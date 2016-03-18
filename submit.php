<?php
/**
*php的返回
*/
    sleep(1);
    //echo "[{'username':'tom'},{'username':'868 panyuroad'}]";
    //phpinfo();
    //链接mysql服务器
    mysql_connect("localhost","root","123");
    //选择数据库
    mysql_select_db("energy");
    //设置支持中文字符，设置操作数据库的字符集;
    mysql_query("set names utf8");
    //执行sql语句，返回结果集
    $sql="select *
             from user
             where username='".$_POST['username']."'
             and password='".$_POST['psw']."'";
       $result=mysql_query($sql);
       $data=mysql_fetch_array($result);
    if($data){
            echo "ok";
        }else{
        echo "failed";
        }
?>