var config = {
  presets: [
    ['@babel/preset-env', { modules: false }]
  ]
}

if (process.argv[2].indexOf('test') >= 0) {
  config.plugins = [
    ["./src/index.js", {
      // promiseNames: ['$confirm', '$prompt', '$msgbox'],
      // catchCallback: 'console.log(err)'
    }]
  ]
}

module.exports = config
