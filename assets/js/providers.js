define(
    ["jquery", "lodash", "nunjucks", "jquery-mixitup", "templates"],
    function (e, o, n) {
        "use strict";
        function t() {
            e("body").hasClass("ctl-expand") ?
                e(".mobile-selector i")
                    .removeClass("fa-caret-down")
                    .addClass("fa-caret-up") :
                e(".mobile-selector i")
                    .removeClass("fa-caret-up")
                    .addClass("fa-caret-down")
        }
        e(document).ready(function () {
            e("#provider-grid").mixItUp(),
                e(document).on("click", ".mix", function (t) {
                    var i = e(this);
                    e("#connection-modal")
                        .modal({
                            position: !1,
                            preOpen: function () {
                                var t;
                                t = i.attr("data-id"),
                                    e.ajax({ url: "https://app.lifescope.io/api/providers/" + t, type: "GET" })
                                        .then(function (t) {
                                            var i, a, c;
                                            c = e("#workflow"),
                                                a = e(".sources"),
                                                i = "My " + t.name + " Account",
                                                a.empty(),
                                                c.attr("data-provider-id", t.id),
                                                c.find("i")
                                                    .removeClass()
                                                    .addClass("fa fa-" + t.name.toLowerCase()),
                                                c.find(".header")
                                                    .html("New " + t.name + " Connection"),
                                                c.find('input[name="provider_id"]')
                                                    .val(t.id),
                                                c.find('input[name="name"]')
                                                    .attr("placeholder", i),
                                                e(".action button")
                                                    .html("Connect to " + t.name),
                                                o.forEach(t.sources, function (e, o) {
                                                    var t;
                                                    t = n.render("components/source.html", {
                                                        source_name: o, source: e
                                                    }), a.append(t)
                                                })
                                        })
                            }, postOpen: function () { e(this).css("display", "flex") }
                        })
                }),
                e("#done")
                    .on("click", function (e) {
                        window.location.href = "/"
                    }),
                e(document)
                    .on("click", ".mobile-selector", function () {
                        e("body")
                            .toggleClass("ctl-expand"), t()
                    }),
                e(document)
                    .on("click", ".filter", function () {
                        var o = e(this);
                        e("body").removeClass("ctl-expand"),
                            e(".mobile-selector")
                                .children(".placeholder-text")
                                .text(o.text()), t()
                    }),
                e(document)
                    .on("click", ".login i", function () {
                        e("#login-modal")
                            .modal({
                                position: !1, postOpen: function () {
                                    e(this)
                                        .css("display", "flex")
                                }
                            })
                    })
        })
    });