const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const t = require('@babel/types');

function generateAST(code) {
  return parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  });
}

function traverseAndTransformAST(ast, mode) {
  if (mode === 'off') {
    removei18n(ast);
  } else if (mode === 'on') {
    installi18n(ast);
  } else {
    console.error('Nonoononono only --on and --off mode');
  }
}

function removei18n(ast) {
  traverse(ast, {
    CallExpression(path) {
      const callee = path.node.callee;
      if (
        t.isIdentifier(callee, { name: 't' }) &&
        path.node.arguments.length === 1 &&
        (t.isStringLiteral(path.node.arguments[0]) ||
          t.isTemplateLiteral(path.node.arguments[0]))
      ) {
        const argument = path.node.arguments[0];

        path.replaceWith(argument);
      }
    },
  });
}

function installi18n(ast) {
  traverse(ast, {
    JSXExpressionContainer(path) {
      if (
        t.isTemplateLiteral(path.node.expression) ||
        t.isStringLiteral(path.node.expression)
      ) {
        const originalNode = path.node.expression;
        const callExpression = t.callExpression(t.identifier('t'), [
          originalNode,
        ]);
        path.replaceWith(t.jsxExpressionContainer(callExpression));
      }
    },
    JSXText(path) {
      const originalNode = path.node;
      if (originalNode.value.trim() !== '') {
        const stringLiteral = t.stringLiteral(originalNode.value);
        const callExpression = t.callExpression(t.identifier('t'), [
          stringLiteral,
        ]);
        path.replaceWith(t.jsxExpressionContainer(callExpression));
      }
    },
  });
}

function generateCodeFromAST(ast) {
  return generator(ast).code;
}

function largeComplicatedProcess(
  directoryPath,
  outputsPath,
  targetExtension,
  mode
) {
  console.log('mode:', mode);
  console.log('direactory:', directoryPath);
  fs.readdir(directoryPath, 'utf8', (err, files) => {
    if (err) {
      console.error('Where is the folder?', err);
      return;
    }
    console.log('files:', files);
    files.forEach((file) => {
      console.log('file:', file);
      const filePath = path.join(directoryPath, file);

      if (fs.lstatSync(filePath).isFile()) {
        console.log('filePath:', filePath);

        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            console.error('Where is the file???', err);
            return;
          }

          const ast = generateAST(data);
          if (file.endsWith(targetExtension)) {
            traverseAndTransformAST(ast, mode);
          }
          const generateCode = generateCodeFromAST(ast);

          if (!fs.existsSync(outputsPath)) {
            fs.mkdirSync(outputsPath, {
              recursive: true,
            });
          }
          const outputsFile = path.join(outputsPath, file);

          fs.writeFileSync(outputsFile, generateCode, (err) => {
            if (err) {
              console.error('Error!!!! i cant write file anymore!!!', err);
            } else {
              console.log('Here is the best file ever~');
            }
          });
        });
      }
    });
  });
}

const args = process.argv.slice(2);
const directoryPath = './src';
const outputsPath = './outputs';
const targetExtension = '.t.tsx';
const mode = args.includes('on')
  ? 'on'
  : args.includes('off')
  ? 'off'
  : 'error';

largeComplicatedProcess(directoryPath, outputsPath, targetExtension, mode);
