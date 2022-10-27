<?php
// include connection setup
include 'conn.php';

//get the c parameter from URL call by JS function showContract XML Request
$c=$_GET["c"];

//get the d parameter from URL call by JS function showContract XML Request
$d=$_GET["d"];

//get the s parameter from URL call by JS function showContract XML Request
$s=$_GET["s"];

//get the e parameter from URL call by JS function showContract XML Request
$e=$_GET["e"];

// Call PHP function, c= table(product) name and d= contract name
if (substr($c, 0, 3) == 'SO3') {
    getContractDetails('sonia', $c, $d, $s, $e);
}
else if (substr($c, 0, 1) == 'I') {
    getContractDetails('euribor', $c, $d, $s, $e);
}
else if (substr($c, 0, 3) == 'SR3') {
    getContractDetails('sofr', $c, $d, $s, $e);
}

// FUNCTION TO RETURN ALL UNIQUE SONIA CONTRACTS IN JSON FORMAT
function getContractDetails(string $product, string $contract1, string $contract2, string $start, string $end)
{
    $contractDetails = [];
    $contract1Details = [];
    $contract2Details = [];

    try
    {
        $conn = OpenConnection();
        $tsql = "SELECT EXPR2.* FROM (SELECT date, soff3, contract, RowNumber, (EXPR1.RowNumber % 6) AS ROW_MOD FROM (SELECT date, soff3, contract, ROW_NUMBER() OVER ( ORDER BY date ) AS 'RowNumber' FROM [test].[dbo].[{$product}_test2] WHERE CONTRACT LIKE '{$contract1}' AND CONVERT(datetime, date, 103) >= '{$start}' AND CONVERT(datetime, date, 103) <= '{$end}')EXPR1) EXPR2 WHERE EXPR2.ROW_MOD = 0 ORDER BY CONVERT(DateTime, date, 103) ASC";
        $getInfo = sqlsrv_query($conn, $tsql);
        if ($getInfo == FALSE)
            die(FormatErrors(sqlsrv_errors()));
        $contract1InfoCount = 0;
        while($row = sqlsrv_fetch_array($getInfo, SQLSRV_FETCH_ASSOC))
        {
            $contract1InfoCount++;
            array_push($contract1Details, $row);
        }
        sqlsrv_free_stmt($getInfo);
        sqlsrv_close($conn);
    }
    catch(Exception $e)
    {
        echo("Error!");
    }

    try
    {
        $conn = OpenConnection();
        $tsql = "SELECT EXPR2.* FROM (SELECT date, soff3, contract, RowNumber, (EXPR1.RowNumber % 6) AS ROW_MOD FROM (SELECT date, soff3, contract, ROW_NUMBER() OVER ( ORDER BY date ) AS 'RowNumber' FROM [test].[dbo].[{$product}_test2] WHERE CONTRACT LIKE '{$contract2}' AND CONVERT(datetime, date, 103) >= '{$start}' AND CONVERT(datetime, date, 103) <= '{$end}')EXPR1) EXPR2 WHERE EXPR2.ROW_MOD = 0 ORDER BY CONVERT(DateTime, date, 103) ASC";
        $getInfo = sqlsrv_query($conn, $tsql);
        if ($getInfo == FALSE)
            die(FormatErrors(sqlsrv_errors()));
        $contract2InfoCount = 0;
        while($row = sqlsrv_fetch_array($getInfo, SQLSRV_FETCH_ASSOC))
        {
            $contract2InfoCount++;
            array_push($contract2Details, $row);
        }
        sqlsrv_free_stmt($getInfo);
        sqlsrv_close($conn);
    }
    catch(Exception $e)
    {
        echo("Error!");
    }

    array_push($contractDetails, $contract1Details);
    array_push($contractDetails, $contract2Details);

    echo json_encode($contractDetails);
}
?>