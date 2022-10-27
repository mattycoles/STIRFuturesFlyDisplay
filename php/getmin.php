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
    GetMin('sonia', $c, $s, $e);
}
else if ($c[0] == 'I') {
    GetMin('euribor', $c, $s, $e);
}
else if ($c[1] == 'R') {
    GetMin('sofr', $c, $s, $e);
}

// FUNCTION TO RETURN ALL UNIQUE SONIA CONTRACTS IN JSON FORMAT
function GetMin(string $product, string $contract, string $start, string $end)
{
    $yesterday = date('m/d/y', strtotime("yesterday"));
    $min = [];
    if ($start == 'none'){
    try
    {
    $conn = OpenConnection();
    $tsql = "SELECT MIN(TRY_CAST(low AS DECIMAL(10,4))) AS MIN FROM [test].[dbo].[{$product}_test2] WHERE [low] NOT LIKE 'NULL' AND CONTRACT LIKE '{$contract}' AND CONVERT(datetime, date, 103) >= '{$yesterday}'";
    $getMin = sqlsrv_query($conn, $tsql);
    if ($getMin == FALSE)
        die(FormatErrors(sqlsrv_errors()));
    while($row = sqlsrv_fetch_array($getMin, SQLSRV_FETCH_ASSOC))
    {
        array_push($min, $row);
    }
        sqlsrv_free_stmt($getMin);
        sqlsrv_close($conn);
    }
    catch(Exception $e)
    {
        echo("Error!");
    }
    
    echo json_encode($min);
    }
    else {
        try
    {
        $conn = OpenConnection();
        $tsql = "SELECT MIN(TRY_CAST(low AS DECIMAL(10,4))) AS MIN FROM [test].[dbo].[{$product}_test2] WHERE [low] NOT LIKE 'NULL' AND CONTRACT LIKE '{$contract}' AND CONVERT(datetime, date, 103) >= '{$start}' AND CONVERT(datetime, date, 103) <= '{$end}'";
        $getMin = sqlsrv_query($conn, $tsql);
        if ($getMin == FALSE)
            die(FormatErrors(sqlsrv_errors()));
        while($row = sqlsrv_fetch_array($getMin, SQLSRV_FETCH_ASSOC))
        {
            array_push($min, $row);
        }
            sqlsrv_free_stmt($getMin);
            sqlsrv_close($conn);
        }
        catch(Exception $e)
        {
            echo("Error!");
        }
    
    echo json_encode($min);
    }
}
?>