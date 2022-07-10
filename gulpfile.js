const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
// const imagemin = require('gulp-imagemin');
// const webp = require('imagemin-webp');
const through2 = require("through2");
const html = require("remark-html");
const lint = require('remark-preset-lint-markdown-style-guide');
const cheerio = require('cheerio');
const rename = require("gulp-rename");
const remark = require("./gulp-scripts/gulp-remark");

// Optimize images using webp
function build(cb) {
    // return gulp.src('public/images/**/*.{jpg,png}')
    //     .pipe(imagemin([
    //         webp({ quality: 75 })
    //     ]))
    //     .pipe(gulp.dest('build/images/'))
}


function generate(cb) {
    const templatehtml = fs.readFileSync(path.resolve(__dirname, './policy/terms-and-conditions-template.html'), 'utf8')
    const $ = cheerio.load(templatehtml);
    return gulp
        .src('policy/*.md')
        .pipe(remark().use(html))
        .pipe(through2({ objectMode: true, allowHalfOpen: false }, function (file, enc, next) {
            if (file.isNull() || file.isDirectory()) {
                next(null, file);
                return;
            }
            $('#root').html(file.contents.toString());
            const html = $.html();
            file.contents = Buffer.from(html, 'utf-8');
            next(null, file);
        }))
        .pipe(rename(function (path) {
            path.extname = ".html";
        }))
        .pipe(gulp.dest('build/policy/'));
}
exports.generate = generate;

exports.default = build;