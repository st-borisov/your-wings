import webp from 'gulp-webp';
import imagemin from 'gulp-imagemin';

export const images = () => {
	return app.gulp.src(app.path.src.images)
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: "IMAGES",
				message: "Error: <%= error.message %>"
			})
		))
		.pipe(app.plugins.newer(app.path.build.images)) // обрабатываем только новые

		// В dev просто копируем
		.pipe(app.plugins.if(app.isDev, app.gulp.dest(app.path.build.images)))

		// В build — webp и imagemin
		.pipe(app.plugins.if(app.isBuild, webp()))
		.pipe(app.plugins.if(app.isBuild, app.gulp.dest(app.path.build.images)))

		.pipe(app.plugins.if(app.isBuild, app.gulp.src(app.path.src.images)))
		.pipe(app.plugins.if(app.isBuild, imagemin({
			progressive: true,
			svgoPlugins: [{ removeViewBox: false }],
			interlaced: true,
			optimizationLevel: 3,
		})))
		.pipe(app.plugins.if(app.isBuild, app.gulp.dest(app.path.build.images)))

		// SVG копируем всегда
		.pipe(app.gulp.src(app.path.src.svg))
		.pipe(app.gulp.dest(app.path.build.images))

		.pipe(app.plugins.browsersync.stream());
}