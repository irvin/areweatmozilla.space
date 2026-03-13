var mozSpaces = {
  dat: [
    {
      name: "Community Space Taipei",
      addr_en: "Rm. 1105, 11F, 99 Chongqing S. Rd. Sec I, Zhongzheng Dist., Taipei City 100, Taiwan",
      addr: "100臺北市中正區重慶南路一段99號1105室世界大樓11樓",
      lat: 25.0429756,
      long: 121.5135698
    },
    {
      name: "Community Space Jakarta",
      addr_en: "SOHO Pancoran, Tower Noble lantai 11, unit N-1109, RT.1/RW.5, Tebet Bar., Kec. Tebet, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12810, Indonesia",
      lat: -6.2424803,
      long: 106.845506
    },
    {
      name: "Berlin",
      addr_en: "GSG-Hof, Schlesische Str. 27/Gebäude 3, 4. Obergeschoss, 10997 Berlin, Germany",
      lat: 52.4994197,
      long: 13.4489385
    },
    {
      name: "Paris",
      addr_en: "34 Rue Laffitte, 75009 Paris, France",
      lat: 48.8735717,
      long: 2.3379989
    },
    /*
    {
      name: "San Francisco",
      addr_en: "149 New Montgomery Street, 4th floor, San Francisco, CA 94105, USA",      
      lat: 37.7895035,
      long: -122.3890646
    },
    */
    {
      name: "Toronto",
      addr_en: "366 Adelaide St W, Suite 500, Toronto, ON M5V 1R9, Canada",
      lat: 43.6471131,
      long: -79.3942263
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
