var gulp = require("gulp");
var browserSync = require('browser-sync').create()
var reload = browserSync.reload;

gulp.task('serve', function(){
    browserSync.init({
        server: "./public",
        port: 3000
    });
    gulp.watch("public/*.html").on("change", reload);
});

gulp.task("default", gulp.series("serve"));