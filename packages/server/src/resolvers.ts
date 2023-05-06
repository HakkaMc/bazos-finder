import {CarFilterAndOrderType, CarSortByEnum} from '@bf2/shared'
import {ObjectTypeComposerFieldConfigAsObjectDefinition, schemaComposer,} from 'graphql-compose'

import {priceFrom, priceTo} from './constants'
import {downloadImages, parseDetails, prepareList} from './parser'
import {pubSub, SubscriptionTrigger} from './pubSub'
import {Store} from './store'
import {CarGallery, CarObject} from './types'
import {carGalleryModel, carModel, carModelTc} from "./db";
import {valueBetween} from "./utils";
import {ObjectId} from "mongodb";

const hello = schemaComposer.createResolver({
    kind: 'query',
    name: 'hello',
    type: 'String!',
    resolve: async () => {
        console.log('Hello response')
        return 'HI'
    }
})

const updateField = schemaComposer.createResolver<
    any,
    { carId: string; field: string; value: string }
>({
    args: {
        carId: 'String!',
        field: 'String!',
        value: 'String!',
    },
    kind: 'mutation',
    name: 'updateField',
    resolve: async ({args}) => {
        // const decodedValue = Buffer.from(args.value, 'base64').toString('ascii');
        const decodedValue = JSON.parse(args.value)

        console.log('updateField: ', args.carId, new ObjectId(args.carId), args.field, args.value, decodedValue)

        await carModel.updateOne({_id: new ObjectId(args.carId)}, {
            modified: true,
            [args.field]: decodedValue
        })

        return 'OK'
    },
    type: 'String!',
})


const GetCarsCarType = schemaComposer.createObjectTC({
    fields: {
        description: 'String',
        engine: 'String',
        favourite: 'Boolean',
        id: 'String!',
        imgBase64: 'String!',
        imgUrl: 'String!',
        invalid: 'Boolean',
        link: 'String!',
        location: 'String!',
        modified: 'Boolean',
        power: 'Float',
        price: 'Float!',
        publishedAt: 'Float!',
        tacho: 'Float',
        tags: ['String!'],
        title: 'String!',
        vendor: 'String!',
        year: 'Float',
    },
    name: 'GetCarsCar',
})

const getCars = schemaComposer.createResolver<any, {filter: Omit<CarFilterAndOrderType, 'narrowMode'>}>({
    args: {
        filter: schemaComposer.createInputTC({
            name: 'GetCarsFilter',
            fields: {
                textFilter: 'String',
                engine: 'String',
                favourite: 'Boolean!',
                powerFrom: 'Float!',
                powerTo: 'Float!',
                priceFrom: 'Float!',
                priceTo: 'Float!',
                yearFrom: 'Float!',
                yearTo: 'Float!',
                tachoTo: 'Float!',
                sortBy: 'String!',
            }
        })
    },
    kind: 'query',
    name: 'getCars',
    resolve: async ({args, projection}) => {
        const projectionObj: Record<string, number> = {}

        Object.keys(projection).forEach(item => {
            projectionObj[item] = 1
        })

        // const filterFnc = (dhis: CarObject) => {

        // }

        const ret = await carModel.find({
            hidden: false,
            invalid: false,
            favourite: {$in: args.filter.favourite ? [true] : [true, false, null]},
        }).sort({
            [args.filter.sortBy]: [CarSortByEnum.Year, CarSortByEnum.Power, CarSortByEnum.PublishedAt].includes(args.filter.sortBy)?-1:1
        }) || []


        return Array.from(ret).filter((car: CarObject) => {
            let ret = true
            if(args.filter.engine) {
                ret = ret && car?.engine === null || car?.engine === undefined || car?.engine === '' || car?.engine === args.filter.engine
            }
            ret = ret && valueBetween(car?.price, args.filter.priceFrom || 0, args.filter.priceTo || 10_000_000)
            ret = ret && valueBetween(car?.power, args.filter.powerFrom || 0, args.filter.powerTo || 1_000)
            ret = ret && valueBetween(car?.year, args.filter.yearFrom || 0, args.filter.yearTo || new Date().getFullYear())
            ret = ret && valueBetween(car?.tacho, 0, args.filter.tachoTo || 500_000)

            return ret
        })

        // return ret
    },
    type: [GetCarsCarType],
})

const getCar = schemaComposer.createResolver<CarObject, { carId: string }>({
    args: {
        carId: 'String!',
    },
    kind: 'query',
    name: 'getCar',
    resolve: async ({args, projection}) => {
        const projectionObj: Record<string, number> = {}

        Object.keys(projection).forEach(item => {
            projectionObj[item] = 1
        })

        return await carModel.findById(args.carId, projectionObj)
    },
    type: GetCarsCarType,
})

const getCarGallery = schemaComposer.createResolver<any, { carId: string }>({
    args: {
        carId: 'String!',
    },
    kind: 'query',
    name: 'getCarGallery',
    resolve: async ({args, projection}) => {
        const projectionObj: Record<string, number> = {}

        Object.keys(projection).forEach(item => {
            projectionObj[item] = 1
        })

        return await carGalleryModel.find({carId: args.carId}, projectionObj)
    },
    type: [
        schemaComposer.createObjectTC<CarGallery>({
            fields: {
                imgBase64: 'String',
                imgUrl: 'String',
                previewBase64: 'String',
                previewUrl: 'String',
            },
            name: 'GetCarsCarGallery',
        }),
    ],
})

const hideCar = schemaComposer.createResolver<any, { carId: string }>({
    args: {
        carId: 'String!',
    },
    kind: 'mutation',
    name: 'hideCar',
    resolve: async ({args}) => {
        await carModel.updateOne({_id: new ObjectId(args.carId)}, {hidden: true})

        return 'OK'
    },
    type: 'String!',
})

const reinitCars = schemaComposer.createResolver<any, { force: boolean }>({
    args: {
        force: 'Boolean!',
    },
    kind: 'mutation',
    name: 'reinitCars',
    resolve: async ({args}) => {
        // await pubSub.publish(SubscriptionTrigger.IsRefreshing, true)

        const doIt = async () => {
            if (args.force) {
                await Store.setIsRefreshing(true)

                await carModel.deleteMany({})
                await carGalleryModel.deleteMany({})

                await Store.setIsRefreshing(false)
            }

            console.info('Prepare lists')
            await prepareList({
                priceFrom,
                priceTo,
                vendor: 'volkswagen',
                what: 't5',
            })
            await prepareList({
              priceFrom,
              priceTo,
              vendor: 'volkswagen',
              what: 't6',
            })
            await prepareList({
              priceFrom,
              priceTo,
              vendor: 'volkswagen',
              what: 'caravelle',
            })
            await prepareList({
              priceFrom,
              priceTo,
              vendor: 'volkswagen',
              what: 'caravella',
            })
            await prepareList({
              priceFrom,
              priceTo,
              vendor: 'volkswagen',
              what: 'caravela',
            })
            await prepareList({
              priceFrom,
              priceTo,
              vendor: 'volkswagen',
              what: 'transporter',
            })
            await prepareList({
              priceFrom,
              priceTo,
              vendor: 'volkswagen',
              what: 'multivan',
            })
            // await prepareList({
            //     priceFrom,
            //     priceTo,
            //     vendor: 'volkswagen',
            //     what: 't4',
            // })

            console.info('Parse details')
            await parseDetails()

            // console.info('Download images')
            // await downloadImages()

            // await Store.setIsRefreshing(false);
        }

        doIt()

        return 'OK'
    },
    type: 'String!',
})

const parseCarDetails = schemaComposer.createResolver({
    kind: 'mutation',
    name: 'parseCarDetails',
    resolve: async () => {
        parseDetails()

        return 'OK'
    },
    type: 'String!',
})

const downloadImagesResolver = schemaComposer.createResolver<string, {carId: string}>({
    kind: 'mutation',
    name: 'downloadImages',
    args: {
        carId: 'String!',
    },
    resolve: async ({args}) => {
        downloadImages(args.carId)

        return 'OK'
    },
    type: 'String!',
})

const isRefreshing: ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> =
    {
        kind: 'subscription',
        name: 'isRefreshing',
        resolve: async (data: any) => data,
        subscribe: async () => {
            const ai = pubSub.asyncIterator([SubscriptionTrigger.IsRefreshing])

            setTimeout(() => {
                pubSub.publish(SubscriptionTrigger.IsRefreshing, Store.isRefreshing)
            })

            return ai
        },
        type: 'Boolean!',
    }

schemaComposer.Query.addFields({
    getCar,//: carModelTc.mongooseResolvers.findById(),
    getCarGallery,
    getCars,
    // getCars2: carModelTc.mongooseResolvers.findMany({
    //     filter: {
    //         operators: true
    //     }
    // }),
    hello
})

schemaComposer.Mutation.addFields({
    hideCar,
    parseCarDetails,
    reinitCars,
    updateField,
    downloadImages: downloadImagesResolver
})

schemaComposer.Subscription.addFields({
    isRefreshing,
})

export const schema = schemaComposer.buildSchema()
