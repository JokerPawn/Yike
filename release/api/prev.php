<?php
    //$today = strtotime('-1day', time());
    //$older = date('Y-m-d', $today);


    //$old = $_GET['old'];
    $cut = $_GET['cut'];
    $prev = strtotime($cut.'day', time());
    $prev = date('Y-m-d', $prev);

    $prevUrl = 'https://moment.douban.com/api/stream/date/'.$prev.'?alt=json&apikey=0bcf52793711959c236df76ba534c0d4&app_version=1.7.4&douban_udid=d623045db9fcb0d5243174c1bf1a675f887047c0&format=full&udid=9a34d8b038ff38971050199b0c5ee9c60c6d1ca3&version=6';

    $prevResult = file_get_contents($prevUrl);

    $prevResult = json_decode($prevResult , true);

    $result = array('prev' => $prevResult);

    echo json_encode($result);
 