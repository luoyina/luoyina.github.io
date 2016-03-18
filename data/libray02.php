<?php
   mysql_connect("localhost","root","123");
    mysql_select_db("energy");
    mysql_query("set names utf8");
    $sql="select * from libray02";
    $result=mysql_query($sql);
    //echo $sql;
    //echo $result;
    $json=null;
    while($data=mysql_fetch_object($result)){
        //echo json_encode($data);
        $json.=json_encode($data).",";
    }
    $json=rtrim($json,",");
    echo "[".$json."]";
?>