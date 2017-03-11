//TODO: Push JSON 'title' on to path
//http://www.ajaxload.info/ for loading gifs!
/*
 * "banner_scale" : "anchor", - sort out an adaptive fit or shrink
 * @type type
 * 
 * TODO: Add handler to inject link based on linkID to element?
 * 
 */
var controller = {
    
//    TYPE_HOME : "HOME",
//    TYPE_LANDING :"LANDING",
//    TYPE_CONTENT : "CONTENT",
//    TYPE_CUSTOM : "CUSTOM",
//    TYPE_DEFAULT : this.TYPE_CONTENT,
//    
//    defaultPage : "index.html",
//    currentPage : null,
//    currentPath : [],
//    data : null,
//    dataOk : false,
    //loading : "/images/icons/ajax-loader-2.gif",
    
    //wufoo:
    wufoo_dialog_width : window.innerWidth * 0.9,
    wufoo_dialog_height : window.innerHeight * 0.9,
    
    
    init : function(){
        this.injectWufooForm();
        this.injectTweets();
        //this.injectObtreeForum();
        this.injectBlogspot();
        //this.switchTransparency();
        //this.loadData();
        //this.loadSearchBanner();     //AJAX load
        //this.loadBannerImages();     //from JSON TODO
        //this.loadCommonElements();
    },
    
    injectWufooForm : function(){
        /*
        * insert wufoo form:
        */
       var wufoo_wrapper = document.createElement("div");
       wufoo_wrapper.setAttribute("id","wufoo-z157nixr1oirgiy");

       //lazy...
       var formStructure = '<div class="ltr"><form id="form1" name="form1" class="wufoo topLabel page" accept-charset="UTF-8" autocomplete="off" enctype="multipart/form-data" method="post" novalidate action="https://jcmssilas.wufoo.com/forms/z157nixr1oirgiy/#public"><ul><li id="foli107" class="notranslate"><label class="desc" id="title107" for="Field107">Name</label><div><input id="Field107" name="Field107" type="text" class="field text large" value="" maxlength="255" tabindex="1" onkeyup=""/> </div></li><li id="foli3" class="notranslate"><label class="desc" id="title3" for="Field3">Email<span id="req_3" class="req">*</span></label><div><input id="Field3" name="Field3" type="email" spellcheck="false" class="field text large" value="" maxlength="255" tabindex="2" required /></div></li><li id="foli4" class="notranslate"><label class="desc" id="title4" for="Field4">Your message</label><div><textarea id="Field4" name="Field4" class="field textarea small" spellcheck="true" rows="10" cols="50" tabindex="3" onkeyup=""></textarea></div></li> <li class="buttons"><div><input id="saveForm" name="saveForm" class="btTxt submit" type="submit" value="Submit"/></div></li><li class="hide"><label for="comment">Do Not Fill This Out</label><textarea name="comment" id="comment" rows="1" cols="1"></textarea><input type="hidden" id="idstamp" name="idstamp" value="4OmMIKthKce7wuHEVj62nALcj1oJFs3sD8tfYS/mWgU=" /></li></ul></form></div>';

       //add form:
       wufoo_wrapper.innerHTML = formStructure;

       //calculate and set iframe size:
       $("#wufoo_iframe").css({
           width : (controller.wufoo_dialog_width - 40) + "px",
           height : (controller.wufoo_dialog_height - 80) + "px"
       });

       //add to panel:
       $("#wufoo_contact_form > .panel-text").append(wufoo_wrapper);
       $('form#form1 input:submit').click(function(){

           $("#_dialog").css({
               "display":""
           }).dialog({
              width: controller.wufoo_dialog_width,
              height: controller.wufoo_dialog_height
           });

           $('form#form1').attr("target","wufoo_iframe");
       });
    },

    injectTweets : function(){
        /*
         * Inject the tweets:
         */
        var twitter_code = '<a class="twitter-timeline" data-height="400" href="https://twitter.com/JCMSConsulting">Tweets by JCMSConsulting</a> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>';
        $("#twitter_widget").html(twitter_code);
    },

    injectObtreeForum : function(){
        /*
        * Inject the Obtree forum widget:
        */
        var obtree_forum_code = '<iframe id="forum_embed" src="javascript:void(0)"  scrolling="no"  frameborder="0"  width="900"  height="700"></iframe><script type="text/javascript">document.getElementById(\'forum_embed\').src = \'https://groups.google.com/forum/embed/?place=forum/jcms-obtree-users-group\'  + \'&showsearch=true&showpopout=true&showtabs=false\'  + \'&parenturl=\' + encodeURIComponent(window.location.href);</script>';
        $("#obtree_forum").html(obtree_forum_code);
    },
    
    injectBlogspot : function(){
        /*
         * Add the blogspot stuff:
         */
        $("#blogspot div.panel-text").css({"overflow":"auto","height":"300px"});

        //points at: http://jcms-consulting.blogspot.com/feeds/posts/default
        $.ajax("/proxy/Passthrough-proxy.aspx",{
            success:function(data){ //changes context for data
                var _out = "";
                var title = data.getElementsByTagName("title")[0].firstChild.nodeValue;

                _out += "<h3><a href='http://jcms-consulting.blogspot.com' target='_blank' title='JCMS Blog'><img src='/images/Blogger.svg.png' alt='Blogger logo' style='width:30px;vertical-align:middle;padding-right:10px;padding-bottom:5px;' /></a>"+title+"</h3>";
                var entries = data.getElementsByTagName("entry");
                _out += "<ul>";
                for(var a=entries.length-1;a>=0;a--){
                    var entryText = entries[a].getElementsByTagName("title")[0].firstChild.nodeValue;

                    //var _date = new Date(Date.parse(date));
                    var published = controller.formatBlogDate(new Date(Date.parse(entries[a].getElementsByTagName("published")[0].firstChild.nodeValue))); //a Date
                    var entryUrl;

                    $(entries[a]).find('link').each(function(){
                        if($(this).attr("rel") === "alternate"){
                            entryUrl = $(this).attr("href");
                        }
                    });

                    _out += "<li><a href='" + entryUrl + "' title='" + entryText + "' target='_blank'>" + entryText + "</a> [" + published + "]</li>";
                }
                _out += "</ul>";

                $("#blogspot div.panel-text").html(_out);
            },
            error:function(){},
            complete:function(){}
        });
    },

    switchTransparency : function(){
                                    /*
        * and set the stripyness on resize...
        *   see http://stackoverflow.com/questions/744319/get-css-rules-percentage-value-in-jquery
        */
       $(".linkpanel").first().parent().hide();
       var width = $(".linkpanel").first().width();
       $(".linkpanel").first().parent().show();
       if(width === 100){  //ie we are on narrow screen
           controller.switchTransparency(width);
       }
    },






    getQueryString : function(param){
        try{
            var out = null;
            var urlStr = window.location.href;
            var qStr = urlStr.split(/\?/)[1];
            var params = qStr.split(/&/g);
            for(var a=0;a<params.length;a++){
                if(params[a].split(/=/)[0] === param){
                    out = params[a].split(/=/)[1];
                }
            }
            return out;
        }
        catch(e){
            return false;
        }
    },

    getCleanUrl : function(){
        var out = window.location.href;
        if(out.indexOf("?" !== -1)){
            out = out.split(/\?/)[0];
        };
        if(out.indexOf("#" !== -1)){
            out = out.split(/\#/)[0];
        };

        return out;
    },

    /*
     * get full relative URL. Optional 'clean' parameter will strip off request parameters.
     */
    getRelativeUrl : function(clean){
        var _url = window.location.pathname;
        if(_url === "/") _url = _url + this.defaultPage;
        if(!clean) _url += window.location.search;
        return _url;
    },

    /*
     * Attach link handlers to panels, suppressing if link is undefined, null or #
     * Also, check that the defined URL actually exists...
     * @returns {undefined}
     */
    initLinkPanels : function(){

        //attach handlers to panels:
        $(".linkpanel").each(function(){
            
            var _currFontColour = null;
            var currentColour = null;
            $(this).mouseenter(function(){
                _currFontColour = $(this).css("color");
                //set current background colour so we can revert on click
                currentColour = $(this).css("background-color"); 
                $(this).css("background-color","grey");
                $(this).find("h2").css({"color":"red"});
                var href = $(this).attr("data-url");
                if(href !== null 
                && href !== undefined 
                && href!== "#"){
                    $(this).css("cursor","pointer");
                }
            })
            .click(function(){
                //flash to white, and fade back to colour:
                var href = $(this).attr("data-url");
                $(this).css("background-color","white");
                $(this).animate({
                    backgroundColor:currentColour
                },
                300,
                null,
                //see http://stackoverflow.com/questions/11693607/passing-paremeters-to-animation-callback-jquery
                function(){
                    controller.panelClickAnimateComplete(href);
                });
            })
            .mouseleave(function(){
                $(this).css("background-color",currentColour);
                $(this).css("cursor","default");
                $(this).find("h2").css({"color":_currFontColour});
            });
        });
    },

    searchSuccessHandler : function(ajaxData){
        $("#banana").html(ajaxData);
        $("#banana").dialog();

        //search engine ID: 001269262574990558717:mzdvf2ahs4w
    },

    panelClickAnimateComplete : function(href){
        if(href !== null 
                && href !== undefined 
                && href!== "#"){ //TODO: boolean check URL exists function
            window.location.href = href;
        }
        else{
            return false;
        }
    },
      
    loadCommonElements : function(){
        $.ajax("/inc/footer.html",
        {
            success:function(data){
                $("#footer").html(data);
            },
            error:function(){
                console.log("failed to load footer");
            }
        });
    },

    getPageFilename : function(){
        var filename = this.getCleanUrl().split(/\//)[this.getCleanUrl().split(/\//).length-1];
        if(filename.length === 0) filename = this.defaultPage;
        return filename;
    },
    
    /*
class: "scheme-light"
intro: "intro text intro text 1"
link: "/landing.html"
linkId: "2"
title: "title text"

Basic Structure:
<div class="pure-u-1-2 pure-u-sm-1-4 linkpanel row-small" id="panel-1">
    <div class="panel-title">
        <h2></h2>
    </div>
    <div class="panel-text"></div>
</div>

* set type (HOME,LANDING,CONTENT). This determines the basic body content layout:
*      HOME    - 1/4 width         pure-u-1-2 pure-u-sm-1-4 linkpanel row-small [scheme]
*      LANDING - 1/2 width         pure-u-1 pure-u-sm-1-2 linkpanel row [scheme]
*      CONTENT - 1/4 | 3/4 width   pure-u-1 pure-u-sm-1-4 contentpanel row [scheme]
*                                  pure-u-1 pure-u-sm-3-4 contentpanel row [scheme]

I only need panelNum on content pages to determine whether left or right panel
     */
//    buildPanel : function(panelData,pageType,panelNum,data){
//        //console.table(panelData);
//        var basePanelClass1 = null;
//        var basePanelClass2 = null;
//  
//        //var url = this.getLinkFromId(data,panelData.linkId);
//        var addLink = false;
//        switch(pageType){
//            case this.TYPE_HOME :
//                basePanelClass1 = "pure-u-1-2 pure-u-sm-1-4 linkpanel row-small";
//                addLink = true;
//            break;
//                
//            case this.TYPE_LANDING :
//                basePanelClass1 = "pure-u-1 pure-u-sm-1-2 linkpanel row";
//                addLink = true;
//            break;
//                
//            case this.TYPE_CONTENT :
//                basePanelClass1 = "pure-u-1 pure-u-sm-1-4 contentpanel row";
//                basePanelClass2 = "pure-u-1 pure-u-sm-3-4 contentpanel row";
//            break;
//        }
//
//        var _outer = document.createElement("div");
//        
//        var baseClass = basePanelClass1;
//        if(pageType === this.TYPE_CONTENT && panelNum > 0){
//            baseClass = basePanelClass2;
//        }
//        
//        //do we have a modifier-class? This is defined in the JSON data
//        if(panelData.modifier_class !== null && panelData.modifier_class !== undefined && panelData.modifier_class !== ""){
//            baseClass += " " + panelData.modifier_class;
//        }
//        
//        //do we have 'transparency' flag?
//        if(panelData.transparency !== null && panelData.transparency !== undefined && panelData.transparency !== ""){
//            $(_outer).attr("style","background:rgba(" + panelData.transparency +")");
//        }
//        
//        $(_outer).attr("class",baseClass);
//        if(panelData.id !== null){
//            $(_outer).attr("id",panelData.id);
//        }
//        if(addLink) $(_outer).attr("data-url",panelData.link);   //conditional
//        $(_outer).addClass(panelData.class);
//        
//        if(panelData.title !== null && panelData.title !== undefined && panelData.title !== ""){
//            var _title = document.createElement("div");
//            $(_title).addClass("panel-title");
//        }
//        
//        var _headline = document.createElement("h2");
//        $(_headline).html(panelData.title);
//        
//        var _text = document.createElement("div");
//        $(_text).attr("class","panel-text");
//        
//        /*
//         * If intro text is omitted, convert to a narrow title bar:
//         * */
//        if(panelData.intro === undefined){
//            $(_outer).css({"height":"75px"});
//        }
//        else{
//            $(_text).html(panelData.intro);
//        }
//        
////        if(panelData.content_id !== undefined){
////            //todo: Add logic for taking title from ONE panel or none. For now, just suppress.
////            ccms.renderCCMSContentItem(panelData.content_id,"#"+panelData.id+" > div.panel-text","#" + panelData.id);
////        }
//        
//        /*
//         * If an array of subnav items is defined in panel, render linklist
//         * get all CCMS objects matching the array:
//         * 
//         * I also want to handle #contentid=123 to render comtent as well.
//         */
//        if(panelData.ajax_sub_menu_array !== null && typeof(eval(panelData.ajax_sub_menu_array)) === "object" && panelData.ajax_sub_menu_array.length > 0){
//            ccms.renderCCMSSubnav(eval(panelData.ajax_sub_menu_array),$(_text),"#ccms_display > div.panel-text","#ccms_display");
//            ccms.buildSubnav = true;
//        } 
//        
//        //build structure:
//        if(panelData.title !== null && panelData.title !== undefined && panelData.title !== ""){
//            _title.appendChild(_headline);
//            _outer.appendChild(_title);
//        }
//        
//        _outer.appendChild(_text);
//        
//        return(_outer);
//    },
    
    /*
     * Build array of pages from self to root
     * I am making it easy for myself - n.n.n - so length/depth is
     * easy.
     * @returns {Array}
     */
//    getPathArray : function(){
//        if(this.currentPage !== null){
//            var _currPageIdArray = this.currentPage.id.split(/\./);
//            this.currentPath = [];
//            for(var a = 0; a < _currPageIdArray.length; a++){
//                this.currentPath.push(this.getPageObjectByLinkId(_currPageIdArray.slice(0,_currPageIdArray.length-a).join(".")));
//            }
//        }
//    },
    
//    getPageObjectByLinkId : function(linkId){
//        var page = null;
//        for(var p in this.data.pages){
//            if(linkId === this.data.pages[p].id){
//                page = this.data.pages[p];
//                //add the URL - I need to sort out the JSON here!
//                //page.url = p;
//            }
//        }
//        return page;
//    },
    
    
    formatBlogDate : function(date){
        //console.log(date);
        var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return days[date.getDay()] + ", " + months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
    },
    
    
    switchTransparency : function(width){
        //get all panels:
        var panelArray = $(".linkpanel");

        var counter = 0;
        switch(width){
            
            case 100:
                //alternate
                $(panelArray).each(function(){
                    $(this).css({"background":"none"}); //reset to none
                    counter++;
                    if(Number.isInteger(counter/2)){
                        $(this).css({"background":"rgba(255,255,255,.5)"});
                    }
                });
                break;

            case 50:
                for(var a=0;a<this.currentPage.panels.length;a++){
                    $(panelArray[a]).css({"background":"none"});    //reset
                    if(this.currentPage.panels[a].data.transparency !== undefined){
                       $(panelArray[a]).css({"background":"rgba(255,255,255,.5)"});
                    }
                }
                break;
        }

    }
    
    
 
};

/*
 * Start the application:
 * @returns {undefined}
 */
$(function(){
    /*
     * Start controller:
     */
    controller.init();
});


//    /*
//     * build AJAX loading overlay
//     */ 
//    //var counter = 0;
//    var overlay = document.createElement("div");
//    overlay.setAttribute("id","overlay");
//
//    var spacer = document.createElement("span");
//    spacer.setAttribute("id","vertical-centerer");
//
//    overlay.appendChild(spacer);
//
//    var loading = document.createElement("img");
//    loading.setAttribute("id","centered");
//    loading.setAttribute("src",controller.loading);
//    overlay.appendChild(loading);

/*
 * Maybe move this?
 * @param {type} param
 */
//$(document).ajaxStart(function(){
//
//    if(controller.getPageFilename() === "librivox.html"){
//        (document.getElementsByTagName("body")[0]).appendChild(overlay);
//    }
//}).ajaxStop(function(){
//    if(controller.getPageFilename() === "librivox.html"){
//        $("#overlay").remove();
//    }
//});
/*
 * Google CSE code
 * https://cse.google.co.uk/cse/all
 */
  (function() {
    var cx = '001269262574990558717:mzdvf2ahs4w';
    var gcse = document.createElement('script');
    gcse.type = 'text/javascript';
    gcse.async = true;
    gcse.src = (document.location.protocol === 'https:' ? 'https:' : 'http:') +
        '//cse.google.com/cse.js?cx=' + cx;
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(gcse, s);
  })();
  
  
  
  
var prevWidth = -1;  
$(window).resize(function(){

    //set wufoo size:
    controller.wufoo_dialog_height = window.innerHeight * 0.9;
    controller.wufoo_dialog_width = window.innerWidth * 0.9;

    if($("#_dialog").hasClass('ui-dialog-content')){
        //calculate and set dialog width/height:
        $("#_dialog").dialog( "option", "width", controller.wufoo_dialog_width );
        $("#_dialog").dialog( "option", "height", controller.wufoo_dialog_height );

        //calculate and set iframe size:
        $("#wufoo_iframe").css({
          width : (controller.wufoo_dialog_width - 40) + "px",
          height : (controller.wufoo_dialog_height - 80) + "px"
        });
    }
    else{
        //console.log("dialog not initialized");
    }
    
    
    //handle switching the transparency:
    var switched = false;

    $(".linkpanel").first().each(function(){
        
        /*
        http://stackoverflow.com/questions/744319/get-css-rules-percentage-value-in-jquery
         */
        $(this).parent().hide();
        var width = $(this).width();
        $(this).parent().show();
        if(prevWidth !== -1 && prevWidth !== width){
            controller.switchTransparency(width);
        }
        prevWidth = width;
    });

});

