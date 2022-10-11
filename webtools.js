javascript:(()=>{
    function exit() {
        var main = document.getElementById("webtools-main");
        main.remove();
        var style = document.getElementById("webtools-style");
        style.remove();

        console.log = window.oldLog;
        window.oldLog = undefined;

        console.warn = window.oldWarn;
        window.oldWarn = undefined;

        console.error = window.oldConsoleError;
        window.oldConsoleError = undefined;

        window.webtoolsLoaded = undefined;
    }
    if (window.webtoolsLoaded) {
        exit();
        return;
    }
    window.webtoolsLoaded = true;
    
    var style = document.createElement("style");
    style.id = "webtools-style";
    /* possibly use http request to get instead of embedding */
    style.textContent = `
        #webtools-main {
            background-color:#202020;
            position:fixed;
            left:5px;
            top:5px;
            width:500px;
            height:300px;
            z-index:2147483647;
            box-sizing:border-box;
            padding:5px;
            border-radius:5px;
            resize:both;
            min-width:300px;
            min-height:200px;
            max-height:75vh;
            max-width:75vw;
            /*overflow:auto;*/
        }
        #webtools-toolbar {
            position:absolute;
            left:5px;
            top:5px;
            width:35px;
            height:100%;
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
            margin-left:35px;
            height:calc(100% - 30px);
            color:#ffffff;
            overflow-wrap:break-word;
            white-space:pre-wrap;
            overflow-y:scroll;
        }
        ::-webkit-scrollbar {
            -webkit-appearance: none;
            width: 7px;
        }
        ::-webkit-scrollbar-thumb {
            border-radius: 4px;
            background-color: #ffffff80;
            -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, .5);
        }
    `;
    document.head.appendChild(style);
    /*var liveSource = new XMLSerializer().serializeToString(document);*/
    var main = document.createElement("div");
    main.id = "webtools-main";

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
    
    });
    toolbar.appendChild(minify);

    var drag = document.createElement("button");
    drag.textContent = "*";
    drag.id = "webtools-drag";
    drag.classList.add("webtools-btn");
    var startOffsetX,startOffsetY;

    function clamp(x, min, max) { return Math.max(min, Math.min(x, max)); }
    function setConsolePos(x,y) {
        main.style.left = clamp(x, -5, window.innerWidth-40) + "px";
        main.style.top = clamp(y, -5, window.innerHeight-100) + "px";
    
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
    window.addEventListener("resize", _=>{
        setConsolePos(main.offsetLeft, main.offsetTop);
    });
    toolbar.appendChild(drag);
    


    var log = document.createElement("div");
    log.id = "webtools-console";

    window.oldLog = console.log;
    console.log = (...data)=>{
        var element = document.createElement("div");
        element.textContent = data.toString();
        log.appendChild(element);
        window.oldLog.apply(console, data);
    };
    window.oldWarn = console.warn;
    console.warn = (...data)=>{
        var element = document.createElement("div");
        element.style.color="yellow";
        element.textContent = data.toString();
        log.appendChild(element);
        window.oldWarn.apply(console, data);
    };
    window.oldConsoleError = console.error;
    console.error = (...data)=>{
        var element = document.createElement("div");
        element.style.color="red";
        element.textContent = data.toString();
        log.appendChild(element);
        window.oldConsoleError.apply(console, data);
    };
    main.appendChild(log);
    /*sourceElement.textContent = liveSource;*/
    main.appendChild(toolbar);
    document.body.appendChild(main);
})();