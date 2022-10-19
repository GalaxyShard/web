javascript:(()=>{
    /* NOTE: only use multiline comments or some browsers wont work */
    var webtools = window.webtools;
    function exit() {
        var main = document.getElementById("webtools-main");
        main.remove();
        var style = document.getElementById("webtools-style");
        style.remove();
        
        console.log = webtools.oldLog;
        console.warn = webtools.oldWarn;
        console.error = webtools.oldConsoleError;
        
        window.removeEventListener("error", webtools.windowError);
        window.removeEventListener("resize", webtools.windowResize);

        window.webtools = undefined;
        webtools = undefined;
    }
    if (webtools) {
        exit();
        return;
    }
    webtools = {};
    window.webtools = webtools;

    function directLog(message, color) {
        var element = document.createElement("div");
        element.style.color=color;
        element.textContent = message;
        var shouldScroll = log.scrollTop >= log.scrollHeight-log.clientHeight-5;
        log.appendChild(element);
        
        if (shouldScroll) {
            log.scrollTop += element.offsetHeight;
        }
    }
    function redirectLog(data, color, original) {
        directLog(data.toString(), color);
        original?.apply(console, data);
    }
    function windowError(e) {
        directLog(`${e.name}: ${e.message}`, "red");
    }
    function windowResize() {
        setConsolePos(main.offsetLeft, main.offsetTop);
    }

    webtools.windowResize = windowResize;
    webtools.windowError = windowError;
    
    var style = document.createElement("style");
    style.id = "webtools-style";
    /* possibly use http request to get instead of embedding */
    style.textContent = `
        #webtools-main {
            font-size:14px;
            font-family:monospace;
            background-color:#000000;
            position:fixed;
            left:5px;
            top:5px;
            width:500px;
            height:300px;
            z-index:2147483647;
            box-sizing:border-box;
            border-radius:5px;
            resize:both;
            min-width:300px;
            min-height:200px;
            max-height:75vh;
            max-width:75vw;
        }
        #webtools-toolbar {
            visibility:visible;
            box-sizing:border-box;
            position:absolute;
            left:0px;
            top:0px;
            width:35px;
            height:95px;
            background-color:#404040;
            border-radius:5px;
        }
        #webtools-tabBar {
            position:absolute;
            left:40px;
            top:0;
            height:20px;
            /*background-color:#404040;*/
        }
        #webtools-tabBar button {
            box-sizing:border-box;
            margin:0 5px 0 0;
            background-color:#c0c0c0;
            border-radius:0 0 5px 5px;
            border:0;
        }
        .webtools-btn {
            width:25px;
            height:25px;
            display:block;
            background-color:#ffffff;
            border-radius:5px;
            font-size:12px;
            text-align:center;
            border:0;
            margin:5px;
        }
        #webtools-close {
            color:red;
        }
        #webtools-minify {
            color:grey;
        }
        #webtools-drag {
            color:black;
            cursor:move;
        }
        .webtools-btn:hover {
            background-color:#c0c0c0;
        }
        #webtools-console {
            position:absolute;
            top:25px;
            left:40px;
            width:calc(100% - 45px);
            height:calc(100% - 55px);
            color:#ffffff;
            overflow-wrap:break-word;
            white-space:pre-wrap;
            overflow-y:scroll;
            overscroll-behavior: none;
        }
        #webtools-source {
            position:absolute;
            top:25px;
            left:40px;
            width:calc(100% - 45px);
            height:calc(100% - 25px);
            color:#ffffff;
            overflow-wrap:break-word;
            white-space:pre-wrap;
            overflow-y:scroll;
            overscroll-behavior: none;
            visibility:hidden;
        }
        #webtools-cmd {
            background-color:#404040;
        }
    `;
    document.head.appendChild(style);
    var main = document.createElement("div");
    main.id = "webtools-main";


    /* TOOLBAR */

    var toolbar = document.createElement("div");
    toolbar.id = "webtools-toolbar";

    var close = document.createElement("button");
    close.id = "webtools-close";
    close.textContent = "X";
    close.classList.add("webtools-btn");
    close.addEventListener("click", _=>{
        exit();
    });
    toolbar.appendChild(close);

    var minify = document.createElement("button");
    minify.textContent = "-";
    minify.id = "webtools-minify";
    minify.classList.add("webtools-btn");
    minify.addEventListener("click", _=>{
        main.style.visibility = main.style.visibility=="hidden" ? "visible" : "hidden";
    });
    toolbar.appendChild(minify);

    var drag = document.createElement("button");
    drag.textContent = "*";
    drag.id = "webtools-drag";
    drag.classList.add("webtools-btn");
    var startOffsetX,startOffsetY;

    function clamp(x, min, max) { return Math.max(min, Math.min(x, max)); }
    function setConsolePos(x,y) {
        main.style.left = clamp(x, -2, window.innerWidth-33) + "px";
        main.style.top = clamp(y, -2, window.innerHeight-93) + "px";
    
    }
    function onMouseMove(e) {
        e.preventDefault();
        setConsolePos(e.clientX+startOffsetX, e.clientY+startOffsetY);
    }
    function onMouseUp() {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    }
    drag.addEventListener("mousedown", e=>{
        e.preventDefault();
        startOffsetX = -e.clientX + main.offsetLeft;
        startOffsetY = -e.clientY + main.offsetTop;
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });
    window.addEventListener("resize", windowResize);
    toolbar.appendChild(drag);
    
    /* TOOLBAR END */

    var tabBar = document.createElement("div");
    tabBar.id = "webtools-tabBar";
    
    var consoleTab = document.createElement("button");
    consoleTab.textContent = "console";

    consoleTab.addEventListener("click", _=>{
        source.style.visibility = "hidden";
        log.style.visibility = "inherit";
    });
    tabBar.appendChild(consoleTab);

    var sourceTab = document.createElement("button");
    sourceTab.textContent = "source";

    sourceTab.addEventListener("click", _=>{
        log.style.visibility = "hidden";
        source.style.visibility = "inherit";
        
        if (!webtools.didLoadSource) {
            webtools.didLoadSource = true;
            source.textContent = "Loading...";
            var liveSource = new XMLSerializer().serializeToString(document);
            source.textContent = liveSource;
        }
    });

    tabBar.appendChild(sourceTab);

    main.appendChild(tabBar);

    var source = document.createElement("div");
    source.id = "webtools-source";
    /* possibly delay loading source until tab is clicked on */
    main.appendChild(source);

    var log = document.createElement("div");
    log.id = "webtools-console";

    webtools.oldLog = console.log;
    console.log = (...data)=>{
        redirectLog(data, "white", webtools.oldLog);
    };
    webtools.oldWarn = console.warn;
    console.warn = (...data)=>{
        redirectLog(data, "yellow", webtools.oldWarn);
    };
    webtools.oldConsoleError = console.error;
    console.error = (...data)=>{
        redirectLog(data, "red", webtools.oldConsoleError);
    };
    window.addEventListener("error", windowError);

    var log = document.createElement("div");
    log.id = "webtools-console";
    main.appendChild(log);
    main.appendChild(toolbar);
    document.body.appendChild(main);
})();