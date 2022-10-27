// CALL showcontract.php and give a contract name as a string
// this then runs the code to insert the list of contracts in a list
// in the main html are contractList div
function showContracts(str) {
  var xhttp;
  if (str == "") {
    document.getElementById("txtHint").innerHTML =
      "<b>Select a product from the above drop-down</b>";
    document.getElementById("contractList").innerHTML = "";
    document.getElementById("chart").innerHTML = "";
    document.getElementById("controlPanel").style.display = "none";
    return;
  }

  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("txtHint").innerHTML =
        "<b>Select TWO contracts and click submit to display the chart: </b>";
      document.getElementById("contractList").innerHTML = "";
      let data = JSON.parse(this.responseText);
      let checkboxList = document.getElementById("contractList");

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
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        if (item[0] == "S") {
          var name = item.substr(0, 3);
          var month = item.substr(4, 3);
          var year = item.substr(7, 2);
        } else if (item[0] == "I") {
          var name = item.substr(0, 1);
          var month = item.substr(1, 3);
          var year = item.substr(4, 3);
        }
        checkbox.id = item;
        checkbox.name = name + " " + month + year;
        checkbox.value = name + " " + month + year;

        var label = document.createElement("label");
        label.htmlFor = item;
        label.appendChild(document.createTextNode(name + " " + month + year));
        var br = document.createElement("br");
        checkboxList.appendChild(checkbox);
        checkboxList.appendChild(label);
        checkboxList.appendChild(br);
      });
      var submit = document.createElement("input");
      submit.setAttribute("type", "submit");
      submit.onclick = function () {
        loadContracts();
        showControlPanel();
      };
      submit.value = "Chart selection";
      checkboxList.appendChild(submit);

      var clear = document.createElement("input");
      clear.setAttribute("type", "submit");
      clear.onclick = function () {
        clearSelectedContracts();
        document.getElementById("controlPanel").style.display = "none";
        document.getElementById("chart").innerHTML = "";
      };
      clear.value = "CLEAR";
      checkboxList.appendChild(submit);
      checkboxList.appendChild(clear);
    }
  };
  xhttp.open("GET", "php/showcontracts.php?c=" + str, true);
  xhttp.send();
}

// This function is called when a contract listed from the above function
// is clicked. It will then call PHP, showcontractinfo.php which shows details
// for the specific contract.
function loadContracts(event) {
  let selectedItems = [];
  for (var i = 0; i < document.getElementsByTagName("input").length; i++) {
    if (
      (document.getElementsByTagName("input").item(i).type == "checkbox") &
      (document.getElementsByTagName("input").item(i).checked == true)
    ) {
      var item = document.getElementsByTagName("input").item(i);
      selectedItems.push(item.id);
    }
  }

  var variables = "c=" + selectedItems[0] + "&d=" + selectedItems[1];
  var xhttp;
  if (selectedItems.length === 0) {
    console.log("ERROR: contractArray is empty!");
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
  xhttp.open("GET", "php/priceratioplus.php?" + variables, true);
  xhttp.send();
}

// CLEAR ALL SELECTED CHECKBOX ITEMS
function clearSelectedContracts() {
  for (var i = 0; i < document.getElementsByTagName("input").length; i++) {
    if (
      (document.getElementsByTagName("input").item(i).type == "checkbox") &
      (document.getElementsByTagName("input").item(i).checked == true)
    ) {
      var item = document.getElementsByTagName("input").item(i);
      item.checked = false;
    }
  }
}

// This function is called when a loaded graph is filtered by date/time
// It will then call PHP, showcontractinfoDateTime.php which shows details
// for the specific contract during the specified date/time period
function dateTimeFilter(event) {
  // get the current active contract names
  let selectedItems = [];
  for (var i = 0; i < document.getElementsByTagName("input").length; i++) {
    if (
      (document.getElementsByTagName("input").item(i).type == "checkbox") &
      (document.getElementsByTagName("input").item(i).checked == true)
    ) {
      var item = document.getElementsByTagName("input").item(i);
      selectedItems.push(item.id);
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

  var variables =
    "c=" +
    selectedItems[0] +
    "&d=" +
    selectedItems[1] +
    "&s=" +
    start +
    "&e=" +
    end;
  var xhttp;
  if (selectedItems.length === 0) {
    console.log("ERROR: contractArray is empty!");
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
  xhttp.open("GET", "php/priceratioplusrange.php?" + variables, true);
  xhttp.send();
}

// CHART THE DATA INTO HTML
// CHART THE DATA INTO HTML

function chartData(data) {
  dateTime = [];
  contract1 = [];
  contract2 = [];
  difference = [];

  var contractName = data[0][0]["contract"];
  // Set the chart title
  chartTitle = data[0][0]["contract"] + " vs " + data[1][0]["contract"];
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

  // push data to the arrays
  for (var i = 0; i < data[0].length; i++) {
    dateTime.push(data[0][i]["date"]);
    contract1.push(parseFloat(data[0][i]["soff3"]));
    contract2.push(parseFloat(data[1][i]["soff3"]));
  }

  // work out the difference and push to an array (fly of the spread of fly's)
  for (var i = 0; i < contract1.length; i++) {
    var val = contract1[i] - contract2[i];
    difference.push(val);
  }

  var trace1 = {
    type: "scatter",
    mode: "lines",
    name: data[0][0]["contract"],
    x: dateTime,
    y: contract1,
    line: { color: "#17BECF" },
  };

  var trace2 = {
    type: "scatter",
    mode: "lines",
    name: data[1][0]["contract"],
    x: dateTime,
    y: contract2,
    line: { color: "#00008B" },
  };

  var trace3 = {
    type: "scatter",
    mode: "lines",
    name: "Difference",
    x: dateTime,
    y: difference,
    line: { color: "#00FF00" },
    visible: "legendonly",
  };

  var data = [trace1, trace2, trace3];

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
