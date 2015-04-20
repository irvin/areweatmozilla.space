var mozilla_spaces = [
  {
    name: "Community Space Taipei",
    addr_en: "3rd Fl., No. 94, Sec. 1, Ba-de Rd., Zhongzheng District, Taipei City 100, Taiwan",
    addr: "100台灣台北市中正區八德路一段94號3F",
    lat: 25.044113,
    long: 121.532295
  },
  {
    name: "Community Space Bangalore",
    addr_en: "No 10, 3rd Floor, Serenity, 'A' Cross, Austin Town, Bangalore, Pin 560 047, India",
    lat: 12.963291,
    long: 77.6142979
  },
  {
    name: "Community Space Manila",
    addr_en: "Molave Building, 2231 Chino Roces Ave, Makati, Metro Manila, Philippines",
    lat: 14.5468499,
    long: 121.0159104
  },  {
    name: "Mountain View",
    addr_en: "331 E. Evelyn Avenue, Mountain View, CA 94041, USA",
    lat: 37.3872783,
    long: -122.0602164
  },
  {
    name: "Auckland",
    addr_en: "Level 7, 5 Short St., Newmarket, Auckland 1023, New Zealand",
    lat: -36.8664438,
    long: 174.7771253
  },
  {
    name: "Mozilla Online Ltd.",
    addr_en: "International Club Office Tower 800A, 21 Jian Guo Men Wai Avenue, Chaoyang District, Beijing 100020, China",
    addr: "北京市 朝阳区 建外大街21号 国际俱乐部办公大楼 800A",
    lat: 39.9113432,
    long: 116.4402447
  },
  {
    name: "Berlin",
    addr_en: "Haus 10, Treppe 6, Voltastr. 5, 13355 Berlin, Germany",
    lat: 52.54216,
    long: 13.39031
  },
  {
    name: "London",
    addr_en: "101 St Martin‘s Lane, 3rd Floor, London WC2N 4AZ, UK",
    lat: 51.5103665,
    long: -0.1271152
  },
  {
    name: "Paris",
    addr_en: "16 Bis Boulevard Montmartre, Paris 75009, France",
    lat: 48.8721388,
    long: 2.3411542
  },
  {
    name: "Portland",
    addr_en: "Brewery Block 2, 1120 NW Couch St, Suite 320, Portland, OR 97209, USA",
    lat: 45.5236849,
    long: -122.6827884
  },
  {
    name: "San Francisco",
    addr_en: "2 Harrison Street, Suite 175, San Francisco, CA 94105, USA",
    lat: 37.7895035,
    long: -122.3890646
  },
  {
    name: "Taipei",
    addr_en: "4F-A1, No. 106, Sec. 5, Xinyi Rd, Xinyi Dist., Taipei City 11047, Taiwan",
    addr: "110台灣台北市信義區信義路五段106號4樓A1",
    lat: 25.032329,
    long: 121.567422
  },
  {
    name: "Tokyo",
    addr_en: "7-5-6 Roppongi, Minato-ku, Tokyo 106-0032, Japan",
    lat: 35.6651776,
    long: 139.7277261
  },
  {
    name: "Toronto",
    addr_en: "366 Adelaide St W, Suite 500, Toronto, ON M5V 1R9, Canada",
    lat: 43.6471131,
    long: -79.3942263
  },
  {
    name: "Vancouver",
    addr_en: "163 W Hastings St, Suite 209, Vancouver, BC V6B 1H5, Canada",
    lat: 49.2824658,
    long: -123.1091908
  }
];

var nearSpaceHbs = Handlebars.compile($("#nearest-tmpl").html());

navigator.geolocation.getCurrentPosition(function(pos) {
  var crd = pos.coords;

  for (id in mozilla_spaces){
    var space = mozilla_spaces[id];
    space.away = Number(GreatCircle.distance(crd.latitude, crd.longitude, space.lat, space.long).toFixed(2));
    space.bearing = GreatCircle.bearing(crd.latitude, crd.longitude, space.lat, space.long);
  };

  var nearSpace = function(mozilla_spaces){
    var nearSpace = null;
    for (id in mozilla_spaces){
      if (!nearSpace || (mozilla_spaces[id].away < nearSpace.away)){
        nearSpace = mozilla_spaces[id];
          console.log('near', mozilla_spaces[id]);
      }
    };
    return nearSpace;
  }(mozilla_spaces);

  var dat = {
    space: nearSpace,
    atSpace: function(){ return (nearSpace.away <= 0.3); }(),
    accuracy: pos.coords.accuracy
  };

  $(nearSpaceHbs(dat)).appendTo('#nearest_space');

}, function(err) {
  alert('location error (' + err.code + '): ' + err.message);
}, {
  enableHighAccuracy: true
});
