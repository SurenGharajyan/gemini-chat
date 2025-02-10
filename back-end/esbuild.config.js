const esbuild = require('esbuild');

esbuild.build({
    entryPoints: ['./app.ts'], // Path to your main TypeScript file
    bundle: true,
    outfile: './dist/app.js', // The output file
    platform: 'node', // For Node.js applications
    target: 'node14', // Change depending on the Node.js version you're targeting
    external: ['express'], // To avoid bundling express if you want to install it separately in production
    sourcemap: true, // Optional: to generate sourcemaps
}).catch(() => process.exit(1));
