export type CarObject = {
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
}

export type CarGalleryObject = {
  carId: string
  gallery: Array<{
    imgBase64: string
    imgUrl: string
    previewBase64: string
    previewUrl: string
  }>
}
export type CarGallery = Array<CarGalleryObject>
