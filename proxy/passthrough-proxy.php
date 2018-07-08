<?php
$jcms_blogspot = curl_init('http://jcms-consulting.blogspot.com/feeds/posts/default');
curl_setopt($jcms_blogspot, CURLOPT_HTTPHEADER,['"Content-type: text/xml"'] );
curl_exec($jcms_blogspot);
    
    


    
    