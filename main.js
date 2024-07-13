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
    console.error(informTextColor, 'Nonoononono only --on and --off mode');
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

function traverseDirectories(currentPath, targetExtension, mode) {
  fs.readdir(currentPath, (err, files) => {
    if (err) {
      return console.error('Wrong directory path!', err);
    }
    files.forEach((file) => {
      const filePath = path.join(currentPath, file);
      fs.lstat(filePath, (err, stats) => {
        if (err) {
          return console.error('wrong file path', err);
        }
        if (stats.isDirectory()) {
          const newFolderPath = filePath.replace('src', 'outputs');
          if (!fs.existsSync(newFolderPath)) {
            fs.mkdirSync(newFolderPath, { recursive: true });
          }
          traverseDirectories(filePath, targetExtension, mode);
        } else if (stats.isFile()) {
          transpileFile(filePath, targetExtension, mode);
        }
      });
    });
  });
}

// 확장자 추출
function getFullExtension(filePath) {
  let ext = path.extname(filePath);
  let baseName = path.basename(filePath, ext);

  while (path.extname(baseName) !== '') {
    ext = path.extname(baseName) + ext;
    baseName = path.basename(baseName, path.extname(baseName));
  }

  return ext;
}

// 파일일 경우에만 확인
function transpileFile(filePath, targetExtension, mode) {
  fs.readFile(filePath, 'utf8', (err, file) => {
    if (err) {
      console.error('Where is the file???', err);
      return;
    }
    const ast = generateAST(file);
    const fileExtension = getFullExtension(filePath);

    if (fileExtension === targetExtension) {
      console.log(informTextColor, `${filePath}`);
      traverseAndTransformAST(ast, mode);
    }
    const generateCode = generateCodeFromAST(ast);
    const newFilePath = filePath.replace('src', 'outputs');

    const outputsFile = path.join(newFilePath);
    fs.writeFileSync(outputsFile, generateCode, (err) => {
      if (err) {
        console.error('Error!!!! i cant write file anymore!!!', err);
      } else {
        console.log('Here is the best file ever~');
      }
    });
  });
}

function startTranspiling(currentPath, targetExtension, mode) {
  console.log('mode:', 'translate', mode);
  traverseDirectories(currentPath, targetExtension, mode);
}

const args = process.argv.slice(2);
const directoryPath = './src';
const targetExtension = '.t.tsx';
const mode = args.includes('on')
  ? 'on'
  : args.includes('off')
  ? 'off'
  : 'error';

const informTextColor = args.includes('on')
  ? '\x1b[32m'
  : args.includes('off')
  ? '\x1b[31m'
  : '\x1b[34m';

const outputsPath = './outputs';
if (!fs.existsSync(outputsPath)) {
  fs.mkdirSync(outputsPath, { recursive: true });
}

startTranspiling(directoryPath, targetExtension, mode);
