    // i not found any better solution on the big websites (ex; blank page loaded when call alert script)
    // wehn document is ready, full loaded and rendered with all staffs (onreday, documentloaded...etc not work properly)
    // when you can see all elements in the page non bloquing resources (idea, inject xhr code when fully loaded and execute)
    // then start downloading javascript resources and apply to the page and then execute

    let isHeader 		= false;
    let sleepXHR 		= "1100";
    let exec_method 	= false;

    // Load resources
    let load_src = [

        // Stylesheets ->fonts need to fix
        { name: 'fonts', src_url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css', src_method: 'no', options: 'head' },
        { name: 'style', src_url: 'https://localhost/style.css', src_method: 'no', options: 'head' },
        { name: 'stylesheet', src_url: 'css/styles.css', src_method: 'no', options: 'head' },

        // Javscripts
        { name: 'head', src_url: 'js/head.js', src_method: 'yes', options: 'head' }, 
        { name: 'slider', src_url: 'js/slider.js', src_method: 'no', options: 'body-inline' }

        // images or other media?
    ];	

    // Gets file extension from URL, or return false if there's no extension
    const extensions = (url) => {
        // Extension starts after the first dot after the last slash
        var extStart = url.indexOf('.',url.lastIndexOf('/')+1);
        if (extStart==-1) return false;
        var ext = url.substr(extStart+1),

        // end of extension must be one of: end-of-string or question-mark or hash-mark
        extEnd = ext.search(/$|[?#]/);
        return ext.substring (0,extEnd);
    }

    // Load resources with XHR Payload
    const loadExternalScripts = (axx,bxx,cxx) =>
    {
        var xhr = new XMLHttpRequest();
        xhr.open("get", axx, true);

        xhr.onreadystatechange = function()
        {
            if (xhr.readyState == 4)
            {
                if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304)
                {
                    // load js scripts and css stylesheets
                    const loadScript = (src,method,options) =>
                    {	

                        var versionUpdate 	= (new Date()).getTime();

                        // comprobamos si es css o javascript
                        if(extensions(src) != null)
                        {
                            var ext = extensions(axx);

                            if(ext === 'css')
                            {
                                var file = location.pathname.split( "/" ).pop();
                                var link = document.createElement( "link" );

                                link.href = src.substr( 0, src.lastIndexOf( "." ) ) + ".css";
                                link.type = "text/css";
                                link.rel = "stylesheet";
                                link.media = "screen,print";

                                document.getElementsByTagName( "head" )[0].appendChild( link );
                            }									
                            else if(ext === 'js')
                            {

                                var script 		= document.createElement("script");
                                script.type 		= "text/javascript";

                                if(method != null)
                                {
                                    if(method === 'yes')
                                    {
                                        exec_method = true;
                                    }
                                    else if (method === 'no')
                                    {
                                        exec_method = false;
                                    }
                                    else
                                    {
                                        exec_method = false;
                                    }
                                }
                                else
                                {
                                    exec_method = false;
                                }

                                if(options != null)
                                {
                                    if(options === 'head')
                                    {					
                                        script.src = src+"?v=" + versionUpdate;
                                        script.async = exec_method;
                                        document.getElementsByTagName("head")[0].appendChild(script);
                                    }
                                    else if (options === 'head-inline')
                                    {
                                        script.text = xhr.responseText;
                                        document.getElementsByTagName("head")[0].appendChild(script);
                                    }
                                    else if (options === 'body')
                                    {
                                        script.src = src + "?v=" + versionUpdate;
                                        script.async = exec_method;
                                        document.body.appendChild(script);
                                    }
                                    else if (options === 'body-inline')
                                    {
                                        script.text = xhr.responseText;
                                        document.body.appendChild(script);
                                    }
                                    else
                                    {			
                                        script.src = src + "?v=" + versionUpdate;
                                        script.async = exec_method;
                                        document.body.appendChild(script);
                                    }			
                                }
                            }
                            else
                            {
                                // no hay extensiones
                            }
                        }
                    }

                    loadScript(axx, bxx, cxx);
                }
            }
        };
        // primero llamamos al script head.js
        setTimeout(() => { xhr.send(null); }, sleepXHR);
    }

    // Check the document status
    document.addEventListener('readystatechange', event => 
    { 

        // When the document is still loading.
        if (event.target.readyState === "loading") 
        {   
            console.log("loading");
        }

        // When HTML/DOM elements are ready:
        if (event.target.readyState === "interactive") 
        {   
            //does same as:  ..addEventListener("DOMContentLoaded"..
            console.log("interactive");
        }

        // When window loaded ( external resources are loaded too- `css`,`src`, etc...) 
        if (event.target.readyState === "complete") 
        {
            // Load every script in a loop
            let elements_loaded = false;

            for (var xhrscript of load_src) 
            {
                loadExternalScripts(xhrscript.src_url, xhrscript.src_method, xhrscript.options);
                elements_loaded = true;
            }

            if(elements_loaded === true)
            {
                console.log("complete");
            }
        }
    });
