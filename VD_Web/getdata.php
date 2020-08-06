// I don't want to use this!!
// use node.js please veve

<?php
require 'C:/composer/vendor/autoload.php';
// Configuration

// Connect
$manager = new MongoDB\Driver\Manager("mongodb://localhost:27017");
// var_dump($manager);

// Insert
// $bulk = new MongoDB\Driver\BulkWrite(['ordered' => true]);
// $bulk->insert(['id' => 6, 'hello' => 'hi', 'name' => 'cindy']);
// $result = $manager->executeBulkWrite('OneYear.testCollection', $bulk);


// Query
$filter = [
    'datacollecttime' => "2018-11-01 00:00:00",
    'vdid' => "nfbVD-N1-S-0.990-N-LOOP",
    // // ['$regex' => '/.2018-11-36./']
    'speed' => ['$gt' => 60],
];
$options = [
    'projection' => ['_id' => 0],
];
$query = new MongoDB\Driver\Query($filter, $options);
$rows = $manager->executeQuery('bin.unDivide', $query); // $mongo contains the connection object to MongoDB

foreach($rows as $r){
   print_r($r);
}

?>