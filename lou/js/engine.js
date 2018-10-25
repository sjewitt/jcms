/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var engine = {
    init : function(flag){
        switch(flag){
            case 'index':
                //see https://owlcarousel2.github.io/OwlCarousel2/demos/mousewheel.html
                var owl = $(".owl-carousel");
                owl.owlCarousel({
                    'loop':true,
                    'margin':5,
                    'autoplay':true,
                    'autoplayTimeout':3000, //2 seconds
                    'autoplayHoverPause':true,
                    'responsive':{
                        0:{
                            items:1
                        },
                        480:{
                            items:2
                        },            
                        768:{
                            items:3
                        },
                        980:{
                            items:4
                        },
                        1024:{
                            items:5
                        }
                    }
                });
                //attach callback for scroll:
                //https://www.h3xed.com/programming/javascript-mouse-scroll-wheel-events-in-firefox-and-chrome for FF
                //https://stackoverflow.com/questions/33874605/mousewheel-plugin-is-not-working-when-applied-to-owl-carousel

                owl.on('DOMMouseScroll','.owl-stage',function(e){
                    if (e.originalEvent.detail > 0){ //Ch:n, IE:n, FF:y
                        owl.trigger('next.owl');
                    } else {
                        owl.trigger('prev.owl');
                    }
                    e.preventDefault();
                });
                owl.on('mousewheel','.owl-stage',function(e){
                    if (e.originalEvent.wheelDelta > 0){
                        owl.trigger('next.owl');
                    } else {
                        owl.trigger('prev.owl');
                    }
                    e.preventDefault();
                });

                this.getCMSFeed();

                break;
                
            case 'about':
                break;
        }
        
    },
    
    getCMSFeed : function(){
        console.log("getting RSS content");
         $.ajax({
             type:"GET",
             crossDomain :true,
//            url:"/cms/feed",
              url:"/cms/feed/",
//              url:"http://www.themidge.co.uk/cms/feed",
//              url:"http://www.themidge.co.uk/cms/feed/",
//              url:"https://www.themidge.co.uk/cms/feed",
//              url:"https://www.themidge.co.uk/cms/feed/",
//            url:"/static/feed.rss",
            success : function(data){
                $xml = $(data);
                var xml = $xml[0];
                var items = xml.getElementsByTagName('item');
                for(var a=0;a<items.length;a++){
                    if($('body').attr('data-wp-content') === items[a].getElementsByTagName('guid')[0].childNodes[0].nodeValue){
                        var stuff = items[a].getElementsByTagName('content:encoded')[0].childNodes[0].nodeValue;
                        /*
						console.log(stuff);
                        
                            because of CF, the WP asset urls are causing CORS errors (WP base URL is http: and changing to https: causes 
                            a redirect loop - I needed to edit the WP DB directly to get back into the admin page) 
                        
                        Therefore, pre-process the asset links found:
                        
                        var newstuff = stuff.replace(/http/gi,'https');
                        console.log(newstuff);
						*/
                        $("div.bodycontent").html(stuff);
                    }
                }
            },
            error: function(xhr, status, error) {
//                var err = eval("(" + xhr.responseText + ")");
//                alert(err.message);
            }
        });
    },
    
    switchyShifyThingie : function(){
        console.log('');
    }
    
};

