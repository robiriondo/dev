/*!
Copyright (c) Delphi Research Group | Carnegie Mellon University | All Rights Reserved.

 ____   ___    _   _  ___ _____   _____ ____ ___ _____
|  _ \ / _ \  | \ | |/ _ \_   _| | ____|  _ \_ _|_   _|
| | | | | | | |  \| | | | || |   |  _| | | | | |  | |
| |_| | |_| | | |\  | |_| || |   | |___| |_| | |  | |
|____/ \___/  |_| \_|\___/ |_|   |_____|____/___| |_|

        Automatically generated from sources at:
      https://github.com/cmu-delphi/delphi-epidata

 Commit hash: 6d543a2363ea7ec0442f093ccff83631785952ca
     Deployed at: 2018-06-25 10:50:43 (1529938243)
*/
/*

(function() {
    var e, n, r;
    null == ("undefined" != typeof $ && null !== $ ? $.getJSON : void 0) && (n = require("https"),
    r = require("querystring")),
    e = function() {
        function e() {}
        var u, l, t, i;
        //Added proxy in order to call API as the current API does not have CORS enabled.
        //Please enable CORS by adding <?php header('Access-Control-Allow-Origin: *'); ?> to the API.
        //API URL: https://delphi.midas.cs.cmu.edu/epidata/api.php
        //return u = "https://cors.io/?https://delphi.midas.cs.cmu.edu/epidata/api.php?",
        return u = "https://delphi.midas.cs.cmu.edu/epidata/api.php?",
        t = function(e) {
            return e.hasOwnProperty("from") && e.hasOwnProperty("to") ? e.from + "-" + e.to : "" + e
        }
        ,
        l = function(e) {
            var n;
            return Array.isArray(e) || (e = [e]),
            function() {
                var r, u, l;
                for (l = [],
                r = 0,
                u = e.length; r < u; r++)
                    n = e[r],
                    l.push(t(n));
                return l
            }().join(",")
        }
        ,
        i = function(e, l) {
            var t, i;
            return t = function(n) {
                return null != (null != n ? n.result : void 0) ? e(n.result, n.message, n.epidata) : e(0, "unknown error", null)
            }
            ,
            null != ("undefined" != typeof $ && null !== $ ? $.getJSON : void 0) ? $.getJSON(u, l, t) : (i = function(e) {
                var n;
                return n = "",
                e.setEncoding("utf8"),
                e.on("data", function(e) {
                    return n += e
                }),
                e.on("error", function(e) {
                    return error(e.message)
                }),
                e.on("end", function() {
                    return t(JSON.parse(n))
                })
            }
            ,
            n.get(u + "?" + r.stringify(l), i))
        }
        ,
        e.range = function(e, n) {
            var r;
            return n <= e && (r = [n, e],
            e = r[0],
            n = r[1]),
            {
                from: e,
                to: n
            }
        }
        ,
        e.fluview = function(e, n, r, u, t, s) {
            var o;
            if (null == n || null == r)
                throw {
                    msg: "`regions` and `epiweeks` are both required"
                };
            if (null != u && null != t)
                throw {
                    msg: "`issues` and `lag` are mutually exclusive"
                };
            return o = {
                source: "fluview",
                regions: l(n),
                epiweeks: l(r)
            },
            null != u && (o.issues = l(u)),
            null != t && (o.lag = t),
            null != s && (o.auth = s),
            i(e, o)
        }
        ,
        e.flusurv = function(e, n, r, u, t) {
            var s;
            if (null == n || null == r)
                throw {
                    msg: "`locations` and `epiweeks` are both required"
                };
            if (null != u && null != t)
                throw {
                    msg: "`issues` and `lag` are mutually exclusive"
                };
            return s = {
                source: "flusurv",
                locations: l(n),
                epiweeks: l(r)
            },
            null != u && (s.issues = l(u)),
            null != t && (s.lag = t),
            i(e, s)
        }
        ,
        e.gft = function(e, n, r) {
            var u;
            if (null == n || null == r)
                throw {
                    msg: "`locations` and `epiweeks` are both required"
                };
            return u = {
                source: "gft",
                locations: l(n),
                epiweeks: l(r)
            },
            i(e, u)
        }
        ,
        e.ght = function(e, n, r, u, t) {
            var s;
            if (null == n || null == r || null == u || null == t)
                throw {
                    msg: "`auth`, `locations`, `epiweeks`, and `query` are all required"
                };
            return s = {
                source: "ght",
                auth: n,
                locations: l(r),
                epiweeks: l(u),
                query: t
            },
            i(e, s)
        }
        ,
        e.twitter = function(e, n, r, u, t) {
            var s;
            if (null == n || null == r)
                throw {
                    msg: "`auth` and `locations` are both required"
                };
            if (!(null != u ^ null != t))
                throw {
                    msg: "exactly one of `dates` and `epiweeks` is required"
                };
            return s = {
                source: "twitter",
                auth: n,
                locations: l(r)
            },
            null != u && (s.dates = l(u)),
            null != t && (s.epiweeks = l(t)),
            i(e, s)
        }
        ,
        e.wiki = function(e, n, r, u, t) {
            var s;
            if (null == n)
                throw {
                    msg: "`articles` is required"
                };
            if (!(null != r ^ null != u))
                throw {
                    msg: "exactly one of `dates` and `epiweeks` is required"
                };
            return s = {
                source: "wiki",
                articles: l(n)
            },
            null != r && (s.dates = l(r)),
            null != u && (s.epiweeks = l(u)),
            null != t && (s.hours = l(t)),
            i(e, s)
        }
        ,
        e.cdc = function(e, n, r, u) {
            var t;
            if (null == n || null == r || null == u)
                throw {
                    msg: "`auth`, `epiweeks`, and `locations` are all required"
                };
            return t = {
                source: "cdc",
                auth: n,
                epiweeks: l(r),
                locations: l(u)
            },
            i(e, t)
        }
        ,
        e.quidel = function(e, n, r, u) {
            var t;
            if (null == n || null == r || null == u)
                throw {
                    msg: "`auth`, `epiweeks`, and `locations` are all required"
                };
            return t = {
                source: "quidel",
                auth: n,
                epiweeks: l(r),
                locations: l(u)
            },
            i(e, t)
        }
        ,
        e.nidss_flu = function(e, n, r, u, t) {
            var s;
            if (null == n || null == r)
                throw {
                    msg: "`regions` and `epiweeks` are both required"
                };
            if (null != u && null != t)
                throw {
                    msg: "`issues` and `lag` are mutually exclusive"
                };
            return s = {
                source: "nidss_flu",
                regions: l(n),
                epiweeks: l(r)
            },
            null != u && (s.issues = l(u)),
            null != t && (s.lag = t),
            i(e, s)
        }
        ,
        e.nidss_dengue = function(e, n, r) {
            var u;
            if (null == n || null == r)
                throw {
                    msg: "`locations` and `epiweeks` are both required"
                };
            return u = {
                source: "nidss_dengue",
                locations: l(n),
                epiweeks: l(r)
            },
            i(e, u)
        }
        ,
        e.delphi = function(e, n, r) {
            var u;
            if (null == n || null == r)
                throw {
                    msg: "`system` and `epiweek` are both required"
                };
            return u = {
                source: "delphi",
                system: n,
                epiweek: r
            },
            i(e, u)
        }
        ,
        e.sensors = function(e, n, r, u, t) {
            var s;
            if (null == n || null == r || null == u || null == t)
                throw {
                    msg: "`auth`, `names`, `locations`, and `epiweeks` are all required"
                };
            return s = {
                source: "sensors",
                auth: n,
                names: l(r),
                locations: l(u),
                epiweeks: l(t)
            },
            i(e, s)
        }
        ,
        e.nowcast = function(e, n, r) {
            var u;
            if (null == n || null == r)
                throw {
                    msg: "`locations` and `epiweeks` are both required"
                };
            return u = {
                source: "nowcast",
                locations: l(n),
                epiweeks: l(r)
            },
            i(e, u)
        }
        ,
        e.meta = function(e) {
            return i(e, {
                source: "meta"
            })
        }
        ,
        e
    }(),
    ("undefined" != typeof exports && null !== exports ? exports : window).Epidata = e
}
).call(this);

*/

(function() {
  var Epidata, https, querystring;

  if ((typeof $ !== "undefined" && $ !== null ? $.getJSON : void 0) == null) {
    https = require('https');
    querystring = require('querystring');
  }

  Epidata = (function() {
    var BASE_URL, _list, _listitem, _request;

    function Epidata() {}

    BASE_URL = 'https://delphi.midas.cs.cmu.edu/epidata/api.php?';

    _listitem = function(value) {
      if (value.hasOwnProperty('from') && value.hasOwnProperty('to')) {
        return value['from'] + "-" + value['to'];
      } else {
        return "" + value;
      }
    };

    _list = function(values) {
      var value;
      if (!Array.isArray(values)) {
        values = [values];
      }
      return ((function() {
        var i, len, results;
        results = [];
        for (i = 0, len = values.length; i < len; i++) {
          value = values[i];
          results.push(_listitem(value));
        }
        return results;
      })()).join(',');
    };

    _request = function(callback, params) {
      var handler, reader;
      handler = function(data) {
        if ((data != null ? data.result : void 0) != null) {
          return callback(data.result, data.message, data.epidata);
        } else {
          return callback(0, 'unknown error', null);
        }
      };
      if ((typeof $ !== "undefined" && $ !== null ? $.getJSON : void 0) != null) {
        return $.getJSON(BASE_URL, params, handler);
      } else {
        reader = function(response) {
          var text;
          text = '';
          response.setEncoding('utf8');
          response.on('data', function(chunk) {
            return text += chunk;
          });
          response.on('error', function(e) {
            return error(e.message);
          });
          return response.on('end', function() {
            return handler(JSON.parse(text));
          });
        };
        return https.get(BASE_URL + "?" + (querystring.stringify(params)), reader);
      }
    };

    Epidata.range = function(from, to) {
      var ref;
      if (to <= from) {
        ref = [to, from], from = ref[0], to = ref[1];
      }
      return {
        from: from,
        to: to
      };
    };

    Epidata.fluview = function(callback, regions, epiweeks, issues, lag, auth) {
      var params;
      if (!((regions != null) && (epiweeks != null))) {
        throw {
          msg: '`regions` and `epiweeks` are both required'
        };
      }
      if ((issues != null) && (lag != null)) {
        throw {
          msg: '`issues` and `lag` are mutually exclusive'
        };
      }
      params = {
        'source': 'fluview',
        'regions': _list(regions),
        'epiweeks': _list(epiweeks)
      };
      if (issues != null) {
        params.issues = _list(issues);
      }
      if (lag != null) {
        params.lag = lag;
      }
      if (auth != null) {
        params.auth = auth;
      }
      return _request(callback, params);
    };

    Epidata.fluview_clinical = function(callback, regions, epiweeks, issues, lag) {
      var params;
      if (!((regions != null) && (epiweeks != null))) {
        throw {
          msg: '`regions` and `epiweeks` are both required'
        };
      }
      if ((issues != null) && (lag != null)) {
        throw {
          msg: '`issues` and `lag` are mutually exclusive'
        };
      }
      params = {
        'source': 'fluview_clinical',
        'regions': _list(regions),
        'epiweeks': _list(epiweeks)
      };
      if (issues != null) {
        params.issues = _list(issues);
      }
      if (lag != null) {
        params.lag = lag;
      }
      return _request(callback, params);
    };

    Epidata.flusurv = function(callback, locations, epiweeks, issues, lag) {
      var params;
      if (!((locations != null) && (epiweeks != null))) {
        throw {
          msg: '`locations` and `epiweeks` are both required'
        };
      }
      if ((issues != null) && (lag != null)) {
        throw {
          msg: '`issues` and `lag` are mutually exclusive'
        };
      }
      params = {
        'source': 'flusurv',
        'locations': _list(locations),
        'epiweeks': _list(epiweeks)
      };
      if (issues != null) {
        params.issues = _list(issues);
      }
      if (lag != null) {
        params.lag = lag;
      }
      return _request(callback, params);
    };

    Epidata.gft = function(callback, locations, epiweeks) {
      var params;
      if (!((locations != null) && (epiweeks != null))) {
        throw {
          msg: '`locations` and `epiweeks` are both required'
        };
      }
      params = {
        'source': 'gft',
        'locations': _list(locations),
        'epiweeks': _list(epiweeks)
      };
      return _request(callback, params);
    };

    Epidata.ght = function(callback, auth, locations, epiweeks, query) {
      var params;
      if (!((auth != null) && (locations != null) && (epiweeks != null) && (query != null))) {
        throw {
          msg: '`auth`, `locations`, `epiweeks`, and `query` are all required'
        };
      }
      params = {
        'source': 'ght',
        'auth': auth,
        'locations': _list(locations),
        'epiweeks': _list(epiweeks),
        'query': query
      };
      return _request(callback, params);
    };

    Epidata.twitter = function(callback, auth, locations, dates, epiweeks) {
      var params;
      if (!((auth != null) && (locations != null))) {
        throw {
          msg: '`auth` and `locations` are both required'
        };
      }
      if (!((dates != null) ^ (epiweeks != null))) {
        throw {
          msg: 'exactly one of `dates` and `epiweeks` is required'
        };
      }
      params = {
        'source': 'twitter',
        'auth': auth,
        'locations': _list(locations)
      };
      if (dates != null) {
        params.dates = _list(dates);
      }
      if (epiweeks != null) {
        params.epiweeks = _list(epiweeks);
      }
      return _request(callback, params);
    };

    Epidata.wiki = function(callback, articles, dates, epiweeks, hours) {
      var params;
      if (articles == null) {
        throw {
          msg: '`articles` is required'
        };
      }
      if (!((dates != null) ^ (epiweeks != null))) {
        throw {
          msg: 'exactly one of `dates` and `epiweeks` is required'
        };
      }
      params = {
        'source': 'wiki',
        'articles': _list(articles)
      };
      if (dates != null) {
        params.dates = _list(dates);
      }
      if (epiweeks != null) {
        params.epiweeks = _list(epiweeks);
      }
      if (hours != null) {
        params.hours = _list(hours);
      }
      return _request(callback, params);
    };

    Epidata.cdc = function(callback, auth, epiweeks, locations) {
      var params;
      if (!((auth != null) && (epiweeks != null) && (locations != null))) {
        throw {
          msg: '`auth`, `epiweeks`, and `locations` are all required'
        };
      }
      params = {
        'source': 'cdc',
        'auth': auth,
        'epiweeks': _list(epiweeks),
        'locations': _list(locations)
      };
      return _request(callback, params);
    };

    Epidata.quidel = function(callback, auth, epiweeks, locations) {
      var params;
      if (!((auth != null) && (epiweeks != null) && (locations != null))) {
        throw {
          msg: '`auth`, `epiweeks`, and `locations` are all required'
        };
      }
      params = {
        'source': 'quidel',
        'auth': auth,
        'epiweeks': _list(epiweeks),
        'locations': _list(locations)
      };
      return _request(callback, params);
    };

    Epidata.norostat = function(callback, auth, location, epiweeks) {
      var params;
      if (!((auth != null) && (location != null) && (epiweeks != null))) {
        throw {
          msg: '`auth`, `location`, and `epiweeks` are all required'
        };
      }
      params = {
        'source': 'norostat',
        'auth': auth,
        'location': location,
        'epiweeks': _list(epiweeks)
      };
      return _request(callback, params);
    };

    Epidata.meta_norostat = function(callback, auth) {
      var params;
      if (auth == null) {
        throw {
          msg: '`auth` is required'
        };
      }
      params = {
        'source': 'meta_norostat',
        'auth': auth
      };
      return _request(callback, params);
    };

    Epidata.afhsb = function(callback, auth, locations, epiweeks, flu_types) {
      var params;
      if (!((auth != null) && (locations != null) && (epiweeks != null) && (flu_types != null))) {
        throw {
          msg: '`auth`, `locations`, `epiweeks` and `flu_types` are all required'
        };
      }
      params = {
        'source': 'afhsb',
        'auth': auth,
        'locations': _list(locations),
        'epiweeks': _list(epiweeks),
        'flu_types': _list(flu_types)
      };
      return _request(callback, params);
    };

    Epidata.meta_afhsb = function(callback, auth) {
      var params;
      if (auth == null) {
        throw {
          msg: '`auth` is required'
        };
      }
      params = {
        'source': 'meta_afhsb',
        'auth': auth
      };
      return _request(callback, params);
    };

    Epidata.nidss_flu = function(callback, regions, epiweeks, issues, lag) {
      var params;
      if (!((regions != null) && (epiweeks != null))) {
        throw {
          msg: '`regions` and `epiweeks` are both required'
        };
      }
      if ((issues != null) && (lag != null)) {
        throw {
          msg: '`issues` and `lag` are mutually exclusive'
        };
      }
      params = {
        'source': 'nidss_flu',
        'regions': _list(regions),
        'epiweeks': _list(epiweeks)
      };
      if (issues != null) {
        params.issues = _list(issues);
      }
      if (lag != null) {
        params.lag = lag;
      }
      return _request(callback, params);
    };

    Epidata.nidss_dengue = function(callback, locations, epiweeks) {
      var params;
      if (!((locations != null) && (epiweeks != null))) {
        throw {
          msg: '`locations` and `epiweeks` are both required'
        };
      }
      params = {
        'source': 'nidss_dengue',
        'locations': _list(locations),
        'epiweeks': _list(epiweeks)
      };
      return _request(callback, params);
    };

    Epidata.delphi = function(callback, system, epiweek) {
      var params;
      if (!((system != null) && (epiweek != null))) {
        throw {
          msg: '`system` and `epiweek` are both required'
        };
      }
      params = {
        'source': 'delphi',
        'system': system,
        'epiweek': epiweek
      };
      return _request(callback, params);
    };

    Epidata.sensors = function(callback, auth, names, locations, epiweeks) {
      var params;
      if (!((auth != null) && (names != null) && (locations != null) && (epiweeks != null))) {
        throw {
          msg: '`auth`, `names`, `locations`, and `epiweeks` are all required'
        };
      }
      params = {
        'source': 'sensors',
        'auth': auth,
        'names': _list(names),
        'locations': _list(locations),
        'epiweeks': _list(epiweeks)
      };
      return _request(callback, params);
    };

    Epidata.nowcast = function(callback, locations, epiweeks) {
      var params;
      if (!((locations != null) && (epiweeks != null))) {
        throw {
          msg: '`locations` and `epiweeks` are both required'
        };
      }
      params = {
        'source': 'nowcast',
        'locations': _list(locations),
        'epiweeks': _list(epiweeks)
      };
      return _request(callback, params);
    };

    Epidata.meta = function(callback) {
      return _request(callback, {
        'source': 'meta'
      });
    };

    return Epidata;

  })();

  (typeof exports !== "undefined" && exports !== null ? exports : window).Epidata = Epidata;

}).call(this);
