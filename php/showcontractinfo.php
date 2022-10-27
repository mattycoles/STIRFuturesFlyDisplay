<?php
// include connection setup
include 'conn.php';

//get the c parameter from URL call by JS function showContract XML Request
$c=$_GET["c"];

//get the d parameter from URL call by JS function showContract XML Request
$d=$_GET["d"];

// Call PHP function, c= table(product) name and d= contract name
if ($c == 'SO3') {
    GetContractInfo('sonia', $d);
}
else if ($c == 'I') {
    GetContractInfo('euribor', $d);
}
else if ($c == 'SR3') {
    GetContractInfo('sofr', $d);
}

// FUNCTION TO RETURN ALL UNIQUE SONIA CONTRACTS IN JSON FORMAT
function GetContractInfo(string $contractId, string $contract)
{
    $yesterday = date('m/d/y', strtotime("yesterday"));
    $contractDetails = [];
    try
    {
        $conn = OpenConnection();
        $tsql = "SELECT * FROM [test].[dbo].[{$contractId}_test2] WHERE CONTRACT LIKE '{$contract}' AND CONVERT(datetime, date, 103) >= '{$yesterday}' ORDER BY CONVERT(DateTime, date, 103) ASC";
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