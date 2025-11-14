const esbuild = require('esbuild');

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

async function main() {
  const ctx = await esbuild.context({
    entryPoints: ['src/Extension.ts'],
    bundle: true,
    format: 'cjs',
    minify: production,
    sourcemap: !production,
    sourcesContent: false,
    platform: 'browser',
    outfile: 'dist/Extension.js',
    external: ['vscode'],
    logLevel: 'info',
    // Make Node.js built-ins optional (return empty objects if not available)
    // This allows the code to run in browser where fs/path don't exist
    define: {
      'process.env.NODE_ENV': production ? '"production"' : '"development"'
    },
    banner: {
      js: `// VS Code Web Extension - Built with esbuild\n`
    }
  });

  if (watch) {
    await ctx.watch();
    console.log('Watching for changes...');
  } else {
    await ctx.rebuild();
    await ctx.dispose();
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
