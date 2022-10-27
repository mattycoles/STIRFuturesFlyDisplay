// Is called on page load
// Displays the list of months / years available to chart on the left side
function loadMonthYear() {
  var xhttp;

  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let data = JSON.parse(this.responseText);
      let list = document.getElementById("monthYearList");

      // sort the data so it is in YEAR-MONTH order instead
      // of SQL order MONTH-YEAR
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

        var m1 = x.substr(4, 3);
        var y1 = x.substr(7, 2);
        var m2 = y.substr(4, 3);
        var y2 = y.substr(7, 2);

        return y1 - y2 || months.indexOf(m1) - months.indexOf(m2);
      });
      data.forEach((item) => {
        var month = item.substr(4, 3);
        var year = item.substr(7, 2);
        let li = document.createElement("li");
        li.innerText = month + " " + year;
        li.setAttribute("id", month + year);
        // Create a function which adds an event listener
        // to each contract item that is listed...
        // If a date/time filter is active, then call a different function
        li.addEventListener("click", function clickContract(event) {
          const dateFilter = document.getElementById("endDateTime");
          if (!document.getElementById("endDateTime").value) {
            overlayContracts(event);
          } else {
            dateTimeFilter(event);
          }
          setActive(this);
          showControlPanel();
        });
        list.appendChild(li);
      });
    }
  };
  // Call sonia to get list of months / years
  xhttp.open("GET", "php/showcontracts.php?c=sonia", true);
  xhttp.send();
}

// sets the last clicked li item as active and underlines the text
function setActive(el) {
  var li = document.getElementsByTagName("li");
  for (var i = 0; i < li.length; i++) {
    if (li[i] == el) {
      el.classList.toggle("active");
    } else {
      li[i].classList.remove("active");
    }
  }
}

// Find the currently active contract
function findActive() {
  var li = document.getElementsByTagName("li");
  for (var i = 0; i < li.length; i++) {
    if (li[i].classList == "active") {
      var activeContract = li[i].innerHTML;
    }
  }
  return activeContract;
}

/*
RESPONSIBLE FOR CHARTING DATA
*/

// load all of the data for the contracts from the specified
// month / year
// calls overlaycontracts.php
function overlayContracts(event) {
  var date = event.srcElement.id;

  var xhttp;
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let data = JSON.parse(this.responseText);
      chartData(data);
    }
  };
  xhttp.open("GET", "php/overlaycontracts.php?d=" + date, true);
  xhttp.send();
}

// This function is called when a loaded graph is filtered by date/time
// It will then call PHP, overlaycontractsrange.php which shows details
// for the specified date/time period
function dateTimeFilter(event) {
  // get the currently active month / year
  if (event) {
    var date = event.srcElement.id;
  } else {
    date = findActive();
    // remove whitespace
    date = date.replace(/\s+/, "");
  }
  // Get the specified start/end times and build into SQL table format
  var startTime = document.getElementById("startDateTime").value;
  start = startTime.substring(5, 7);
  start += "/";
  start += startTime.substring(8, 10);
  start += "/";
  start += startTime.substring(0, 4);
  start += " ";
  start += startTime.substring(11, 13);
  start += startTime.substring(13, 16);
  start += ":00";
  var endTime = document.getElementById("endDateTime").value;
  end = endTime.substring(5, 7);
  end += "/";
  end += endTime.substring(8, 10);
  end += "/";
  end += endTime.substring(0, 4);
  end += " ";
  end += endTime.substring(11, 13);
  end += endTime.substring(13, 16);
  end += ":00";

  var variables = "d=" + date + "&s=" + start + "&e=" + end;
  var xhttp;
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      //document.getElementById("contractDetails").innerHTML = "";
      let data = JSON.parse(this.responseText);
      //let list = document.getElementById("contractDetails");
      chartData(data);
    }
  };
  xhttp.open("GET", "php/overlaycontractsrange.php?" + variables, true);
  xhttp.send();
}

// CHART THE DATA INTO HTML

function chartData(data) {
  dateTime = [];
  sonia = [];
  euribor = [];
  sofr = [];

  // Find the active date and make that the chart title
  chartTitle = findActive();
  // Set the period to add to the title
  var period;
  var start = document.getElementById("startDateTime");
  if (!start.value) {
    period = " over the the last 24 hours";
    chartTitle += period;
  } else {
    // Get the specified start/end times and build into SQL table format
    var startTime = document.getElementById("startDateTime").value;
    start = startTime.substring(5, 7);
    start += "/";
    start += startTime.substring(8, 10);
    start += "/";
    start += startTime.substring(0, 4);
    start += " ";
    start += startTime.substring(11, 13);
    start += startTime.substring(13, 16);
    start += ":00";
    var endTime = document.getElementById("endDateTime").value;
    end = endTime.substring(5, 7);
    end += "/";
    end += endTime.substring(8, 10);
    end += "/";
    end += endTime.substring(0, 4);
    end += " ";
    end += endTime.substring(11, 13);
    end += endTime.substring(13, 16);
    end += ":00";

    period =
      " during the period " +
      start.substr(3, 3) +
      start.substr(0, 2) +
      start.substr(5, 5) +
      " until " +
      end.substr(3, 3) +
      end.substr(0, 2) +
      end.substr(5, 5);

    chartTitle += period;
  }

  for (var i = 0; i < data.length; i++) {
    dateTime.push(data[i]["date"]);
    sonia.push(parseFloat(data[i]["sonia"]));
    euribor.push(parseFloat(data[i]["euribor"]));
    sofr.push(parseFloat(data[i]["sofr"]) / 100);
  }

  var trace1 = {
    type: "scatter",
    mode: "lines",
    name: "SONIA",
    x: dateTime,
    y: sonia,
    line: { color: "#17BECF" },
  };

  var trace2 = {
    type: "scatter",
    mode: "lines",
    name: "EURIBOR",
    x: dateTime,
    y: euribor,
    line: { color: "#00008B" },
  };

  var trace3 = {
    type: "scatter",
    mode: "lines",
    name: "SOFR",
    x: dateTime,
    y: sofr,
    line: { color: "#FF0000" },
  };

  var data = [trace1, trace2, trace3];

  var layout = {
    title: chartTitle,
    xaxis: { tickmode: "auto" },
    yaxis: {
      autotick: false,
      tick0: 0.025,
      dtick: 0.025,
      ticklen: 8,
      tickcolor: "#000",
    },
  };

  Plotly.newPlot("chart", data, layout);
}

/*
CONTROL PANEL AREA JAVASCRIPT
*/
// Buttons for the control panel which can automatically filter
// based on the selected filter button

// Show the control panel when a chart is loaded
function showControlPanel() {
  document.getElementById("controlPanel").style.display = "inline";
}

// Show the range options when 'CUSTOM RANGE' is selected
function showCustomRange() {
  const range = document.querySelectorAll(".customRange");
  range.forEach((r) => {
    if (r.style.display == "inline") {
      r.style.display = "none";
    } else {
      r.style.display = "inline";
    }
  });
}

// Show the range options when 'CUSTOM RANGE' is selected
function showCustomRange() {
  const range = document.querySelectorAll(".customRange");
  range.forEach((r) => {
    if (r.style.display == "inline") {
      r.style.display = "none";
    } else {
      r.style.display = "inline";
    }
  });
}

/// DAY
function dayFilter() {
  const today = new Date(new Date().toString().split("GMT")[0] + " UTC")
    .toISOString()
    .split(".")[0];
  const oneDayAgo = new Date(
    new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toString().split("GMT")[0] +
      " UTC"
  )
    .toISOString()
    .split(".")[0];
  document.getElementById("startDateTime").value = oneDayAgo;
  document.getElementById("endDateTime").value = today;
  dateTimeFilter();
}

/// 3 Days
function day3Filter() {
  const today = new Date(new Date().toString().split("GMT")[0] + " UTC")
    .toISOString()
    .split(".")[0];
  const threeDaysAgo = new Date(
    new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toString().split("GMT")[0] +
      " UTC"
  )
    .toISOString()
    .split(".")[0];
  document.getElementById("startDateTime").value = threeDaysAgo;
  document.getElementById("endDateTime").value = today;
  dateTimeFilter();
}

/// WEEK
function weekFilter() {
  const today = new Date(new Date().toString().split("GMT")[0] + " UTC")
    .toISOString()
    .split(".")[0];
  const sevenDaysAgo = new Date(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toString().split("GMT")[0] +
      " UTC"
  )
    .toISOString()
    .split(".")[0];
  document.getElementById("startDateTime").value = sevenDaysAgo;
  document.getElementById("endDateTime").value = today;
  dateTimeFilter();
}

// 14 Days
function day14Filter() {
  const today = new Date(new Date().toString().split("GMT")[0] + " UTC")
    .toISOString()
    .split(".")[0];
  const fourteenDaysAgo = new Date(
    new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toString().split("GMT")[0] +
      " UTC"
  )
    .toISOString()
    .split(".")[0];
  document.getElementById("startDateTime").value = fourteenDaysAgo;
  document.getElementById("endDateTime").value = today;
  dateTimeFilter();
}

/// MONTH
function monthFilter() {
  const today = new Date(new Date().toString().split("GMT")[0] + " UTC")
    .toISOString()
    .split(".")[0];
  const thirtyDaysAgo = new Date(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toString().split("GMT")[0] +
      " UTC"
  )
    .toISOString()
    .split(".")[0];
  document.getElementById("startDateTime").value = thirtyDaysAgo;
  document.getElementById("endDateTime").value = today;
  dateTimeFilter();
}
