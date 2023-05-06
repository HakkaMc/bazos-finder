import mongoose, {Schema, Model} from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';

import {CarGalleryObject2, CarObject} from "./types";

const carSchema = new Schema<CarObject>({
    description: {
        type: String
    },
    engine: {
        type: String
    },
    favourite: {
        type: Boolean
    },
    hidden: {
        type: Boolean
    },
    imgBase64: {
        type: String
    },
    imgUrl: {
        type: String
    },
    invalid: {
        type: String
    },
    link: {
        type: String
    },
    location: {
        type: String
    },
    modified: {
        type: Boolean
    },
    power: {
        type: Number
    },
    price: {
        type: Number
    },
    publishedAt: {
        type: Number
    },
    tacho: {
        type: Number
    },
    title: {
        type: String
    },
    updatedAt: {
        type: Number
    },
    vendor: {
        type: String
    },
    year: {
        type: Number
    },
    tags: [String]
})

export const carModel: Model<CarObject> = mongoose.model('Car', carSchema)
export const carModelTc = composeMongoose(carModel as any, {})

const carGallerySchema = new Schema<CarGalleryObject2>({
    carId: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'cars'
    },
    imgBase64: {
        type: String
    },
    imgUrl: {
        type: String
    },
    previewBase64: {
        type: String
    },
    previewUrl: {
        type: String
    },
})

export const carGalleryModel: Model<CarGalleryObject2> = mongoose.model('CarGallery', carGallerySchema)
export const carGalleryModelTc = composeMongoose(carGalleryModel as any, {})

export const connectMongo = async () => {
    //await mongoose.connect(`mongodb://localhost:${processEnv.dbPort}/${processEnv.db}`)
    await mongoose.connect(`mongodb://localhost:27017/bazosFinder2`)
}
