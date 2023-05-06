import { resolve } from "path";

import * as TJS from "typescript-json-schema";

// optionally pass argument to schema generator
const settings: TJS.PartialArgs = {
  required: true,
};

// optionally pass ts compiler options
const compilerOptions: TJS.CompilerOptions = {
  strictNullChecks: true,
};

// optionally pass a base path
const basePath = "./";

const program = TJS.getProgramFromFiles(
  [resolve("pokus.d.ts")],
  compilerOptions,
  basePath
);

console.log('Path: ', resolve('pokus.d.ts'))

// We can either get the schema for one file and one type...
const schema = TJS.generateSchema(program, "CarObject", settings);
console.log(JSON.stringify(schema, null, "\t"))
// ... or a generator that lets us incrementally get more schemas

// const generator: any = TJS.buildGenerator(program, settings);

// generator can be also reused to speed up generating the schema if usecase allows:
// const schemaWithReusedGenerator = TJS.generateSchema(program, "Book", settings, [], generator);

// all symbols
// const symbols = generator.getUserSymbols();
// console.log(symbols)

// Get symbols for different types from generator.
// console.log(JSON.stringify(generator.getSchemaForSymbol("Book"), null, "\t"));
// generator.getSchemaForSymbol("AnotherType");
