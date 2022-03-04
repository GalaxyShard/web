window.addEventListener("pageshow", function()
{
    document.documentElement.classList.add("page-load");
});
window.addEventListener("beforeunload", function()
{
    document.documentElement.classList.add("page-unload");
});
