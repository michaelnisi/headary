// headary - summarize HTTP headers

module.exports = headary

// Normalized summary of some HTTP status codes and headers.
// - message String | undefined An error message
// - ok Boolean | false `true` if no further actions are required
// - permanent Boolean | false `true` if resource has been permanently moved
// - url String | undefined The location header
function Headers (message, ok, permanent, url) {
  this.message = message
  this.ok = ok
  this.permanent = permanent
  this.url = url
}

function msg (url) {
  return !url ? 'no location' : null
}

function moved (url) {
  return new Headers(msg(url), false, false, url)
}

var funs = {
  200: function () {
    return new Headers(null, true, false, null)
  },
  300: moved,
  301: function (url) {
    return new Headers(msg(url), false, true, url)
  },
  302: moved,
  303: moved,
  304: function () {
    return new Headers(null, false, false, null)
  },
  305: function () {
    return new Headers(null, false, false, null)
  },
  307: moved,
  410: function () {
    return new Headers(null, false, true, null)
  }
}

function headary (res) {
  var h
  var sc = res.statusCode
  var f = funs[sc]
  var loc = res.headers['location']
  if (f) h = f(loc)
  if (h && h.message === 'no location') {
    h.message += ': ' + sc + ' from ' + res.url
  }
  if (!h) {
    var msg = 'quaint HTTP status: ' + sc + ' from ' + res.url
    h = new Headers(msg, false, false, null)
  }
  return h
}

if (parseInt(process.env.NODE_TEST, 10) === 1) {
  exports.Headers = Headers
  exports.funs = funs
}
