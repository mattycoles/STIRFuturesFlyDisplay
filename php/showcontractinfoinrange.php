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
if ($c == 'SO3') {
    GetContractInfoRange('sonia', $d, $s, $e);
}
else if ($c == 'I') {
    GetContractInfoRange('euribor', $d, $s, $e);
}
else if ($c == 'SR3') {
    GetContractInfoRange('sofr', $d, $s, $e);
}


// FUNCTION TO RETURN ALL UNIQUE SONIA CONTRACTS IN JSON FORMAT
function GetContractInfoRange(string $contractId, string $contract, string $start, string $end)
{
    $contractDetails = [];
    try
    {
        $conn = OpenConnection();
        $tsql = "SELECT EXPR2.* FROM (SELECT date, soff3, sofs3, contract, high, low, RowNumber, (EXPR1.RowNumber % 6) AS ROW_MOD FROM (SELECT date, soff3, sofs3, contract, high, low, ROW_NUMBER() OVER ( ORDER BY date ) AS 'RowNumber' FROM [test].[dbo].[{$contractId}_test2] WHERE CONTRACT LIKE '{$contract}' AND CONVERT(datetime, date, 103) >= '{$start}' AND CONVERT(datetime, date, 103) <= '{$end}')EXPR1) EXPR2 WHERE EXPR2.ROW_MOD = 0 ORDER BY CONVERT(DateTime, date, 103) ASC";
        $getInfo = sqlsrv_query($conn, $tsql);
        if ($getInfo == FALSE)
            die(FormatErrors(sqlsrv_errors()));
        $contractInfoCount = 0;
        while($row = sqlsrv_fetch_array($getInfo, SQLSRV_FETCH_ASSOC))
        {
            $contractInfoCount++;
            array_push($contractDetails, $row);
        }
        sqlsrv_free_stmt($getInfo);
        sqlsrv_close($conn);
    }
    catch(Exception $e)
    {
        echo("Error!");
    }

    echo json_encode($contractDetails);
}
?>