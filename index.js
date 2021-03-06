// headary - summarize HTTP headers

module.exports = headary

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

const funs = {
  200: () => {
    return new Headers(null, true, false, null)
  },
  300: moved,
  301: (url) => {
    return new Headers(msg(url), false, true, url)
  },
  302: moved,
  303: moved,
  304: () => {
    return new Headers(null, false, false, null)
  },
  305: () => {
    return new Headers(null, false, false, null)
  },
  307: moved,
  410: () => {
    return new Headers(null, false, true, null)
  }
}

// TODO: File Node issue
//
// Contrary to the Node documentation,
// https://nodejs.org/api/http.html#http_message_url,
// I found that the message never provided anything but an empty String as URL.
//
function somewhere (res) {
  if (typeof res.url === 'string' && res.url !== '') return res.url
  if (res.req) {
    const host = res.req.getHeader('host')
    if (host) return host
  }
  if (res.socket) return res.socket.remoteAddress
  return 'somewhere'
}

function headary (res) {
  var h
  const sc = res.statusCode
  const f = funs[sc]
  const loc = res.headers['location']
  if (f) h = f(loc)
  if (h && h.message === 'no location') {
    h.message += ': ' + sc + ' from ' + somewhere(res)
  }
  if (!h) {
    const msg = 'quaint HTTP status: ' + sc + ' from ' + somewhere(res)
    h = new Headers(msg, false, false, null)
  }
  return h
}

if (parseInt(process.env.NODE_TEST, 10) === 1) {
  exports.Headers = Headers
  exports.funs = funs
}
