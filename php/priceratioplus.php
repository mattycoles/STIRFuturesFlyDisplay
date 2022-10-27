<?php
// include connection setup
include 'conn.php';

//get the c parameter from URL call by JS function showContract XML Request
$c=$_GET["c"];

//get the d parameter from URL call by JS function showContract XML Request
$d=$_GET["d"];

// Call PHP function, c= table(product) name and d= contract name
if (substr($c, 0, 3) == 'SO3') {
    getContractDetails('sonia', $c, $d);
}
else if (substr($c, 0, 1) == 'I') {
    getContractDetails('euribor', $c, $d);
}
else if (substr($c, 0, 3) == 'SR3') {
    getContractDetails('sofr', $c, $d);
}

// FUNCTION TO RETURN ALL UNIQUE SONIA CONTRACTS IN JSON FORMAT
function getContractDetails(string $product, string $contract1, string $contract2)
{
    $yesterday = date('m/d/y', strtotime("yesterday"));
    $contractDetails = [];
    $contract1Details = [];
    $contract2Details = [];

    try
    {
        $conn = OpenConnection();
        $tsql = "SELECT * FROM [test].[dbo].[{$product}_test2] WHERE CONTRACT LIKE '{$contract1}' AND CONVERT(datetime, date, 103) >= '{$yesterday}' ORDER BY CONVERT(DateTime, date, 103) ASC";
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
        $tsql = "SELECT * FROM [test].[dbo].[{$product}_test2] WHERE CONTRACT LIKE '{$contract2}' AND CONVERT(datetime, date, 103) >= '{$yesterday}' ORDER BY CONVERT(DateTime, date, 103) ASC";
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