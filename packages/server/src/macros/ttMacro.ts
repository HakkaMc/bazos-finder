// transformer1-module
import ts, {Program, TransformationContext, SourceFile, Node, TypeNode, Symbol, visitEachChild, isCallExpression, TypeFlags} from "typescript";
import { prop } from "cheerio/lib/api/attributes";

// export default function(program: Program, pluginOptions: {}) {
//   return (ctx: TransformationContext) => {
//     return (sourceFile: SourceFile) => {
//       function visitor(node: Node): Node {
//         // if (ts.isCallExpression(node)) {
//         //     return ts.createLiteral('call');
//         // }
//
//         // console.log('Transformer visitor')
//
//         return visitEachChild(node, visitor, ctx);
//       }
//       return visitEachChild(sourceFile, visitor, ctx);
//     };
//   };
// }

const loop = (program: Program, ctx: TransformationContext, sourceFile: SourceFile, typeNode: TypeNode, symbols: Symbol[]) => {
  const checker = program.getTypeChecker()
  // const enhancedType = program.getTypeChecker().getTypeAtLocation(node)

  // console.log(enhancedType.getProperties()[0])
  // console.log(enhancedType.getProperties()[0].)

  // console.log(program.getTypeChecker().getTypeFromTypeNode(node))


  symbols.forEach(symbol=>{
    const detail = checker.getTypeOfSymbolAtLocation(symbol, typeNode)
    // console.log(symbol.name, symbol.valueDeclaration?.getText())

    switch (detail.getFlags()){
      case TypeFlags.Object:
        console.log(symbol.name, 'object', symbol.valueDeclaration?.getText(), checker.getExportsOfModule(symbol))
        // console.log(detail.getProperties())
        // loop(program, ctx, sourceFile, typeNode, detail.getProperties())



        break;
      case TypeFlags.Number:
        console.log(symbol.name, 'number')
        break;
      case TypeFlags.String:
        console.log(symbol.name, 'string')
        break;
      case TypeFlags.Boolean:
        console.log(symbol.name, 'boolean')
        break;
      default:
        console.error('Unknown type: ', symbol.name, detail.getFlags())
    }


  })
}

export const transformerModule = (program: Program, pluginOptions: {}) => (ctx: TransformationContext) => (sourceFile: SourceFile) => {
  function visitor(node: Node): Node {
    // if (ts.isCallExpression(node)) {
    //     return ts.createLiteral('call');
    // }

    // if(isCallExpression(node) {
    //   console.log(node.expression.getText(sourceFile))
    // }

    if(isCallExpression(node) && node.expression.getText(sourceFile) === 'type2string') {
      console.log('Transformer visitor')
      // console.log('Arguments:', node.arguments)
      // console.log('Type arguments', node.typeArguments)

      if(node?.typeArguments && node.typeArguments.length > 0){
        const type = node.typeArguments[0]
        // console.log('Selected type:')
        // console.log(type)

        const typeChecker = program.getTypeChecker();
        // const importSymbol = typeChecker.getSymbolAtLocation(type);
        // if(importSymbol) {
        //   const exportSymbols = typeChecker.getExportsOfModule(type.);
        //
        //   exportSymbols.forEach(symbol =>
        //     console.log(
        //       `found "${
        //         symbol.escapedName
        //       }" export with value "${symbol?.valueDeclaration?.getText()}"`
        //     )
        //   );
        // }
        // else{
        //   console.log('importSymbol is undefined')
        // }



        const enhancedType = program.getTypeChecker().getTypeFromTypeNode(type)
        // enhancedType.getProperties().forEach(symbol=>{
        //   console.log(symbol.valueDeclaration?.get)
        // })

        loop(program,ctx, sourceFile, type, enhancedType.getProperties())
        // loop(program,ctx, sourceFile, type, enhancedType.getProperties())

        // console.log('enhancedTypeNode')

        // const enhancedType = program.getTypeChecker().getTypeAtLocation(type)

        // console.log(enhancedType.getProperties()[0])

        // if(enhancedType.isTypeParameter()){
          //ctx.factory.createStringLiteral()
          // const result = program.getTypeChecker().typeToString(enhancedType)

          // console.log('Result: ', ctx.factory.createStringLiteral(result))

        //   program.getTypeChecker().typeToString()
        // }
      }
    }

    return visitEachChild(node, visitor, ctx);
  }

  // console.log('File: ', sourceFile.fileName)

  return visitEachChild(sourceFile, visitor, ctx);
};



export default transformerModule
