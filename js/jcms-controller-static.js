/*
 * Feb 2017:
 * 
 * Scripts for JCMS, not reliant on AJAX injection of remote CCMS content, or local assembly of pages
 * based on JSON data. That was fun for thecoven, but not appropriate for this site.
 * 
 * AJAX injection routines removed, and injection of remote content (twitter, blogger etc.) modified to 
 * work with static HTML source.
 * 
 * ADD A GOOGLE SEARCH INTEGRATION
 * ADD GOOGLE SITEMAP XML
 */
var controller = {
    
    //push these into blocks, and build navs
    /*
     * 
     * This is a data structure that is used to generate the navigation breadcrumb. Currently, it is this Javascript array.
     * Ideally it will be an AJAX injected JSON structure generated dynamically from - something...
     * 
     * Baby steps...
     */
    SITEMAP : [
        {"key":"1",         "url":"/",                    "linktext" : "Home",             "parent" : null},
        
        {"key":"1-1",       "url":"/about/",               "linktext":"About Us",                    "parent" : "1"},
        
        {"key":"1-2",       "url":"/content-management/obtree/",               "linktext":"Obtree WCM",                    "parent" : "1"},
        {"key":"1-2-1",     "url":"/content-management/obtree/case-studies/",      "linktext":"Case Studies",       "parent" : "1-2"},
        {"key":"1-2-2",     "url":"/content-management/obtree/tips/",              "linktext":"Tips",               "parent" : "1-2"},
        
        {"key":"1-3",       "url":"/content-management/reddot/",               "linktext":"RedDot CMS",                    "parent" : "1"},
        {"key":"1-3-1",     "url":"/content-management/reddot/case-studies/",      "linktext":"Case Studies",       "parent" : "1-3"},
        {"key":"1-3-2",     "url":"/content-management/reddot/tips/",              "linktext":"Tips",               "parent" : "1-3"},
        
        {"key":"1-4",       "url":"/content-management/decoupled/",            "linktext":"Decoupled CMS",                 "parent" : "1"},
        {"key":"1-4-1",     "url":"/content-management/decoupled/details/",    "linktext":"Details",                 "parent" : "1-4"},
        
        {"key":"1-5",       "url":"/websites/development/",          "linktext":"Web Development",               "parent" : "1"},
        {"key":"1-5-1",     "url":"/websites/integrations/",             "linktext":"Integrations",                  "parent" : "1-5"},
        {"key":"1-5-1-1",   "url":"/websites/integrations/cludo/",                    "linktext":"Cludo Search",                  "parent" : "1-5-1"},
        {"key":"1-5-1-2",   "url":"/websites/integrations/google-map/",               "linktext":"Google Maps",                   "parent" : "1-5-1"},
        {"key":"1-5-1-3",   "url":"/websites/integrations/google-blog/",              "linktext":"Google Blogger",                "parent" : "1-5-1"},
        {"key":"1-5-2",     "url":"/websites/web-design/",               "linktext":"Web Design",                    "parent" : "1-5"},
        {"key":"1-5-3",     "url":"/websites/web-design/case-studies/",  "linktext":"Web Development Case Studies",  "parent" : "1-5"},
        
        {"key":"1-6",       "url":"/content-management/wordpress/",  "linktext":"JCMS WordPress Solutions",         "parent" : "1"},
        {"key":"1-6-1",     "url":"/content-management/wordpress/plugins/librivox/",  "linktext":"Librivox Plugin",         "parent" : "1-6"},
        {"key":"1-6-2",     "url":"/content-management/wordpress/plugins/cms-connector/",  "linktext":"CMS Connector",         "parent" : "1-6"},
        {"key":"1-6-3",     "url":"/content-management/wordpress/themes/jcms-theme/",  "linktext":"JCMS Theme",         "parent" : "1-6"},
        
        {"key":"1-7",       "url":"/customers/",                "linktext":"Customers",                     "parent" : "1"},
        
        {"key":"1-8",       "url":"/websites/site-management/",         "linktext":"Website Management",         "parent" : "1"},
        ],
    
    TYPE_HOME : "HOME",
    TYPE_LANDING :"LANDING",
    TYPE_CONTENT : "CONTENT",
    TYPE_CUSTOM : "CUSTOM",
    TYPE_DEFAULT : this.TYPE_CONTENT,
    
    //manage selection of dropdown based on query string:
    mapper : {
        "general" : "General",
        "decoupled:offering":"Decoupled CMS",
        "obtree:support" : "Obtree support",
        "obtree:training" : "Obtree training",
        "obtree:upgrade" : "Obtree upgrade",
        "obtree:develop" : "Obtree development",
        "obtree:integrate" : "Obtree integration",
        "obtree:headless" : "Obtree as headless CMS",
        
        "reddot:support" : "Red Dot support",
        "reddot:training" : "Red Dot training",
        "reddot:upgrade" : "Red Dot upgrade",
        "reddot:develop" : "Red Dot development",
        "reddot:integrate" : "Red Dot integration",
        "reddot:headless" : "Red Dot as headless CMS",
        
        "web:develop" : "Web application development",
        "web:server" : "Server-side development"
    },
            
    
    defaultPage : "/",
    currentPage : null,
    currentPath : [],
    data : null,
    dataOk : false,
    //loading : "/images/icons/ajax-loader-2.gif",
    sourceHTMLTransparencyFlagArray : [],
    
    //wufoo:
    wufoo_dialog_width : window.innerWidth * 0.9,
    wufoo_dialog_height : window.innerHeight * 0.9,
    
    
    init : function(){
        
        //what page are we on?
        if($('body').attr('data-page-action')){
            switch($('body').attr('data-page-action')){
                case "scratchpad":
                    //attach handlers to menu:
                    
                    $("#scratchpad-menu > li").each(function(){
                        $(this).click(function(){
                            //the attribute value is the function name...
                            controller[$(this).attr('data-scratchpad-menu-action')]();
                        });
                    });
                    
                    break;
            }
        }
        
        //load source linkpanel overlay flag:
        this.sourceHTMLTransparencyFlagArray = new Array();

        this.loadCommonElements();
        this.loadPageSpecificStuff();
        this.buildBreadcrumb();
    },

    buildBreadcrumb : function(){
        var _outer = document.createElement("div");
        $(_outer).addClass("pure-u-1 row-tiny linkpanel panel-title");
        $(_outer).attr("id","bc");
        var _title = document.createElement("div");
        
        if(this.getPageFilename() === '/'){
            //build quicklinks for homepage panels
            var _a = new Array();
            $('div.linkpanel .panel-title').each(function(){
                var _temp = document.createElement('a');
                _temp.setAttribute('href','#'+$(this).attr('id'));
                
                _temp.innerHTML = $(this).find('h2').text();
                $(_temp).click(function(){            
                    ////and add a simple scrollto thing:
                    //https://stackoverflow.com/questions/8579643/how-to-scroll-up-or-down-the-page-to-an-anchor-using-jquery
                    var _anc = $(this).attr('href').replace('#','');
                    controller.scrollToAnchor(_anc);
                    return false;
                });
                _a.push(_temp);
            });
            for(var a=0;a<_a.length;a++){
                $(_title).append($(_a[a]).append(" "));
            }
        }
        else{
            buildBC = function(obj){
                var out = new Array();
                out.push(obj);

                recurse = function(obj){
                   for(var a=0;a< controller.SITEMAP.length;a++){
                        if(controller.SITEMAP[a].key === obj.parent){
                            obj = controller.SITEMAP[a];
                            out.push(obj);
                            recurse(obj);
                        }
                    } 
                };
                recurse(obj);
                return out;
            };
            var bc = [];
            for(var a=0;a<this.SITEMAP.length;a++){
                if(this.getPageFilename() === this.SITEMAP[a].url){
                    bc = buildBC(this.SITEMAP[a]);
                }
            };
            controller.bc = bc.reverse();

            var _bc = [];   //lazy. Do as DOM eleemnts
            for(var a = 0;a < controller.bc.length; a++){
                if(a === controller.bc.length-1){
                    _bc .push("<span class='bc-tip'>" + controller.bc[a].linktext + "</span>");
                }
                else{
                    _bc .push("<a href='" + controller.bc[a].url + "'>" + controller.bc[a].linktext + "</a>");
                }
            }
            $(_title).html(_bc.join(" &raquo; "));
        }
        _outer.appendChild(_title);
        $("#body-content").prepend($(_outer));
    },

    loadPageSpecificStuff : function(){
        switch(this.getPageFilename()){
            case "/":
                
                /*
                 * Display promo overlay:
                 */
                //$('#homepage_promo').dialog({"width":"600px",'top':'0px'});
                
                /*
                 * insert wufoo form:
                 */
                var wufoo_wrapper = document.createElement("div");
                wufoo_wrapper.setAttribute("id","wufoo-z157nixr1oirgiy");

                var formStructure = '<form id="form1" name="form1" class="wufoo topLabel page" accept-charset="UTF-8" autocomplete="off" enctype="multipart/form-data" method="post" novalidate action="https://jcmssilas.wufoo.com/forms/z157nixr1oirgiy/#public"><header id="header" class="info"><h2>Contact Us</h2><div></div></header><ul><li id="foli107" class="notranslate"><label class="desc" id="title107" for="Field107">Name</label><div><input id="Field107" name="Field107" type="text" class="field text large" value="" maxlength="255" tabindex="1" onkeyup=""       /></div></li><li id="foli3" class="notranslate      "><label class="desc" id="title3" for="Field3">Email<span id="req_3" class="req">*</span></label><div><input id="Field3" name="Field3" type="email" spellcheck="false" class="field text large" value="" maxlength="255" tabindex="2"       required /></div></li><li id="foli109" class="      "><label class="desc notranslate" id="title109" for="Field109">Select a Choice</label><div><select id="Field109" name="Field109" class="field select medium"       tabindex="3" ><option value="General" selected="selected"><span class="notranslate">General</span></option><option value="Decoupled CMS" ><span class="notranslate">Decoupled CMS</span></option><option value="Obtree support" ><span class="notranslate">Obtree support</span></option><option value="Obtree training" ><span class="notranslate">Obtree training</span></option><option value="Obtree upgrade" ><span class="notranslate">Obtree upgrade</span></option><option value="Obtree development" ><span class="notranslate">Obtree development</span></option><option value="Obtree integration" ><span class="notranslate">Obtree integration</span></option><option value="Obtree as headless CMS" ><span class="notranslate">Obtree as headless CMS</span></option><option value="Red Dot support" ><span class="notranslate">Red Dot support</span></option><option value="Red Dot training" ><span class="notranslate">Red Dot training</span></option><option value="Red Dot upgrade" ><span class="notranslate">Red Dot upgrade</span></option><option value="Red Dot development" ><span class="notranslate">Red Dot development</span></option><option value="Red Dot integration" ><span class="notranslate">Red Dot integration</span></option><option value="Red Dot as headless CMS" ><span class="notranslate">Red Dot as headless CMS</span></option><option value="Website build" ><span class="notranslate">Website build</span></option><option value="Web application development" ><span class="notranslate">Web application development</span></option><option value="Server-side development" ><span class="notranslate">Server-side development</span></option></select></div></li><li id="foli4" class="notranslate"><label class="desc" id="title4" for="Field4">Your message</label><div><textarea id="Field4" name="Field4" class="field textarea small" spellcheck="true" rows="10" cols="50" tabindex="4" onkeyup=""></textarea></div></li> <li class="buttons "><div><input id="saveForm" name="saveForm" class="btTxt submit" type="submit" value="Submit" /></div></li><li class="hide"><label for="comment">Do Not Fill This Out</label><textarea name="comment" id="comment" rows="1" cols="1"></textarea><input type="hidden" id="idstamp" name="idstamp" value="4OmMIKthKce7wuHEVj62nALcj1oJFs3sD8tfYS/mWgU=" /></li></ul></form>';
                
                //add form:
                $(wufoo_wrapper).append(formStructure);
                //wufoo_wrapper.innerHTML = formStructure;
                //See http://stackoverflow.com/questions/22308733/jquery-cant-select-just-appended-element. SCOPE!!

                var subject_query = this.getQueryString("subject");
                if(subject_query !== null){
                    //set dropdown option:
                    $(wufoo_wrapper).find("#Field109 > option").each(function(){

                        if($(this).attr("value") === controller.mapper[subject_query]){
                            $(this).attr("selected","selected");
                        }
                        else{
                            $(this).attr("selected",null);
                        }
                    });
                }

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
                var obtree_forum_code = '<iframe id="forum_embed" src="javascript:void(0)"  scrolling="no"  frameborder="0"  width="900"  height="400"></iframe><script type="text/javascript">document.getElementById(\'forum_embed\').src = \'https://groups.google.com/forum/embed/?place=forum/jcms-green-users-group\'  + \'&showsearch=true&showpopout=true&showtabs=false\'  + \'&parenturl=\' + encodeURIComponent(window.location.href);</script>';
                $("#obtree_forum").html(obtree_forum_code);

                /*
                 * Add the blogspot stuff:
                 */
                $("#blogspot div.panel-text").css({"overflow":"auto","height":"300px"});

                //points at: http://jcms-consulting.blogspot.com/feeds/posts/default
                $.ajax("/proxy/passthrough-proxy.php",{
                    success:function(data){ //changes context for data
                        var _out = "";
                        data = $.parseXML(data);
                        var title = data.getElementsByTagName("title")[0].firstChild.nodeValue;

                        _out += "<h3><a href='http://jcms-consulting.blogspot.com' target='_blank' title='JCMS Blog'><img src='/images/Blogger.svg.png' alt='Blogger logo' style='width:30px;vertical-align:middle;padding-right:10px;padding-bottom:5px;' /></a>"+title+"</h3>";
                        var entries = data.getElementsByTagName("entry");
                        _out += "<ul>";
                        
                        for(var a=0;a < entries.length;a++){
                            var entryText = entries[a].getElementsByTagName("title")[0].firstChild.nodeValue;

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
                    error:function(err){
                        console.log(err);
                    },
                    complete:function(){}
                });

                
            case "development/cms/obtree":
                break;
                
            case "development/cms/obtree/":
                break;
                
        }
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

    getPageFilename : function(){
        return(document.location.pathname);
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
                    if(out.indexOf("#") !== -1){    //there may be a hash on the end...
                        out = out.split(/#/)[0];
                    }
                }
            }
            return out;
        }
        catch(e){
            return false;
        }
    },
    
    //see https://stackoverflow.com/questions/8579643/how-to-scroll-up-or-down-the-page-to-an-anchor-using-jquery
    scrollToAnchor : function(aid){
        var aTag = $("#"+ aid);
        $('html,body').animate({scrollTop: aTag.offset().top},'slow');
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

    getRelativeUrl : function(clean){
        var _url = window.location.pathname;
        if(_url === "/") _url = _url + this.defaultPage;
        if(!clean) _url += window.location.search;
        return _url;
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
                //if panels are full width (100%), alternate:
                $(panelArray).each(function(){
                    $(this).removeClass("transparency");
                    counter++;
                    if(Number.isInteger(counter/2)){
                        $(this).addClass("transparency");
                    }
                });
                break;

            case 50:
                //if panels are half-width (50%), revert/apply stepped as per sourcecode:
                $(panelArray).each(function(){
                    $(this).removeClass("transparency");
                    if(controller.sourceHTMLTransparencyFlagArray[counter]){
                        //apply overlay
                        $(this).addClass("transparency");
                    }
                    counter++;
                });
            break;
        }

    },

    /*
     * set the grey border to be 100% height if content is not full height.
     * Only applies on widescreen.
     * EXPERIMENTAL
     * 
     * HEIGHT OF PANEL - HEIGHT OF TITLE! DOH!!!
     * work out heights of container FIRST and pass in here: TODO
     */
    setTextBorderHeight : function(containerHeight, index){
        $("div.panel-text").eq(index).css({'height':''});
    }

};

/*
 * Start the application:
 */
$(function(){
    /*
     * Start controller:
     */
    controller.init();
    
    
    /*
     * Tooltips for inline definitions
     */
    $("span.tooltip").tooltip();
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
    }
    
    //handle switching the transparency:
    var switched = false;

});

