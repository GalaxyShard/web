let webtools = document.getElementById("bookmarklet-webtools");
let gitpages = document.getElementById("bookmarklet-gitpages");

function loadScript(element, link) {
    fetch(link)
        .then((response) => response.text())
        .then((data) => {
            element.href = `javascript:(()=>{${data}})();`;
            element.classList.add("loaded");
        });
}
loadScript(gitpages, "bookmarklets/github-swap.min.js");
loadScript(webtools, "bookmarklets/webtools.min.js");