import CloseIcon from '@mui/icons-material/Close'
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Typography,
} from '@mui/material'
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'

import { EditableText } from '../../forms'
import { useGetCarGalleryQuery, useGetCarQuery, useDownloadImagesMutation } from '../../graphql'
import {
  FormattedCurrency,
  FormattedDate,
  FormattedNumber,
} from '../../locale/locale'
import { Tags } from "../Tags/Tags";

type Props = {
  carId: string
  onClose: () => void
}

export const Detail = ({ carId, onClose }: Props) => {
  const [selectedImgIndex, setSelectedImgIndex] = useState(0)

  const { loading, data } = useGetCarQuery({ variables: { carId } })
  const { data: galleryData } = useGetCarGalleryQuery({ variables: { carId } })
  const [downloadImages] = useDownloadImagesMutation({variables: {carId}})

  // const [selectedImg, setSelectedImg] = useState(`data:image/jpeg;base64,${galleryData?.getCarGallery?.[0]?.imgBase64}`)

  const car = data?.getCar

  const imagesLength = galleryData?.getCarGallery?.length || 1

  const selectedImgSrc = useMemo((): string =>{
    if(galleryData?.getCarGallery?.length) {
      if(galleryData?.getCarGallery?.[selectedImgIndex]?.imgBase64) {
        return `data:image/jpeg;base64,${galleryData?.getCarGallery?.[selectedImgIndex]?.imgBase64}`
      }
      else {
        return galleryData?.getCarGallery?.[selectedImgIndex]?.imgUrl || ''
      }
    }
    return ''
  }, [galleryData, selectedImgIndex])

  const setSelectedImgIndexWrapper = useCallback(
    (value: number) => () => {
      setSelectedImgIndex(value)
    },
    [setSelectedImgIndex]
  )

  const nextImg = useCallback(() => {
    setSelectedImgIndex((selectedImgIndex + 1) % imagesLength)
  }, [selectedImgIndex, imagesLength, setSelectedImgIndex])

  const previousImg = useCallback(() => {
    let newIndex = selectedImgIndex - 1

    if (newIndex < 0) {
      newIndex = imagesLength + newIndex
    }

    setSelectedImgIndex(newIndex)
  }, [selectedImgIndex, imagesLength, setSelectedImgIndex])

  useEffect(()=>{
    console.log('downloadImages')
    downloadImages()
  }, [downloadImages])

  return (
    <Dialog fullScreen open={true} onClose={onClose}>
      <DialogTitle>
        <Typography variant="h4">{data?.getCar?.title}</Typography>
        <IconButton
          aria-label="close"
          sx={{
            color: (theme) => theme.palette.grey[500],
            position: 'absolute',
            right: 8,
            top: 8,
          }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container flexWrap="nowrap" sx={{ maxHeight: '100%' }}>
          <Grid item pr={2} sm={6} sx={{ overflow: 'auto' }} xs={12}>
            <Grid container mb={2} pt={1} spacing={2}>
              <Grid item>
                <EditableText
                  carId={car?.id}
                  name="year"
                  type="number"
                  value={car?.year}
                >
                  {car?.year || 'year N/A'}
                </EditableText>
              </Grid>
              <Grid item>
                <EditableText
                  carId={car?.id}
                  name="tacho"
                  type="number"
                  value={car?.tacho}
                >
                  {car?.tacho ? (
                    <FormattedNumber
                      style="unit"
                      unit="kilometer"
                      value={car?.tacho}
                    />
                  ) : (
                    'tacho N/A'
                  )}
                </EditableText>
              </Grid>
              <Grid item>
                <EditableText
                  carId={car?.id}
                  name="engine"
                  type="string"
                  value={car?.engine}
                >
                  {car?.engine || 'engine N/A'}
                </EditableText>
              </Grid>
              <Grid item>
                <EditableText
                  carId={car?.id}
                  name="power"
                  type="string"
                  value={car?.power}
                >
                  {car?.power ? `${car?.power} kw` : 'power N/A'}
                </EditableText>
              </Grid>
              <Grid item>
                <EditableText
                  carId={car?.id}
                  name="price"
                  type="number"
                  value={car?.price}
                >
                  <FormattedCurrency value={car?.price} />
                </EditableText>
              </Grid>
              <Grid item>
                <FormattedDate value={car?.publishedAt} />
              </Grid>
              <Grid item>{car?.location}</Grid>
            </Grid>
            <Divider />
            <Box mt={2}>
            <Tags tags={data?.getCar?.tags||[]}/>
            </Box>
            <Box
              dangerouslySetInnerHTML={{
                __html: data?.getCar?.description || '',
              }}
              mt={2}
            />
          </Grid>
          <Grid
            item
            pr={2}
            sx={{ overflow: 'auto', position: 'relative', textAlign: 'center' }}
            xs={12}
          >
            {/* <Grid container sx={{overflow: 'auto', width:'100%'}} wrap="nowrap" item>*/}
            {/*  {galleryData?.getCarGallery?.map(gallery=>{*/}
            {/*    let src = gallery?.imgUrl || ''*/}
            {/*    if(gallery?.imgBase64){*/}
            {/*      src = `data:image/jpeg;base64,${gallery?.previewBase64}`*/}
            {/*    }*/}

            {/*    return <Grid item key={gallery?.imgUrl} pr={1}><img src={src} /></Grid>*/}
            {/*  })}*/}
            {/* <Box sx={{position: 'relative', maxWidth: '100%', maxHeight: '100%'}}>*/}
            <img
              src={selectedImgSrc}
              style={{ maxHeight: '100%', maxWidth: '100%' }}
            />
            <Box
              sx={{
                bottom: 0,
                left: 0,
                position: 'absolute',
                top: 0,
                width: '50%',
              }}
              onClick={previousImg}
            />
            <Box
              sx={{
                bottom: 0,
                position: 'absolute',
                right: 0,
                top: 0,
                width: '50%',
              }}
              onClick={nextImg}
            />
            {/* </Box>*/}
          </Grid>
          <Grid
            item
            sx={{ maxWidth: '300px', overflow: 'auto', width: '300px' }}
          >
            <Grid container sx={{ overflow: 'auto', width: '100%' }}>
              {galleryData?.getCarGallery?.map((gallery, index) => {
                let src = gallery?.previewUrl || ''
                if (gallery?.previewBase64) {
                  src = `data:image/jpeg;base64,${gallery?.previewBase64}`
                }

                return (
                  <Grid
                    key={gallery?.imgUrl}
                    item
                    pr={1}
                    xs={6}
                    onClick={setSelectedImgIndexWrapper(index)}
                    onMouseEnter={setSelectedImgIndexWrapper(index)}
                  >
                    <img
                      src={src}
                      style={{ maxHeight: '100%', maxWidth: '100%' }}
                    />
                  </Grid>
                )
              })}
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}
