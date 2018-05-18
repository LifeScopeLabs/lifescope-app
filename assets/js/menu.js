/**
 * Copyright (c) 2018 BitScoop Labs, Inc.
 * All rights reserved.
 */
define(["module", "jquery", "minimodal", "templates"], function(e, a) {
    "use strict";
    function s() {
        a("#menu").addClass("open")
    }
    function n() {
        a("#menu").removeClass("open")
    }
    a(document).ready(function() {
        a(document).on("click", function(e) {
            var s;
            s = a(e.target),
            a("#menu").hasClass("open") && 0 === s.closest("#menu").length && n()
        }),
        a(document).on("click", "#menu .menu header", n),
        a(document).on("click", "#menu-button", function(e) {
            e.stopPropagation(),
            s()
        }),
        a("#menu").on("click", ".menu .views > div:first-child, .menu .sort > div:first-child, .menu .facets > div:first-child", function(e) {
            var s, n, t, i = a(this);
            n = (s = i.parents("section").children(".sort, .views, .facets")).children("div:first-child"),
            t = s.children("div:last-child"),
            n.find("i.fa-caret-up").removeClass("fa-caret-up").addClass("fa-caret-down"),
            i.hasClass("active") ? (n.removeClass("active"),
            t.addClass("hidden"),
            i.parent(".sort, .views, .facets").find("i.fa-caret-up").removeClass("fa-caret-up").addClass("fa-caret-down")) : (n.removeClass("active"),
            t.addClass("hidden"),
            i.addClass("active"),
            i.parent().children("div:last-child").removeClass("hidden"),
            i.parent(".sort, .views, .facets").find("i.fa-caret-down").removeClass("fa-caret-down").addClass("fa-caret-up"))
        })
    }),
    e.exports = {
        close: n,
        open: s
    }
});
