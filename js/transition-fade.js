var running = false;
var queue = new Y.AsyncQueue;

function shutdown () {
    running = false;
    queue.stop();
}

Y.Upstage.on("transition", function (ev) {

    if (running) {
        // A transition is already in progress.
        // Run Upstage's default transition behavior
        // by reverting our styles and not calling
        // ev.preventDefault. Finally, tell the
        // current transitions to halt.
        Y.all(".slide").setStyles({
            "opacity" : "1",
            "display" : "none"
        });
        return shutdown();
    }

    ev.preventDefault();
    running = true;

    var prev = ev.details[0],
        next = ev.details[1];

    queue.add(function () {
        // run the next function after transition completes:
        queue.pause();
        // we use AsyncQueue just for the stop() ability.
        prev.transition({
            duration : 0.2,
            easing : "ease-out",
            opacity : 0
        }, Y.bind(queue.run, queue));
    });

    queue.add(function () {
        queue.pause();
        next.setStyles({
            "opacity" : "0",
            "display" : "block"
        });
        next.transition({
            duration : 0.2,
            easing : "ease-out",
            opacity : 1
        }, Y.bind(queue.run, queue));
    });

    queue.add(function () {
        // hide the previous slide completely.
        // this prevents a transparent slide
        // from getting in the way of elements
        // on the current slide.
        prev.setStyles({
            "display" : "none",
            "opacity" : "1"
        });
    });

    queue.add(shutdown);

    queue.run();

});