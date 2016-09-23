const http = require('http')
const headary = require('./')

http.get('http://google.com/hello', (res) => {
  const h = headary(res)
  console.log(h)
})
