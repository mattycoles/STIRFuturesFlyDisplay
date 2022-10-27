<?php
// include connection setup
include 'conn.php';

//get the c parameter from URL call by JS function loadContract XML Request
$c=$_GET["c"];

// Call the PHP function, c= table(product) name
if ($c == 'sonia') {
    GetContracts('sonia');
}
else if ($c == 'euribor') {
    GetContracts('euribor');
}
else if ($c == 'sofr') {
    GetContracts('sofr');
}





// FUNCTION TO RETURN ALL UNIQUE SONIA CONTRACTS IN JSON FORMAT
function GetContracts(string $contract)
{
    $contracts = [];
    $yesterday = date('m/d/y', strtotime("yesterday"));
        try
        {
            $conn = OpenConnection();
            $tsql = "SELECT DISTINCT [CONTRACT]
            FROM [test].[dbo].[{$contract}_test2] WHERE CONVERT(datetime, date, 103) >= '{$yesterday}'";
            $getContracts = sqlsrv_query($conn, $tsql);
            if ($getContracts == FALSE)
                die(FormatErrors(sqlsrv_errors()));
            $contractCount = 0;
            while($row = sqlsrv_fetch_array($getContracts, SQLSRV_FETCH_ASSOC))
            {
                //echo($row['CONTRACT']);
                //echo("<br/>");
                $contractCount++;
                array_push($contracts, $row['CONTRACT']);
            }
            sqlsrv_free_stmt($getContracts);
            sqlsrv_close($conn);
        }
        catch(Exception $e)
        {
            echo("Error!");
        }
    
    echo json_encode($contracts);
}
?>