// This module provides browser history and permalinks for your presentation.

var Upstage = Y.Upstage,
    getText = Y.Selection.getText;

// Enable indexing by search engines.
Y.HistoryHash.hashPrefix = "!";

var history = new Y.HistoryHash,
    title,
    titleContent;

// Setup some data when the app starts.
Upstage.on("start", function () {
    title = Y.one("title");
    titleContent = getText(title);

    Upstage.fire("position", history.get("slide") || 1);
});

// Update our URL when the slide changes.
Upstage.on("navigate", function (idx) {
    history.addValue("slide", idx);
});

// Update the page title when the slide changes.
Upstage.on("transition", function (ev) {
    var next = ev.details[1],
        idx = next.getData("slide"),
        slide = Upstage.L10N.get("Slide"),
        slideTitle;

    if (idx == 1) {
        // Ignore the title slide,
        // because I like it that way.
        slideTitle = titleContent;
    } else {
        var h1 = next.one("h1");
        if (h1) slideTitle = getText(h1);
        if (!slideTitle) slideTitle = slide + " " + next.getData("slide");
        slideTitle = titleContent + ": " + slideTitle;
    }

    title.setContent(slideTitle);
});

// Handle changes to the URL.

// No matter what `ev.src` this came from, we will get
// two `slideChange` events for every change.
// That's OK, since `position` only acts if a change occurs.

function positioner (idx) {
    if (idx && idx.newVal) idx = idx.newVal;
    else idx = 1;
    Upstage.fire("position", idx);
}

history.on("slideChange", positioner);
history.on("slideRemove", positioner);
