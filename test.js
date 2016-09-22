const headary = require('./')
const test = require('tap').test

test('processing of received HTTP headers', (t) => {
  const f = headary
  function d (sc) {
    return {
      message: 'quaint HTTP status: ' + sc + ' from http://abc.de',
      ok: false,
      permanent: false,
      url: null
    }
  }
  const tmp = {
    message: null,
    ok: false,
    permanent: false,
    url: 'http://fgh.ijk'
  }
  function noloc (sc) {
    return {
      message: 'no location: ' + sc + ' from http://abc.de',
      ok: false,
      permanent: false,
      url: undefined
    }
  }
  const wanted = [
    d(100),
    { message: null,
      ok: true,
      permanent: false,
      url: null
    },
    tmp,
    noloc(300),
    { message: null,
      ok: false,
      permanent: true,
      url: 'http://fgh.ijk'
    },
    { message: 'no location: 301 from http://abc.de',
      ok: false,
      permanent: true,
      url: undefined
    },
    tmp,
    noloc(302),
    tmp,
    noloc(303),
    { message: null,
      ok: false,
      permanent: false,
      url: null
    },
    tmp,
    noloc(307),
    d(400),
    { message: null,
      ok: false,
      permanent: true,
      url: null
    },
    d(500)
  ]
  const found = [
    f({ statusCode: 100, headers: {}, url: 'http://abc.de' }),
    f({ statusCode: 200, headers: {} }),
    f({ statusCode: 300, headers: { 'location': 'http://fgh.ijk' } }),
    f({ statusCode: 300, headers: {}, url: 'http://abc.de' }),
    f({ statusCode: 301, headers: { 'location': 'http://fgh.ijk' } }),
    f({ statusCode: 301, headers: {}, url: 'http://abc.de' }),
    f({ statusCode: 302, headers: { 'location': 'http://fgh.ijk' } }),
    f({ statusCode: 302, headers: {}, url: 'http://abc.de' }),
    f({ statusCode: 303, headers: { 'location': 'http://fgh.ijk' } }),
    f({ statusCode: 303, headers: {}, url: 'http://abc.de' }),
    f({ statusCode: 304, headers: {} }),
    f({ statusCode: 307, headers: { 'location': 'http://fgh.ijk' } }),
    f({ statusCode: 307, headers: {}, url: 'http://abc.de' }),
    f({ statusCode: 400, headers: {}, url: 'http://abc.de' }),
    f({ statusCode: 410, headers: {} }),
    f({ statusCode: 500, headers: {}, url: 'http://abc.de' })
  ]
  t.plan(wanted.length)
  found.forEach(function (it) {
    t.same(it, wanted.shift())
  })
})
