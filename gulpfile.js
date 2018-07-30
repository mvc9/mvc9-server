/*
 *  mvc9 demo - gulpfile.js
 *  http://localhost:1090/
*/

const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const minifycss = require('gulp-clean-css');
const eslint = require('gulp-eslint');
const uglify = require('gulp-uglify');
const watch = require('gulp-watch');
// 取命令行参数
const argv = process.argv;
const cmdArgLast = argv[argv.length - 1].match(/^[^\.]+$/g) || ['dev'];

// 是否执行开发模式编译;=true不会压缩js/css;
let developmentMode = (cmdArgLast[0] !== 'build');
// 开发源路径根目录
let appSrcBaseDir = "./webApp/dafuim_dev";
// 项目编译路径根目录
let appBuildBaseDir = "./webApp/dafuim";

let config = {
  // LESS开发源路径
  "sassSrc": appSrcBaseDir + "/**/*.scss",
  // LESS编译输出路径
  "sassExport": appBuildBaseDir,
  // 编译时压缩样式表
  "sassCompress": !developmentMode,
  // JS开发源路径
  "jsSrc": [appSrcBaseDir + "/**/*.js", "!./**/*.c.js", "!./**/*.tpl.js"],
  // 公用模块JS事件
  "tplJsSrc": appSrcBaseDir + "/**/*.tpl.js",
  // JS编译输出路径
  "jsExportDir": appBuildBaseDir,
  // 编译时压缩JS
  "jsCompress": !developmentMode,
  // HTML5开发源路径
  "htmlSrc": appSrcBaseDir + "/**/*.html",
  // HTML5编译路径
  "htmlExportDir": appBuildBaseDir,
  // src源路径
  "srcSrc": [appSrcBaseDir + "/**/*.!(js)", appSrcBaseDir + "/**/*.c.js", "!./**/*.scss", "!./**/*.html"],
  // src发布路径
  "srcExportDir": appBuildBaseDir
};

gulp.task('sass', function() {
  if (config.sassCompress) {
    return gulp.src([config.sassSrc]) // sass源文件
      .pipe(sass()) // 执行编译
      .pipe(autoprefixer({
        browsers: ['last 2 versions','Safari >0', 'Explorer >0', 'Edge >0', 'Opera >0', 'Firefox >=20'],
        cascade: true,
        remove: true  // 去除不必要的前缀
      }))
      .pipe(concat('css.css'))
      .pipe(minifycss()) // 压缩CSS
      .pipe(gulp.dest(config.sassExport)) // 输出目录
  } else {
    return gulp.src([config.sassSrc])
      .pipe(sass())
      .pipe(autoprefixer({
        browsers: ['last 2 versions','Safari >0', 'Explorer >0', 'Edge >0', 'Opera >0', 'Firefox >=20'],
        cascade: true,
        remove: true  // 去除不必要的前缀
      }))
      .pipe(concat('css.css'))
      .pipe(gulp.dest(config.sassExport))
  }
});

gulp.task('js', function() {
  if (config.jsCompress) {
    return gulp.src(config.jsSrc)
      .pipe(uglify({
        mangle: true, // 类型：Boolean 默认：true 是否修改变量名
        compress: false // 类型：Boolean 默认：true 是否完全压缩
        // preserveComments: 'all' //保留所有注释
      }).on('error', function(err) {
        console.log('UglifyJS error: ', err);
      })) // 压缩
      .pipe(gulp.dest(config.jsExportDir)); // 输出
  } else {
    return gulp.src(config.jsSrc)
      .pipe(gulp.dest(config.jsExportDir));
  }
});

gulp.task('tplJs', function() {
  if (config.jsCompress) {
    return gulp.src(config.tplJsSrc)
      .pipe(concat('components.js'))
      .pipe(uglify()) // 压缩
      .pipe(gulp.dest(config.jsExportDir)); // 输出
  } else {
    return gulp.src(config.tplJsSrc)
      .pipe(concat('components.js'))
      .pipe(gulp.dest(config.jsExportDir));
  }
});

gulp.task('html', function() {
  return gulp.src(config.htmlSrc)
    .pipe(gulp.dest(config.htmlExportDir)); // 输出
});

gulp.task('src', function() {
  return gulp.src(config.srcSrc)
    .pipe(gulp.dest(config.srcExportDir)); // 输出
});

gulp.task('watch', function() {
  watch(config.sassSrc, function() { // 监视所有sass
    setTimeout(gulp.start.bind(gulp, 'sass'), 100); // 出现修改立即执行sass任务
  });
  watch(config.jsSrc, function() { // 监视所有js
    setTimeout(gulp.start.bind(gulp, 'js'), 100); // 出现修改立即执行js任务
  });
  watch(config.tplJsSrc, function() { // 监视所有公共模块的js
    setTimeout(gulp.start.bind(gulp, 'tplJs'), 100); // 出现修改立即执行js任务
  });
  watch(config.htmlSrc, function() { // 监视所有html
    setTimeout(gulp.start.bind(gulp, 'html'), 100); // 出现修改立即执行html任务
  });
  watch(config.srcSrc, function() { // 监视所有src
    setTimeout(gulp.start.bind(gulp, 'src'), 100); // 出现修改立即执行src任务
  });
});

gulp.task('eslint', function() {
  return gulp.src([appSrcBaseDir + "/**/*.js"])
    .pipe(eslint()) // 代码检查
    .pipe(eslint.format()) // 在控制台输出结果
    .pipe(eslint.failAfterError()); // 有异常后报错
});

gulp.task('dev', ['src', 'sass', 'js', 'tplJs', 'html', 'watch']);

gulp.task('build', ['src', 'sass', 'js', 'html']);
