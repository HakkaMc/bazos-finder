const {createMacro} = require('babel-plugin-macros')

function webpackCommentImportMacros({ references, state, babel }) {
  references.default.map((referencePath) => {
    if (referencePath.parentPath.type === "CallExpression") {
      requireWebpackCommentImport({ referencePath, state, babel });
    } else {
      throw new Error(
        `This is not supported: \`${referencePath
          .findParent(babel.types.isExpression)
          .getSource()}\`. Please see the webpack-comment-import.macro documentation`,
      );
    }
  });
}

function requireWebpackCommentImport({ referencePath, state, babel }) {
  // TODO implement
  console.log('TODO implement: requireWebpackCommentImport')
  return 'To zvladneme'
}

module.exports = createMacro(webpackCommentImportMacros);
