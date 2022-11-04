function loadYield() {
  var active = [];
  var sonia = document.getElementById("sonia");
  var euribor = document.getElementById("euribor");
  var sofr = document.getElementById("sofr");

  if (
    sonia.checked == false &&
    euribor.checked == false &&
    sofr.checked == false
  ) {
    document.getElementById("replay").style.display = "none";
  } else {
    document.getElementById("replay").style.display = "inline";
  }

  if (sonia.checked == true) {
    active.push("sonia");
  }
  if (euribor.checked == true) {
    active.push("euribor");
  }
  if (sofr.checked == true) {
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
      }
    };
    xhttp.open("GET", "php/flycurve.php?" + variables, true);
    xhttp.send();
  }
}

// CHART THE DATA INTO HTML
function chartData(data) {
  if (data.length < 10) {
    var dataDate = data[0][4][""]["date"].substring(0, 10);
  } else {
    var dataDate = data[4][""]["date"].substring(0, 10);
  }
  var dates = [];
  var soniaData = [];
  var euriborData = [];
  var sofrData = [];
  var chartTitle = dataDate + " Fly Curve for:";

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
    name: "Sonia",
    x: dates,
    y: soniaData,
    line: { color: "#17BECF" },
  };

  var trace2 = {
    type: "scatter",
    mode: "lines",
    name: "Euribor",
    x: dates,
    y: euriborData,
    line: { color: "#00008B" },
  };

  var trace3 = {
    type: "scatter",
    mode: "lines",
    name: "SOFR",
    x: dates,
    y: sofrData,
    line: { color: "#FF0000" },
  };

  var data = [trace1, trace2, trace3];

  if (
    (sofrData.length != 0) &
    (soniaData.length == 0) &
    (euriborData.length == 0)
  ) {
    var layout = {
      title: chartTitle,
      xaxis: { tickmode: "auto" },
      yaxis: {
        autotick: false,
        ticks: "outside",
        tick0: 2,
        dtick: 2,
        ticklen: 8,
        tickcolor: "#000",
      },
    };
  } else {
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
  }

  Plotly.newPlot("chart", data, layout, {
    displaylogo: false,
    responsive: true,
  });
}

// REPLAY Daily Button logic
function replayDaily() {
  var loading = document.getElementById("loading");
  loading.style.display = "inline";
  loading.innerHTML = "LOADING ...";
  var active = [];
  var sonia = document.getElementById("sonia");
  var euribor = document.getElementById("euribor");
  var sofr = document.getElementById("sofr");

  if (sonia.checked == true) {
    active.push("sonia");
  }
  if (euribor.checked == true) {
    active.push("euribor");
  }
  if (sofr.checked == true) {
    active.push("sofr");
  }

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
      //console.log(this.responseText);
      let returnData = JSON.parse(this.responseText);
      var data = [];
      for (m = 0; m < returnData.length; m++) {
        if (returnData[m][0].length > 1) {
          data.push(returnData[m]);
        }
      }

      for (var d = 0; d < data.length; d++) {
        for (var r = 0; r < data[d].length; r++) {
          data[d][r].sort(function (x, y) {
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
      }
      // Chart the data slowly for replay of curve
      var loading = document.getElementById("loading");
      loading.innerHTML = "PLAYING DAILY DATA";
      cancel = false; // Used to re-enable break out function for timer async
      chartSlowly(data);
    }
  };

  xhttp.open("GET", "php/replaydailycurve.php?" + variables, true);
  xhttp.send();
}

// REPLAY Weekly Button logic
function replayWeekly() {
  var loading = document.getElementById("loading");
  loading.style.display = "inline";
  loading.innerHTML = "LOADING ...";
  var active = [];
  var sonia = document.getElementById("sonia");
  var euribor = document.getElementById("euribor");
  var sofr = document.getElementById("sofr");

  if (sonia.checked == true) {
    active.push("sonia");
  }
  if (euribor.checked == true) {
    active.push("euribor");
  }
  if (sofr.checked == true) {
    active.push("sofr");
  }

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
      //console.log(this.responseText);
      let returnData = JSON.parse(this.responseText);
      var data = [];
      for (m = 0; m < returnData.length; m++) {
        if (returnData[m][0].length > 1) {
          data.push(returnData[m]);
        }
      }

      for (var d = 0; d < data.length; d++) {
        for (var r = 0; r < data[d].length; r++) {
          data[d][r].sort(function (x, y) {
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
      }
      // Chart the data slowly for replay of curve
      var loading = document.getElementById("loading");
      loading.innerHTML = "PLAYING WEEKLY DATA";
      cancel = false; // Used to re-enable break out function for timer async
      chartSlowly(data);
    }
  };

  xhttp.open("GET", "php/replayweeklycurve.php?" + variables, true);
  xhttp.send();
}

const timer = (ms) => new Promise((res) => setTimeout(res, ms));
let cancel; // Used to re-enable break out function for timer async
async function chartSlowly(data) {
  // Check how many products we have data for
  // 1 product
  if (data[0].length == 1) {
    for (let i = 0; i < data.length; i++ && !cancel) {
      chartData(data[i][0]);
      await timer(2000);
      if (cancel) break; // breaks out of process if reset is clicked.
    }
  }
  // 2 products
  else {
    for (let i = 0; i < data.length; i++ && !cancel) {
      chartData(data[i]);
      await timer(2000);
      if (cancel) break; // breaks out of process if reset is clicked.
    }
  }
  loading.innerHTML = "DONE";
}

function reset() {
  cancel = true;
  var active = [];
  var sonia = document.getElementById("sonia");
  var euribor = document.getElementById("euribor");
  var sofr = document.getElementById("sofr");

  if (sonia.checked == true) {
    sonia.click();
    sonia.click();
  }
  if (euribor.checked == true) {
    euribor.click();
    euribor.click();
  }
  if (sofr.checked == true) {
    sofr.click();
    sofr.click();
  }
  var loading = document.getElementById("loading");
  loading.innerHTML = "";
}
