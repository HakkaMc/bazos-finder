import { Client } from '@elastic/elasticsearch'
import * as cheerio from 'cheerio'
import https from 'https'

import { bazosBasicLink } from './constants'
import { elasticClient } from './elastic'
import { Store } from './store'
import {carGalleryModel, carModel} from "./db";
import {ObjectId} from "mongodb";

type RequestOptions = {
  encoding?: BufferEncoding
}

type PrepareListProps = {
  priceFrom: number
  priceTo: number
  vendor: string
  what: string
}

const getPower = async (sourceString: string): Promise<number | undefined> => {
  const both = sourceString.replace(/\s/g, ';').toLowerCase()

  const result = both.match(/\d+;*kw/)
  const number = parseFloat(result ? result[0].replace(/[^\d]/g, '') || '' : '')

  return Number.isNaN(number) ? undefined : number
}

const getEngine = async (sourceString: string): Promise<string> => {
  const both = sourceString.replace(/\s/g, ';').replace(/,/g, '.').toLowerCase()

  let engine = ''

  const result = both.match(/(\d\.{0,1}\d|\d)(;*)td(i{0,1})/)
  if (result) {
    const tmp = result[0].replace(/;/g, '')
    if (tmp) {
      engine = tmp.replace(/[^\d\.]/g, '')
    }
  }

  if (!result) {
    const result = both.match(/((\d{4})|(\d;+\d{3}));+(ccm|cc3|cc2|cm2|cm3)/)

    if (result) {
      const number = parseFloat(result[0].replace(/ccm|cc3|cc2|cm2|cm3/g, '').replace(/[^\d]/g, ''))

      if (!Number.isNaN(number)) {
        engine = number.toString()
      }
    }
  }

  // console.log(result?result[0]:'N/A', title)

  return engine
}

const getTacho = async (sourceString: string): Promise<number | undefined> => {
  const both = sourceString.replace(/\s/g, ';').replace(/,/g, '.').toLowerCase()
  let km = undefined

  let result = both.match(/(\d{1,3}(;|\.)+\d{1,3}|\d+);*km/)

  if (result) {
    const number = parseFloat(result[0].replace(/[^\d]/g, ''))
    if (!Number.isNaN(number)) {
      km = number
    }
  }

  if (!km) {
    result = both.match(/(\d{1,3})(;|\.)+((x|\.){3})/)
    if (result) {
      km = parseFloat(result[1]) * 1000
    }
  }

  if (!km) {
    result = both.match(/(\d{1,3})(;|\.)*(tis|tkm)/)
    if (result) {
      km = parseFloat(result[1]) * 1000
    }
  }

  if (!km) {
    result = both.match(
      /(najeto|najezd|nájezd|naj\.)(;*)(\d{1,3})(;|\.)*(\d{1,3}|(x|\.){3})/
    )
    if (result) {
      const part1 = parseFloat(result[3])
      const part2 = result[5].replace(/[^\d]/, '')

      if (!part2) {
        km = part1 * 1000
      } else {
        km = parseFloat(`${part1}${part2}`)
      }
    }
  }

  return km
}

const getYear = async (sourceString: string): Promise<number | undefined> => {
  const both = sourceString

  const result = both.match(/(199\d|20[0-4]\d)/)
  const number = parseFloat(result ? result[0] : '')

  return Number.isNaN(number) ? undefined : number
}

const is44 = (sourceString: string): boolean => {
  const str = sourceString.toLowerCase()

  return (
    str.includes('4x4') || str.includes('4 motion') || str.includes('4motion')
  )
}

const isAutomat = (sourceString: string) => {
  const str = sourceString.toLowerCase()

  return str.includes('dsg') ||
    str.includes('automatická převodovka') ||
  !!str.replace(/[,\.;!]/g, ' ').match(/\s(automat)(\s|\.)/)
}

const hasIndependentHeating = (sourceString: string) => {
  const str = sourceString.toLowerCase()
  return (
    str.includes('nezávislé topení') ||
    str.includes('nezavisle topeni') ||
    str.includes('bufík') ||
    str.includes('bufik')
  )
}

const hasCruiseControl = (sourceString: string) => {
  const str = sourceString.toLowerCase()

  return str.includes('tempomat')
}

const hasTowingDevice = (sourceString: string) => {
  const str = sourceString.toLowerCase()

  return str.includes('tažné')
}

const isFromAbroad = (sourceString: string) => {
  const str = sourceString.toLowerCase()

  return str.includes('dovoz')
}

const hasPDC = (sourceString: string) => {
  const str = sourceString.toLowerCase()

  return (
    str.includes('pdc') ||
    str.includes('parkovací senzory') ||
    str.includes('parkovaci senzory')
  )
}

const isEngineDamaged = (sourceString: string) => {
  const str = sourceString.toLowerCase()

  return (
    str.includes('výměna motoru') ||
    str.includes('vymena motoru') ||
    str.includes('go motoru') ||
    str.includes('repase motoru') ||
    str.includes('repas motoru')
  )
}

const isLong = (sourceString: string) => {
  const str = sourceString.toLowerCase()

  return (
    str.includes('long') ||
    str.includes('lang') ||
    str.includes('dlouhá verze')
  )
}

const getRequest = (
  url: string,
  { encoding = 'utf8' }: RequestOptions
): Promise<string> =>
  new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          // headers: {
          //   'Content-Type': 'text/html; charset=UTF-8'
          // }
        },
        (response) => {
          // console.log(url)
          response.setEncoding(encoding)

          let rawData = ''
          response.on('data', (chunk) => {
            rawData += chunk
          })
          response.on('end', () => {
            try {
              resolve(rawData)
            } catch (error) {
              reject(error)
            }
          })
        }
      )
      .on('error', (error) => {
        console.error(error)
        reject(error)
      })
    // .end()
  })

// const getRequest = (
//   url: string,
//   { encoding = 'utf8' }: RequestOptions
// ): Promise<string> => fetch(url).then(response=>response.text())

export const prepareList = async ({
  vendor,
  what,
  priceFrom,
  priceTo,
}: PrepareListProps) => {
  console.info('prepareList', vendor, what)

  if (!Store.isRefreshing) {
    await Store.setIsRefreshing(true)

    let from = 0
    let cont = true

    const existingLinks = new Set<string>()


    const result = await carModel.find({}, {link: 1}) || []

    result.forEach(car=>{
      if (car?.link) {
        existingLinks.add(car.link)
      }
    })

    const ids: Array<string> = []

    while (cont) {
      const fromString = from ? `${from}/` : ''

      try {
        const url = `${bazosBasicLink}/${vendor}/${fromString}?hledat=${what}&cenaod=${priceFrom}&cenado=${priceTo}`
        console.log(url)
        const data = await getRequest(url, {})

        const cher = cheerio.load(data, {
          decodeEntities: false,
        })

        const items = cher('.inzeraty')
        if (cher(items).length) {
          // console.log(cher(items).html())

          const array: Array<any> = []

          cher(items).each((index: number, element: any) => {
            array.push(element)
          })

          for (let i = 0; i < array.length; i++) {
            const element = array[i]

            // console.log('------------------------------------------------------------------------')
            //   // console.log(cher(element).html())
            //
            //   // console.log(cheerio.html(this))
            //
            //   // const link = bazosBasicLink + cher(this)?.find('.nadpis')?.first()?.find('a')?.attr('href')?.trim() || ''
            const link =
              bazosBasicLink +
                cher(element)
                  .find('.nadpis')
                  .first()
                  .find('a')
                  .first()
                  .attr('href')
                  ?.trim() || ''

            if (!existingLinks.has(link)) {
              const title =
                cher(element)
                  ?.find('.nadpis')
                  ?.first()
                  ?.find('a')
                  ?.html()
                  ?.trim() || ''

              let price
              const priceString =
                cher(element)
                  ?.find('.inzeratycena')
                  ?.first()
                  ?.find('b')
                  ?.first()
                  ?.html()
                  ?.replace(/\s/g, '') || ''
              const priceMatch = priceString.match(/\d*/)
              if (priceMatch && priceMatch.length) {
                price = parseInt(priceMatch[0])
              }

              const [city, zip] = (
                cher(element)?.find('.inzeratylok')?.first()?.html() || ''
              ).split('<br>')
              const location = `${zip} ${city}`

              let publishedAt
              cher(element)
                ?.find('.velikost10')
                ?.each(() => {
                  const publishedOnMatch = cher(element)
                    ?.html()
                    ?.match(/\[.+\]/i)
                  if (publishedOnMatch && publishedOnMatch.length) {
                    const publishedString = publishedOnMatch[0]
                      .replace(/\s/g, '')
                      .replace('[', '')
                      .replace(']', '')
                    const [day, month, year] = publishedString.split('.')
                    publishedAt = new Date(`${year}-${month}-${day}`).getTime()
                  }
                })

              const imgUrl =
                cher(element)
                  ?.find('.inzeratynadpis')
                  .first()
                  .find('img')
                  .first()
                  .attr('src') || ''
              //   // console.log(imgUrl)
              const imgBase64Data = await getRequest(imgUrl, {
                encoding: 'base64',
              })


              const newCar = new carModel({
                favourite: false,
                gallery: [],
                hidden: false,
                imgBase64: imgBase64Data,
                imgUrl,
                invalid: false,
                link,
                location,
                modified: false,
                price: price || -1,
                publishedAt,
                tags: [],
                title,
                updatedAt: Date.now(),
                vendor
              })
              ids.push(newCar._id.toString())
              await newCar.save()
            }
          }
        } else {
          cont = false
        }
      } catch (ex) {
        console.error(ex)
      }

      from += 20
    }

    for (let i = 0; i < ids.length; i++) {
      await downloadDetail(ids[i], elasticClient)
    }

    await Store.setIsRefreshing(false)
  }

  console.log('done')
}

export const downloadDetail = async (carId: string, elasticClient: Client) => {

  const carObject = await carModel.findById(carId)

  if (
      carObject
  ) {
    try {
      const data = (await getRequest(
        carObject?.link || '',
        {}
      )) as string

      const cher = cheerio.load(data, {
        decodeEntities: false,
      })

      const description = cher('.popisdetail').html() as string
      // console.log('description: ', description)

      const galleryUrls: Array<string> = []

      cher('.flinavigace img').each((i: number, imgElement: any) => {
        const imgUrl = (cher(imgElement).attr('src') || '').trim()
        if (imgUrl) {
          galleryUrls.push(imgUrl)
        }
      })

      for (let i = 0; i < galleryUrls.length; i++) {
        const previewUrl = galleryUrls[i]
        const imgUrl = previewUrl.replace(/(\/img\/.*)(t)(\/)/g, '$1$3')
        // const previewBase64Data = (await getRequest(previewUrl, { encoding: 'base64' })) as string
        // const imgBase64Data = (await getRequest(imgUrl, { encoding: 'base64' })) as string

        await new carGalleryModel({
          carId: carObject._id,
          imgBase64: '',
          imgUrl,
          previewBase64: '',
          previewUrl,
        }).save()
      }

      carObject.description = description
      await carObject.save()


      return true
    } catch (ex) {
      console.error(ex)
    }
  }

  return false
}

export const parseDetails = async () => {
  console.info('parseDetails')

  if (!Store.isRefreshing) {
    await Store.setIsRefreshing(true)

    const allCars = await carModel.find() || []

    for (let i = 0; i < allCars.length; i++) {
      const car = allCars[i]

      const sourceString = `${car?.title} ${car?.description}`.toLowerCase()

      const power = await getPower(sourceString)
      const engine = await getEngine(sourceString)
      const tacho = await getTacho(sourceString)
      const year = await getYear(sourceString)

      const tags: Array<string> = []

      if (hasCruiseControl(sourceString)) {
        tags.push('cruiseControl')
      }

      if (hasTowingDevice(sourceString)) {
        tags.push('towingDevice')
      }

      if (isFromAbroad(sourceString)) {
        tags.push('fromAbroad')
      }

      if (hasPDC(sourceString)) {
        tags.push('pdc')
      }

      if (isEngineDamaged(sourceString)) {
        tags.push('engineDamaged')
      }

      if (hasIndependentHeating(sourceString)) {
        tags.push('independentHeating')
      }

      if (isAutomat(sourceString)) {
        tags.push('automat')
      }

      if (is44(sourceString)) {
        tags.push('4x4')
      }

      if (isLong(sourceString)) {
        tags.push('long')
      }

      car.engine = engine
      car.power = power
      car.tacho = tacho
      car.tags = tags
      car.year = year
      car.save()
    }

    await Store.setIsRefreshing(false)
  }

  console.info('parseDetails done')
}

const downloadImagesLock: Record<string, boolean> = {}

export const downloadImages = async (carId?: string) => {
  console.info('downloadImages')

  if(!downloadImagesLock[carId || 'ALL']){
    downloadImagesLock[carId || 'ALL'] = true

    await Store.setIsRefreshing(true)

    const filter: Record<string, any> = {}

    if(carId){
      filter['carId'] = new ObjectId(carId)
      filter['imgBase64'] = {$eq: ""}
    }

    const gallery = await carGalleryModel.find(filter)

    for (let round = 0; round < gallery.length; round++) {
      const galleryObject = gallery[round]
      if (!galleryObject?.imgBase64 || !galleryObject?.previewBase64) {
        console.log('Download image: ', `${round + 1}/${gallery.length}`)

        const doIt = async () => {
          const previewBase64Data = await getRequest(galleryObject.previewUrl, {
            encoding: 'base64',
          })
          const imgBase64Data = await getRequest(galleryObject.imgUrl, {
            encoding: 'base64',
          })

          galleryObject.imgBase64 = imgBase64Data
          galleryObject.previewBase64 = previewBase64Data
          await galleryObject.save()
        }

        doIt()
      }
    }

    await Store.setIsRefreshing(false)
  }
  console.info('Downloading images done')
}
