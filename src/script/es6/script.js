$(function() {
    let app = {
        init: function() {
            this.$tab = $(".site-footer .item");
            this.$con = $(".home-content").children();
            this.bind();
            this.start();
        },
        bind: function() {
            let self = this;
            this.$tab.eq(0).addClass("active");
            this.$con.eq(0).show();

            this.$tab.on("click", function() {
                let index = $(this).index();
                $(this)
                    .addClass("active")
                    .siblings()
                    .removeClass("active");
                self.$con
                    .eq(index)
                    .fadeIn()
                    .siblings()
                    .hide();
            });
        },
        start: function() {
            top250.init();
            tomorrow.init();
            searchMovie.init();
        }
    };

    let top250 = {
        init: function() {
            this.count = 0;
            this.loading = false;
            this.$con = $(".top-content");
            this.$wrap = $(".top-content .wrap");
            this.$loading = $(".top-content .loading-box");
            this.total = null;
            this.getData();
            this.bind();
        },
        bind: function() {
            let self = this;
            this.$con.on("scroll", function() {
                if (self.loading) {
                    return;
                }
                if (self.count > self.total) {
                    return;
                }
                let totalHeight = self.$con.height() + self.$con.scrollTop();
                let wrapHeight = self.$wrap.height();
                if (totalHeight + 15 > wrapHeight) {
                    self.getData();
                }
            });
        },
        getData: function() {
            let self = this;
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
            })
                .done(function(data) {
                    self.total = data.total;
                    console.log(data);
                    self.render(data);
                    self.count += 20;
                    self.loading = false;
                    self.$loading.hide();
                })
                .fail(function(error) {
                    console.log(error);
                    self.$loading.hide();
                });
        },
        render: function(data) {
            let tpl = document.getElementById("tpl-douban").innerHTML;
            let subjects = data.subjects;
            let html = template.render(tpl, subjects);
            this.$wrap.append(html);
        }
    };

    let tomorrow = {
        init: function() {
            this.count = 0;
            this.loading = false;
            this.$con = $(".hot-content");
            this.$wrap = $(".hot-content .wrap");
            this.$loading = $(".hot-content .loading-box");
            this.getData();
            this.bind();
        },
        bind: function() {
            let self = this;
            this.$con.on("scroll", function() {
                if (self.loading) {
                    return;
                }
                if (self.count > self.total) {
                    return;
                }
                let totalHeight = self.$con.height() + self.$con.scrollTop();
                let wrapHeight = self.$wrap.height();
                if (totalHeight + 15 > wrapHeight) {
                    self.getData();
                }
            });
        },
        getData: function() {
            let self = this;
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
            })
                .done(function(data) {
                    self.total = data.total;
                    console.log(data);
                    self.render(data);
                    self.count += 20;
                    self.loading = false;
                    self.$loading.hide();
                })
                .fail(function(error) {
                    console.log(error);
                    self.$loading.hide();
                });
        },
        render: function(data) {
            let tpl = document.getElementById("tpl-douban").innerHTML;
            let subjects = data.subjects;
            let html = template.render(tpl, subjects);
            this.$wrap.append(html);
        }
    };

    let searchMovie = {
        init: function() {
            this.$wrap = $(".search-content .search-result");
            this.$btn = $(".search-input button");
            this.$input = $(".search-input input");
            this.loading = false;
            this.$loading = $(".search-content .loading-box");
            this.$loading.hide();
            this.bind();
        },
        bind: function() {
            let self = this;
            if (self.loading) {
                return;
            }
            self.$btn.on("click", function() {
                self.getData();
            });
        },
        getData: function() {
            let self = this;
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
            })
                .done(function(data) {
                    console.log(data);
                    self.render(data);
                    self.loading = false;
                    self.$loading.hide();
                })
                .fail(function(error) {
                    console.log(error);
                    self.$loading.hide();
                });
        },
        render: function(data) {
            let tpl = document.getElementById("tpl-douban").innerHTML;
            let subjects = data.subjects;
            let html = template.render(tpl, subjects);
            this.$wrap.html(html);
        }
    };

    app.init();
});
