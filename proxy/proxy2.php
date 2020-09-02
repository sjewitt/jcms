<?php
include "includes/lib.php";
echo "start";
$_p = new proxy();
header('Content-Type: text/html');
/**
 * expose endpoints
 * */
echo $_p->doRequest($_GET);
