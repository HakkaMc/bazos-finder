import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'

// import { GRAPHQL_ENDPOINT } from '../constants'

const graphqlWsClient = createClient({
  on: {
    closed: (event: any) => {
      window.console.info('GraphQl socket closed', event?.reason)
    },
    connected: () => {
      window.console.info('GraphQl socket connected')
    },
    error: (error) => {
      window.console.error(error)
    },
  },
  url: `ws://localhost:4000/graphql`,
  lazy: false // Keep websocket opened
})

// const QUERY = gql`
//     query getCar($carId: String!){
//         getCar(carId: $carId){
//             engine
//         }
//     }
// `
//
// const HELLO_QUERY = gql`
//   query hello{
//       hello
//   }
// `
//
// graphqlWsClient.subscribe(
//   {query: '{ hello }'},
// {
//     next: (data) => {
//       console.log('data: ', data)
//       return data
//     },
//     error: (error)=>{
//       console.log(error)
//     },
//     complete: () => {
//       console.log('Complete ')
//     },
//   })

// const gClient = new GraphQLWsLink(wsClient)
// gClient.client.subscribe({
//     query: '{ getCar(carId: "RPlqD4MB5pvpu06w6Xae") {engine} }',
//   },
//   {
//     next: (data) => {
//       console.log('data: ', data)
//       return data
//     },
//     error: (error)=>{
//       console.log(error)
//     },
//     complete: () => {
//       console.log('Complete ')
//     },
//   })

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache({}),
  credentials: 'include',
  link: new GraphQLWsLink(graphqlWsClient),
})
//
// wsClient.subscribe(
//   {
//     query: '{ getCar(carId: "RPlqD4MB5pvpu06w6Xae") {engine} }',
//   },
//   {
//     next: (data) => {
//       console.log('data: ', data)
//       return data
//     },
//     error: (error)=>{
//       console.log(error)
//     },
//     complete: () => {
//       console.log('Complete ')
//     },
//   })



// apolloClient.query({
//   query: HELLO_QUERY,
//   // variables: {
//   //   carId: 'RPlqD4MB5pvpu06w6Xae'
//   // }
// }).catch((error)=>{
//   console.error(error)
// })

const GQL = {
  CONNECTION_INIT: 'connection_init',
  CONNECTION_ACK: 'connection_ack',
  CONNECTION_ERROR: 'connection_error',
  CONNECTION_KEEP_ALIVE: 'ka',
  START: 'start',
  STOP: 'stop',
  CONNECTION_TERMINATE: 'connection_terminate',
  DATA: 'data',
  ERROR: 'error',
  COMPLETE: 'complete'
}
//
// const socket = new WebSocket('ws://localhost:4000/graphql', "graphql-ws");
//
// // Connection opened
// socket.addEventListener('open', (event) => {
//   const data = {
//     type: GQL.CONNECTION_INIT
//   }
//
//   // const data = {
//   //   id: "973da194-4cd1-4370-9e83-b8f2b3873433",
//   //   payload: {
//   //     query: '{ getCar(carId: "RPlqD4MB5pvpu06w6Xae") {engine} }',
//   //   },
//   //   type: GQL.START
//   // }
//   //
//   // socket.send(JSON.stringify(data));
// });
//
// // Connection closed
// socket.addEventListener('closed', (event) => {
//   // socket.send('Closed connection!');
//   console.log('Closed connection!', event)
// });
//
// // Listen for messages
// socket.addEventListener('message', (event) => {
//   // console.log('Message from server ', event.data);
//   const data = JSON.parse(event.data)
//   switch (data.type) {
//     case GQL.CONNECTION_ACK: {
//       console.log('success')
//       break
//     }
//     case GQL.CONNECTION_ERROR: {
//       console.error(data.payload)
//       break
//     }
//     case GQL.CONNECTION_KEEP_ALIVE: {
//       break
//     }
//   }
// })
