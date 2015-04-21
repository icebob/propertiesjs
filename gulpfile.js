'use strict'

var path            = require('path');
var fs 				= require('fs');

var browserSync     = require('browser-sync');
var reload          = browserSync.reload;

var browserify 		= require('browserify');
var source 			= require('vinyl-source-stream');
var buffer 			= require('vinyl-buffer');
var glob 			= require('glob');

var gulp            = require('gulp');
var $ 				= require('gulp-load-plugins')({
						pattern: ['gulp-*']
					});

// Browser-sync task
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: "./demo",
			routes: {
				"/src": "src",
				"/dist": "dist"
			}
		}
	});
});

// Sass task
gulp.task('sass', function () {

	gulp.src('src/scss/*.scss')
		.pipe($.plumber())
		.pipe($.compass({
			project: path.join(__dirname, "src"),
			css: 'css',
			sass: 'scss',
			style: 'expanded',
			cache: false
		})
		.on('error', $.util.log));
});

// Sass demo task
gulp.task('sass:demo', function () {

	gulp.src('demo/*.scss')
		.pipe($.plumber())
		.pipe($.compass({
			project: __dirname,
			css: 'demo',
			sass: 'demo',
			style: 'expanded',
			cache: false
		})
		.on('error', $.util.log));
});

// Coffescript task
gulp.task('coffee', function () {
	return gulp.src('src/coffee/**/*.coffee', {base: "./src/coffee"})
		.pipe($.plumber())
		.pipe($.coffeelint())
		.pipe($.coffeelint.reporter())
		.pipe($.coffee({bare: false }))
		.pipe(gulp.dest("src/js"));
});

// Coffescript demo task
gulp.task('coffee:demo', function () {
	return gulp.src('demo/**/*.coffee', {base: "./demo"})
		.pipe($.plumber())
		.pipe($.coffee({bare: true }))
		.pipe(gulp.dest("./demo"));
});

// Coffescript test task
gulp.task('coffee:test', function () {
	return gulp.src('test/**/*.coffee', {base: "./test"})
		.pipe($.plumber())
		.pipe($.coffeelint())
		.pipe($.coffeelint.reporter())
		.pipe($.coffee({bare: true }))
		.pipe(gulp.dest("./test"));
});

// JADE task
gulp.task('jade', function () {
	return gulp.src('demo/*.jade')
		.pipe($.plumber())
		.pipe($.jade({
			pretty: true
		}))
		.pipe(gulp.dest("./demo"));
});

/**
 * Reload all Browsers
 */
gulp.task('bs-reload', function () {
	browserSync.reload();
});

// Default task (compile, build)
gulp.task('default', ['build']);

// Develop task (compile + watch + reload)
gulp.task('dev', ['jade', 'sass', 'sass:demo', 'coffee', 'coffee:demo', 'build', 'browser-sync'], function () {
	$.watch(['src/css/*.css', 'demo/*.css'], function(file) {
		reload(file.path);
	});

	$.watch('demo/*.html', function() {
		gulp.start('bs-reload');
	});
	$.watch(['dist/*.js', 'demo/*.js'], function() {
		gulp.start('bs-reload');
	});

	$.watch('demo/*.jade', function() {
		gulp.start('jade');
	});
	$.watch('src/coffee/**/*.coffee', function() {
		gulp.start('build');
	});
	$.watch('demo/*.coffee', function() {
		gulp.start('coffee:demo');
	});
	$.watch('src/scss/*.scss', function() {
		gulp.start('sass');
	});
	$.watch('demo/*.scss', function() {
		gulp.start('sass:demo');
	});

});


/**
 * Testing
 */
var testFiles = [
	'src/js/**/*.js',
	'test/**/*.spec.js'
];

// Test task with karma
gulp.task("test", ["coffee", "coffee:test"], function() {

	return gulp.src(testFiles, {read: false})
		.pipe($.karma({
			configFile: 'karma.conf.js',
			action: 'run'
		}))
		.on('error', function(err) {
			// Make sure failed tests cause gulp to exit non-zero 
			throw err;
		});
});

// Test task with karma and watching (CI)
gulp.task('karma', ["sass", "coffee", "coffee:test"], function() { 

	// Watch server scripts
	$.watch(["test/**/*.spec.coffee", "src/coffee/**/*.coffee"], {read: false}, function(files) {
		gulp.start(["coffee", "coffee:test"]);
	});

	// Run karma with watch

	return gulp.src(testFiles.concat(['test/*.css', 'src/css/*.css']), {read: false})
		.pipe($.plumber())
		.pipe($.karma({
			configFile: 'karma.dev.conf.js',
			action: 'watch'
		}))
		.on('error', $.util.log);
});

/**
 * Build
 */

var pkg = require('./package.json');
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' * Copyright (c) <%= new Date().getFullYear() %> Icebob',
  ' * ',
  ' * ',
  ' * Build Date: <%= new Date().toString() %>',
  ' * ',
  ' */',
  ''].join('\n');

gulp.task('build', ["sass", "coffee"], function () {

	gulp.src('src/css/*.css')
		.pipe(gulp.dest("dist"));

	// set up the browserify instance on a task basis
	var b = browserify({
		entries: './src/js/propertiesJS.js',
		debug: false,
		external: ['jquery']
	});

 	return b.bundle()
		.pipe(source('propertiesJS.js'))
		.pipe(buffer())
		.pipe($.header(banner, { pkg : pkg } ))
		.pipe(gulp.dest('./dist'))
		.pipe($.sourcemaps.init({loadMaps: true}))
			// Add transformation tasks to the pipeline here.
			.pipe($.uglify())
			.on('error', $.util.log)
		.pipe($.sourcemaps.write('./'))
		.pipe($.rename('propertiesJS.min.js'))
		.pipe($.header(banner, { pkg : pkg } ))
		.pipe(gulp.dest('./dist'));
});

/**
 * Bump version
 */

gulp.task('bump', [], function () {
  var bumpType = $.util.env.type || 'patch'; // major.minor.patch

  return gulp.src(['./package.json'])
    .pipe($.bump({ type: bumpType }))
    .pipe(gulp.dest('./'));
});