let pagesRegex = /^https:\/\/(.+?)\.github\.io\/(.+?)(\/.*)?$/;
let sourceRegex = /^https:\/\/github\.com\/(.+?)\/(.+?)(\/.*)?$/;
let url = window.location.href;
if (pagesRegex.test(url)) {
    let match = url.match(pagesRegex);
    window.location.href = `https://github.com/${match[1]}/${match[2]}`;
} else if (sourceRegex.test(url)) {
    let match = url.match(sourceRegex);
    window.location.href = `https://${match[1]}.github.io/${match[2]}`;
} else {
    alert("This is not a Github Pages site!");
}