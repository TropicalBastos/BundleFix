const gulp = require('gulp');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');

/**
 * Args reserved keys
 */
const reserved = [
    '--vendor',
    '--theme',
    '--lang'
]

/**
 * @summary Looks at each .bundle.js file and converts them
 * to .bundle.min.js file
 * 
 * @return void
 * @throws {Error} Throws if all three args are not supplied
 */
const bundleFixTask = () => {
    const args = process.argv;
    var finalArgs = {};

    if(args.filter((item) => item === '--merged').length > 0){
        merged = true;
        console.log("Merge flag is on, targeting merge cache...");
        return processWithMerge();
    }

    filterByReserved(args).forEach((val) => {
        switch(val){
            case '--vendor':
                finalArgs['vendor'] = getArg(val);
                break;
            case '--theme':
                finalArgs['theme'] = getArg(val);
                break;
            case '--lang':
                finalArgs['lang'] = getArg(val);
                break;
            default:
                break;
        }
    });

    if(Object.keys(finalArgs).length != 3){
        throw new Error("Not enough arguments: --vendor --theme --lang");
    }

    return processWithoutMerge(finalArgs); 
}

/**
 * @summary Runs a minify in the pub/static and not merge cache
 * 
 * @param {String} finalArgs
 * @return {Task}
 */
const processWithoutMerge = (finalArgs) => {
    var path = buildStaticJsPath(finalArgs['vendor'], finalArgs['theme'], finalArgs['lang']);
    var glob = path + '**/*.js';
    return gulp.src(glob, { base: './' })
            .pipe(uglify())
            .pipe(rename( (path) => {
                path.basename += '.min';
            }))
            .pipe(gulp.dest('./'));
}

/**
 * @summary Runs the task on the merged cache js files
 * 
 * @param {String} finalArgs 
 * @return {Task}
 */
const processWithMerge = () => {
    var path = 'pub/static/_cache/merged/*.js';
    return gulp.src([path, '!**/**.min.js'], { base: './' })
            .pipe(uglify().on('error', (err) => {
                console.log(err);
            }))
            .pipe(gulp.dest('./'));
}

/**
 * @summary Builds the path for the task runner to search for
 * 
 * @param {String} vendor e.g Magento
 * @param {String} theme e.g luma
 * @param {String} lang e.g en_US
 * @return {String}
 */
const buildStaticJsPath = (vendor, theme, lang) => {
    return `pub/static/frontend/${vendor}/${theme}/${lang}/`;
}

/**
 * @summary Filters all process args by reserved keys
 * 
 * @param {Array} args 
 * @return {Array} The filtered array
 * @throws {Error} Errors when there are no matching args
 */
const filterByReserved = (args) => {
    const ret = args.filter(arg => {
        return reserved.includes(arg);
    });
    if(ret.length < 1){
        throw new Error("No valid arguments passed");
    }
    return ret;
}

/**
 * @summary Gets an argument from the args vector based on key
 * 
 * @param {String} arg The arg key
 * @return {String} The argument
 */
const getArg = (arg) => {
    return process.argv.reduce((prev, cur, index, arr) => {
        if(cur === arg){
            return arr[index + 1];
        }
        return prev;
    });
}

/** Apply functions to task runner */
gulp.task('bundlefix', bundleFixTask);