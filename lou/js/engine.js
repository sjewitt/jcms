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
//             crossDomain :true,
             url:"/cms/?feed=rss2",
//             url:"/cms/feed.rss",
//            url:"/cms/feed",
              //url:"/cms/feed/", //working syntax
//              url:"http://www.themidge.co.uk/cms/feed",
//              url:"http://www.themidge.co.uk/cms/feed/",
//              url:"https://www.themidge.co.uk/cms/feed",
//              url:"https://www.themidge.co.uk/cms/feed/",
//            url:"/static/feed.rss",
            success : function(data){
//                console.log(data);
                $xml = $(data);
                var xml = $xml[0];
//                console.log(xml);
                var items = xml.getElementsByTagName('item');
//                console.log(items);
                for(var a=0;a<items.length;a++){
                    var item = items[a].getElementsByTagName('guid')[0];
                    
                    var content = items[a].getElementsByTagName('description')[0].nextElementSibling;
                    if($('body').attr('data-wp-content') === items[a].getElementsByTagName('guid')[0].childNodes[0].nodeValue){
                        var stuff = null;
                        if(items[a].getElementsByTagName('content:encoded')[0]){
                            //this selector fails in Edge
                            stuff = items[a].getElementsByTagName('content:encoded')[0].childNodes[0].nodeValue;
                        }
                        else{
                            //this hacky workaround for Edge:
                            stuff = items[a].getElementsByTagName('description')[0].nextElementSibling.childNodes[0].nodeValue;
                        }
                        console.log(stuff);
                        $("div.bodycontent").html(stuff);
                    }
                }
            },
            error: function(xhr, status, error) {
            }
        });
    },
    
    switchyShifyThingie : function(){
        console.log('');
    }
    
};

