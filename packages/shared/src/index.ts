// export {default as myMacro} from './my.macro'

export type CarFilterType = {
  engine?: string
  favourite: boolean
  powerFrom: number
  powerTo: number
  priceFrom: number
  priceTo: number
  yearFrom: number
  yearTo: number
  tachoTo: number
}

export enum CarSortByEnum {
  Engine = 'engine',
  Power = 'power',
  Price = 'price',
  PublishedAt = 'publishedAt',
  Tacho = 'tacho',
  Year = 'year',
}

export type CarFilterAndOrderType = CarFilterType & {
  sortBy: CarSortByEnum
  narrowMode: boolean
  textFilter?: string
}

export const carSortByList = Object.entries(CarSortByEnum).map(
  ([key, value]) => ({ label: key, value })
)

// export enum CarTagsEnum {
//
// }


