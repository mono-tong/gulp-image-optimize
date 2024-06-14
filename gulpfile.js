import { src, dest, parallel, task } from 'gulp';
import imagemin, { svgo, gifsicle } from 'gulp-imagemin';
import rename from 'gulp-rename';
import webp from 'imagemin-webp';

const quality = 75;

const srcPath = './source';
const distPath = './optimized';

function imgWebP() {
  return src(`${srcPath}/**/*.{jpg,jpeg,png}`, {
    base: srcPath,
    encoding: false,
  })
    .pipe(imagemin([webp({ quality })], { verbose: true }))
    .pipe(
      rename((path) => {
        path.extname = '.webp';
      })
    )
    .pipe(dest(distPath));
}

function imgOther() {
  return src(`${srcPath}/**/*.{gif,svg}`, {
    base: srcPath,
    encoding: false,
  })
    .pipe(
      imagemin(
        [
          gifsicle({ interlaced: true }),
          svgo({
            plugins: [
              {
                name: 'removeViewBox',
                active: false,
              },
            ],
          }),
        ],
        { verbose: true }
      )
    )
    .pipe(dest(distPath));
}

task('optimize', parallel(imgWebP, imgOther));
