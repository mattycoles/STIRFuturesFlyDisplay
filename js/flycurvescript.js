function loadYield() {
  var active = [];
  var sonia = document.getElementById("sonia");
  var euribor = document.getElementById("euribor");
  var sofr = document.getElementById("sofr");

  if (sonia.checked == false) {
    active.push("sonia");
  }
  if (euribor.checked == false) {
    active.push("euribor");
  }
  if (sofr.checked == false) {
    active.push("sofr");
  }

  if (active.length === 0) {
    console.log("nothing toggled. nothing to do.");
    document.getElementById("chart").innerHTML = "";
  } else {
    var variables = "c=" + active[0];
    if (active.length == 2) {
      variables += "&d=" + active[1];
    }
    if (active.length == 3) {
      variables += "&d=" + active[1];
      variables += "&e=" + active[2];
    }
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let data = JSON.parse(this.responseText);

        // sort the data so it is in YEAR-MONTH order instead
        // of SQL order MONTH-YEAR
        if (data.length < 10) {
          for (var i = 0; i < data.length; i++) {
            data[i].sort(function (x, y) {
              // use index to ditermine which months come first
              var months = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ];
              // assign substrings for SO3 and I
              if (x["contract"].substring(0, 1) == "S") {
                var m1 = x["contract"].substr(4, 3);
                var y1 = x["contract"].substr(7, 2);
                var m2 = y["contract"].substr(4, 3);
                var y2 = y["contract"].substr(7, 2);
              } else if (x["contract"].substring(0, 1) == "I") {
                var m1 = x["contract"].substr(2, 3);
                var y1 = x["contract"].substr(5, 2);
                var m2 = y["contract"].substr(2, 3);
                var y2 = y["contract"].substr(5, 2);
              }

              return y1 - y2 || months.indexOf(m1) - months.indexOf(m2);
            });
          }
        } else {
          data.sort(function (x, y) {
            // use index to ditermine which months come first
            var months = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ];
            // assign substrings for SO3 and I
            if (x["contract"].substring(0, 1) == "S") {
              var m1 = x["contract"].substr(4, 3);
              var y1 = x["contract"].substr(7, 2);
              var m2 = y["contract"].substr(4, 3);
              var y2 = y["contract"].substr(7, 2);
            } else if (x["contract"].substring(0, 1) == "I") {
              var m1 = x["contract"].substr(2, 3);
              var y1 = x["contract"].substr(5, 2);
              var m2 = y["contract"].substr(2, 3);
              var y2 = y["contract"].substr(5, 2);
            }

            return y1 - y2 || months.indexOf(m1) - months.indexOf(m2);
          });
        }

        chartData(data);
        //console.log(data);
      }
    };
    xhttp.open("GET", "php/flycurve.php?" + variables, true);
    xhttp.send();
  }
}

// CHART THE DATA INTO HTML
function chartData(data) {
  var dates = [];
  var soniaData = [];
  var euriborData = [];
  var sofrData = [];
  var chartTitle = "Fly Curve for:";

  //// IF THERE ARE MULTIPLE PRODUCTS SELECTED
  // Get a list of dates
  if (data.length < 10) {
    if (data[0][0]["contract"].substring(0, 2) == "SO") {
      for (var i = 0; i < data[0].length; i++) {
        var date = data[0][i]["contract"];
        var m = date.substr(4, 3);
        var y = date.substr(7, 2);
        dates.push(m + " " + y);
      }
    } else if (data[0][0]["contract"].substring(0, 2) == "SR") {
      for (var i = 0; i < data[0].length; i++) {
        var date = data[0][i]["contract"];
        var m = date.substr(4, 3);
        var y = date.substr(7, 2);
        dates.push(m + " " + y);
      }
    } else if (data[0][0]["contract"].substring(0, 1) == "I") {
      for (var i = 0; i < data[0].length; i++) {
        var date = data[0][i]["contract"];
        var m = date.substr(2, 3);
        var y = date.substr(5, 2);
        dates.push(m + " " + y);
      }
    }

    // get the data for each product
    for (var i = 0; i < data.length; i++) {
      for (var p = 0; p < data[i].length; p++) {
        if (data[i][0]["contract"].substring(0, 2) == "SO") {
          soniaData.push(data[i][p]["soff3"]);
        } else if (data[i][0]["contract"].substring(0, 2) == "SR") {
          sofrData.push(data[i][p]["soff3"] / 100);
        } else if (data[i][0]["contract"].substring(0, 1) == "I") {
          euriborData.push(data[i][p]["soff3"]);
        }
      }
    }
    if (soniaData.length != 0) {
      chartTitle = chartTitle + " SONIA";
    }
    if (euriborData.length != 0) {
      chartTitle = chartTitle + " EURIBOR";
    }
    if (sofrData.length != 0) {
      chartTitle = chartTitle + " SOFR";
    }
  } else {
    //// IF THERE IS A SINGLE PRODUCTS SELECTED
    if (data[0]["contract"].substring(0, 2) == "SO") {
      chartTitle += " SONIA";
      for (var i = 0; i < data.length; i++) {
        var date = data[i]["contract"];
        var m = date.substr(4, 3);
        var y = date.substr(7, 2);
        dates.push(m + " " + y);
        soniaData.push(data[i]["soff3"]);
      }
    } else if (data[0]["contract"].substring(0, 2) == "SR") {
      chartTitle += " SOFR";
      for (var i = 0; i < data.length; i++) {
        var date = data[i]["contract"];
        var m = date.substr(4, 3);
        var y = date.substr(7, 2);
        dates.push(m + " " + y);
        sofrData.push(data[i]["soff3"]);
      }
    } else if (data[0]["contract"].substring(0, 1) == "I") {
      chartTitle += " EURIBOR";
      for (var i = 0; i < data.length; i++) {
        var date = data[i]["contract"];
        var m = date.substr(2, 3);
        var y = date.substr(5, 2);
        dates.push(m + " " + y);
        euriborData.push(data[i]["soff3"]);
      }
    }
  }

  var trace1 = {
    type: "scatter",
    mode: "lines",
    name: "soniaData",
    x: dates,
    y: soniaData,
    line: { color: "#17BECF" },
  };

  var trace2 = {
    type: "scatter",
    mode: "lines",
    name: "euriborData",
    x: dates,
    y: euriborData,
    line: { color: "#00008B" },
  };

  var trace3 = {
    type: "scatter",
    mode: "lines",
    name: "sofrData",
    x: dates,
    y: sofrData,
    line: { color: "#FF0000" },
  };

  var data = [trace1, trace2, trace3];

  var layout = {
    title: chartTitle,
    xaxis: { tickmode: "auto" },
    yaxis: {
      autotick: false,
      ticks: "outside",
      tick0: 0.25,
      dtick: 0.25,
      ticklen: 8,
      tickcolor: "#000",
    },
  };

  Plotly.newPlot("chart", data, layout);
}
