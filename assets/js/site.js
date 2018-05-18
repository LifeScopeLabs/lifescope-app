/**
 * Copyright (c) 2018 BitScoop Labs, Inc.
 * All rights reserved.
 */
define(["jquery", "cookies", "ga", "nunjucks", "jquery-regexp-selector", "templates"], function(o, e, n, c) {
    "use strict";
    o(document).ready(function() {
        var n;
        e.get("cookieconsent") || (n = c.render("components/cookie-consent.html"),
        o("body").append(n)),
        o(document).on("click", ".modal .content", function(o) {
            o.stopPropagation()
        }),
        o(document).on("modalopen", function() {
            o("body").addClass("modal-open")
        }),
        o(document).on("modalclose", function() {
            o("body").removeClass("modal-open")
        }),
        o(document).on("click", ".cookie-consent button", function() {
            e.set("cookieconsent", !0, {
                expires: 365,
                path: "/",
                domain: "app.lifescope.io"
            }),
            o(".cookie-consent").remove()
        })
    }),
    n && (n("create", "UA-65896068-1", "auto"),
    n("send", "pageview"))
});
