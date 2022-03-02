const { getAst, getDependencies, transform } = require("./parser");
const path = require("path");
const fs = require("fs");

module.exports = class Compiler {
  constructor(options) {
    const { output, entry } = options;
    this.output = output;
    this.entry = entry;
    // 存放所有构建好的模块信息
    this.modules = [];
  }
  run() {
    const entryModule = this.buildModule(this.entry, true);
    // console.log(entryModule)
    this.modules.push(entryModule);
    this.modules.map((_module) => {
      _module.dependencies.map((dependency) => {
        this.modules.push(this.buildModule(dependency));
      });
    });
    console.log("this", this.modules);
    this.emitFile();
  }
  buildModule(filename, isEntry) {
    let ast;
    if (isEntry) {
      ast = getAst(filename);
    } else {
      //相对路径转换成绝对路径， cwd()到根目录
      const absolutePath = path.join(process.cwd(), "./src", filename);
      ast = getAst(absolutePath);
    }
    return {
      filename,
      dependencies: getDependencies(ast),
      source: transform(ast),
    };
  }

  emitFile() {
    const outputPath = path.join(this.output.path, this.output.filename);
    let modules = "";
    this.modules.map((_module) => {
      modules += `'${_module.filename}':function(require,module,exports){${_module.source}},`;
    });
    console.log("modules", modules);
    const bundle = `
            (function(modules){
                function require(filename){
                    var fn = modules[filename]
                    var module = { exports :{}}
                    fn(require,module,module.exports)
                    return module.exports
                }
                require('${this.entry}')
            })({${modules}})
        
        `;
    // console.log('bundle',bundle)
    fs.writeFileSync(outputPath, bundle, "utf-8");
  }
};
