const webtoolsStyle = `
    #webtools-main *, #webtools-main {
        all:revert;
        box-sizing:border-box;
    }
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
        border-radius:5px;
        overflow:auto;
        resize:both;
        min-width:300px;
        min-height:200px;
        max-height:75vh;
        max-width:75vw;
    }
    #webtools-toolbar {
        visibility:visible;
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
    }
    #webtools-tabBar button {
        margin:0 5px 0 0;
        background-color:#c0c0c0;
        border-radius:0 0 5px 5px;
        border:0;
    }
    #webtools-main .webtools-btn {
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
        cursor:grab;
    }
    #webtools-drag:active {
        color:black;
        cursor:grabbing;
    }
    #webtools-main .webtools-btn:hover {
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
    #webtools-math {
        position:absolute;
        top:25px;
        left:40px;
        width:calc(100% - 45px);
        height:calc(100% - 25px);
        color:#ffffff;
    }
    #webtools-math > input {
        width:100%;
        color:#000000;
        background-color:#ffffff;
    }
    #webtools-cmd {
        background-color:#404040;
    }
`;

/* NOTE: only use multiline comments or some browsers wont work */
var webtools = window.webtoolsData;
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

    window.webtoolsData = undefined;
    webtools = undefined;
}
if (webtools) {
    exit();
    return;
}
webtools = {};
window.webtoolsData = webtools;


/* MATH */
function parseEquation(str) {
    var index = 0;
    var token = {type:""};
    function isDigit(c) { return c>="0" && c<="9"; }
    function nextTkn() {
        if (index >= str.length) {
            token.type = "";
            token.val = undefined;
            return token;
        }
        while (str[index] === " ") {
            index += 1;
        }
        if (index >= str.length) {
            token.type = "";
            token.val = undefined;
            return token;
        }
        if (isDigit(str[index])) {
            var startIndex = index;
            index += 1;
            while (isDigit(str[index]))
                index += 1;
            if (str[index] === ".") {
                index += 1;
                while (isDigit(str[index]))
                    index += 1;
            }
            token.type = "number";
            token.val = parseFloat(str.substring(startIndex, index));
            return token;
        }
        var c = str[index];
        if (c==="+" || c==="-" || c==="*" || c==="/" || c==="^") {
            index += 1;
            token.type = "op";
            token.val = c;
            return token;
        }
        if (c==="(" || c===")") {
            index += 1;
            token.type = "parenthesis";
            token.val = c;
            return token;
        }
        token.type = "";
        token.val = undefined;
        return token;
    }
    function evalVal() {
        var val = token.val;
        if (val === "(") {
            nextTkn();
            val = evalAdd();
            /* token.val===")"*/
            nextTkn();
        } else {
            nextTkn();
        }
        return val;
    }
    function evalExp(){
        var lhs = evalVal();
        if (token.val === "^") {
            nextTkn();
            var rhs = evalNeg();
            return Math.pow(lhs, rhs);
        }
        return lhs;
    }
    function evalNeg(){
        if (token.val === "-") {
            nextTkn();
            return -evalNeg();
        }
        return evalExp();
    }
    function evalMul(){
        var lhs = evalNeg();
        while (token.val === "*" || token.val === "/") {
            var mul = token.val==="*";
            nextTkn();
            var rhs = evalNeg();
            if (mul) { lhs *= rhs; }
            else { lhs /= rhs; }
        }
        return lhs;
    }
    function evalAdd() {
        var lhs = evalMul();
        while (token.val === "+" || token.val === "-") {
            var add = token.val==="+";
            nextTkn();
            var rhs = evalMul();
            if (add) { lhs += rhs; }
            else { lhs -= rhs; }
        }
        return lhs;
    }
    /*console.log("tokens");
    while (1) {
        nextTkn();
        console.log("token: " + token.type + ", " + token.val);
        if (token.val === undefined) {
            break;
        }
    }
    console.log("end tokens");

    return undefined;*/
    
    nextTkn();
    /*try {
        return evalAdd();
    } catch (error) {
        console.error(error);
        return undefined;
    }*/
    var result = evalAdd();
    return result;
}
/* END OF MATH */

function directLog(message, color) {
    var element = document.createElement("div");
    element.style.color=color;
    element.textContent = message;
    var shouldScroll = consoleTab.scrollTop >= consoleTab.scrollHeight-consoleTab.clientHeight-5;
    consoleTab.appendChild(element);
    
    if (shouldScroll) {
        consoleTab.scrollTop += element.offsetHeight;
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
style.textContent = webtoolsStyle;
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
    if (main.style.visibility=="hidden"){
        main.style.visibility = "visible";
        minify.textContent = "-";
    } else {
        main.style.visibility = "hidden";
        minify.textContent = "+";
    }
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
var tabs = [];
function setTab(tab) {
    tabs.forEach(e => {
        e.style.visibility = "hidden";
    });
    tab.style.visibility = "inherit";
}

var tabBar = document.createElement("div");
tabBar.id = "webtools-tabBar";

function newTab(name, contentId, onOpen) {
    var openTab = document.createElement("button");
    openTab.textContent = name;
    var content = document.createElement("div");
    content.id = contentId;
    main.appendChild(content);
    tabs[tabs.length] = content;
    openTab.addEventListener("click", _=>{
        setTab(content);
        if (onOpen) { onOpen(content); }
    });
    tabBar.appendChild(openTab);
    return content;
}
var consoleTab = newTab("console", "webtools-console", null);
newTab("dom", "webtools-source", e=>{
    if (!webtools.didLoadSource) {
        webtools.didLoadSource = true;
        e.textContent = "Loading...";
        setTimeout(()=>{
            var liveSource = new XMLSerializer().serializeToString(document);
            e.textContent = liveSource;
        }, 0);
    }
});
newTab("math", "webtools-math", e=>{
    if (!webtools.loadedMath) {
        webtools.loadedMath = true;
        var input = document.createElement("input");
        input.addEventListener("input", e => {
            var str = e.currentTarget.value;
            setTimeout(()=>{
                /* var evaluated = parseEquation(e.currentTarget.value);*/
                var evaluated = parseEquation(str);
                output.textContent = evaluated || "___";
            }, 0);
        });
        e.appendChild(input);
        var output = document.createElement("p");
        output.textContent = "___";
        e.appendChild(output);
    }
});
setTab(consoleTab);
main.appendChild(tabBar);


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

main.appendChild(toolbar);
document.body.appendChild(main);