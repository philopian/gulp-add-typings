# Add Typings to your project 

- This package will loop thru your bower.json file and add all the typings


## Install
~~~
$ npm i gulp-add-typings --save-dev
~~~

## Basic Usage
- e.g. 
~~~
const gulp = require('gulp');
const addTypings = require('gulp-add-typings');

gulp.task('default', function () {
  return gulp
    .src(__dirname)
    .pipe(addTypings('bower.json'))
    .pipe(gulp.dest('.'));
});
~~~