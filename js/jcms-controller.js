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
    
    TYPE_HOME : "HOME",
    TYPE_LANDING :"LANDING",
    TYPE_CONTENT : "CONTENT",
    TYPE_CUSTOM : "CUSTOM",
    TYPE_DEFAULT : this.TYPE_CONTENT,
    
    defaultPage : "index.html",
    currentPage : null,
    currentPath : [],
    data : null,
    dataOk : false,
    //loading : "/images/icons/ajax-loader-2.gif",
    
    //wufoo:
    wufoo_dialog_width : window.innerWidth * 0.9,
    wufoo_dialog_height : window.innerHeight * 0.9,
    
    
    init : function(){
        this.loadData();
        //this.loadSearchBanner();     //AJAX load
        //this.loadBannerImages();     //from JSON TODO
        //this.loadCommonElements();
    },

    loadData : function(){
        $.ajax("/js/data/site-structurev2.json",
        {
            success : function(data){
                /*
                 * Load data into global var:
                 */
                controller.data = data;
                
                /*
                 * Load current page:
                 */
                controller.loadCurrentPage();
                
                if(controller.dataOk){
                    /*
                     * And call dependent functions:
                     */
                    //controller.getPathArray();

                    /*
                     * load the breadcrumb
                     */
                    //controller.loadBreadcrumb();
                    
                    //load content panels:
                    controller.loadContentPanels();
                    
                    /*
                     * Handler for CCMS content on URL hash:
                     * TODO: I need to make this dynamic. Will probably only be for subnav driven panels
                     */
                    if($("#ccms_display").length > 0){  //single panel subnav driven only. This value MUST be static for this type of output
                        var hash = window.location.hash;
                        if(hash.split(/=/)[0] === "#contentid"){
                            var contentId = hash.split(/=/)[1];
                            ccms.renderCCMSContentItem(contentId,"#ccms_display > div.panel-text","#ccms_display");
                        }
                    }
                    
                    /*
                     * Handlers for custom pages/functions
                     */
                    switch(controller.currentPage.id){
                        /*
                         * HOMEPAGE. Quite complex...
                         */
                        case "1":

                            /*
                             * insert wufoo form:
                             */
                            var wufoo_wrapper = document.createElement("div");
                            wufoo_wrapper.setAttribute("id","wufoo-z157nixr1oirgiy");
                            
                            //lazy...
                            var formStructure = '<div id="containerXXX" class="ltr"><form id="form1" name="form1" class="wufoo topLabel page" accept-charset="UTF-8" autocomplete="off" enctype="multipart/form-data" method="post" novalidate action="https://jcmssilas.wufoo.com/forms/z157nixr1oirgiy/#public"><ul><li id="foli107" class="notranslate"><label class="desc" id="title107" for="Field107">Name</label><div><input id="Field107" name="Field107" type="text" class="field text large" value="" maxlength="255" tabindex="1" onkeyup=""/> </div></li><li id="foli3" class="notranslate"><label class="desc" id="title3" for="Field3">Email<span id="req_3" class="req">*</span></label><div><input id="Field3" name="Field3" type="email" spellcheck="false" class="field text large" value="" maxlength="255" tabindex="2" required /></div></li><li id="foli4" class="notranslate"><label class="desc" id="title4" for="Field4">Your message</label><div><textarea id="Field4" name="Field4" class="field textarea small" spellcheck="true" rows="10" cols="50" tabindex="3" onkeyup=""></textarea></div></li> <li class="buttons"><div><input id="saveForm" name="saveForm" class="btTxt submit" type="submit" value="Submit"/></div></li><li class="hide"><label for="comment">Do Not Fill This Out</label><textarea name="comment" id="comment" rows="1" cols="1"></textarea><input type="hidden" id="idstamp" name="idstamp" value="4OmMIKthKce7wuHEVj62nALcj1oJFs3sD8tfYS/mWgU=" /></li></ul></form></div>';
                            
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
                            
                            
                            /*
                             * Inject the tweets:
                             */
                            var twitter_code = '<a class="twitter-timeline" data-height="400" href="https://twitter.com/JCMSConsulting">Tweets by JCMSConsulting</a> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>';
                            $("#twitter_widget").html(twitter_code);
                            
                            /*
                             * Inject the Obtree forum widget:
                             */
//                            var obtree_forum_code = '<iframe id="forum_embed" src="javascript:void(0)"  scrolling="no"  frameborder="0"  width="900"  height="700"></iframe><script type="text/javascript">document.getElementById(\'forum_embed\').src = \'https://groups.google.com/forum/embed/?place=forum/jcms-green-users-group\'  + \'&showsearch=true&showpopout=true&showtabs=false\'  + \'&parenturl=\' + encodeURIComponent(window.location.href);</script>';
//                            $("#obtree_forum").html(obtree_forum_code);
                            
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
                                    _out += "<ul>"
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
                        break;
                    }
                }
                else{
                    //load content not found:
                }
            },
            error : function(e){
                console.log(e);
            },
            complete : function(){}
        });
    },

    
    loadCurrentPage : function(){
        this.currentPage = null;
        for(var a=0;a<this.data.pages.length;a++){
            if(this.data.pages[a].url === this.getRelativeUrl(true)){ //may need to change this to include path?
                this.currentPage = this.data.pages[a];
                this.dataOk = true;
            }
        }
    },
    
    /*
     * Push search box onto all pages:
     */
//    loadSearchBanner : function(){
//        $.ajax("/inc/searchblock.html",
//        {
//            success : function(data){
//                $("#search-panel").append(data);
//                controller.initSearchComponents();
//            }
//        }
//        );
//    },

//    loadBreadcrumb : function(){
//        //load breadcrumb data:
//        this.getPathArray();
//        
//        //then generate HTML:
//        /*
//        <div class="pure-g row-tiny border-bottom" id="breadcrumb">
//            <!-- JQuery controlled background image. Set ID and image array in javascript -->
//            <div class="pure-u-1 scheme-black">
//                <ul>
//                    <li><a href="/">Home</a><span>|</span></li>
//                    <li>Landing</li>
//                </ul>
//            </div>
//        </div>
//         */
//        var _outer = $(document.createElement("div")).addClass("pure-g row-tiny border-bottom").attr("id","breadcrumb");
//        var _inner = $(document.createElement("div")).addClass("pure-u-1 scheme-black");
//        var _ul = document.createElement("ul");
//        for(var a=this.currentPath.length-1; a>=0; a--){
//            var _li = document.createElement("li");
//            var _a = $(document.createElement("a")).attr("href",this.currentPath[a].url);
//            var _pipe = document.createElement("span").appendChild(document.createTextNode(">"));
//            var _txt = document.createTextNode(this.currentPath[a].title);
//            _a[0].appendChild(_txt);
//            if(a === 0){
//                //text only
//                _li.appendChild(_txt);
//            }
//            else{
//                //link
//                _li.appendChild(_a[0]);
//                _li.appendChild(_pipe);
//            }
//            
//            _ul.appendChild(_li);
//        }
//        _inner[0].appendChild(_ul);
//        _outer[0].appendChild(_inner[0]);
//        
//        //and push as next sibling of header:
//        if(this.currentPath.length > 1){
//            $("#header").after(_outer);
//        }
//    },

    loadContentPanels : function(){

            if(this.currentPage !== undefined){
                //console.log("TEST");
                var pageType = this.currentPage.type;
                $("title").html(this.currentPage.title);
                $(".top-bar-title").html(this.currentPage.title);

//                var _imageAttachment = "contain";
//                if(this.currentPage.banner_attachment && this.currentPage.banner_attachment !== null){
//                    _imageAttachment = this.currentPage.banner_attachment;
//                }
                //banner
//                $(".banner-content").css({
//                    "background-image":"url(" + this.currentPage.banner + ")",
//                    //base switch here on banner_scale: default to contain.
//                    "background-size": _imageAttachment,
//                    "background-position": "left",
//                    "background-repeat": "no-repeat",
//                    "background-attachment":"top-left"
//                });
                /*
                 * Build panels sequentially from data and inject into body area: 
                 */
                for(var a=0;a<this.currentPage.panels.length;a++){
                    $("#body-content").append(controller.buildPanel(this.currentPage.panels[a].data,pageType,a,this.data));
                }

                /*
                 * Attach the handlers once we have hte HREFs added:
                 */
                //this.initLinkPanels();
            }
            else{
                //console.log("no data defined for " + this.getPageFilename());
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

    initSearchComponents : function(){

        /*
         * Start search handler
         */
        var searchterm = null;

        $("#search-btn").click(function(){
            $("#search-panel").slideDown();
        });

        $("#search-btn-close").click(function(){
            $("#search-panel").slideUp();
        });

        //search handler:
        $("#search-btn-go").hover(function(){
            $(this).css("cursor","pointer");
        }).click(function(){
            searchterm = $("#search-field").val();
            if(searchterm !== undefined && searchterm.length > 0){
                window.location.href = controller.getCleanUrl() + "?q=" + searchterm + "&showresults=true";
            }
        });

        $(document).keyup(function(evt){
            switch(evt.keyCode){
                case 13:        //enter
                    $("#search-btn-go").click();
                break;
                case 27:        //esc
                    $("#search-btn-close").click();
                break;
                case 83:        //'s'
                    $("#search-btn").click();
                break;
            }
        });


        //handle search result display:
        var showSearchResult = this.getQueryString("showresults");
        if(showSearchResult === "true"){

            //keep search box open:
            $("#search-btn").click();

            //populate search for with term:
            $("#search-field").val(controller.getQueryString("q"));

            //overlay search result:
            $("#search-results").dialog({
                position : {my : "left top", at:"left top",of:window},
                modal:true,
                draggable:false,
                width : $(window).width()

            });

            $(window).resize(function(){
                $("#search-results").dialog("option","width",$(window).width());
            });
        }
        /*
         * End search handler
         */
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
                $("#footer").html(data+"XXXXXXXX");
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
     * Build array of pages from self to root
     * I am making it easy for myself - n.n.n - so length/depth is
     * easy.
     * @returns {Array}
     */
    getPathArray : function(){
        if(this.currentPage !== null){
            var _currPageIdArray = this.currentPage.id.split(/\./);
            this.currentPath = [];
            for(var a = 0; a < _currPageIdArray.length; a++){
                this.currentPath.push(this.getPageObjectByLinkId(_currPageIdArray.slice(0,_currPageIdArray.length-a).join(".")));
            }
        }
    },
    
    getPageObjectByLinkId : function(linkId){
        var page = null;
        for(var p in this.data.pages){
            if(linkId === this.data.pages[p].id){
                page = this.data.pages[p];
                //add the URL - I need to sort out the JSON here!
                //page.url = p;
            }
        }
        return page;
    },
    
    
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


    /*
     * build AJAX loading overlay
     */ 
    //var counter = 0;
    var overlay = document.createElement("div");
    overlay.setAttribute("id","overlay");

    var spacer = document.createElement("span");
    spacer.setAttribute("id","vertical-centerer");

    overlay.appendChild(spacer);

    var loading = document.createElement("img");
    loading.setAttribute("id","centered");
    loading.setAttribute("src",controller.loading);
    overlay.appendChild(loading);

/*
 * Maybe move this?
 * @param {type} param
 */
$(document).ajaxStart(function(){

    if(controller.getPageFilename() === "librivox.html"){
        (document.getElementsByTagName("body")[0]).appendChild(overlay);
    }
}).ajaxStop(function(){
    if(controller.getPageFilename() === "librivox.html"){
        $("#overlay").remove();
    }
});
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

