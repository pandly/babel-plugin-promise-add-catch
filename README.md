# babel-plugin-promise-add-catch

[![GitHub issues](https://img.shields.io/github/issues/pandly/babel-plugin-promise-add-catch.svg)](https://github.com/pandly/babel-plugin-promise-add-catch/issues)
[![GitHub forks](https://img.shields.io/github/forks/pandly/babel-plugin-promise-add-catch.svg)](https://github.com/pandly/babel-plugin-promise-add-catch/network)
[![GitHub stars](https://img.shields.io/github/stars/pandly/babel-plugin-promise-add-catch.svg)](https://github.com/pandly/babel-plugin-promise-add-catch/stargazers)
[![GitHub license](https://img.shields.io/github/license/pandly/babel-plugin-promise-add-catch.svg)](https://github.com/pandly/babel-plugin-promise-add-catch/blob/master/LICENSE)

## Install

```bash
npm i babel-plugin-promise-add-catch -D
```

## Usage

Via `babel.config.js` or babel-loader.

```js
{
  "plugins": [["promise-add-catch", options]]
}
```

### options

`options` is object.

```javascript
{
  "promiseNames": ['$confirm', 'confirm', '$prompt', 'getUserInfo'],
  "catchCallback" 'console.log(err)'
}
```

* `promiseNames:array`: Choose to add catch for the specified Promise; if it is empty, don't add catch for any Promise; if you don't set this option, add catch for all Promise;

* `catchCallback:string`: The function body of catch callback, the parameter is err; if not set, the callback of catch defaults to err => err；

## Example

### Converts
```javascript
this.$confirm().then()

MessageBox.confirm().then()

this['$prompt'].then()

getUserInfo().then()

getUserInfo().then().catch()

ctx.$confirm("是否确定删除?", "提示", {
  type: "warning"
}).then(() => {
  getUserInfo().then(() => {
    getPermission().then()
  })
})
```

### To
```javascript
this.$confirm().then().catch(err => { console.log(err) })

MessageBox.confirm().then().catch(err => { console.log(err) })

this['$prompt'].then().catch(err => { console.log(err) })

getUserInfo().then().catch(err => { console.log(err) })

getUserInfo().then().catch()

ctx.$confirm("是否确定删除?", "提示", {
  type: "warning"
}).then(() => {
  getUserInfo().then(() => {
    getPermission().then().catch(err => { console.log(err) })
  }).catch(err => { console.log(err) })
}).catch(err => { console.log(err) })
```

## Development

```bash
npm run test
```

## Build

```bash
npm run build
```

