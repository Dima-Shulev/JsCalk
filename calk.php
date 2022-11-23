<?php 
$dal = [];
$dal = $_POST;  
$string = '';
foreach($dal as $item){
    $dal[] = $item;
}
$string = $dal[0];
echo $string;
?>