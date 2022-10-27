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
    
    // Get Details
    try
    {
        $conn = OpenConnection();
        $tsql = "SELECT DISTINCT contract, MAX(soff3) as soff3, MAX(CONVERT(DateTime, date, 103)) from {$c}_test2 WHERE soff3 NOT LIKE 'NULL' GROUP BY contract";
        $getInfo = sqlsrv_query($conn, $tsql);
        if ($getInfo == FALSE)
            die(FormatErrors(sqlsrv_errors()));
        $contractInfoCount = 0;
        while($row = sqlsrv_fetch_array($getInfo, SQLSRV_FETCH_ASSOC))
        {
            $contractInfoCount++;
            array_push($contractYield, $row);
        }
        sqlsrv_free_stmt($getInfo);
        sqlsrv_close($conn);
    }
    catch(Exception $e)
    {
        echo("Error!");
    }
    
    echo json_encode($contractYield);
}

// FUNCTION TO RETURN ALL MAX values for each given contract for the product $c & $d in JSON
function yieldcurve2(string $c, string $d)
{
    $contractYield = [];
    $contract_c = [];
    $contract_d = [];
    // Get Details for $c
    try
    {
        $conn = OpenConnection();
        $tsql = "SELECT DISTINCT contract, MAX(soff3) as soff3, MAX(CONVERT(DateTime, date, 103)) from {$c}_test2 WHERE soff3 NOT LIKE 'NULL' GROUP BY contract";
        $getInfo = sqlsrv_query($conn, $tsql);
        if ($getInfo == FALSE)
            die(FormatErrors(sqlsrv_errors()));
        $contractInfoCount = 0;
        while($row = sqlsrv_fetch_array($getInfo, SQLSRV_FETCH_ASSOC))
        {
            $contractInfoCount++;
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
        $tsql = "SELECT DISTINCT contract, MAX(soff3) as soff3, MAX(CONVERT(DateTime, date, 103)) from {$d}_test2 WHERE soff3 NOT LIKE 'NULL' GROUP BY contract";
        $getInfo = sqlsrv_query($conn, $tsql);
        if ($getInfo == FALSE)
            die(FormatErrors(sqlsrv_errors()));
        $contractInfoCount = 0;
        while($row = sqlsrv_fetch_array($getInfo, SQLSRV_FETCH_ASSOC))
        {
            $contractInfoCount++;
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
    echo json_encode($contractYield);
}

// FUNCTION TO RETURN ALL MAX values for each given contract for the product $c & $d & $e in JSON
function yieldcurve3(string $c, string $d, string $e)
{
    $contractYield = [];
    $contract_c = [];
    $contract_d = [];
    $contract_e = [];
    // Get Details for $c
    try
    {
        $conn = OpenConnection();
        $tsql = "SELECT DISTINCT contract, MAX(soff3) as soff3, MAX(CONVERT(DateTime, date, 103)) from {$c}_test2 WHERE soff3 NOT LIKE 'NULL' GROUP BY contract";
        $getInfo = sqlsrv_query($conn, $tsql);
        if ($getInfo == FALSE)
            die(FormatErrors(sqlsrv_errors()));
        $contractInfoCount = 0;
        while($row = sqlsrv_fetch_array($getInfo, SQLSRV_FETCH_ASSOC))
        {
            $contractInfoCount++;
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
        $tsql = "SELECT DISTINCT contract, MAX(soff3) as soff3, MAX(CONVERT(DateTime, date, 103)) from {$d}_test2 WHERE soff3 NOT LIKE 'NULL' GROUP BY contract";
        $getInfo = sqlsrv_query($conn, $tsql);
        if ($getInfo == FALSE)
            die(FormatErrors(sqlsrv_errors()));
        $contractInfoCount = 0;
        while($row = sqlsrv_fetch_array($getInfo, SQLSRV_FETCH_ASSOC))
        {
            $contractInfoCount++;
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
        $tsql = "SELECT DISTINCT contract, MAX(soff3) as soff3, MAX(CONVERT(DateTime, date, 103)) from {$e}_test2 WHERE soff3 NOT LIKE 'NULL' GROUP BY contract";
        $getInfo = sqlsrv_query($conn, $tsql);
        if ($getInfo == FALSE)
            die(FormatErrors(sqlsrv_errors()));
        $contractInfoCount = 0;
        while($row = sqlsrv_fetch_array($getInfo, SQLSRV_FETCH_ASSOC))
        {
            $contractInfoCount++;
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
    echo json_encode($contractYield);
}
?>