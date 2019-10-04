var App, CENSUS_REGIONS, Epidata_fluview_single, Epidata_nowcast_multi, Epidata_nowcast_single, HHS_REGIONS, ILI_AVAILABLE, ILI_SHARED, LAT_MAX, LAT_MIN, LOCATIONS, LON_MAX, LON_MIN, MONTHS, NAMES, NATIONAL, NON_INFLUENZA_WEEK_SEASON, POPULATION, PointerInput, REGION2STATE, REGIONS, STATES, WEEKDAYS, activity_level, calculateColor, calculateMean, calculateNonInfluenzaData, calculateStdev, centerX, centerY, date2String, deg2rad, dlat, dlon, epiweek2date, epiweekOffByOne, epiweekOffByTen, getEpidataHander, getFakeRow, get_ecef2ortho, i, indexes, j, lat, len, len1, len2, len3, len4, len5, len6, level2Color, ll2ecef, lon, m, maxX, maxY, minX, minY, n, normalizeCase, o, p, poly, q, r, ref, ref1, ref10, ref11, ref12, ref13, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, s, x1, x2, y1, y2,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

deg2rad = Math.PI / 180;

ll2ecef = function(lat, lon, h) {
  var C, H, S, a, clat, clon, f, ref, ref1, ref2, ref3, slat, slon, x, y, z;
  if (h == null) {
    h = 0;
  }
  ref = [lat * deg2rad, lon * deg2rad], lat = ref[0], lon = ref[1];
  ref1 = [Math.cos(lat), Math.cos(lon)], clat = ref1[0], clon = ref1[1];
  ref2 = [Math.sin(lat), Math.sin(lon)], slat = ref2[0], slon = ref2[1];
  ref3 = [6378137, Math.pow(298.257223563, -1)], a = ref3[0], f = ref3[1];
  C = Math.pow(Math.pow(clat, 2) + Math.pow((1 - f) * slat, 2), -0.5);
  S = Math.pow(1 - f, 2) * C;
  H = h / a;
  x = (C + H) * clat * clon;
  y = (C + H) * clat * slon;
  z = (S + H) * slat;
  return [x, y, z];
};

get_ecef2ortho = function(lat, lon, zoom, w, h) {
  var a, b, cx, cy, d, dx, dy, e, f, h2, ref, ref1, ref2, ref3, ref4, sx, sy, w2, wh;
  ref = [lat * deg2rad, lon * deg2rad], dx = ref[0], dy = ref[1];
  ref1 = [Math.sin(dx), Math.cos(dx)], sx = ref1[0], cx = ref1[1];
  ref2 = [Math.sin(dy), Math.cos(dy)], sy = ref2[0], cy = ref2[1];
  ref3 = [w / 2, h / 2], w2 = ref3[0], h2 = ref3[1];
  wh = Math.min(w2, h2) * zoom;
  ref4 = [-sy * wh, cy * wh, cy * sx * wh, sx * sy * wh, -cx * wh], a = ref4[0], b = ref4[1], d = ref4[2], e = ref4[3], f = ref4[4];
  return function(x, y, z) {
    return [w2 + x * a + y * b, h2 + x * d + y * e + z * f];
  };
};

indexes = [];

ref = geodata.locations['HI'].paths;
for (j = 0, len = ref.length; j < len; j++) {
  poly = ref[j];
  for (m = 0, len1 = poly.length; m < len1; m++) {
    i = poly[m];
    if (indexOf.call(indexes, i) < 0) {
      indexes.push(i);
    }
  }
}

for (n = 0, len2 = indexes.length; n < len2; n++) {
  i = indexes[n];
  ref1 = geodata.points[i], lat = ref1[0], lon = ref1[1];
  geodata.points[i] = [lat + 5, lon + 50];
}

indexes = [];

ref2 = geodata.locations['AK'].paths;
for (o = 0, len3 = ref2.length; o < len3; o++) {
  poly = ref2[o];
  for (p = 0, len4 = poly.length; p < len4; p++) {
    i = poly[p];
    if (indexOf.call(indexes, i) < 0) {
      indexes.push(i);
    }
  }
}

ref3 = [Number.MAX_VALUE, Number.MAX_VALUE, Number.MIN_VALUE, Number.MIN_VALUE], minX = ref3[0], minY = ref3[1], maxX = ref3[2], maxY = ref3[3];

for (q = 0, len5 = indexes.length; q < len5; q++) {
  i = indexes[q];
  ref4 = geodata.points[i], lat = ref4[0], lon = ref4[1];
  if (lon < 0) {
    ref5 = [Math.min(minX, lon), Math.min(minY, lat), Math.max(maxX, lon), Math.max(maxY, lat)], minX = ref5[0], minY = ref5[1], maxX = ref5[2], maxY = ref5[3];
  }
}

ref6 = [(minX + maxX) / 2, (minY + maxY) / 2], centerX = ref6[0], centerY = ref6[1];

for (r = 0, len6 = indexes.length; r < len6; r++) {
  i = indexes[r];
  ref7 = geodata.points[i], lat = ref7[0], lon = ref7[1];
  if (lon > 0) {
    lon = lon - 360;
  }
  dlon = Math.abs(lon - centerX) * 12 / 17;
  dlat = Math.abs(lat - centerY) * 9 / 17;
  if (lat > centerY) {
    lat = lat - dlat;
  } else {
    lat = lat + dlat;
  }
  if (lon > centerX) {
    lon = lon - dlon;
  } else {
    lon = lon + dlon;
  }
  if (lon < -180) {
    lon = lon + 360;
  }
  geodata.points[i] = [lat - 35, lon - 10];
}

for (i = s = 0, ref8 = geodata.points.length; 0 <= ref8 ? s < ref8 : s > ref8; i = 0 <= ref8 ? ++s : --s) {
  ref9 = geodata.points[i], lat = ref9[0], lon = ref9[1];
  geodata.points[i] = ll2ecef(lat, lon);
  if (lon >= 0) {
    lon -= 360;
  }
  if (i === 0) {
    ref10 = [lon, lon, lat, lat], x1 = ref10[0], x2 = ref10[1], y1 = ref10[2], y2 = ref10[3];
  }
  ref11 = [Math.min(y1, lat), Math.max(y2, lat)], y1 = ref11[0], y2 = ref11[1];
  ref12 = [Math.min(x1, lon), Math.max(x2, lon)], x1 = ref12[0], x2 = ref12[1];
}

ref13 = [x1, x2, y1, y2], LON_MIN = ref13[0], LON_MAX = ref13[1], LAT_MIN = ref13[2], LAT_MAX = ref13[3];

WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

NATIONAL = ['nat'];

HHS_REGIONS = ['hhs1', 'hhs2', 'hhs3', 'hhs4', 'hhs5', 'hhs6', 'hhs7', 'hhs8', 'hhs9', 'hhs10'];

CENSUS_REGIONS = ['cen1', 'cen2', 'cen3', 'cen4', 'cen5', 'cen6', 'cen7', 'cen8', 'cen9'];

REGIONS = HHS_REGIONS.concat(CENSUS_REGIONS);

STATES = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'];

LOCATIONS = NATIONAL.concat(REGIONS).concat(STATES);

ILI_SHARED = ['AK', 'AZ', 'CA', 'CO', 'ID', 'KS', 'LA', 'MD', 'ME', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'OH', 'OR', 'PA', 'RI', 'TN', 'TX', 'VA', 'VI', 'VT', 'WI', 'WV', 'WY'];

ILI_AVAILABLE = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'IA', 'ID', 'IL', 'IN', 'KS', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'RI', 'SC', 'SD', 'TN', 'TX', 'VT', 'WI', 'WV', 'WY'];

NAMES = {
  "FL": "Florida",
  "cen4": "West North Central",
  "hhs9": "HHS Region 9",
  "MT": "Montana",
  "WV": "West Virginia",
  "RI": "Rhode Island",
  "AR": "Arkansas",
  "VA": "Virginia",
  "cen7": "West South Central",
  "IN": "Indiana",
  "NC": "North Carolina",
  "IA": "Iowa",
  "MN": "Minnesota",
  "cen2": "Middle Atlantic",
  "DE": "Delaware",
  "PA": "Pennsylvania",
  "hhs7": "HHS Region 7",
  "nat": "US National",
  "hhs10": "HHS Region 10",
  "LA": "Louisiana",
  "MD": "Maryland",
  "AK": "Alaska",
  "CO": "Colorado",
  "WI": "Wisconsin",
  "ID": "Idaho",
  "OK": "Oklahoma",
  "hhs3": "HHS Region 3",
  "hhs2": "HHS Region 2",
  "hhs1": "HHS Region 1",
  "cen1": "New England",
  "KY": "Kentucky",
  "ME": "Maine",
  "CA": "California",
  "cen5": "South Atlantic",
  "WY": "Wyoming",
  "ND": "North Dakota",
  "NY": "New York",
  "MA": "Massachusetts",
  "UT": "Utah",
  "DC": "District of Columbia",
  "MS": "Mississippi",
  "hhs6": "HHS Region 6",
  "GA": "Georgia",
  "AL": "Alabama",
  "HI": "Hawaii",
  "hhs4": "HHS Region 4",
  "AZ": "Arizona",
  "CT": "Connecticut",
  "KS": "Kansas",
  "NH": "New Hampshire",
  "cen8": "Mountain",
  "TX": "Texas",
  "NV": "Nevada",
  "TN": "Tennessee",
  "NJ": "New Jersey",
  "MI": "Michigan",
  "hhs8": "HHS Region 8",
  "NM": "New Mexico",
  "IL": "Illinois",
  "cen3": "East North Central",
  "VT": "Vermont",
  "WA": "Washington",
  "SD": "South Dakota",
  "NE": "Nebraska",
  "hhs5": "HHS Region 5",
  "SC": "South Carolina",
  "cen6": "East South Central",
  "OR": "Oregon",
  "cen9": "Pacific",
  "MO": "Missouri",
  "OH": "Ohio"
};

REGION2STATE = {
  "hhs1": ['ME', 'MA', 'NH', 'VT', 'RI', 'CT'],
  "hhs2": ['NY', 'NJ'],
  "hhs3": ['PA', 'DE', 'DC', 'MD', 'VA', 'WV'],
  "hhs4": ['NC', 'SC', 'GA', 'FL', 'KY', 'TN', 'MS', 'AL'],
  "hhs5": ['MI', 'IL', 'IN', 'OH', 'WI', 'MN'],
  "hhs6": ['LA', 'AR', 'OK', 'TX', 'NM'],
  "hhs7": ['IA', 'MO', 'NE', 'KS'],
  "hhs8": ['ND', 'SD', 'CO', 'WY', 'MT', 'UT'],
  "hhs9": ['NV', 'CA', 'HI', 'AZ'],
  "hhs10": ['WA', 'OR', 'AK', 'ID'],
  "cen1": ['ME', 'MA', 'NH', 'VT', 'RI', 'CT'],
  "cen2": ['PA', 'NY', 'NJ'],
  "cen3": ['WI', 'MI', 'IN', 'IL', 'OH'],
  "cen4": ['ND', 'SD', 'NE', 'KS', 'MN', 'IA', 'MO'],
  "cen5": ['DE', 'MD', 'DC', 'WV', 'VA', 'NC', 'SC', 'GA', 'FL'],
  "cen6": ['KY', 'TN', 'MS', 'AL'],
  "cen7": ['OK', 'AR', 'LA', 'TX'],
  "cen8": ['MT', 'ID', 'WY', 'CO', 'UT', 'NV', 'AZ', 'NM'],
  "cen9": ['WA', 'OR', 'CA', 'AK', 'HI']
};

POPULATION = {
  'AK': 731449,
  'AL': 4822023,
  'AR': 2949131,
  'AZ': 6553255,
  'CA': 38041430,
  'CO': 5187582,
  'CT': 3590347,
  'DC': 632323,
  'DE': 917092,
  'FL': 19317568,
  'GA': 9919945,
  'HI': 1392313,
  'IA': 3074186,
  'ID': 1595728,
  'IL': 12875255,
  'IN': 6537334,
  'KS': 2885905,
  'KY': 4380415,
  'LA': 4601893,
  'MA': 6646144,
  'MD': 5884563,
  'ME': 1329192,
  'MI': 9883360,
  'MN': 5379139,
  'MO': 6021988,
  'MS': 2984926,
  'MT': 1005141,
  'NC': 9752073,
  'ND': 699628,
  'NE': 1855525,
  'NH': 1320718,
  'NJ': 8864590,
  'NM': 2085538,
  'NV': 2758931,
  'NY': 19570261,
  'OH': 11544225,
  'OK': 3814820,
  'OR': 3899353,
  'PA': 12763536,
  'RI': 1050292,
  'SC': 4723723,
  'SD': 833354,
  'TN': 6456243,
  'TX': 26059203,
  'UT': 2855287,
  'VA': 8185867,
  'VT': 626011,
  'WA': 6897012,
  'WI': 5726398,
  'WV': 1855413,
  'WY': 576412
};

NON_INFLUENZA_WEEK_SEASON = 2015;

calculateMean = function(values) {
  var len7, sum, t, v;
  sum = 0;
  for (t = 0, len7 = values.length; t < len7; t++) {
    v = values[t];
    sum += v;
  }
  return sum / values.length;
};

calculateStdev = function(values, mean) {
  var len7, sum, t, v;
  sum = 0;
  for (t = 0, len7 = values.length; t < len7; t++) {
    v = values[t];
    sum += Math.pow(v - mean, 2);
  }
  return Math.pow(sum / (values.length - 1), 0.5);
};

calculateNonInfluenzaData = function(epidata, season) {
  var NonInfluenzaData, aa, ab, ac, ad, len10, len11, len7, len8, len9, loc, mappedData, mean, ref14, region, row, state, stdev, t, values, week, weeks, wk;
  NonInfluenzaData = {};
  mappedData = {};
  for (t = 0, len7 = LOCATIONS.length; t < len7; t++) {
    loc = LOCATIONS[t];
    mappedData[loc] = {};
  }
  for (aa = 0, len8 = epidata.length; aa < len8; aa++) {
    row = epidata[aa];
    wk = row.epiweek % 100;
    mappedData[row.location][wk] = row.value;
  }
  for (ab = 0, len9 = HHS_REGIONS.length; ab < len9; ab++) {
    region = HHS_REGIONS[ab];
    weeks = nonInfluenzaWeekData[season][region];
    ref14 = REGION2STATE[region];
    for (ac = 0, len10 = ref14.length; ac < len10; ac++) {
      state = ref14[ac];
      values = [];
      for (ad = 0, len11 = weeks.length; ad < len11; ad++) {
        week = weeks[ad];
        values.push(mappedData[state][week]);
      }
      mean = calculateMean(values);
      stdev = calculateStdev(values, mean);
      NonInfluenzaData[state] = [mean, stdev];
    }
  }
  return NonInfluenzaData;
};

calculateColor = function(NonInfluenzaData, epidata, ep) {
  var aa, ab, ac, ad, ae, af, colorData, ili, len10, len11, len12, len13, len7, len8, len9, level, levelData, mappedData, mean, pop_total, ref14, ref15, ref16, region, row, state, stdev, t;
  mappedData = {};
  levelData = {};
  colorData = {};
  for (t = 0, len7 = epidata.length; t < len7; t++) {
    row = epidata[t];
    if (row.epiweek = ep) {
      mappedData[row.location] = row.value;
    }
  }
  for (aa = 0, len8 = STATES.length; aa < len8; aa++) {
    state = STATES[aa];
    ref14 = NonInfluenzaData[state], mean = ref14[0], stdev = ref14[1];
    ili = mappedData[state];
    level = activity_level(ili, mean, stdev);
    colorData[state] = level2Color(level);
    levelData[state] = level;
  }
  for (ab = 0, len9 = REGIONS.length; ab < len9; ab++) {
    region = REGIONS[ab];
    pop_total = 0;
    ref15 = REGION2STATE[region];
    for (ac = 0, len10 = ref15.length; ac < len10; ac++) {
      state = ref15[ac];
      pop_total += POPULATION[state];
    }
    level = 0;
    ref16 = REGION2STATE[region];
    for (ad = 0, len11 = ref16.length; ad < len11; ad++) {
      state = ref16[ad];
      level += (POPULATION[state] / pop_total) * levelData[state];
    }
    colorData[region] = level2Color(level);
    levelData[region] = level;
  }
  pop_total = 0;
  for (ae = 0, len12 = STATES.length; ae < len12; ae++) {
    state = STATES[ae];
    pop_total += POPULATION[state];
  }
  level = 0;
  for (af = 0, len13 = STATES.length; af < len13; af++) {
    state = STATES[af];
    level += (POPULATION[state] / pop_total) * levelData[state];
  }
  colorData['nat'] = level2Color(level);
  levelData['nat'] = level;
  return colorData;
};

activity_level = function(ili, mean, stdev) {
  var l;
  l = (ili - mean) / stdev;
  if (l < 1.1) {
    return 1;
  }
  if (l < 2.5) {
    return 2;
  }
  if (l < 4.0) {
    return 3;
  }
  if (l < 4.9) {
    return 4;
  }
  if (l < 6.0) {
    return 5;
  }
  if (l < 7.6) {
    return 6;
  }
  if (l < 8.0) {
    return 7;
  }
  if (l < 9.5) {
    return 8;
  }
  if (l < 12) {
    return 9;
  }
  return 10;
};

level2Color = function(level) {
  return Math.max(0, Math.min(10, level)) / 10;
};

Date.prototype.getWeek = function() {
  var rst, stdDate;
  stdDate = new Date(2016, 0, 3);
  rst = Math.ceil((((this - stdDate) / 86400000) + stdDate.getDay() + 1) / 7) % 52;
  if (rst === 0) {
    return 52;
  }
  return rst;
};

date2String = function(date) {
  return MONTHS[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
};

epiweek2date = function(epiweek) {
  var increment, stdDate, wk, yr;
  stdDate = new Date(2016, 0, 3);
  wk = epiweek % 100;
  yr = Math.floor(epiweek / 100);
  increment = ((yr - 2016) * 52 + wk - 1) * 7;
  stdDate.setDate(stdDate.getDate() + increment);
  return stdDate;
};

epiweekOffByTen = function(epiweek) {
  var _, nextWeek, previousWeek, ref14, ref15, ref16, t;
  ref14 = [epiweek, epiweek], previousWeek = ref14[0], nextWeek = ref14[1];
  for (i = t = 0; t < 10; i = ++t) {
    ref15 = epiweekOffByOne(previousWeek), previousWeek = ref15[0], _ = ref15[1];
    ref16 = epiweekOffByOne(nextWeek), _ = ref16[0], nextWeek = ref16[1];
  }
  return [previousWeek, nextWeek];
};

epiweekOffByOne = function(epiweek) {
  var nextWeek, previousWeek, wk, yr;
  wk = epiweek % 100;
  yr = Math.floor(epiweek / 100);
  previousWeek = epiweek - 1;
  nextWeek = epiweek + 1;
  if (wk === 1) {
    previousWeek = (yr - 1) * 100 + 52;
  }
  if (wk === 52) {
    nextWeek = (yr + 1) * 100 + 1;
  }
  return [previousWeek, nextWeek];
};

getFakeRow = function(location, i) {
  return {
    'location': location,
    'epiweek': 201201 + 100 * Math.floor(i / 52) + i % 52,
    'value': 1 + Math.random() * 3,
    'std': 0.5 + Math.random() * 1,
    'wili': 1 + Math.random() * 3
  };
};

normalizeCase = function(loc) {
  if (loc.length === 2) {
    return loc.toUpperCase();
  } else {
    return loc.toLowerCase();
  }
};

getEpidataHander = function(callback) {
  return function(result, message, epidata) {
    var len7, msg, row, t;
    if (result === 1) {
      for (t = 0, len7 = epidata.length; t < len7; t++) {
        row = epidata[t];
        if (row.location != null) {
          row.location = normalizeCase(row.location);
        }
        if (row.region != null) {
          row.region = normalizeCase(row.region);
        }
      }
      return callback(epidata);
    } else {
      msg = "The Epidata API says '" + message + "'. (error #" + result + ")";
      console.log(msg);
      return alert(msg);
    }
  };
};

Epidata_fluview_single = function(handler, location, epiweeks) {
  var callback, delay, fakeData;
  if ((typeof Epidata !== "undefined" && Epidata !== null ? Epidata.fluview : void 0) != null) {
    return Epidata.fluview(handler, location, epiweeks);
  } else {
    fakeData = (function() {
      var results, t;
      results = [];
      for (i = t = 0; t < 280; i = ++t) {
        results.push(getFakeRow(location, i));
      }
      return results;
    })();
    callback = function() {
      return handler(1, 'debug', fakeData);
    };
    delay = 250 + Math.round(Math.random() * 500);
    return window.setTimeout(callback, delay);
  }
};

Epidata_nowcast_single = function(handler, location) {
  var callback, delay, fakeData;
  if ((typeof Epidata !== "undefined" && Epidata !== null ? Epidata.nowcast : void 0) != null) {
    return Epidata.nowcast(handler, location, '201130-202030');
  } else {
    fakeData = (function() {
      var results, t;
      results = [];
      for (i = t = 0; t < 280; i = ++t) {
        results.push(getFakeRow(location, i));
      }
      return results;
    })();
    callback = function() {
      return handler(1, 'debug', fakeData);
    };
    delay = 250 + Math.round(Math.random() * 500);
    return window.setTimeout(callback, delay);
  }
};

Epidata_nowcast_multi = function(handler, locations, epiweek1, epiweek2) {
  var aa, callback, delay, fakeData, len7, location, t;
  if ((typeof Epidata !== "undefined" && Epidata !== null ? Epidata.nowcast : void 0) != null) {
    return Epidata.nowcast(handler, locations, Epidata.range(epiweek1, epiweek2));
  } else {
    fakeData = [];
    for (t = 0, len7 = locations.length; t < len7; t++) {
      location = locations[t];
      for (i = aa = 0; aa < 280; i = ++aa) {
        fakeData.push(getFakeRow(location, i));
      }
    }
    callback = function() {
      return handler(1, 'debug', fakeData);
    };
    delay = 250 + Math.round(Math.random() * 500);
    return window.setTimeout(callback, delay);
  }
};

PointerInput = (function() {
  var THRESHOLD;

  THRESHOLD = 5;

  function PointerInput(elem, listener) {
    this.elem = elem;
    this.listener = listener;
    this.elem.on('mousedown touchstart', (function(_this) {
      return function(e) {
        return _this.onDown(e);
      };
    })(this));
    this.elem.on('mouseup touchend', (function(_this) {
      return function(e) {
        return _this.onUp(e);
      };
    })(this));
    this.elem.on('mousemove touchmove', (function(_this) {
      return function(e) {
        return _this.onMove(e);
      };
    })(this));
    this.elem.on('mouseleave touchleave', (function(_this) {
      return function(e) {
        return _this.onLeave(e);
      };
    })(this));
    this.elem.on('wheel', (function(_this) {
      return function(e) {
        return _this.onWheel(e);
      };
    })(this));
  }

  PointerInput.prototype._get_xyt = function(e) {
    var offset, ref14, touch;
    if (((ref14 = e.touches) != null ? ref14.length : void 0) > 0) {
      touch = e.touches.item(0);
      offset = this.elem.offset();
      return [touch.pageX - offset.left, touch.pageY - offset.top, +new Date()];
    } else {
      return [e.offsetX, e.offsetY, +new Date()];
    }
  };

  PointerInput.prototype.onDown = function(e) {
    return this.last = this.down = this._get_xyt(e);
  };

  PointerInput.prototype.onUp = function(e) {
    var ref14, ref15, t1, t2;
    if (this.down == null) {
      return;
    }
    ref14 = this.down, x1 = ref14[0], y1 = ref14[1], t1 = ref14[2];
    ref15 = this._get_xyt(e), x2 = ref15[0], y2 = ref15[1], t2 = ref15[2];
    this.down = null;
    if (Math.pow(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2), 0.5) < THRESHOLD) {
      return this.listener.onClick((x1 + x2) / 2, (y1 + y2) / 2);
    }
  };

  PointerInput.prototype.onMove = function(e) {
    var ref14, ref15, t1, t2;
    if (this.down == null) {
      return;
    }
    e.preventDefault();
    this.curr = this._get_xyt(e);
    ref14 = this.last, x1 = ref14[0], y1 = ref14[1], t1 = ref14[2];
    ref15 = this.curr, x2 = ref15[0], y2 = ref15[1], t2 = ref15[2];
    this.last = this.curr;
    return this.listener.onDrag(x2, y2, x2 - x1, y2 - y1);
  };

  PointerInput.prototype.onLeave = function(e) {
    return this.down = null;
  };

  PointerInput.prototype.onWheel = function(e) {
    return this.listener.onScroll(e.originalEvent.deltaY);
  };

  return PointerInput;

})();

window.App = App = (function() {
  var PAGE_CHART, PAGE_MAP;

  PAGE_MAP = 0;

  PAGE_CHART = 1;

  function App() {
    var clicker, isPinching, pinchZoom, pinchend, pinchstart, ref14, xe2, xe3, xs0, xs1, ye2, ye3, ys0, ys1;
    clicker = (function(_this) {
      return function(name, locations) {
        return function() {
          $('.button_group0 i').removeClass('fa-dot-circle-o');
          $('.button_group0 i').addClass('fa-circle-o');
          $("#button_view_" + name + " i").removeClass('fa-circle-o');
          $("#button_view_" + name + " i").addClass('fa-dot-circle-o');
          return _this.setLocations(locations);
        };
      };
    })(this);
    ref14 = [-1, -1, -1, -1, -1, -1, -1, -1], xs0 = ref14[0], xs1 = ref14[1], xe2 = ref14[2], xe3 = ref14[3], ys0 = ref14[4], ys1 = ref14[5], ye2 = ref14[6], ye3 = ref14[7];
    isPinching = false;
    pinchZoom = (function(_this) {
      return function() {
        var d1, d2;
        d1 = Math.pow(Math.pow(xs0 - xs1, 2) + Math.pow(ys0 - ys1, 2), 0.5);
        d2 = Math.pow(Math.pow(xe2 - xe3, 2) + Math.pow(ye2 - ye3, 2), 0.5);
        if (d1 > d2) {
          return _this.zoomOut();
        } else {
          return _this.zoomIn();
        }
      };
    })(this);
    pinchend = (function(_this) {
      return function(e) {
        if (isPinching) {
          if (e.originalEvent.changedTouches.length === 2) {
            xe2 = e.originalEvent.changedTouches[0].pageX;
            xe3 = e.originalEvent.changedTouches[1].pageX;
            ye2 = e.originalEvent.changedTouches[0].pageY;
            ye3 = e.originalEvent.changedTouches[1].pageY;
            isPinching = false;
            pinchZoom();
          }
          if (e.originalEvent.changedTouches.length === 1) {
            if (xe2 < 0) {
              xe2 = e.originalEvent.changedTouches[0].pageX;
              return ye2 = e.originalEvent.changedTouches[0].pageY;
            } else {
              xe3 = e.originalEvent.changedTouches[0].pageX;
              ye3 = e.originalEvent.changedTouches[0].pageY;
              isPinching = false;
              return pinchZoom();
            }
          }
        }
      };
    })(this);
    pinchstart = (function(_this) {
      return function(e) {
        var ref15;
        if (e.originalEvent.targetTouches.length === 2) {
          isPinching = true;
          ref15 = [-1, -1, -1, -1, -1, -1, -1, -1], xs0 = ref15[0], xs1 = ref15[1], xe2 = ref15[2], xe3 = ref15[3], ys0 = ref15[4], ys1 = ref15[5], ye2 = ref15[6], ye3 = ref15[7];
          xs0 = e.originalEvent.targetTouches[0].pageX;
          xs1 = e.originalEvent.targetTouches[1].pageX;
          ys0 = e.originalEvent.targetTouches[0].pageY;
          return ys1 = e.originalEvent.targetTouches[1].pageY;
        }
      };
    })(this);
    $('#button_view_nat').click(clicker('nat', NATIONAL));
    $('#button_view_hhs').click(clicker('hhs', HHS_REGIONS));
    $('#button_view_cen').click(clicker('cen', CENSUS_REGIONS));
    $('#button_view_sta').click(clicker('sta', STATES));
    $('#button_zoom_in').click((function(_this) {
      return function() {
        return _this.zoomIn();
      };
    })(this));
    $('#button_zoom_out').click((function(_this) {
      return function() {
        return _this.zoomOut();
      };
    })(this));
    this.dataTimeline = $("#dataTimeline");
    this.canvasMap = $('#canvas_map');
    this.canvasMap.mousemove((function(_this) {
      return function(e) {
        var ctx, current, idx, ili, loc, std;
        loc = _this.hitTest(e.offsetX, e.offsetY);
        if (loc != null) {
          $('#canvas_map').css('cursor', 'pointer');
          _this.renderMap();
          ctx = _this.canvasMap[0].getContext('2d');
          ctx.font = 12 + 'px sans-serif';
          ctx.fillStyle = '#eee';
          current = _this.mapData[loc];
          ili = '' + (Math.round(current.value * 100) / 100);
          if (indexOf.call(ili, '.') >= 0) {
            ili += '00';
            idx = ili.indexOf('.');
            ili = ili.slice(0, idx + 3);
          } else {
            ili += '.00';
          }
          std = '' + (Math.round(current.std * 100) / 100);
          if (indexOf.call(std, '.') >= 0) {
            std += '00';
            idx = std.indexOf('.');
            std = std.slice(0, idx + 3);
          } else {
            std += '.00';
          }
          ili = '(' + ili + '±' + std + ')%';
          return ctx.fillText(loc + " " + ili + "", e.offsetX, e.offsetY);
        } else {
          $('#canvas_map').css('cursor', 'auto');
          return _this.renderMap();
        }
      };
    })(this));
    this.canvasMap.on('touchstart', pinchstart);
    this.canvasMap.on('touchend', pinchend);
    this.canvasChart = $('#canvas_chart');
    $(window).resize((function(_this) {
      return function() {
        return _this.resizeCanvas();
      };
    })(this));
    this.pointerInput = new PointerInput(this.canvasMap, this);
    this.canvasMap.focus();
    this.currentPage = PAGE_MAP;
    this.nonInfluenzaWeekSeason = NON_INFLUENZA_WEEK_SEASON;
    this.setLocations(STATES);
    this.resetView();
    this.resizeCanvas();
    this.loadEpidata();
    this.currentDetailedLoc = null;
    this.keyPressLock = 0;
    $(document).keydown((function(_this) {
      return function(e) {
        var _, ref15, ref16, ref17, ref18, wk;
        if (_this.keyPressLock === 0) {
          if (e.keyCode === 37) {
            _this.keyPressLock = 1;
            ref15 = epiweekOffByOne(_this.currentEpweek), _this.currentEpweek = ref15[0], _ = ref15[1];
            wk = _this.currentEpweek % 100;
            if (wk === 39) {
              _this.nonInfluenzaWeekSeason = _this.nonInfluenzaWeekSeason - 1;
            }
            _this.loadEpidata(_this.currentEpweek);
            if (_this.currentDetailedLoc != null) {
              _this.fetchNowcast(_this.currentDetailedLoc, _this.currentEpweek);
            }
          }
          if (e.keyCode === 38) {
            if (_this.currentEpweek < _this.maxEpiweek) {
              _this.keyPressLock = 1;
              ref16 = epiweekOffByTen(_this.currentEpweek), _ = ref16[0], _this.currentEpweek = ref16[1];
              _this.currentEpweek = Math.min(_this.currentEpweek, _this.maxEpiweek);
              wk = _this.currentEpweek % 100;
              if ((50 > wk && wk >= 40)) {
                _this.nonInfluenzaWeekSeason = _this.nonInfluenzaWeekSeason + 1;
              }
              _this.loadEpidata(_this.currentEpweek);
              if (_this.currentDetailedLoc != null) {
                _this.fetchNowcast(_this.currentDetailedLoc, _this.currentEpweek);
              }
            } else {
              wk = _this.maxEpiweek % 100;
              alert("Week" + wk + " is the lastest data we had! Please check back next week!");
            }
          }
          if (e.keyCode === 39) {
            if (_this.currentEpweek < _this.maxEpiweek) {
              _this.keyPressLock = 1;
              ref17 = epiweekOffByOne(_this.currentEpweek), _ = ref17[0], _this.currentEpweek = ref17[1];
              wk = _this.currentEpweek % 100;
              if (wk === 40) {
                _this.nonInfluenzaWeekSeason = _this.nonInfluenzaWeekSeason + 1;
              }
              _this.loadEpidata(_this.currentEpweek);
              if (_this.currentDetailedLoc != null) {
                _this.fetchNowcast(_this.currentDetailedLoc, _this.currentEpweek);
              }
            } else {
              wk = _this.maxEpiweek % 100;
              alert("Week" + wk + " is the lastest data we had! Please check back next week!");
            }
          }
          if (e.keyCode === 40) {
            _this.keyPressLock = 1;
            ref18 = epiweekOffByTen(_this.currentEpweek), _this.currentEpweek = ref18[0], _ = ref18[1];
            wk = _this.currentEpweek % 100;
            if ((40 > wk && wk > 29)) {
              _this.nonInfluenzaWeekSeason = _this.nonInfluenzaWeekSeason - 1;
            }
            _this.loadEpidata(_this.currentEpweek);
            if (_this.currentDetailedLoc != null) {
              return _this.fetchNowcast(_this.currentDetailedLoc, _this.currentEpweek);
            }
          }
        }
      };
    })(this));
    window.onpopstate = (function(_this) {
      return function(e) {
        return _this.backToHome();
      };
    })(this);
    $('#back_arrow').click(function(e) {
      return window.history.back();
    });
  }

  App.prototype.loadEpidata = function(epweek) {
    var _, callback, callback1, date, datestr, epiweek1, epiweek2, handler, ref14;
    if (epweek == null) {
      epweek = null;
    }
    if (epweek != null) {
      epiweek2 = epweek;
      ref14 = epiweekOffByOne(epiweek2), epiweek1 = ref14[0], _ = ref14[1];
      date = epiweek2date(epiweek2);
      datestr = "(" + date2String(date);
      date.setDate(date.getDate() + 6);
      datestr = datestr + "-" + date2String(date) + ")";
      this.dataTimeline.html("");
      this.currentEpweek = epiweek2;
      callback1 = (function(_this) {
        return function(epidata) {
          var NonInfluenzaData, callback2, handler;
          NonInfluenzaData = calculateNonInfluenzaData(epidata, _this.nonInfluenzaWeekSeason);
          callback2 = function(epidata) {
            var c, colorData, ili, len7, row, t, v;
            _this.colors = {};
            _this.mapData = {};
            colorData = calculateColor(NonInfluenzaData, epidata, epiweek2);
            for (t = 0, len7 = epidata.length; t < len7; t++) {
              row = epidata[t];
              if (row.epiweek === epiweek2) {
                ili = row.value;
                v = colorData[row.location];
                c = ('0' + Math.round(0x3f + v * 0xc0).toString(16)).slice(-2);
                _this.colors[row.location] = '#' + c + '4040';
                _this.mapData[row.location] = row;
              }
            }
            _this.renderMap();
            _this.dataTimeline.html("Nowcasting epi-week " + epiweek2 % 100 + " " + datestr);
            if (_this.keyPressLock === 1) {
              return _this.keyPressLock = 0;
            }
          };
          handler = getEpidataHander(callback2);
          return Epidata_nowcast_multi(handler, LOCATIONS, epiweek1, epiweek2);
        };
      })(this);
      handler = getEpidataHander(callback1);
      return Epidata_nowcast_multi(handler, STATES, this.nonInfluenzaWeekSeason * 100 + 40, (this.nonInfluenzaWeekSeason + 1) * 100 + 39);
    } else {
      callback = (function(_this) {
        return function(epidata) {
          epiweek1 = epidata[epidata.length - 4].epiweek;
          epiweek2 = epidata[epidata.length - 1].epiweek;
          _this.maxEpiweek = epiweek2;
          date = epiweek2date(epiweek2);
          datestr = "(" + date2String(date);
          date.setDate(date.getDate() + 6);
          datestr = datestr + "-" + date2String(date) + ")";
          _this.dataTimeline.html("Nowcasting epi-week " + epiweek2 % 100 + " " + datestr);
          _this.currentEpweek = epiweek2;
          callback1 = function(epidata) {
            var NonInfluenzaData, callback2;
            NonInfluenzaData = calculateNonInfluenzaData(epidata, _this.nonInfluenzaWeekSeason);
            callback2 = function(epidata) {
              var c, colorData, ili, len7, row, t, v;
              _this.colors = {};
              _this.mapData = {};
              colorData = calculateColor(NonInfluenzaData, epidata, epiweek2);
              for (t = 0, len7 = epidata.length; t < len7; t++) {
                row = epidata[t];
                if (row.epiweek === epiweek2) {
                  ili = row.value;
                  v = colorData[row.location];
                  c = ('0' + Math.round(0x3f + v * 0xc0).toString(16)).slice(-2);
                  _this.colors[row.location] = '#' + c + '4040';
                  _this.mapData[row.location] = row;
                }
              }
              return _this.renderMap();
            };
            handler = getEpidataHander(callback2);
            return Epidata_nowcast_multi(handler, LOCATIONS, epiweek1, epiweek2);
          };
          handler = getEpidataHander(callback1);
          return Epidata_nowcast_multi(handler, STATES, _this.nonInfluenzaWeekSeason * 100 + 40, (_this.nonInfluenzaWeekSeason + 1) * 100 + 39);
        };
      })(this);
      handler = getEpidataHander(callback);
      return Epidata_nowcast_single(handler, 'nat');
    }
  };

  App.prototype.backToHome = function() {
    this.currentPage = PAGE_MAP;
    return $('.pages').animate({
      left: '0%'
    }, 125);
  };

  App.prototype.showLocationDetails = function(loc) {
    var ref14, ref15, ref16;
    this.currentPage = PAGE_CHART;
    history.pushState({}, '');
    $('#location_name').html(NAMES[loc]);
    $('.achievement_holder').hide();
    $('.achievement_holder_top').hide();
    $('.ili_note').hide();
    if (ref14 = loc.toUpperCase(), indexOf.call(STATES, ref14) >= 0) {
      $('#state_note').show();
      $('#state_note_left').show();
      $('#location_google1').show();
      $('#location_twitter1').show();
      $('#location_wiki0').show();
      $('#location_cdc1').show();
      $('#location_epicast0').show();
      $('#location_arch0').show();
      $('#location_sar30').show();
      if (ref15 = loc.toUpperCase(), indexOf.call(ILI_AVAILABLE, ref15) >= 0) {
        $('#location_star1').show();
      } else {
        $('#location_star0').show();
      }
      if (ref16 = loc.toUpperCase(), indexOf.call(ILI_SHARED, ref16) >= 0) {
        $('#location_heart1').show();
      } else {
        $('#location_heart0').show();
      }
    }
    if (indexOf.call(HHS_REGIONS, loc) >= 0) {
      $('#hhs_note').show();
      $('#hhs_note_left').show();
      $('#location_google0').show();
      $('#location_twitter1').show();
      $('#location_wiki0').show();
      $('#location_cdc1').show();
      $('#location_epicast1').show();
      $('#location_arch1').show();
      $('#location_sar31').show();
    }
    if (indexOf.call(CENSUS_REGIONS, loc) >= 0) {
      $('#location_google0').show();
      $('#location_twitter1').show();
      $('#location_wiki0').show();
      $('#location_cdc1').show();
      $('#location_epicast0').show();
      $('#location_arch1').show();
      $('#location_sar31').show();
    }
    if (loc === 'nat') {
      $('#location_google1').show();
      $('#location_twitter1').show();
      $('#location_wiki1').show();
      $('#location_cdc1').show();
      $('#location_epicast1').show();
      $('#location_arch1').show();
      $('#location_sar31').show();
    }
    $('.location_right').css('display', 'none');
    $('#loading_icon').css('display', 'flex');
    $('.pages').animate({
      left: '-100%'
    }, 125);
    this.currentDetailedLoc = loc;
    return this.fetchNowcast(loc, this.currentEpweek);
  };

  App.prototype.setLocations = function(locations1) {
    this.locations = locations1;
    this.renderMapList();
    return this.renderMap();
  };

  App.prototype.resizeCanvas = function() {
    this.canvasMap.attr('width', this.canvasMap.width() + 'px');
    this.canvasMap.attr('height', this.canvasMap.height() + 'px');
    this.canvasChart.attr('width', this.canvasChart.width() + 'px');
    this.canvasChart.attr('height', this.canvasChart.height() + 'px');
    this.renderMap();
    return this.renderChart();
  };

  App.prototype.resetView = function() {
    this.dlat = 35;
    this.dlon = -108.8;
    this.zoom = 2.5;
    return this.renderMap();
  };

  App.prototype.onClick = function(x, y) {
    var loc;
    loc = this.hitTest(x, y);
    if (loc != null) {
      return this.showLocationDetails(loc);
    }
  };

  App.prototype.onDrag = function(x, y, dx, dy) {
    this.dlon -= dx / (4 * this.zoom);
    this.dlat += dy / (4 * this.zoom);
    this.dlat = Math.max(Math.min(this.dlat, LAT_MAX), LAT_MIN);
    this.dlon = Math.max(Math.min(this.dlon, LON_MAX), LON_MIN);
    return this.renderMap();
  };

  App.prototype.onScroll = function(delta) {
    var factor;
    factor = 1 + Math.abs(delta) / 500;
    if (delta < 0) {
      return this.zoomIn(factor);
    } else {
      return this.zoomOut(factor);
    }
  };

  App.prototype.zoomIn = function(factor) {
    if (factor == null) {
      factor = 1.5;
    }
    this.zoom = Math.min(this.zoom * factor, 500);
    return this.renderMap();
  };

  App.prototype.zoomOut = function(factor) {
    if (factor == null) {
      factor = 1.5;
    }
    this.zoom = Math.max(this.zoom / factor, 1.25);
    return this.renderMap();
  };

  App.prototype.renderMapList = function() {
    var aa, len7, len8, loc, ref14, ref15, results, saveThis, t;
    $('#map_list ul').empty();
    saveThis = this;
    ref14 = this.locations;
    for (t = 0, len7 = ref14.length; t < len7; t++) {
      loc = ref14[t];
      $('#map_list ul').append($('<li>').attr('class', 'map_list_element').attr('id', 'map_list_element_' + loc).append($('<a>').attr('id', 'map_list_element_text_' + loc).append(NAMES[loc])));
    }
    ref15 = this.locations;
    results = [];
    for (aa = 0, len8 = ref15.length; aa < len8; aa++) {
      loc = ref15[aa];
      $('#map_list_element_' + loc).click(function() {
        return saveThis.showLocationDetails(loc);
      });
      results.push($('#map_list_element_' + loc).hover((function(ev) {
        var current, idx, ili, std;
        loc = this.id.substring(17);
        current = saveThis.mapData[loc];
        ili = '' + (Math.round(current.value * 100) / 100);
        if (indexOf.call(ili, '.') >= 0) {
          ili += '00';
          idx = ili.indexOf('.');
          ili = ili.slice(0, idx + 3);
        } else {
          ili += '.00';
        }
        std = '' + (Math.round(current.std * 100) / 100);
        if (indexOf.call(std, '.') >= 0) {
          std += '00';
          idx = std.indexOf('.');
          std = std.slice(0, idx + 3);
        } else {
          std += '.00';
        }
        ili = '(' + ili + '±' + std + ')%';
        $('#map_list_element_text_' + loc).text(ili);
        return saveThis.renderMap(loc);
      }), (function(ev) {
        loc = this.id.substring(17);
        $('#map_list_element_text_' + loc).text(NAMES[loc]);
        return saveThis.renderMap();
      })));
    }
    return results;
  };

  App.prototype.renderMap = function(highlight) {
    var aa, ab, ac, ad, ae, af, ag, ah, ai, aj, ak, areas_box, c, cX, cY, ctx, h, idx, len10, len11, len12, len13, len14, len15, len16, len17, len7, len8, len9, lh, line, ln, loc, lw, ref14, ref15, ref16, ref17, ref18, ref19, ref20, ref21, ref22, ref23, ref24, ref25, ref26, ref27, ref28, ref29, ref30, ref31, ref32, ref33, t, v, w, wx, x0, x_offset, y0;
    if (highlight == null) {
      highlight = null;
    }
    ref14 = [this.canvasMap.width(), this.canvasMap.height()], w = ref14[0], h = ref14[1];
    ctx = this.canvasMap[0].getContext('2d');
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    line = {
      0: function(x, y) {
        return ctx.moveTo(x, y);
      },
      1: function(x, y) {
        return ctx.lineTo(x, y);
      }
    };
    this.ecef2ortho = get_ecef2ortho(this.dlat, this.dlon, this.zoom, w, h);
    ref15 = this.locations;
    for (t = 0, len7 = ref15.length; t < len7; t++) {
      loc = ref15[t];
      if (loc !== highlight) {
        ref16 = geodata.locations[loc].paths;
        for (aa = 0, len8 = ref16.length; aa < len8; aa++) {
          poly = ref16[aa];
          ctx.beginPath();
          ln = 0;
          for (ab = 0, len9 = poly.length; ab < len9; ab++) {
            idx = poly[ab];
            line[ln].apply(line, this.ecef2ortho.apply(this, geodata.points[idx]));
            ln |= 1;
          }
          ctx.closePath();
          ctx.fillStyle = (ref17 = (ref18 = this.colors) != null ? ref18[loc] : void 0) != null ? ref17 : '#ccc';
          ctx.fill();
          ctx.stroke();
        }
      }
    }
    if (highlight != null) {
      ctx.font = 12 + 'px sans-serif';
      ctx.strokeStyle = '#eee';
      if (highlight in REGION2STATE) {
        ctx.lineWidth = 0.5;
        ref19 = REGION2STATE[highlight];
        for (ac = 0, len10 = ref19.length; ac < len10; ac++) {
          loc = ref19[ac];
          ref20 = geodata.locations[loc].paths;
          for (ad = 0, len11 = ref20.length; ad < len11; ad++) {
            poly = ref20[ad];
            ctx.beginPath();
            ln = 0;
            for (ae = 0, len12 = poly.length; ae < len12; ae++) {
              idx = poly[ae];
              line[ln].apply(line, this.ecef2ortho.apply(this, geodata.points[idx]));
              ln |= 1;
            }
            ctx.closePath();
            ctx.fillStyle = (ref21 = (ref22 = this.colors) != null ? ref22[loc] : void 0) != null ? ref21 : '#ccc';
            ctx.fill();
            ctx.stroke();
          }
        }
        ctx.lineWidth = 1.5;
        ref23 = geodata.locations[highlight].paths;
        for (af = 0, len13 = ref23.length; af < len13; af++) {
          poly = ref23[af];
          ctx.beginPath();
          ln = 0;
          for (ag = 0, len14 = poly.length; ag < len14; ag++) {
            idx = poly[ag];
            line[ln].apply(line, this.ecef2ortho.apply(this, geodata.points[idx]));
            ln |= 1;
          }
          ctx.closePath();
          ctx.stroke();
        }
        ref24 = REGION2STATE[highlight];
        for (ah = 0, len15 = ref24.length; ah < len15; ah++) {
          loc = ref24[ah];
          ctx.fillStyle = '#eee';
          ref25 = this.locCenterOnMap(loc), cX = ref25[0], cY = ref25[1];
          ctx.fillText(loc, cX, cY);
        }
      } else {
        ctx.lineWidth = 1.5;
        ref26 = geodata.locations[highlight].paths;
        for (ai = 0, len16 = ref26.length; ai < len16; ai++) {
          poly = ref26[ai];
          ctx.beginPath();
          ln = 0;
          for (aj = 0, len17 = poly.length; aj < len17; aj++) {
            idx = poly[aj];
            line[ln].apply(line, this.ecef2ortho.apply(this, geodata.points[idx]));
            ln |= 1;
          }
          ctx.closePath();
          ctx.fillStyle = (ref27 = (ref28 = this.colors) != null ? ref28[loc] : void 0) != null ? ref27 : '#ccc';
          ctx.fill();
          ctx.stroke();
        }
        ctx.fillStyle = '#eee';
        ref29 = this.locCenterOnMap(highlight), cX = ref29[0], cY = ref29[1];
        ctx.fillText(highlight, cX, cY);
      }
    }
    if (highlight !== 'AK') {
      ref30 = this.locCenterOnMap('AK'), cX = ref30[0], cY = ref30[1];
      ctx.font = 12 + 'px sans-serif';
      ctx.fillStyle = '#eee';
      ctx.fillText('AK', cX, cY);
    }
    if (highlight !== 'HI') {
      ref31 = this.locCenterOnMap('HI'), cX = ref31[0], cY = ref31[1];
      ctx.font = 12 + 'px sans-serif';
      ctx.fillStyle = '#eee';
      ctx.fillText('HI', cX, cY);
    }
    if (this.locations === STATES) {
      ctx.font = 12 * Math.max(0.7, w / 1000) + 'px sans-serif';
      ctx.fillStyle = '#eee';
      wx = w / 3;
      if (w < 600) {
        wx = w / 5;
      }
      ctx.fillText('NOTE 1: %ILI is not meaningfully comparable between states,', wx, h - 24 - 24 * Math.max(0.7, w / 1000));
      ctx.fillText('               due to differences in reporter types.', wx, h - 24 - 12 * Math.max(0.7, w / 1000));
      ctx.fillText('NOTE 2: Color intensity is similar to, but not the same as, CDC’s Flu Activity Level.', wx, h - 24);
    }
    x_offset = 32;
    areas_box = $('#map_list');
    if (areas_box.css('visibility') !== 'hidden') {
      x_offset += areas_box.position().left + areas_box.width();
    }
    ref32 = [w / 25, h / 2], lw = ref32[0], lh = ref32[1];
    ref33 = [x_offset, h / 10, x_offset + lw, h / 10 + lh], x0 = ref33[0], y0 = ref33[1], x1 = ref33[2], y1 = ref33[3];
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 0.5;
    for (i = ak = 1; ak <= 10; i = ++ak) {
      ctx.beginPath();
      ctx.moveTo(x0, y0 + (i - 1) * (lh / 10));
      ctx.lineTo(x0, y0 + i * (lh / 10));
      ctx.lineTo(x1, y0 + i * (lh / 10));
      ctx.lineTo(x1, y0 + (i - 1) * (lh / 10));
      ctx.lineTo(x0, y0 + (i - 1) * (lh / 10));
      ctx.closePath();
      v = level2Color(11 - i);
      c = ('0' + Math.round(0x3f + v * 0xc0).toString(16)).slice(-2);
      ctx.fillStyle = '#' + c + '4040';
      ctx.fill();
      ctx.stroke();
    }
    ctx.fillStyle = '#eee';
    ctx.font = 12 + 'px sans-serif';
    ctx.fillText('Highest', x0 + lw / 4, y0 - Math.min(10, lh / 10));
    ctx.fillText('Lowest', x0 + lw / 4, y1 + Math.min(16, lh / 10));
    return 0;
  };

  App.prototype.renderChart = function() {
    var aa, ab, ac, ad, bounds, ctx, current, downY, h, i2x, iVals, ili, ili2y, iliVals, ilibase, len7, len8, line, loc, maxILI, numWeeks, padding, prefix, ref14, ref15, ref16, ref17, ref18, ref19, ref20, row, t, trace, upY, w, wk, write, x, y, yr;
    if (this.chartData == null) {
      return;
    }
    ref14 = [this.canvasChart.width(), this.canvasChart.height()], w = ref14[0], h = ref14[1];
    ctx = this.canvasChart[0].getContext('2d');
    ctx.fillStyle = '#ddd';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#000';
    ctx.strokeStyle = '#000';
    ctx.setLineDash([1, 0]);
    ctx.lineWidth = 0.005 * (w + h) / 2;
    line = {
      0: function(x, y) {
        return ctx.moveTo(x, y);
      },
      1: function(x, y) {
        return ctx.lineTo(x, y);
      }
    };
    padding = {
      left: 64,
      right: 20,
      top: 36,
      bottom: 64
    };
    bounds = {
      width: w - padding.left - padding.right,
      height: h - padding.top - padding.bottom
    };
    numWeeks = this.chartData.length;
    ref15 = this.chartData;
    for (t = 0, len7 = ref15.length; t < len7; t++) {
      row = ref15[t];
      maxILI = Math.max(maxILI != null ? maxILI : row.value, row.value);
    }
    maxILI = Math.round(maxILI + 1);
    i2x = function(i) {
      return padding.left + bounds.width * i / (numWeeks - 1);
    };
    ili2y = function(ili) {
      return padding.top + bounds.height * (1 - ili / maxILI);
    };
    trace = function(xx, yy) {
      var _i, aa, ln, ref16;
      ln = 0;
      ctx.beginPath();
      for (_i = aa = 0, ref16 = xx.length; 0 <= ref16 ? aa < ref16 : aa > ref16; _i = 0 <= ref16 ? ++aa : --aa) {
        line[ln](xx[_i], yy[_i]);
        ln |= 1;
      }
      return ctx.stroke();
    };
    write = function(txt, x, y, angle) {
      var ht, wt;
      ht = ctx.measureText('W').width;
      wt = ctx.measureText(txt).width;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle * Math.PI * 2);
      ctx.translate(-wt / 2, +ht / 2);
      ctx.fillText(txt, 0, 0);
      return ctx.restore();
    };
    trace([0, numWeeks - 1].map(i2x), [0, 0].map(ili2y));
    trace([0, 0].map(i2x), [0, maxILI].map(ili2y));
    ctx.font = '16px sans-serif';
    write('Time (weeks)', w / 2, h - padding.bottom / 3, 0);
    prefix = this.chartData[0].location.length > 2 ? 'Weighted ' : '';
    write(prefix + '%ILI', padding.left / 3, h / 2, -0.25);
    ctx.font = '12px sans-serif';
    for (ili = aa = 0, ref16 = maxILI; 0 <= ref16 ? aa <= ref16 : aa >= ref16; ili = 0 <= ref16 ? ++aa : --aa) {
      y = ili2y(ili);
      trace([padding.left - 6, padding.left], [y, y]);
      if (bounds.height / maxILI >= 32 || ili % 2 === 0) {
        write(ili, 3 * padding.left / 4, y, 0);
      }
    }
    ref17 = ((function() {
      var ac, ref17, results;
      results = [];
      for (i = ac = 0, ref17 = numWeeks - 10; 0 <= ref17 ? ac < ref17 : ac > ref17; i = 0 <= ref17 ? ++ac : --ac) {
        results.push(i);
      }
      return results;
    })()).concat([numWeeks - 1]);
    for (ab = 0, len8 = ref17.length; ab < len8; ab++) {
      i = ref17[ab];
      wk = this.chartData[i].epiweek % 100;
      if (wk === 20 || wk === 40 || i === (numWeeks - 1)) {
        x = i2x(i);
        trace([x, x], [h - padding.bottom, h - (padding.bottom - 6)]);
        yr = Math.round(this.chartData[i].epiweek / 100) % 100;
        yr = ('00' + yr).slice(-2);
        wk = ('00' + wk).slice(-2);
        write("'" + yr + "w" + wk, x, h - 2 * padding.bottom / 3, -0.125);
      }
    }
    ctx.lineWidth = ctx.lineWidth / 2;
    iVals = (function() {
      var ac, ref18, results;
      results = [];
      for (i = ac = 0, ref18 = numWeeks; 0 <= ref18 ? ac < ref18 : ac > ref18; i = 0 <= ref18 ? ++ac : --ac) {
        results.push(i);
      }
      return results;
    })();
    if (this.truthData != null) {
      iliVals = (function() {
        var ac, ref18, results;
        results = [];
        for (i = ac = 0, ref18 = this.truthData.length; 0 <= ref18 ? ac < ref18 : ac > ref18; i = 0 <= ref18 ? ++ac : --ac) {
          results.push(this.truthData[i].wili);
        }
        return results;
      }).call(this);
      trace(iVals.map(i2x), iliVals.map(ili2y));
    }
    ctx.strokeStyle = '#FF0000';
    iliVals = (function() {
      var ac, ref18, results;
      results = [];
      for (i = ac = 0, ref18 = numWeeks; 0 <= ref18 ? ac < ref18 : ac > ref18; i = 0 <= ref18 ? ++ac : --ac) {
        results.push(this.chartData[i].value);
      }
      return results;
    }).call(this);
    trace(iVals.map(i2x), iliVals.map(ili2y));
    loc = this.chartData[0].location;
    if (indexOf.call(HHS_REGIONS, loc) >= 0 || loc === 'nat') {
      ctx.strokeStyle = '#008080';
      ctx.setLineDash([5, 3]);
      for (i = ac = 0, ref18 = numWeeks; 0 <= ref18 ? ac < ref18 : ac > ref18; i = 0 <= ref18 ? ++ac : --ac) {
        wk = this.chartData[i].epiweek % 100;
        if (wk === 40) {
          yr = Math.round(this.chartData[i].epiweek / 100);
          ilibase = baselinedata[loc][yr];
          if (ilibase != null) {
            ctx.beginPath();
            ctx.moveTo(i2x(i), ili2y(ilibase));
            if (i + 32 < numWeeks) {
              ctx.lineTo(i2x(i + 32), ili2y(ilibase));
            } else {
              ctx.lineTo(i2x(numWeeks - 1), ili2y(ilibase));
            }
            ctx.stroke();
          }
        }
      }
    }
    ctx.setLineDash([1, 0]);
    ctx.strokeStyle = 'green';
    for (i = ad = 0, ref19 = numWeeks - 1; 0 <= ref19 ? ad <= ref19 : ad >= ref19; i = 0 <= ref19 ? ++ad : --ad) {
      if (this.chartData[i].epiweek === this.currentEpweek) {
        current = this.chartData[i];
        centerX = i2x(i);
        centerY = ili2y(current.value);
        ref20 = [ili2y(current.value + current.std), ili2y(current.value - current.std)], upY = ref20[0], downY = ref20[1];
        ctx.beginPath();
        ctx.moveTo(centerX, upY);
        ctx.lineTo(centerX, downY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(centerX - 2 * (i2x(2) - i2x(1)), upY);
        ctx.lineTo(centerX + 2 * (i2x(2) - i2x(1)), upY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(centerX - 2 * (i2x(2) - i2x(1)), downY);
        ctx.lineTo(centerX + 2 * (i2x(2) - i2x(1)), downY);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX, centerY, 2, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'green';
        ctx.fill();
        ctx.strokeStyle = '#FF0000';
        ctx.fillStyle = '#000';
      }
    }
    ctx.font = 12 * Math.min(1, w / 500) + 'px sans-serif';
    ctx.lineWidth = ctx.lineWidth / 2;
    write("Nowcast", w - 3 * padding.right, padding.top, 0);
    ctx.beginPath();
    ctx.moveTo(w - 6 * padding.right, padding.top);
    ctx.lineTo(w - 5 * padding.right, padding.top);
    ctx.stroke();
    if (this.truthData != null) {
      ctx.strokeStyle = '#000';
      write("Ground Truth", w - 3 * padding.right, (3 / 2) * padding.top, 0);
      ctx.beginPath();
      ctx.moveTo(w - 6 * padding.right, (3 / 2) * padding.top);
      ctx.lineTo(w - 5 * padding.right, (3 / 2) * padding.top);
      ctx.stroke();
    }
    if (indexOf.call(HHS_REGIONS, loc) >= 0 || loc === 'nat') {
      ctx.strokeStyle = '#008080';
      ctx.setLineDash([5, 3]);
      write("CDC Baseline", w - 3 * padding.right, 2. * padding.top, 0);
      ctx.beginPath();
      ctx.moveTo(w - 6 * padding.right, 2. * padding.top);
      ctx.lineTo(w - 5 * padding.right, 2. * padding.top);
      ctx.stroke();
    }
    ctx.font = 24 * Math.min(1, w / 500) + 'px sans-serif';
    return write("Historical Nowcasts (out-of-sample)", w / 2, padding.top / 2, 0);
  };

  App.prototype.hitTest = function(u, v) {
    var aa, ab, hit, idx, len7, len8, loc, ref14, ref15, ref16, ref17, ref18, ref19, t, u1, u2, v1, v2;
    ref14 = this.locations;
    for (t = 0, len7 = ref14.length; t < len7; t++) {
      loc = ref14[t];
      ref15 = geodata.locations[loc].paths;
      for (aa = 0, len8 = ref15.length; aa < len8; aa++) {
        poly = ref15[aa];
        hit = false;
        ref16 = this.ecef2ortho.apply(this, geodata.points[poly[0]]), u1 = ref16[0], v1 = ref16[1];
        for (idx = ab = 1, ref17 = poly.length; 1 <= ref17 ? ab <= ref17 : ab >= ref17; idx = 1 <= ref17 ? ++ab : --ab) {
          ref18 = this.ecef2ortho.apply(this, geodata.points[poly[idx % poly.length]]), u2 = ref18[0], v2 = ref18[1];
          if (((v1 > v) !== (v2 > v)) && ((u1 > u) || (u2 > u)) && (((u1 > u) && (u2 > u)) || (u1 + (v - v1) * (u2 - u1) / (v2 - v1) > u))) {
            hit = !hit;
          }
          ref19 = [u2, v2], u1 = ref19[0], v1 = ref19[1];
        }
        if (hit) {
          return loc;
        }
      }
    }
    return null;
  };

  App.prototype.locCenterOnMap = function(loc) {
    var aa, idx, k, len7, ref14, ref15, ref16, ref17, ref18, ref19, t, x, y;
    ref14 = [0, 0, 0], centerX = ref14[0], centerY = ref14[1], k = ref14[2];
    ref15 = geodata.locations[loc].paths;
    for (t = 0, len7 = ref15.length; t < len7; t++) {
      poly = ref15[t];
      for (idx = aa = 1, ref16 = poly.length; 1 <= ref16 ? aa <= ref16 : aa >= ref16; idx = 1 <= ref16 ? ++aa : --aa) {
        ref17 = this.ecef2ortho.apply(this, geodata.points[poly[idx % poly.length]]), x = ref17[0], y = ref17[1];
        ref18 = [centerX + x, centerY + y], centerX = ref18[0], centerY = ref18[1];
        k++;
      }
    }
    ref19 = [centerX / k, centerY / k], centerX = ref19[0], centerY = ref19[1];
    if (loc === 'AK') {
      centerY = centerY - 10;
    }
    return [centerX, centerY];
  };

  App.prototype.fetchNowcast = function(loc, currentEpiweek) {
    var callback;
    this.chartData = null;
    this.truthData = null;
    callback = (function(_this) {
      return function(epidata) {
        return _this.onNowcastReceived(epidata, currentEpiweek);
      };
    })(this);
    return Epidata_nowcast_single(getEpidataHander(callback), loc);
  };

  App.prototype.onNowcastReceived = function(epidata, currentEpiweek) {
    var callback, current, end, endepiweek, epiweek, idx, ili, len7, loc, row, start, std, t, wk, yr;
    for (t = 0, len7 = epidata.length; t < len7; t++) {
      row = epidata[t];
      if (row.epiweek === currentEpiweek) {
        current = row;
      }
    }
    start = epidata[0];
    end = epidata[epidata.length - 1];
    wk = end.epiweek % 100;
    yr = Math.floor(end.epiweek / 100);
    endepiweek = end.epiweek - 10;
    if (wk > 40) {
      endepiweek = yr * 100 + 39;
    }
    if (wk < 20) {
      endepiweek = (yr - 1) * 100 + 39;
    }
    loc = current.location;
    if (indexOf.call(REGIONS, loc) >= 0 || indexOf.call(NATIONAL, loc) >= 0) {
      callback = (function(_this) {
        return function(ilidata) {
          return _this.onFluviewReceived(ilidata);
        };
      })(this);
      Epidata_fluview_single(getEpidataHander(callback), loc, start.epiweek + "-" + endepiweek);
    }
    ili = '' + (Math.round(current.value * 100) / 100);
    if (indexOf.call(ili, '.') >= 0) {
      ili += '00';
      idx = ili.indexOf('.');
      ili = ili.slice(0, idx + 3);
    } else {
      ili += '.00';
    }
    std = '' + (Math.round(current.std * 100) / 100);
    if (indexOf.call(std, '.') >= 0) {
      std += '00';
      idx = std.indexOf('.');
      std = std.slice(0, idx + 3);
    } else {
      std += '.00';
    }
    ili = '(' + ili + '&#177;' + std + ')';
    epiweek = current.epiweek % 100;
    this.chartData = epidata;
    $('#nowcast_label').text("ILI nowcast for " + loc + " for epi-week " + epiweek + ":");
    $('#nowcast_label_left').text("ILI nowcast for " + loc + " for epi-week " + epiweek + ":");
    $('#nowcast_value').html(ili + "%");
    $('#nowcast_value_left').html(ili + "%");
    $('#chart_label').text("Historical ILI nowcasts for " + loc + ":");
    $('.location_right').css('display', 'block');
    $('#loading_icon').css('display', 'none');
    return this.resizeCanvas();
  };

  App.prototype.onFluviewReceived = function(ilidata) {
    this.truthData = ilidata;
    return this.resizeCanvas();
  };

  return App;

})();

// ---
// generated by coffee-script 1.9.2
 
