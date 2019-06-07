'use strict';

const gulp = require('gulp');
const sequence = require('run-sequence');


let pkg = require('./package.json');
let banner = '/**\n * Copyright (c) ${new Date().getFullYear()} ${pkg.author}\n * All rights reserved.\n */\n';


gulp.task('default', function(done) {
	sequence('devel', 'watch', done);
});


gulp.task('build', function(done) {
	sequence('lint', 'clean', ['copy:assets', 'nunjucks', 'schema', 'uglify'], 'snapshot', done);
});


gulp.task('bundle', function() {
	const path = require('path');

	const gzip = require('gulp-gzip');
	const rename = require('gulp-rename');
	const tar = require('gulp-tar');

	let basename = path.basename(process.cwd());
	let renameExpression = new RegExp('^' + basename);

	return gulp.src([
		'config/**',
		'fixtures/**',
		'lib/**',
		'migrations/**',
		'scripts/**/*',
		'schemas/**/*',
		'templates/**/*',
		'package.json',
		'app.js',
		'server.js'
	], {
		nodir: true,
		base: '..'
	})
		.pipe(rename(function(path) {
			path.dirname = path.dirname.replace(renameExpression, pkg.name);

			return path;
		}))
		.pipe(tar(pkg.name + '-' + pkg.version + '.tar'))
		.pipe(gzip())
		.pipe(gulp.dest('dist'));
});


gulp.task('bundle:ebs', function() {
	const path = require('path');

	const zip = require('gulp-zip');
	const rename = require('gulp-rename');

	let basename = path.basename(process.cwd());
	let renameExpression = new RegExp('^' + basename);

	return gulp.src([
		'.ebextensions/**',
		'.nuxt/**',
		'apollo/**',
		'assets/**',
		'build/**',
		'components/**',
		'config/!(local).json',
		'lib/**',
		'layouts/**',
		'pages/**',
		'plugins/**',
		'static/**',
		'store/**',
		'fixtures/**',
		'.babelrc',
		'.npmrc',
		'package.json',
		'server.js'
	], {
		nodir: true,
		dot: true,
		base: '.'
	})
		.pipe(rename(function(path) {
			path.dirname = path.dirname.replace(renameExpression, pkg.name);

			return path;
		}))
		.pipe(zip(pkg.name + '-ebs-' + pkg.version + '.zip'))
		.pipe(gulp.dest('dist'));
});


gulp.task('clean', function() {
	const clean = require('gulp-clean');

	return gulp.src([
		'artifacts/',
		'dist/',
		'dump/',
	], {
		read: false
	})
		.pipe(clean({
			force: true
		}));
});


gulp.task('copy:assets', function() {
	return gulp.src([
		'static/**/*',
		'!static/**/*.js',
		'!static/**/*.less'
	], {
		nodir: true
	})
		.pipe(gulp.dest('artifacts/'));
});


gulp.task('devel', function(done) {
	sequence('clean', ['copy:assets', 'nunjucks', 'schema', 'uglify:devel'], done);
});


gulp.task('lint', ['lint:js', 'lint:json']);


gulp.task('lint:js', function() {
	const eslint = require('gulp-eslint');

	return gulp.src([
		'*.js',
		'apollo/**/*.js',
		'components/**/*.js',
		'components/**/*.vue',
		'!components/xr/**/*.vue',
		'layouts/**/*.vue',
		'lib/**/*.js',
		'!lib/aframe/**/*.js',
		'!lib/dev/**/*.js',
		'migrations/**/*.js',
		'pages/**/*.vue',
		'plugins/**/*.js',
		'static/*.js',
		'store/**/*.js',
		'test/**/*.js'
	])
		.pipe(eslint())
		.pipe(eslint.formatEach());
});


gulp.task('lint:json', function() {
	const jsonlint = require('gulp-jsonlint');

	return gulp.src([
		'*.json',
		'config/*.json',
		'fixtures/**/*.json',
		'schemas/**/*.json'
	])
		.pipe(jsonlint())
		.pipe(jsonlint.failOnError())
		.pipe(jsonlint.reporter());
});


gulp.task('lint:sass', function() {
	const sassLint = require('gulp-sass-lint');

	return gulp.src([
		'assets/**/*.s+(a|c)ss'
	])
		.pipe(sassLint({
			configFile: '.sasslintrc.json'
		}))
		.pipe(sassLint.format())
		.pipe(sassLint.failOnError());
});


gulp.task('schema', function() {
	const path = require('path');

	const $RefParser = require('json-schema-ref-parser');
	const through = require('through2');

	return gulp.src([
		'schemas/**/*.json'
	], {
		base: process.cwd(),
		read: false
	})
		.pipe(through.obj(function(file, enc, cb) {
			let schema = path.relative(process.cwd(), file.path);

			$RefParser.bundle(schema)
				.then(function(schema) {
					file.contents = new Buffer(JSON.stringify(schema));

					cb(null, file);
				});
		}))
		.pipe(gulp.dest('artifacts'));
});


gulp.task('snapshot', function() {
	return gulp.src([
		'artifacts/**'
	])
		.pipe(gulp.dest('dist/static/' + new Date().getTime()));
});


gulp.task('uglify', function() {
	const addsrc = require('gulp-add-src');
	const babel = require('gulp-babel');
	const header = require('gulp-header');
	const rename = require('gulp-rename');
	const uglify = require('gulp-uglify');

	return gulp.src([
		'static/**/*.js',
		'!static/lib/requirejs/**/*.js'
	])
		.pipe(babel({
			presets: ['es2015'],
			plugins: ['@babel/plugin-transform-modules-amd']
		}))
		.pipe(addsrc([
			'static/lib/requirejs/**/*.js'
		], {
			base: 'static'
		}))
		.pipe(uglify())
		.pipe(header(banner, {
			pkg: pkg
		}))
		.pipe(rename({
			extname: '.min.js'
		}))
		.pipe(gulp.dest('artifacts'));
});


gulp.task('uglify:devel', function() {
	const addsrc = require('gulp-add-src');
	const babel = require('gulp-babel');
	const rename = require('gulp-rename');

	return gulp.src([
		'static/**/*.js',
		'!static/lib/requirejs/**/*.js'
	])
		.pipe(babel({
			presets: ['es2015'],
			plugins: ['@babel/plugin-transform-modules-amd']
		}))
		.pipe(addsrc([
			'static/lib/requirejs/**/*.js'
		], {
			base: 'static'
		}))
		.pipe(rename({
			extname: '.min.js'
		}))
		.pipe(gulp.dest('artifacts'));
});


gulp.task('watch', function() {
	gulp.watch([
		'static/*.js',
		'static/**/*.js'
	], ['uglify:devel'])
		.on('error', function() {
			this.emit('end');
		});

	gulp.watch([
		'schemas/**/*'
	], ['schema'])
		.on('error', function() {
			this.emit('end');
		});

	gulp.watch([
		'nunjucks/**/*.html'
	], ['nunjucks'])
		.on('error', function() {
			this.emit('end');
		});

	gulp.watch([
		'docs/**/*.md'
	], ['docs'])
		.on('error', function() {
			this.emit('end');
		});

	gulp.watch([
		'static/**/*.less'
	], ['less'])
		.on('error', function() {
			this.emit('end');
		});
});
