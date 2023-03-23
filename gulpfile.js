var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var themePath = './src/';


gulp.task('serve', function(done) {

   browserSync.init({
        files: [
            `${themePath}/**/*.html`,
            `${themePath}/**/*.js`,
            `${themePath}/**/*.css`,
        ],

            server: themePath
        
    });

  

    done();
});

gulp.task('default', gulp.series('serve'));