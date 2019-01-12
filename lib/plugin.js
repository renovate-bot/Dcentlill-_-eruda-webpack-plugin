const fs = require('fs')
class ErudaPlugin {
  constructor(options = {
    force: false
  }) {
    this.options = options
  }
  apply(compiler) {
    const options = this.options;
    if (compiler.options.mode !== 'development' && !options.force) return;
    compiler.hooks.emit.tap('ErudaPlugin', (compilation) => {
      const eruda = fs.readFileSync(require.resolve('eruda'))
      const assets = compilation.assets;

      return new Promise((resolve, reject) => {
        Object.keys(assets).forEach(e => {
          if (!/\.js$/.test(e)) return
          let source = assets[e].source()
          const erudaCode = `\n;(function() {
                        ${eruda};
                        eruda.init();
                    })()`
          source += erudaCode
          compilation.assets[e].source = () => source
          compilation.assets[e].size = () => source.length
        })
        resolve()
      })
    })
  }
}

module.exports = ErudaPlugin