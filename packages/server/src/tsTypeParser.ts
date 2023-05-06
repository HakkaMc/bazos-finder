// const TSTypesParser = require('ts-types-parser');
// const parser = new TSTypesParser();
import * as tsj from "ts-to-json"
import { resolve } from "path";

// parser.setSource('pokus.d.ts')
// parser.setTarget('pokus.json')
//
// parser.mainType('CarObject');
//
// parser.on('level-up', levelData => {
//   console.log('level up: ', levelData)
// });
//
// parser.on('level-down', levelData => {
//   console.log('level down: ', levelData)
// });
//
// parser.on('done', () => {
//   console.log('done');
// })
//
// parser.run();


const config: tsj.Config = {
  path: resolve("./pokus.d.ts"),
  // tsconfig: "./../tsconfig.json",
  type: "*", // Or <type-name> if you want to generate schema for that one type only
  expose: 'all',
  jsDoc: "extended",
  topRef: true,
  handleUnknownTypes: true,
  showUnknownTypeInfo: true,
  maxDepth: 3
};

const schema = tsj.createGenerator(config).createSchema(config.type);
const schemaString = JSON.stringify(schema, null, 2);
console.log(schemaString)
