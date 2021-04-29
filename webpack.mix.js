/*
Copyright the Trivet copyright holders.

See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-project/fluidic-11ty/raw/master/AUTHORS.md.

Licensed under the New BSD license. You may not use this file except in compliance with this License.

You may obtain a copy of the New BSD License at
https://github.com/fluid-project/fluidic-11ty/raw/master/LICENSE.md.
*/

"use strict";

const mix = require("laravel-mix");
const moveFile = require("move-file");
const path = require("path");
require("laravel-mix-purgecss");

// Set public path.
mix.setPublicPath("dist/assets");

// Process JavaScript files with Babel.
mix.js("./src/assets/scripts/app.js", "dist/assets/scripts");
mix.js("./src/assets/scripts/matomo.js", "dist/assets/scripts");

// Compile Sass with Dart Sass.
mix.sass("./src/assets/styles/app.scss", "dist/assets/styles");

// Purge unused styles.
mix.purgeCss({
    content: [
        path.join(__dirname, "src/_includes/**/*.njk"),
        path.join(__dirname, "src/shortcodes/*.js")
    ],
    safelist: ["picture"]
});

mix.options({
    // Don't modify stylesheet url() functions.
    processCssUrls: false,
    // Enable PostCSS Logical Properties plugin.
    postCss: [
        require("postcss-logical")({
            dir: "ltr"
        })
    ]
});

// Enable source maps.
mix.sourceMaps(false, "source-map");

// Add version string to assets in production.
if (mix.inProduction()) {
    mix.version();
}

// Copy asset manifest into Eleventy's data directory to trigger a build when assets are updated.
mix.then(() => {
    moveFile.sync("dist/assets/mix-manifest.json", "src/_data/assets.json");
});
