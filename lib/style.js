var style;

// this is a wrapped function
(function () {

  var defaultColor = "rgb(254, 255, 240)",
    highlightColor = "#FDFFB5";

  style = {
    navitem: {
      base: {
        font: '40pt TheMinion',
        align: 'center',
        srokeThickness: 4
      },
      default: {
        fill: defaultColor,
        stroke: 'rgba(0,0,0,0)'
      },
      inverse: {
        fill: 'black',
        stroke: 'black'
      },
      hover: {
        fill: highlightColor,
        stroke: 'rgba(200,200,200,0.5)',
      //   textShadow: '4px 6px 5px rgba(0, 0, 0, 0.5)',
      }
    }
  };

  for (var key in style.navitem) {
    if (key !== "base") {
      Object.assign(style.navitem[key], style.navitem.base)
    }
  }

})();

// the trailing () triggers the function call immediately
