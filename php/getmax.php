<?php
// include connection setup
include 'conn.php';

//get the c parameter from URL call by JS function showContract XML Request
$c=$_GET["c"];

//get the s parameter from URL call by JS function showContract XML Request
$s=$_GET["s"];

//get the e parameter from URL call by JS function showContract XML Request
$e=$_GET["e"];

// Call PHP function, c= table(product) name and d= contract name
if ($c[1] == 'O') {
    GetMax('sonia', $c, $s, $e);
}
else if ($c[0] == 'I') {
    GetMax('euribor', $c, $s, $e);
}
else if ($c[1] == 'R') {
    GetMax('sofr', $c, $s, $e);
}

// FUNCTION TO RETURN ALL UNIQUE SONIA CONTRACTS IN JSON FORMAT
function GetMax(string $product, string $contract, string $start, string $end)
{
    $yesterday = date('m/d/y', strtotime("yesterday"));
    $max = [];
    if ($start == 'none'){
    try
    {
    $conn = OpenConnection();
    $tsql = "SELECT MAX(TRY_CAST(high AS DECIMAL(10,4))) AS MAX FROM [test].[dbo].[{$product}_test2] WHERE [high] NOT LIKE 'NULL' AND CONTRACT LIKE '{$contract}' AND CONVERT(datetime, date, 103) >= '{$yesterday}'";
    $getMax = sqlsrv_query($conn, $tsql);
    if ($getMax == FALSE)
        die(FormatErrors(sqlsrv_errors()));
    while($row = sqlsrv_fetch_array($getMax, SQLSRV_FETCH_ASSOC))
    {
        array_push($max, $row);
    }
        sqlsrv_free_stmt($getMax);
        sqlsrv_close($conn);
    }
    catch(Exception $e)
    {
        echo("Error!");
    }
    
    echo json_encode($max);
    }
    else {
        try
    {
        $conn = OpenConnection();
        $tsql = "SELECT MAX(TRY_CAST(high AS DECIMAL(10,4))) AS MAX FROM [test].[dbo].[{$product}_test2] WHERE [high] NOT LIKE 'NULL' AND CONTRACT LIKE '{$contract}' AND CONVERT(datetime, date, 103) >= '{$start}' AND CONVERT(datetime, date, 103) <= '{$end}'";
        $getMax = sqlsrv_query($conn, $tsql);
        if ($getMax == FALSE)
            die(FormatErrors(sqlsrv_errors()));
        while($row = sqlsrv_fetch_array($getMax, SQLSRV_FETCH_ASSOC))
        {
            array_push($max, $row);
        }
            sqlsrv_free_stmt($getMax);
            sqlsrv_close($conn);
        }
        catch(Exception $e)
        {
            echo("Error!");
        }
    
    echo json_encode($max);
    }
}
?>