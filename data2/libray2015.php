<?php
   mysql_connect("localhost","root","123");
    mysql_select_db("energy");
    mysql_query("set names utf8");
    $sql="select libray01.libraynumber01,libray01.libraydate01,admin01.adminnumber01,college01.collegenumber01,canteen01.canteennumber01,teachbuild01.teachbuildnumber01 from libray01,admin01,college01,canteen01,teachbuild01 where  libray01.id=admin01.id=college01.id=canteen01.id=teachbuild01.id ";
    //echo $sql;
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