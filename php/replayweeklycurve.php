<?php
// include connection setup
include 'conn.php';
if (isset($_GET["c"]) && isset($_GET["d"]) && isset($_GET["e"])){
    $c=$_GET["c"];
    $d=$_GET["d"];
    $e=$_GET["e"];
    yieldcurve3($c, $d, $e); // Call PHP function
}
else if (isset($_GET["c"]) && isset($_GET["d"])){//get the d parameter from URL call by JS function showContract XML Request
    $c=$_GET["c"];
    $d=$_GET["d"];
    yieldcurve2($c, $d); // Call PHP function
}
else if (isset($_GET["c"])){//get the s parameter from URL call by JS function showContract XML Request
    $c=$_GET["c"];
    yieldcurve1($c); // Call PHP function
}



// FUNCTION TO RETURN ALL MAX values for each given contract for the product $c in JSON
function yieldcurve1(string $c)
{
    $contractYield = [];
    $contract_c = [];
    $arrayOfContractYields = [];

    $today = date('m/d/y', strtotime("today"));
    $dates = [];
    $dates2 = [];
    array_push($dates, $today);
    array_push($dates2, $today);
    for ($d = 1; $d < 52; $d++){
        $num = strval($d * 7);
        $newDate = date('m/d/y', strtotime("-{$num} days"));
        array_push($dates, $newDate);
    }
    for ($e = 1; $e < 52; $e++){
        $num2 = strval(($e * 7) + 1);
        $newDate2 = date('m/d/y', strtotime("-{$num2} days"));
        array_push($dates2, $newDate2);
    }
    // Get Details
    $j = count($dates);
    for($i = 1; $i < $j; $i++) {
        $date = $dates[$i];
        $date2 = $dates2[$i];
        // Get Details for $c
        try
        {
        $conn = OpenConnection();
        $tsql = "SELECT DISTINCT contract, MAX(soff3) as soff3, MAX(CONVERT(DateTime, date, 103)) from {$c}_test2 WHERE soff3 NOT LIKE 'NULL' AND CONVERT(datetime, date, 103) <= '$date' AND CONVERT(datetime, date, 103) >= '$date2' GROUP BY contract";
        $getInfo = sqlsrv_query($conn, $tsql);
        if ($getInfo == FALSE)
            die(FormatErrors(sqlsrv_errors()));
        while($row = sqlsrv_fetch_array($getInfo, SQLSRV_FETCH_ASSOC))
        {
            array_push($contract_c, $row);
        }
        sqlsrv_free_stmt($getInfo);
        sqlsrv_close($conn);
        }
    catch(Exception $e)
    {
        echo("Error!");
    }
    
    array_push($contractYield, $contract_c);
    array_push($arrayOfContractYields, $contractYield);
    $contract_c = [];
    $contractYield = [];
    }
    echo json_encode($arrayOfContractYields);
}

// FUNCTION TO RETURN ALL MAX values for each given contract for the product $c & $d in JSON
function yieldcurve2(string $c, string $d)
{
    $contractYield = [];
    $contract_c = [];
    $contract_d = [];
    $arrayOfContractYields = [];

    $today = date('m/d/y', strtotime("today"));
    $dates = [];
    $dates2 = [];
    array_push($dates, $today);
    array_push($dates2, $today);
    for ($f = 1; $f < 52; $f++){
        $num = strval($f * 7);
        $newDate = date('m/d/y', strtotime("-{$num} days"));
        array_push($dates, $newDate);
    }
    for ($e = 1; $e < 52; $e++){
        $num2 = strval(($e * 7) + 1);
        $newDate2 = date('m/d/y', strtotime("-{$num2} days"));
        array_push($dates2, $newDate2);
    }
    // Get Details
    $j = count($dates);
    for($i = 1; $i < $j; $i++) {
        $date = $dates[$i];
        $date2 = $dates2[$i];
        // Get Details for $c
        try
        {
        $conn = OpenConnection();
        $tsql = "SELECT DISTINCT contract, MAX(soff3) as soff3, MAX(CONVERT(DateTime, date, 103)) from {$c}_test2 WHERE soff3 NOT LIKE 'NULL' AND CONVERT(datetime, date, 103) <= '$date' AND CONVERT(datetime, date, 103) >= '$date2' GROUP BY contract";
        $getInfo = sqlsrv_query($conn, $tsql);
        if ($getInfo == FALSE)
            die(FormatErrors(sqlsrv_errors()));
        while($row = sqlsrv_fetch_array($getInfo, SQLSRV_FETCH_ASSOC))
        {
            array_push($contract_c, $row);
        }
        sqlsrv_free_stmt($getInfo);
        sqlsrv_close($conn);
        }
    catch(Exception $e)
    {
        echo("Error!");
    }
    // Get Details for $d
        try
        {
        $conn = OpenConnection();
        $tsql = "SELECT DISTINCT contract, MAX(soff3) as soff3, MAX(CONVERT(DateTime, date, 103)) from {$d}_test2 WHERE soff3 NOT LIKE 'NULL' AND CONVERT(datetime, date, 103) <= '$date' AND CONVERT(datetime, date, 103) >= '$date2' GROUP BY contract";
        $getInfo = sqlsrv_query($conn, $tsql);
        if ($getInfo == FALSE)
            die(FormatErrors(sqlsrv_errors()));
        while($row = sqlsrv_fetch_array($getInfo, SQLSRV_FETCH_ASSOC))
        {
            array_push($contract_d, $row);
        }
        sqlsrv_free_stmt($getInfo);
        sqlsrv_close($conn);
        }
    catch(Exception $e)
    {
        echo("Error!");
    }
    array_push($contractYield, $contract_c);
    array_push($contractYield, $contract_d);
    array_push($arrayOfContractYields, $contractYield);
    $contract_c = [];
    $contract_d = [];
    $contractYield = [];
    }
    echo json_encode($arrayOfContractYields);
}

// FUNCTION TO RETURN ALL MAX values for each given contract for the product $c & $d in JSON
function yieldcurve3(string $c, string $d, string $e)
{
    $contractYield = [];
    $contract_c = [];
    $contract_d = [];
    $contract_e = [];
    $arrayOfContractYields = [];

    $today = date('m/d/y', strtotime("today"));
    $dates = [];
    $dates2 = [];
    array_push($dates, $today);
    array_push($dates2, $today);
    for ($f = 1; $f < 52; $f++){
        $num = strval($f * 7);
        $newDate = date('m/d/y', strtotime("-{$num} days"));
        array_push($dates, $newDate);
    }
    for ($g = 1; $g < 52; $g++){
        $num2 = strval(($g * 7) + 1);
        $newDate2 = date('m/d/y', strtotime("-{$num2} days"));
        array_push($dates2, $newDate2);
    }
    // Get Details
    $j = count($dates);
    for($i = 1; $i < $j; $i++) {
        $date = $dates[$i];
        $date2 = $dates2[$i];
        // Get Details for $c
    try
    {
        $conn = OpenConnection();
        $tsql = "SELECT DISTINCT contract, MAX(soff3) as soff3, MAX(CONVERT(DateTime, date, 103)) from {$c}_test2 WHERE soff3 NOT LIKE 'NULL' AND CONVERT(datetime, date, 103) <= '$date' AND CONVERT(datetime, date, 103) >= '$date2' GROUP BY contract";
        $getInfo = sqlsrv_query($conn, $tsql);
        if ($getInfo == FALSE)
            die(FormatErrors(sqlsrv_errors()));
        while($row = sqlsrv_fetch_array($getInfo, SQLSRV_FETCH_ASSOC))
        {
            array_push($contract_c, $row);
        }
        sqlsrv_free_stmt($getInfo);
        sqlsrv_close($conn);
    }
    catch(Exception $e)
    {
        echo("Error!");
    }
    // Get Details for $d
    try
    {
        $conn = OpenConnection();
        $tsql = "SELECT DISTINCT contract, MAX(soff3) as soff3, MAX(CONVERT(DateTime, date, 103)) from {$d}_test2 WHERE soff3 NOT LIKE 'NULL' AND CONVERT(datetime, date, 103) <= '$date' AND CONVERT(datetime, date, 103) >= '$date2' GROUP BY contract";
        $getInfo = sqlsrv_query($conn, $tsql);
        if ($getInfo == FALSE)
            die(FormatErrors(sqlsrv_errors()));
        while($row = sqlsrv_fetch_array($getInfo, SQLSRV_FETCH_ASSOC))
        {
            array_push($contract_d, $row);
        }
        sqlsrv_free_stmt($getInfo);
        sqlsrv_close($conn);
    }
    catch(Exception $e)
    {
        echo("Error!");
    }
    // Get Details for $e
    try
    {
        $conn = OpenConnection();
        $tsql = "SELECT DISTINCT contract, MAX(soff3) as soff3, MAX(CONVERT(DateTime, date, 103)) from {$e}_test2 WHERE soff3 NOT LIKE 'NULL' AND CONVERT(datetime, date, 103) <= '$date' AND CONVERT(datetime, date, 103) >= '$date2' GROUP BY contract";
        $getInfo = sqlsrv_query($conn, $tsql);
        if ($getInfo == FALSE)
            die(FormatErrors(sqlsrv_errors()));
        while($row = sqlsrv_fetch_array($getInfo, SQLSRV_FETCH_ASSOC))
        {
            array_push($contract_e, $row);
        }
        sqlsrv_free_stmt($getInfo);
        sqlsrv_close($conn);
    }
    catch(Exception $e)
    {
        echo("Error!");
    }
    array_push($contractYield, $contract_c);
    array_push($contractYield, $contract_d);
    array_push($contractYield, $contract_e);
    array_push($arrayOfContractYields, $contractYield);
    $contract_c = [];
    $contract_d = [];
    $contract_e = [];
    $contractYield = [];
    }
    echo json_encode($arrayOfContractYields);
}
?>