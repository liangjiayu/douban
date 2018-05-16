var del = require("del");
var gulp = require("gulp");
var sass = require("gulp-sass");
var autoprefixer = require("autoprefixer");
var postcss = require("gulp-postcss");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var cleanCSS = require("gulp-clean-css");
var htmltpl = require("gulp-html-tpl");
var artTemplate = require("art-template");
var browserSync = require("browser-sync");
var imagemin = require("gulp-imagemin");

artTemplate.defaults.rules.unshift({
    test: /{{raw}}([\w\W]*?){{\/raw}}/,
    use: function(match, code) {
        return { output: "raw", code: JSON.stringify(code) };
    }
});

var paths = {
    src: {
        style: "src/style/",
        styleLib: "src/style/libs/*.css",
        script: "src/script/",
        scriptLib: "src/script/libs/*.js",
        views: "src/views/**/*",
        pages: "src/pages/",
        data: "src/data/",
        fonts: "src/fonts/",
        images: "src/images/",
        media: "src/media/"
    },
    built: {
        root: "built/",
        style: "built/style/",
        script: "built/script/",
        pages: "built/pages/",
        data: "built/data/",
        fonts: "built/fonts/",
        images: "built/images/",
        media: "built/media/"
    }
};

// task src
gulp.task("delhtml", function() {
    return del(["src/pages/**/*"]);
});

gulp.task("compileHtml", ["delhtml"], function() {
    return gulp
        .src(paths.src.views)
        .pipe(
            htmltpl({
                engine: function(template, data) {
                    return artTemplate.compile(template)(data);
                },
                beautify: {
                    indent_size: 4,
                    indent_char: " ",
                    indent_with_tabs: false,
                    eol: "\n"
                }
            })
        )
        .pipe(gulp.dest(paths.src.pages))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task("sass", function() {
    return gulp
        .src(paths.src.style + "style.scss")
        .pipe(sourcemaps.init())
        .pipe(sass().on("error", sass.logError))
        .pipe(
            postcss([
                autoprefixer({
                    browsers: [
                        "last 4 versions",
                        "not ie <= 8",
                        "Android >= 4.0",
                        "ios > 7",
                        "ff >= 15"
                    ]
                })
            ])
        )
        .pipe(sourcemaps.write("./maps"))
        .pipe(gulp.dest(paths.src.style))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task("scriptbabel", function() {
    return gulp
        .src(paths.src.script + "es6/*.js")
        .pipe(
            babel({
                presets: ["env"]
            })
        )
        .pipe(gulp.dest(paths.src.script));
});

gulp.task("scriptmin", function() {
    return gulp
        .src(paths.src.scriptLib)
        .pipe(concat("core.js"))
        .pipe(uglify())
        .pipe(gulp.dest(paths.src.script));
});

gulp.task("cssmin", function() {
    return gulp
        .src(paths.src.styleLib)
        .pipe(concat("core.css"))
        .pipe(cleanCSS())
        .pipe(gulp.dest(paths.src.style));
});

gulp.task("imagemin", function() {
    return gulp
        .src("src/images/**/*")
        .pipe(imagemin())
        .pipe(gulp.dest("src/images/"));
});

gulp.task("server", function() {
    browserSync.init({
        server: {
            baseDir: "./src"
        },
        port: 3001,
        startPath: "/pages"
    });
});

gulp.task("watch", ["server"], function() {
    gulp.watch(paths.src.views, ["compileHtml"]);
    gulp.watch(paths.src.style + "**/*.scss", ["sass"]);
    gulp.watch(paths.src.script + "es6/*.js", ["scriptbabel"]);
    gulp.watch(paths.src.scriptLib, ["scriptmin"]);
    gulp.watch(paths.src.styleLib, ["cssmin"]);
});

gulp.task("default", ["watch"]);

// task src end

// built task
gulp.task("delbuilt", function() {
    del([paths.built.root + "**/*"]);
});

gulp.task("moveData", ["delbuilt"], function() {
    return gulp.src(paths.src.data + "**/*").pipe(gulp.dest(paths.built.data));
});

gulp.task("moveFonts", ["moveData"], function() {
    return gulp
        .src(paths.src.fonts + "**/*")
        .pipe(gulp.dest(paths.built.fonts));
});

gulp.task("moveMedia", ["moveFonts"], function() {
    return gulp
        .src(paths.src.media + "**/*")
        .pipe(gulp.dest(paths.built.media));
});

gulp.task("moveScript", ["moveMedia"], function() {
    return gulp
        .src(paths.src.script + "*.js")
        .pipe(uglify())
        .pipe(gulp.dest(paths.built.script));
});

gulp.task("moveStyle", ["moveScript"], function() {
    return gulp
        .src(paths.src.style + "*.css")
        .pipe(cleanCSS())
        .pipe(gulp.dest(paths.built.style));
});

gulp.task("movePages", ["moveStyle"], function() {
    return gulp
        .src(paths.src.pages + "**/*")
        .pipe(gulp.dest(paths.built.pages));
});

gulp.task("delPublic", ["movePages"], function() {
    return del([paths.built.pages + "public"]);
});

gulp.task("moveImages", ["delPublic"], function() {
    return gulp
        .src(paths.src.images + "**/*")
        .pipe(imagemin())
        .pipe(gulp.dest(paths.built.images));
});

gulp.task("built", ["moveImages"]);
