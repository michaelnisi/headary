# headary - summarize HTTP headers

**headary** is a trivial [Node](https://nodejs.org) package that provides a normalized summary of basic HTTP status codes and headers. You might use **headary** to write control flow for `redirects` and `304s` in a uniform way. This can make sense if you handle responses at multiple locations in your code.

[![Build Status](https://secure.travis-ci.org/michaelnisi/headary.svg)](http://travis-ci.org/michaelnisi/headary)

## example

```js
var headary = require('headary')

// Get HTTP response `res` from somewhere.

var h = headary(res)
if (h.ok) {
  // Move on.
} else {
  if (h.message) {
    // Quaint or unhandled HTTP status.
    var er = new Error(h.message)
    this.emit('error', er)
  } else if (h.url) {
    // Issue request with new URL.
    if (h.permanent) {
      // Update some cache or whatever.
    }
  } else if (h.permanent) {
    // `410: Gone`, update cache.
  } else {
    // `304: Not Modified`, done.
  }
}
```

## types

### summary (message, ok, permanent, url)

- `message` [`String()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)` | undefined` An error message
- `ok` [`Boolean()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)` | false` No further actions required
- `permanent Boolean() | false` Resource been moved permanently
- `url String() | undefined` The new location of the resource

## exports

**headary** exports a single function that returns a `summary()` object.

### headary(res)

- `res` [`http.IncomingMessage()`](https://nodejs.org/api/http.html#http_http_incomingmessage) A HTTP response

Take a HTTP response, and return a `summary()` object.

The considered HTTP status codes:

- `200 OK`
- `300 Multiple Choices`
- `301 Moved Permanently`
- `302 Found`
- `303 See Other`
- `304 Not Modified`
- `305 Use Proxy`
- `307 Temporary Redirect`
- `410 Gone`

## install

With [npm](https://npmjs.org/package/headary) do:

```
$ npm install headary
```

## license

[MIT License](https://raw.github.com/michaelnisi/headary/master/LICENSE)
