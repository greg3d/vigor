'use strict';

var gulp = require('gulp'),
		concat = require('gulp-concat'),
		scss = require('gulp-sass'),
		uglify = require('gulp-uglify'),
		plumber = require('gulp-plumber'),
		ngAnnotate = require('gulp-ng-annotate'),
		webserver = require('gulp-webserver');

gulp.task('libsjs', function(){
	gulp.src([

			'bower_components/angular/angular.min.js',
			'bower_components/angular-ui-router/release/angular-ui-router.min.js',
			//'bower_components/angular-bootstrap/ui-bootstrap.js',
			//'bower_components/angular-animate/angular-animate.js',
			//'bower_components/angular-translate/angular-translate.min.js',
			//'node_modules/chart.js/dist/Chart.min.js',
			//'node_modules/angular-chart.js/dist/angular-chart.min.js',
			//'bower_components/angular-ui-tree/dist/angular-ui-tree.min.js',

		])
	.pipe(concat('libs.js'))
	.pipe(gulp.dest('builds/dev'));
});


gulp.task('js', function(){
	gulp.src([
			'builds/dev/app/**/*.js',
		])
		.pipe(plumber())
		.pipe(concat('app.js'))
		.pipe(ngAnnotate())
		//.pipe(uglify())
		.pipe(gulp.dest('builds/dev'));
});

gulp.task('libscss', function(){
	gulp.src([
		'bower_components/bootstrap-sass/assets/stylesheets/bootstrap.scss',
		'bower_components/angular/angular-csp.css',
		//'bower_components/angular-ui-tree/dist/angular-ui-tree.min.css',

		])
		.pipe(scss())
		.pipe(concat('libs.css'))
		.pipe(gulp.dest('builds/dev'));
});

gulp.task('scss', function(){
	gulp.src([
			'builds/dev/app/**/*.scss',
		])
		.pipe(plumber())
		.pipe(scss())
		.pipe(concat('app.css'))
		.pipe(gulp.dest('builds/dev'));
});


gulp.task('watch', function(){
	gulp.watch('builds/dev/app/**/*.js', ['js']);
	gulp.watch('builds/dev/app/**/*.scss', ['scss']);
})


gulp.task('webserver', function(){
	gulp.src('builds/dev').pipe(webserver({
		livereload: true, open: true
	}));
});

gulp.task('upload', function(){
	gulp.src(['builds/dev/**/*',
						'builds/dev/*'])
	.pipe(sftp({
		host: '192.168.0.163',
		user: 'root',
		pass: 'root',
		remotePath: '/home/infotrans/web_ui'
	}))
});

gulp.task('default', ['js', 'libsjs','libscss','scss','webserver','watch']);

gulp.task('up', ['js', 'scss','watch']);