<?php
// include connection setup
include 'conn.php';

//get the d parameter from URL call by JS function showContract XML Request
$d=$_GET["d"];

//get the s parameter from URL call by JS function showContract XML Request
$s=$_GET["s"];

//get the e parameter from URL call by JS function showContract XML Request
$e=$_GET["e"];

// Call PHP function, c= table(product) name and d= contract name
overlaycontractsrange($d, $s, $e);



// FUNCTION TO RETURN ALL UNIQUE SONIA CONTRACTS IN JSON FORMAT
function overlaycontractsrange(string $contractDate, string $start, string $end)
{
    $contractDetails = [];
    
    // Get Details
    try
    {
        $conn = OpenConnection();
        $tsql = "SELECT sonia_test2.date as date, sonia_test2.soff3 as sonia,euribor_test2.soff3 as euribor, sofr_test2.soff3 as sofr  from sonia_test2 LEFT JOIN euribor_test2 ON sonia_test2.date = euribor_test2.date AND euribor_test2.contract LIKE '%{$contractDate}%' LEFT JOIN sofr_test2 ON sonia_test2.date = sofr_test2.date AND sofr_test2.contract LIKE '%{$contractDate}%' WHERE sonia_test2.contract like '%{$contractDate}%' AND CONVERT(datetime, sonia_test2.date, 103) >= '{$start}'AND CONVERT(datetime, sonia_test2.date, 103) <= '{$end}' ORDER BY CONVERT(DateTime, sonia_test2.date, 103) ASC";
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