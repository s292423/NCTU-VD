<?php
    require 'conDB.php';
    $x = new DBClass();

    // $date = ["2018-01-01", "2018-01-01"];
    // $vdid = ["nfbVD-N1-N--0.100-M-LOOP"];
    $date = $_POST['date'];
    $vdid = $_POST['vdid'];
    
    $stack = array();
    $stack1 = array();
        // echo $value."\n";
    foreach ($date as $value1){
        $str_sec = explode("-",$value1);
        array_push($stack,$str_sec[0]."-".$str_sec[1],$str_sec[2]);
        array_push($stack1,$str_sec[0],$str_sec[1],$str_sec[2]);
    }
    // $stack[0][2]為年月, $stack[1][3]為日期
    // $stack1[0][3]為年, $stack1[1][4]為月, $stack1[2][5]為日

    if ($stack[0]==$stack[2]){
        foreach ($vdid as $value){
            $table = $stack[0]."-".$value;
            $temp = str_replace("/","-",$stack[0]);
            $startday = $temp."-".$stack[1];
            $howmanyday = (int)$stack[3]-(int)$stack[1];
            $x->queryforsinglemonth($table,$startday,$howmanyday);
        }
        if(count($vdid)>1){
            $x->data_clear_double();
        }else{
            $x->data_clear();
        }
    }else{
        foreach ($vdid as $value){
            $howmanymonth = (int)$stack1[4]-(int)$stack1[1];
            $year = $stack1[0]."-".$stack1[1];
            $firstday = $stack1[2];
            $startday = $stack1[0]."-".$stack1[1]."-".$stack1[2];
            $endday = $stack1[0]."-".$stack1[4]."-".$stack1[5];
            $howmanyday = (int)$stack1[5]-1;
            $x->queryformutlimonth($value,$year,$firstday,$startday,"-01",$howmanymonth,$howmanyday);
        }
        if(count($vdid)>1){
            $x->data_clear_double();
        }else{
            $x->data_clear();
        }
    }
    echo json_encode($x->tt);
    $x->clear();
?>