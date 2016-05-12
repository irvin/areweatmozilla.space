var mozSpaces = {
  dat: [
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
    },
    {
      name: "Community Space Jakarta",
      addr_en: "Daerah Khusus Ibukota Jakarta, Jl. Cikini Raya No.9, Cikini, Menteng, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta, Indonesia",
      lat: -6.1876205,
      long: 106.8345783
    },
    {
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
      name: "Beijing (Mozilla Online Ltd.)",
      addr_en: "China Resources Building, Suite 1708, 8 Jianguomenbei Avenue, Dongcheng District, Beijing 100005, China",
      addr: "北京市 东城区 建国门北大街8号 华润大厦 17层1708单元",
      lat: 39.9129981,
      long: 116.4318727
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
      addr: "東京都港区六本木7丁目5-6",
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
  ],
  calcDistance: function(coord){
    for (id in this.dat){
      var space = this.dat[id];
      space.away = Number(GreatCircle.distance(coord.latitude, coord.longitude, space.lat, space.long).toFixed(2));
      space.bearing = Math.round(GreatCircle.bearing(coord.latitude, coord.longitude, space.lat, space.long));
    };
  },
  getNearest: function(){
    var nearSpace = null;
    for (id in this.dat){
      if (!nearSpace || (this.dat[id].away < nearSpace.away))
        nearSpace = this.dat[id];
    };
    return nearSpace;
  },
  getFarest: function(){
    var farSpace = null;
    for (id in this.dat){
      if (!farSpace || (this.dat[id].away > farSpace.away))
        farSpace = this.dat[id];
    };
    return farSpace;
  }
};

var color = {
  // https://www.mozilla.org/en-US/styleguide/identity/mozilla/color/
  'mozRed': '#C13832',
  'mozCharcoal': '#4D4E53'
}

var inspace = {
init: function(){
  this.$locationInfo = $('#location_info');

  this.compileTmpl();
  this.getLocation();
},
compileTmpl: function(){
  this.nearSpaceTmpl = Handlebars.compile($("#nearest-tmpl").html());
  this.spaceInfoTmpl = Handlebars.compile($("#spaceinfo-tmpl").html());
},
getLocation: function(){
  var me = this;
  navigator.geolocation.getCurrentPosition(function(pos){
    me.handlePos.call(me, pos);
  }, this.handlePosError, { enableHighAccuracy: true });
  // navigator.geolocation.getCurrentPosition(this.handlePos, this.handlePosError, { enableHighAccuracy: true });
},
handlePosError: function(err){
  alert('location error (' + err.code + '): ' + err.message);
},
handlePos: function(pos) {
  var me = this;
  mozSpaces.calcDistance(pos.coords);

  var nearSpace = mozSpaces.getNearest();
  var farestSpace = mozSpaces.getFarest();

  // Show text message
  var dat = {
    space: nearSpace,
    atSpace: function(){ return (nearSpace.away <= 0.3); }(),
    accuracy: Math.floor(pos.coords.accuracy)
  };
  this.$locationInfo.html(this.nearSpaceTmpl(dat));

  function rPointHoverIn(){
    var point = this;
    var dat = {
      space: rSpaceTable[point.id],
      accuracy: Math.floor(pos.coords.accuracy)
    };

    me.$locationInfo.html(me.spaceInfoTmpl(dat));
    rPoints.attr({stroke: 'none'});
    point.attr({stroke: color.mozCharcoal}).toFront();
  };
  function rPointHoverOut(){
    // console.log('out', rSpaceTable[this.id].name);
    return;
  };

  var paper = Raphael("moz_radar", 300, 300);
  var rCircle = paper.circle(150, 150, 148).attr({fill: 'none', stroke: '#666', 'stroke-width': 2});

  var rSpaceTable = {};
  var rPoints = paper.set();
  var nearestPoint;

  for (id in mozSpaces.dat){
    var space = mozSpaces.dat[id];

    var rst = space.rSet = paper.set();

    // 12756 - http://en.wikipedia.org/wiki/Antipodes
    var lnAway = 150 - (150 / (Math.log(12756) - Math.log(0.1)) * Math.log(space.away));
    var rPoint = paper.circle(150, lnAway, 10).attr({fill: color.mozRed, stroke: 'none', 'stroke-width': 2});
    rSpaceTable[rPoint.id] = space;
    rPoints.push(rPoint);

    rPoint.hover( rPointHoverIn, rPointHoverOut );

    rst.push(
      paper.rect(0, 0, 300, 300).attr({fill: 'none', stroke: 'none', 'stroke-width': 1}),
      rPoint
    );
    rst.transform('R' + Math.round(space.bearing) + ',150, 150');

    // Nearest space
    if (space == nearSpace) nearestPoint = rPoint;
  };
  nearestPoint.attr({stroke: color.mozCharcoal}).toFront();
}
}.init();
