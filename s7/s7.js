YUI({
    base : "yui3/build/",
    // filter : "debug",
    useConsole : true
}).use(
    "s7-slideshow",
    "s7-controls",
    "s7-keyboard",
    "s7-permalink",
    "s7-transition-fade",
    "console", function (Y) {
    // (new Y.Console).render();
    Y.S7.fire("start");
});
