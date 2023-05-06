import { Client, HttpConnection } from '@elastic/elasticsearch'

export const elasticClient = new Client({
  node: 'http://localhost:9200',
  Connection: HttpConnection,
  tls: {
    rejectUnauthorized: false
  }
  /* auth: {
    username: 'elastic',
    password: 'IwTjEtSBs67V734E*r1*'
  },*/
})
//
// elasticClient.indices.putMapping({
//   index: 'cars',
//   properties:{
//
//   }
// })
