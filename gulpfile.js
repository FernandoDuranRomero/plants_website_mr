const {series, src, dest, watch} = require("gulp");

const gulp = require("gulp");

const htmlmin = require('gulp-htmlmin');

const sass = require("gulp-sass")(require("node-sass"));

const notify = require("gulp-notify");

const image = require("gulp-image");

const concat = require("gulp-concat");

const autoprefixer = require("autoprefixer");

const postcss = require("gulp-postcss");

const cssnano = require("cssnano");

const sourcemaps = require("gulp-sourcemaps");

const terser = require("gulp-terser-js");

const rename = require("gulp-rename");

gulp.task('minify-html', () => {
  return gulp.src('./*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('./build'));
});

gulp.task('image', (done) => {
    gulp.src('src/img/**/*')
      .pipe(image({
        pngquant: true,
        optipng: false,
        zopflipng: true,
        jpegRecompress: false,
        mozjpeg: true,
        gifsicle: true,
        svgo: true,
        concurrent: 10
    }))
      .pipe(gulp.dest('./build/img'))
      .pipe(notify({message: "minified image"}));
      done();
     
  });

  function css() {
    return src("src/scss/app.scss")
       .pipe( sourcemaps.init() )
      .pipe(sass())
      .pipe( postcss( [autoprefixer(), cssnano() ]) )
      .pipe( sourcemaps.write(".") )
      .pipe(dest("./build/css"));
  }

function javascript(){
    return src("src/js/**/*.js")
    .pipe(sourcemaps.init())
    .pipe(concat("bundle.js"))
    .pipe(terser())
    .pipe(sourcemaps.write("."))
    .pipe(rename({suffix: ".min"}))
    .pipe(dest("./build/js"))
  }

  function watchfiles() {
    watch("src/scss/**/*.scss", css); 
    watch("src/js/**/*.js", javascript);
    watch("./*.html", gulp.task("minify-html"));
  }


exports.css = css;
exports.watchfiles = watchfiles;
exports.default = series( gulp.task("minify-html"), css, javascript,  watchfiles );