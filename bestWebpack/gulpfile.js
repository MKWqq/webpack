const gulp = require("gulp");
const crypto = require('crypto');
const bump = require('gulp-bump');
const fs = require('fs');
const runSequence = require('run-sequence');
const git = require('gulp-git');
const gzip = require('gulp-gzip');
const exec = require('child_process').exec;

//使用webpack打包压缩
gulp.task("webpack", function(callback) {
	exec('npm run build', function(error, stdout, stderr) {
		console.log(stdout);
		console.error(stderr);
		callback();
	});
});

//git pull
gulp.task('pull', function(cb) {
	git.pull('', '', function(err) {
		if (err) throw err;
		cb();
	});
});

//add version
gulp.task('bump', function() {
	return gulp.src('./package.json')
		.pipe(bump({
			type: "patch"
		}))
		.pipe(gulp.dest('./'));
});

//计算bundle.js的hash，添加到package.json。防止缓存
gulp.task('version', function (callback) {
	var package = require('./package.json');
	package.bundleHash = md5(`./dist/static/bundle.js`).substr(0, 10);
	fs.writeFileSync('./package.json', JSON.stringify(package, null, "\t"));
	callback();
});


gulp.task('compress', function(callback) {
	gulp.src(['./dist/static/*', '!./dist/static/*.gz'])
		.pipe(gzip())
		.pipe(gulp.dest('./dist/static/'));
});

//默认任务，执行所有任务
gulp.task('default', function(cb) {
	runSequence('bump', 'webpack');
});



function md5(f) {
	var md5sum = crypto.createHash('md5');
	md5sum.update(fs.readFileSync(f));
	return md5sum.digest('hex');
}