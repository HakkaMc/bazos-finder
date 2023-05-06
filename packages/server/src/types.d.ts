import {Types} from 'mongoose'

export type CarObject = {
  _id: Types.ObjectId
  description?: string
  engine?: string
  favourite?: boolean
  hidden?: boolean
  imgBase64: string
  imgUrl: string
  invalid?: boolean
  link: string
  location: string
  modified?: boolean
  power?: number
  price: number
  publishedAt: number
  tacho?: number
  title: string
  updatedAt: number
  vendor?: string
  year?: number
  tags: Array<string>
}

export type CarGalleryObject2 = {
  _id: Types.ObjectId
  carId: Types.ObjectId
  imgBase64: string
  imgUrl: string
  previewBase64: string
  previewUrl: string
}

export type CarGallery = Array<CarGalleryObject2>

declare global {
  function type2string<T>(): void;
}
