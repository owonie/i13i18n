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

function traverseAndTransformAST(ast) {
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

function traverseDirectories(currentPath) {
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
          traverseDirectories(filePath);
        } else if (stats.isFile()) {
          transpileFile(filePath);
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
function transpileFile(filePath) {
  fs.readFile(filePath, 'utf8', (err, file) => {
    if (err) {
      console.error('Where is the file???', err);
      return;
    }
    const fileExtension = getFullExtension(filePath);

    const newFilePath = filePath.replace(
      sourceDirectory.slice(2),
      outputDirectory.slice(2)
    );
    const outputsFile = path.join(newFilePath);

    if (!targetExtensions.includes(fileExtension)) {
      fs.copyFile(filePath, outputsFile, (err) => {
        if (err) {
          console.error('Error copying file:', err);
          return;
        }
      });
      return;
    } else {
      console.log(informTextColor, `${filePath}`);

      const ast = generateAST(file);
      traverseAndTransformAST(ast, mode);
      const generateCode = generateCodeFromAST(ast);
      fs.writeFileSync(outputsFile, generateCode, (err) => {
        if (err) {
          console.error('Error!!!! i cant write file anymore!!!', err);
        } else {
          console.log('Here is the best file ever~');
        }
      });
    }
  });
}

function startTranspiling(currentPath) {
  console.log('mode:', 'translate', mode);
  traverseDirectories(currentPath);
}

function loadConfig() {
  const configPath = path.resolve(process.cwd(), 'i13i18n.config.json');
  if (!fs.existsSync(configPath)) {
    throw new Error(`Config File Not Found! ${configPath}`);
  }
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

function main() {
  // const directoryPath = './src';
  // const targetExtension = '.t.tsx';
  // const outputsPath = './outputs';

  if (fs.existsSync(outputDirectory)) {
    fs.rmSync(outputDirectory, { recursive: true, force: true });
  }
  fs.mkdirSync(outputDirectory, { recursive: true });
  startTranspiling(sourceDirectory);
}

const args = process.argv.slice(2);
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

const config = loadConfig();
console.log('debug', config);
const { sourceDirectory, outputDirectory, transpileOptions, targetExtensions } =
  config;
console.log('debug2', outputDirectory);

main();
