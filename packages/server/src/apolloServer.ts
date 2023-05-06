import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express'
import { useServer } from 'graphql-ws/lib/use/ws'
import { WebSocketServer } from 'ws'

import { graphqlPath } from './constants'
// import { expressServer, httpServer, session } from './expressServer'

export const initApolloServer = async (
  httpServer: any,
  expressServer: any,
  graphqlSchema: any
) => {
  // console.info('Call initDatabase...')
  // const graphqlSchema = await initDatabase()
  // console.info('initDatabase done.')

  // Create the WebSocket server
  const wsServer = new WebSocketServer({
    path: graphqlPath,
    server: httpServer,
  })

  // Hand in the schema we just created and have the WebSocketServer start listening.
  const serverCleanup = useServer(
    {
      // context: async (context, message, args) => {
      //   const wsSession: any = await new Promise((resolve) => {
      //     const { request } = context.extra
      //
      //     session(request as any, {} as any, () => {
      //       const enhancedRequest = request as typeof context.extra.request & {
      //         session: Record<string, any> | undefined
      //       }
      //
      //       if (enhancedRequest?.session) {
      //         return resolve(enhancedRequest.session)
      //       }
      //       return resolve({})
      //     })
      //   })
      //
      //   if (wsSession.userId) {
      //     return { session: wsSession }
      //   }
      //
      //   throw new Error('Missing auth!')
      // },

      // As before, ctx is the graphql-ws Context where connectionParams live.
      onConnect: async (ctx) => {
        console.info('Graphql WS connected')
        // Check authentication every time a client connects.
        // if (tokenIsNotValid(ctx.connectionParams)) {
        // You can return false to close the connection  or throw an explicit error
        // throw new Error('Auth token missing!');
        // }
      },
      onDisconnect(ctx, code, reason) {
        console.info('Graphql WS disconnected:', code, reason)
      },
      schema: graphqlSchema,
    },
    wsServer
  )

  // Create Apollo server
  const apolloServer = new ApolloServer({
    // context: async ({ req, res }) => {
    //   return { req, res, session: req.session }
    // },

    cache: 'bounded',

    csrfPrevention: true,

    debug: true,

    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },

      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],

    schema: graphqlSchema,
  })

  await apolloServer.start()

  apolloServer.applyMiddleware({
    app: expressServer,
    cors: false,
    path: graphqlPath,
  })

  return apolloServer
}
