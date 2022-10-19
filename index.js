var webtools = document.getElementById("bookmarklet-webtools");

webtools.href = 'javascript:(()=>{var e,o,t=window.webtools;function i(){document.getElementById("webtools-main").remove(),document.getElementById("webtools-style").remove(),console.log=t.oldLog,console.warn=t.oldWarn,console.error=t.oldConsoleError,window.removeEventListener("error",t.windowError),window.removeEventListener("resize",t.windowResize),window.webtools=void 0,t=void 0}if(t){i();return}function n(e,o){var t=document.createElement("div");t.style.color=o,t.textContent=e;var i=E.scrollTop>=E.scrollHeight-E.clientHeight-5;E.appendChild(t),i&&(E.scrollTop+=t.offsetHeight)}function r(e,o,t){n(e.toString(),o),t?.apply(console,e)}function l(e){n(`${e.name}: ${e.message}`,"red")}function s(){h(a.offsetLeft,a.offsetTop)}t={},window.webtools=t,t.windowResize=s,t.windowError=l;var d=document.createElement("style");d.id="webtools-style",d.textContent="#webtools-main,#webtools-toolbar{border-radius:5px;box-sizing:border-box}#webtools-tabBar button,.webtools-btn:hover{background-color:silver}#webtools-console,#webtools-source{position:absolute;top:25px;left:40px;width:calc(100% - 45px);color:#fff;overflow-wrap:break-word;white-space:pre-wrap;overflow-y:scroll;overscroll-behavior:none}#webtools-cmd,#webtools-toolbar{background-color:#404040}#webtools-main{font-size:14px;font-family:monospace;background-color:#000;position:fixed;left:5px;top:5px;width:500px;height:300px;z-index:2147483647;resize:both;min-width:300px;min-height:200px;max-height:75vh;max-width:75vw}#webtools-toolbar{visibility:visible;position:absolute;left:0;top:0;width:35px;height:95px}#webtools-tabBar{position:absolute;left:40px;top:0;height:20px}#webtools-tabBar button{box-sizing:border-box;margin:0 5px 0 0;border-radius:0 0 5px 5px;border:0}.webtools-btn{width:25px;height:25px;display:block;background-color:#fff;border-radius:5px;font-size:12px;text-align:center;border:0;margin:5px}#webtools-close{color:red}#webtools-minify{color:grey}#webtools-drag{color:#000;cursor:move}#webtools-console{height:calc(100% - 55px)}#webtools-source{height:calc(100% - 25px);visibility:hidden}",document.head.appendChild(d);var a=document.createElement("div");a.id="webtools-main";var b=document.createElement("div");b.id="webtools-toolbar";var c=document.createElement("button");c.id="webtools-close",c.textContent="X",c.classList.add("webtools-btn"),c.addEventListener("click",e=>{i()}),b.appendChild(c);var p=document.createElement("button");p.textContent="-",p.id="webtools-minify",p.classList.add("webtools-btn"),p.addEventListener("click",e=>{a.style.visibility="hidden"==a.style.visibility?"visible":"hidden"}),b.appendChild(p);var v=document.createElement("button");function w(e,o,t){return Math.max(o,Math.min(e,t))}function h(e,o){a.style.left=w(e,-2,window.innerWidth-33)+"px",a.style.top=w(o,-2,window.innerHeight-93)+"px"}function m(t){t.preventDefault(),h(t.clientX+e,t.clientY+o)}function x(){document.removeEventListener("mousemove",m),document.removeEventListener("mouseup",x)}v.textContent="*",v.id="webtools-drag",v.classList.add("webtools-btn"),v.addEventListener("mousedown",t=>{t.preventDefault(),e=-t.clientX+a.offsetLeft,o=-t.clientY+a.offsetTop,document.addEventListener("mousemove",m),document.addEventListener("mouseup",x)}),window.addEventListener("resize",s),b.appendChild(v);var f=document.createElement("div");f.id="webtools-tabBar";var u=document.createElement("button");u.textContent="console",u.addEventListener("click",e=>{g.style.visibility="hidden",E.style.visibility="inherit"}),f.appendChild(u);var $=document.createElement("button");$.textContent="source",$.addEventListener("click",e=>{if(E.style.visibility="hidden",g.style.visibility="inherit",!t.didLoadSource){t.didLoadSource=!0,g.textContent="Loading...";var o=new XMLSerializer().serializeToString(document);g.textContent=o}}),f.appendChild($),a.appendChild(f);var g=document.createElement("div");g.id="webtools-source",a.appendChild(g);var E=document.createElement("div");E.id="webtools-console",t.oldLog=console.log,console.log=(...e)=>{r(e,"white",t.oldLog)},t.oldWarn=console.warn,console.warn=(...e)=>{r(e,"yellow",t.oldWarn)},t.oldConsoleError=console.error,console.error=(...e)=>{r(e,"red",t.oldConsoleError)},window.addEventListener("error",l);var E=document.createElement("div");E.id="webtools-console",a.appendChild(E),a.appendChild(b),document.body.appendChild(a)})();';

