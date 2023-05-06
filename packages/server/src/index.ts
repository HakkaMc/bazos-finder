import express, { RequestHandler } from 'express'
import { createServer as createHttpServer } from 'http'

import { initApolloServer } from './apolloServer'
import { graphqlPath, PORT } from "./constants";
import { elasticClient } from './elastic'
import { schema } from './resolvers'
import {connectMongo} from "./db";

// import { $$typeToString } from "ts-macros";

// function type2string<T>(){}
//
// type Pokus = {
//   name: string
//   age: number
//   nested: {
//     location: string
//     married: boolean
//   }
//   arr: Array<number>
// }

async function startServer() {
  await connectMongo()

  // try {
  //   const pingResponse = await elasticClient.ping()
  //   console.log('Elasting ping response: ', pingResponse)
  // }
  // catch (ex){
  //   console.error('Connect to elasticsearch service failed. Check if "xpack.security.enabled: false" is set in "elasticsearch.yml"')
  // }
  //
  // console.info('Check cars DB exists')
  // const carsDbExists = await elasticClient.indices.exists({ index: 'cars' })
  // if (!carsDbExists) {
  //   console.log('Creating cars DB')
  //   await elasticClient.indices.create({ index: 'cars' })
  // }
  // // else {
  // //   await elasticClient.indices.delete({index: 'cars'})
  // // }
  //
  // console.info('Check car-gallery DB exists')
  // const carGalleryDbExists = await elasticClient.indices.exists({
  //   index: 'car-gallery',
  // })
  // if (!carGalleryDbExists) {
  //   console.log('Creating car-gallery DB')
  //   await elasticClient.indices.create({ index: 'car-gallery' })
  // }
  // // else{
  // //   await elasticClient.indices.delete({index: 'car-gallery'})
  // // }


  const expressServer = express()
  expressServer.use(graphqlPath, express.json() as RequestHandler)

  const httpServer = createHttpServer(expressServer)

  const apolloServer = await initApolloServer(httpServer, expressServer, schema)


  // Start the server
  console.info('Starting listening server...')
  httpServer.listen(PORT, () => {
    console.info(
      `Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`
    )
    console.info(
      `Subscriptions ready at ws://localhost:${PORT}${apolloServer.graphqlPath}`
    )
  })

  // myMacro('Co ja vím?')

  // console.log(`🚀 Server ready at ${url}`)

  // console.log($$typeToString!<Pokus>());

  // type2string<Pokus>()

}

startServer()
