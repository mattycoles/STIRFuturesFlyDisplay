<?php
// FUNCTION TO OPEN THE CONNECTION TO SQL
// USED BY ALL OTHER PHP FILES
// Update the serverName IP Address 
// Update the database, user id and the password.
function OpenConnection()
{
     $serverName = "tcp:192.168.0.0,1433";
     $connectionOptions = array("Database"=>"DBNAME",
         "Uid"=>"SQLUSERID", "PWD"=>"PASSWORDHERE");
     $conn = sqlsrv_connect($serverName, $connectionOptions);
     if($conn == false)
         die(FormatErrors(sqlsrv_errors()));

     return $conn;
}
?>