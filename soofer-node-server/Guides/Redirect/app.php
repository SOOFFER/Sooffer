<!DOCTYPE html>
<html lang="en">
<?php

// android store
if (preg_match('#android#i', $_SERVER ['HTTP_USER_AGENT'])) {
    header('Location: market://details?id=com.google.android.apps.maps');
    exit;
}

// ios
if (preg_match('#(iPad|iPhone|iPod)#i', $_SERVER ['HTTP_USER_AGENT'])) {
    header('Location: itms://itunes.apple.com/us/app/google-maps-real-time-navigation/id585027354?mt=8');
    exit;
}

// for another os
echo $_SERVER ['HTTP_USER_AGENT'];  





//mtd2
/*<?php

$iPod    = stripos($_SERVER['HTTP_USER_AGENT'],"iPod");
$iPhone  = stripos($_SERVER['HTTP_USER_AGENT'],"iPhone");
$iPad    = stripos($_SERVER['HTTP_USER_AGENT'],"iPad");
$Android = stripos($_SERVER['HTTP_USER_AGENT'],"Android");
$webOS   = stripos($_SERVER['HTTP_USER_AGENT'],"webOS");

//do something with this information
if( $iPod || $iPhone ){
    //browser reported as an iPhone/iPod touch -- do something here
    $string = "Location: <<your itunes app link>>";
    header($string);
    die();
}else if($iPad){
    //browser reported as an iPad -- do something here
    $string = "Location: <<your itunes app link>>";
    header($string);
    die();
}else if($Android){
    //browser reported as an Android device -- do something here
    $string = "Location: <<Google Play Link>>";
    header($string);
    die();
}else if($webOS){
    //browser reported as a webOS device -- do something here
    $string = "Location: <<Your Page link>>";
    header($string);
    die();
}else{
    //browser reported as PC -- do something here
    $string = "Location: <<Your Page link>>";
    header($string);
    die();
}


?>*/