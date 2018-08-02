const gulp = require('gulp');
const rename = require('gulp-rename');

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

    var path = buildStaticJsPath(finalArgs['vendor'], finalArgs['theme'], finalArgs['lang']);
    var glob = path + '**/*.js';
    return gulp.src(glob, { base: './' })
            .pipe(rename( (path) => {
                path.basename += '.min';
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