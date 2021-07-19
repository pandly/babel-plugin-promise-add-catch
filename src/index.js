module.exports = ({ types: t, template }) => {
  function isObjectProperty (callee, name) {
    if (!callee || !t.isMemberExpression(callee)) {
      return false
    }
    if (callee.computed) { // handle a['b']
      return t.isStringLiteral(callee.property, { value: name })
    } else { // handle a.b
      return t.isIdentifier(callee.property, { name })
    }
  }

  return {
    visitor: {
      CallExpression (path, { opts }) {
        const promiseNames = opts.promiseNames
        const catchCallback = opts.catchCallback

        if (typeof catchCallback !== 'string') {
          throw new Error('catchCallback must be String')
        }

        let polyfillPath = path
        const { node } = polyfillPath

        if (promiseNames) {
          if (!Array.isArray(promiseNames)) {
            throw new Error('promiseNames must be Array<string>')
          }
          if (!promiseNames.length) {
            return
          }
          let isMatch = false
          if (t.isIdentifier(node.callee)) {
            isMatch = promiseNames.some(name => t.isIdentifier(node.callee, { name }))
          } else if (t.isMemberExpression(node.callee)) {
            isMatch = promiseNames.some(name => isObjectProperty(node.callee, name))
          }
          if (!isMatch) {
            return
          }
        } else if (!isObjectProperty(node.callee, 'then')) {
          return
        }

        const catchPath = path.findParent(({ node }) => {
          return t.isFunction(node) || isObjectProperty(node.callee, 'catch')
        })
        if (catchPath && !t.isFunction(catchPath.node)) {
          return
        }

        const mostOuterThenPath = path.findParent(pPath => {
          const node = pPath.node
          return t.isFunction(node) || (isObjectProperty(node.callee, 'then') && !t.isMemberExpression(pPath.parentPath.node))
        })
        if (mostOuterThenPath && !t.isFunction(mostOuterThenPath.node)) {
          polyfillPath = mostOuterThenPath
        }

        const arrowFunctionBody = !catchCallback
          ? t.identifier('err')
          : t.BlockStatement([
            template.ast(catchCallback)
          ])
        const arrowFunctionNode = t.arrowFunctionExpression(
          [t.identifier('err')],
          arrowFunctionBody
        )

        const newNode = t.callExpression(
          t.memberExpression(
            polyfillPath.node,
            t.identifier('catch')
          ),
          [arrowFunctionNode]
        )

        polyfillPath.replaceWith(newNode)
      }
    }
  }
}
