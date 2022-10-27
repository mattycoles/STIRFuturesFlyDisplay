// CALL showcontract.php and give a contract name as a string
// this then runs the code to insert the list of contracts in a list
// in the main html are contractList div
function showContracts(str) {
  var xhttp;
  if (str == "") {
    document.getElementById("txtHint").innerHTML =
      "<b>Select a product from the above drop-down</b>";
    document.getElementById("contractList").innerHTML = "";
    //document.getElementById("highLow").innerHTML = "";
    document.getElementById("chart").innerHTML = "";
    document.getElementById("controlPanel").style.display = "none";
    return;
  }

  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("txtHint").innerHTML =
        "<b>Select a contract to display chart: </b>";
      document.getElementById("contractList").innerHTML = "";
      let data = JSON.parse(this.responseText);
      let list = document.getElementById("contractList");

      // sort the data so it is in YEAR-MONTH order instead
      // of SQL order MONTH-YEAR
      data.sort(function (x, y) {
        // use index to determine which months come first
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
        if (x.substring(0, 1) == "S") {
          var m1 = x.substr(4, 3);
          var y1 = x.substr(7, 2);
          var m2 = y.substr(4, 3);
          var y2 = y.substr(7, 2);
        } else if (x.substring(0, 1) == "I") {
          var m1 = x.substr(2, 3);
          var y1 = x.substr(5, 2);
          var m2 = y.substr(2, 3);
          var y2 = y.substr(5, 2);
        }

        return y1 - y2 || months.indexOf(m1) - months.indexOf(m2);
      });

      data.forEach((item) => {
        let li = document.createElement("li");
        if (item[0] == "S") {
          var name = item.substr(0, 3);
          var month = item.substr(4, 3);
          var year = item.substr(7, 2);
        } else if (item[0] == "I") {
          var name = item.substr(0, 1);
          var month = item.substr(1, 3);
          var year = item.substr(4, 3);
        }
        li.innerText = name + " " + month + year;
        li.setAttribute("id", item);
        // Create a function which adds an event listener
        // to each contract item that is listed...
        // If a date/time filter is active, then call a different function
        li.addEventListener("click", function clickContract(event) {
          const dateFilter = document.getElementById("endDateTime");
          if (!document.getElementById("endDateTime").value) {
            loadContract(event);
          } else {
            dateTimeFilter(event);
          }
          setActive(this);
          showControlPanel();
        });
        list.appendChild(li);
      });
      // Load the high and low data for last 24 hours
      highLow();
    }
  };
  xhttp.open("GET", "php/showcontracts.php?c=" + str, true);
  xhttp.send();
}

// This function is called when a contract listed from the above function
// is clicked. It will then call PHP, showcontractinfo.php which shows details
// for the specific contract.
function loadContract(event) {
  var contract = event.srcElement.id;
  const contractArray = contract.split(" ");
  var variables = "c=" + contractArray[0] + "&d=" + contract;

  var xhttp;
  if (contractArray.length === 0) {
    console.log("ERROR: contractArray is empty!");
    document.getElementById("contractDetails").innerHTML =
      "ERROR: contractArray is empty!";
  }
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("contractDetails").innerHTML = "";
      let data = JSON.parse(this.responseText);
      let list = document.getElementById("contractDetails");
      chartData(data);
    }
  };
  xhttp.open("GET", "php/showcontractinfo.php?" + variables, true);
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
      var activeContract = li[i].id;
    }
  }
  return activeContract;
}

// This function is called when a loaded graph is filtered by date/time
// It will then call PHP, showcontractinfoDateTime.php which shows details
// for the specific contract during the specified date/time period
function dateTimeFilter(event) {
  showHighLowValues();
  // get the current active contract name
  if (event) {
    var contract = event.srcElement.id;
  } else {
    var li = document.getElementsByTagName("li");
    for (var i = 0; i < li.length; i++) {
      if (li[i].classList == "active") {
        var contract = li[i].id;
      }
    }
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

  const contractArray = contract.split(" ");
  var variables =
    "c=" + contractArray[0] + "&d=" + contract + "&s=" + start + "&e=" + end;
  var xhttp;
  if (contractArray.length === 0) {
    console.log("ERROR: contractArray is empty!");
  }
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("contractDetails").innerHTML = "";
      let data = JSON.parse(this.responseText);
      let list = document.getElementById("contractDetails");
      chartData(data);
      highLow();
    }
  };
  xhttp.open("GET", "php/showcontractinfoinrange.php?" + variables, true);
  xhttp.send();
}

// CHART THE DATA INTO HTML
function chartData(data) {
  const contractName = data[0]["contract"];

  dateTime = [];
  soff3 = [];
  sofs3 = [];
  high = [];
  low = [];

  for (var i = 0; i < data.length; i++) {
    dateTime.push(data[i]["date"]);
    soff3.push(parseFloat(data[i]["soff3"]));
    sofs3.push(parseFloat(data[i]["sofs3"]));
    high.push(parseFloat(data[i]["high"]));
    low.push(parseFloat(data[i]["low"]));
  }

  var trace1 = {
    type: "scatter",
    mode: "lines",
    name: "FPR",
    x: dateTime,
    y: soff3,
    line: { color: "#17BECF" },
  };

  var trace2 = {
    type: "scatter",
    mode: "lines",
    name: "SPR",
    x: dateTime,
    y: sofs3,
    line: { color: "#7F7F7F" },
  };

  var trace3 = {
    type: "scatter",
    mode: "lines",
    name: "FPR high",
    x: dateTime,
    y: high,
    line: { color: "#00FF00" },
    visible: "legendonly",
  };

  var trace4 = {
    type: "scatter",
    mode: "lines",
    name: "FPR low",
    x: dateTime,
    y: low,
    line: { color: "#FF0000" },
    visible: "legendonly",
  };

  var data = [trace1, trace2, trace3, trace4];

  if (contractName.substr(0, 2) == "SO") {
    var layout = {
      title: contractName,
      xaxis: { tickmode: "auto" },
      yaxis: {
        autotick: false,
        tick0: 0.005,
        dtick: 0.005,
        ticklen: 8,
        tickcolor: "#000",
      },
    };
  } else if (contractName.substr(0, 2) == "SR") {
    var layout = {
      title: contractName,
      xaxis: { tickmode: "auto" },
      yaxis: {
        autotick: false,
        tick0: 0.25,
        dtick: 0.25,
        ticklen: 8,
        tickcolor: "#000",
      },
    };
  } else if (contractName.substr(0, 1) == "I") {
    var layout = {
      title: contractName,
      xaxis: { tickmode: "auto" },
      yaxis: {
        autotick: false,
        tick0: 0.005,
        dtick: 0.005,
        ticklen: 8,
        tickcolor: "#000",
      },
    };
  }

  Plotly.newPlot("chart", data, layout);
}

// Show the high/low value for the current contract below the chart
function showHighLowValues(el) {
  if (!el) {
    var li = document.getElementsByTagName("li");
    for (var i = 0; i < li.length; i++) {
      if (li[i].classList == "active") {
        var contract = li[i].id;
        if (contract[0] == "I") {
          var contract = contract.substr(0, 7);
        } else if (contract[0] == "S") {
          var contract = contract.substr(0, 9);
        }
      }
    }
  } else {
    var contract = el.id;
    if (contract[0] == "I") {
      var contract = contract.substr(0, 7);
    } else if (contract[0] == "S") {
      var contract = contract.substr(0, 9);
    }
  }

  // Add the period to the text above the high/low table
  // THIS IS MODIFIED FROM highLow() FUNCTION BELOW
  var period;
  var start = document.getElementById("startDateTime");
  var end = document.getElementById("endDateTime");
  if (!start.value) {
    var high;
    var low;
    var li = document.getElementsByTagName("li");
    for (r = 0; r < li.length; r++) {
      if (
        document.getElementById("highLowTable").rows[r].cells[0].innerHTML ==
        contract
      ) {
        high =
          document.getElementById("highLowTable").rows[r].cells[1].innerHTML;
        low =
          document.getElementById("highLowTable").rows[r].cells[2].innerHTML;
      }
    }
    period = "the last 24 hours";
    document.getElementById("highLowValue").innerHTML =
      "<b>" +
      contract +
      " HIGH: " +
      high +
      " LOW: " +
      low +
      " for " +
      period +
      "</b>";
  } else {
    var high;
    var low;
    var li = document.getElementsByTagName("li");
    for (r = 0; r < li.length; r++) {
      if (
        document.getElementById("highLowTable").rows[r].cells[0].innerHTML ==
        contract
      ) {
        high =
          document.getElementById("highLowTable").rows[r].cells[1].innerHTML;
        low =
          document.getElementById("highLowTable").rows[r].cells[2].innerHTML;
      }
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

    period =
      "the period " +
      start.substr(3, 3) +
      start.substr(0, 2) +
      start.substr(5, 5) +
      " until " +
      end.substr(3, 3) +
      end.substr(0, 2) +
      end.substr(5, 5);

    document.getElementById("highLowValue").innerHTML =
      "<b>" +
      contract +
      " HIGH: " +
      high +
      " LOW: " +
      low +
      " for " +
      period +
      "</b>";
  }
}

/*
SCRIPTS RESPONSIBLE FOR HIGH/LOW TABLE
*/

// Show the table panel when a product is selected
function showHighLowTable() {
  document.getElementById("highLowTable").style.display = "inline";
  document.getElementById("tablePeriod").style.display = "inline";
}

// Show the high/low for the last 24 hours (or given date)
// in the highLow div table
function highLow() {
  showHighLowTable();
  var li = document.getElementsByTagName("li");
  var contractList = [];
  var idList = [];
  for (var i = 0; i < li.length; i++) {
    contractList.push(li[i].innerHTML);
  }
  for (var i = 0; i < li.length; i++) {
    idList.push(li[i].id);
  }
  document.getElementById("highLowTable").innerHTML =
    "<tr><th>Contract</th><th>High</th><th>Low</th></tr>";
  var table = document.getElementById("highLowTable");
  var period;
  var start = document.getElementById("startDateTime");
  var end = document.getElementById("endDateTime");
  if (!start.value) {
    period = "the last 24 hours";
    document.getElementById("tablePeriod").innerHTML =
      "<b>High and low data for " + period + "</b>";

    for (i = 1; i < contractList.length; i++) {
      var row = highLowTable.insertRow(i);
      row.insertCell(0).innerHTML = contractList[i];
      row.id = idList[i];
      row.insertCell(1).innerHTML = "";
      row.insertCell(2).innerHTML = "";
      getMin(idList[i], "none", "none");
      getMax(idList[i], "none", "none");
    }
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
      "the period " +
      start.substr(3, 3) +
      start.substr(0, 2) +
      start.substr(5, 5) +
      " until " +
      end.substr(3, 3) +
      end.substr(0, 2) +
      end.substr(5, 5);
    document.getElementById("tablePeriod").innerHTML =
      "High and low data for " + period;

    for (i = 1; i < contractList.length; i++) {
      var row = highLowTable.insertRow(i);
      row.insertCell(0).innerHTML = contractList[i];
      row.id = idList[i];
      row.insertCell(1).innerHTML = "";
      row.insertCell(2).innerHTML = "";
      getMin(idList[i], start, end);
      getMax(idList[i], start, end);
    }
  }
}

// Function which calls getmin.php to query SQL and returns the
// min value for the given contract and range
function getMin(contract, start, end) {
  var variables = "c=" + contract + "&s=" + start + "&e=" + end;

  var xhttp;
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      minData = JSON.parse(this.responseText);
      var min = minData[0]["MIN"];
      var table = document.getElementById("highLowTable");
      for (var r = 1, n = table.rows.length; r < n; r++) {
        if (table.rows[r].id == contract) {
          table.rows[r].cells[2].innerHTML = min;
        }
      }
    }
  };
  xhttp.open("GET", "php/getmin.php?" + variables, true);
  xhttp.send();
}

// Function which calls getmax.php to query SQL and returns the
// max value for the given contract and range
function getMax(contract, start, end) {
  var variables = "c=" + contract + "&s=" + start + "&e=" + end;

  var xhttp;
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      maxData = JSON.parse(this.responseText);
      var max = maxData[0]["MAX"];
      var table = document.getElementById("highLowTable");
      for (var r = 1, n = table.rows.length; r < n; r++) {
        if (table.rows[r].id == contract) {
          table.rows[r].cells[1].innerHTML = max;
        }
      }
    }
  };
  xhttp.open("GET", "php/getmax.php?" + variables, true);
  xhttp.send();
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
