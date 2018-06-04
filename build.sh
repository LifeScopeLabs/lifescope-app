babel apollo -d dist/app/apollo --presets env,stage-2
babel lib -d dist/app/lib --presets env,stage-2
babel plugins -d dist/app/plugins --presets env,stage-2
babel store -d dist/app/store --presets env,stage-2
babel server.js -d dist/app --presets env,stage-2
babel nuxt.config.js -d dist/app --presets env,stage-2
cp -r fixtures dist/app
cp .babelrc dist/appnpm
cp --parents apollo/**/*.gql dist/app
