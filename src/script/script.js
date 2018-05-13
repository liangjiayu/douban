"use strict";

$(function () {
    var app = {
        init: function init() {
            this.$tab = $(".site-footer .item");
            this.$con = $(".home-content").children();
            this.bind();
            this.start();
        },
        bind: function bind() {
            var self = this;
            this.$tab.eq(0).addClass("active");
            this.$con.eq(0).show();

            this.$tab.on("click", function () {
                var index = $(this).index();
                $(this).addClass("active").siblings().removeClass("active");
                self.$con.eq(index).fadeIn().siblings().hide();
            });
        },
        start: function start() {
            top250.init();
            tomorrow.init();
            searchMovie.init();
        }
    };

    var top250 = {
        init: function init() {
            this.count = 0;
            this.loading = false;
            this.$con = $(".top-content");
            this.$wrap = $(".top-content .wrap");
            this.$loading = $(".top-content .loading-box");
            this.total = null;
            this.getData();
            this.bind();
        },
        bind: function bind() {
            var self = this;
            this.$con.on("scroll", function () {
                if (self.loading) {
                    return;
                }
                if (self.count > self.total) {
                    return;
                }
                var totalHeight = self.$con.height() + self.$con.scrollTop();
                var wrapHeight = self.$wrap.height();
                if (totalHeight + 15 > wrapHeight) {
                    self.getData();
                }
            });
        },
        getData: function getData() {
            var self = this;
            self.loading = true;
            self.$loading.show();
            $.ajax({
                url: "https://api.douban.com/v2/movie/top250",
                type: "GET",
                dataType: "jsonp",
                data: {
                    start: self.count,
                    count: 20
                }
            }).done(function (data) {
                self.total = data.total;
                console.log(data);
                self.render(data);
                self.count += 20;
                self.loading = false;
                self.$loading.hide();
            }).fail(function (error) {
                console.log(error);
                self.$loading.hide();
            });
        },
        render: function render(data) {
            var tpl = document.getElementById("tpl-douban").innerHTML;
            var subjects = data.subjects;
            var html = template.render(tpl, subjects);
            this.$wrap.append(html);
        }
    };

    var tomorrow = {
        init: function init() {
            this.count = 0;
            this.loading = false;
            this.$con = $(".hot-content");
            this.$wrap = $(".hot-content .wrap");
            this.$loading = $(".hot-content .loading-box");
            this.getData();
            this.bind();
        },
        bind: function bind() {
            var self = this;
            this.$con.on("scroll", function () {
                if (self.loading) {
                    return;
                }
                if (self.count > self.total) {
                    return;
                }
                var totalHeight = self.$con.height() + self.$con.scrollTop();
                var wrapHeight = self.$wrap.height();
                if (totalHeight + 15 > wrapHeight) {
                    self.getData();
                }
            });
        },
        getData: function getData() {
            var self = this;
            self.loading = true;
            self.$loading.show();
            $.ajax({
                url: "https://api.douban.com/v2/movie/coming_soon",
                type: "GET",
                dataType: "jsonp",
                data: {
                    start: self.count,
                    count: 20
                }
            }).done(function (data) {
                self.total = data.total;
                console.log(data);
                self.render(data);
                self.count += 20;
                self.loading = false;
                self.$loading.hide();
            }).fail(function (error) {
                console.log(error);
                self.$loading.hide();
            });
        },
        render: function render(data) {
            var tpl = document.getElementById("tpl-douban").innerHTML;
            var subjects = data.subjects;
            var html = template.render(tpl, subjects);
            this.$wrap.append(html);
        }
    };

    var searchMovie = {
        init: function init() {
            this.$wrap = $(".search-content .search-result");
            this.$btn = $(".search-input button");
            this.$input = $(".search-input input");
            this.loading = false;
            this.$loading = $(".search-content .loading-box");
            this.$loading.hide();
            this.bind();
        },
        bind: function bind() {
            var self = this;
            if (self.loading) {
                return;
            }
            self.$btn.on("click", function () {
                self.getData();
            });
        },
        getData: function getData() {
            var self = this;
            self.loading = true;
            self.$loading.show();
            $.ajax({
                url: "https://api.douban.com/v2/movie/search",
                type: "GET",
                dataType: "jsonp",
                data: {
                    tag: self.$input.val(),
                    q: self.$input.val()
                }
            }).done(function (data) {
                console.log(data);
                self.render(data);
                self.loading = false;
                self.$loading.hide();
            }).fail(function (error) {
                console.log(error);
                self.$loading.hide();
            });
        },
        render: function render(data) {
            var tpl = document.getElementById("tpl-douban").innerHTML;
            var subjects = data.subjects;
            var html = template.render(tpl, subjects);
            this.$wrap.html(html);
        }
    };

    app.init();
});