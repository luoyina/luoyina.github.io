<?php
   mysql_connect("localhost","root","123");
    mysql_select_db("energy");
    mysql_query("set names utf8");
   $sql="select libray01.libraynumber10,libray01.libraydate10,admin01.adminnumber10,college01.collegenumber10,canteen01.canteennumber10,teachbuild01.teachbuildnumber10
                                  from teachbuild01
                                  left join libray01 on libray01.id=teachbuild01.id
                                  left join college01 on college01.id=teachbuild01.id
                                   left join admin01 on admin01.id=teachbuild01.id
                                    left join canteen01 on canteen01.id=teachbuild01.id
                                    order by libray01.id ";
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