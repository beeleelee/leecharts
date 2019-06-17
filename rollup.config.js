import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import pkg from './package.json'
import babel from 'rollup-plugin-babel'
// import { uglify } from 'rollup-plugin-uglify'
import postcss from 'rollup-plugin-postcss'
import simpleVar from 'postcss-simple-vars'
import nested from 'postcss-nested'
import cssnext from 'postcss-cssnext'
//import csspreset from 'postcss-preset-env'
import cssnano from 'cssnano'
import cssImport from 'postcss-import'

export default [
  // browser-friendly UMD build
  {
    input: 'index.js',
    external: ['d3', 'mytoolkit'],
    output: {
      name: 'leecharts',
      file: pkg.browser,
      format: 'umd'
    },
    plugins: [
      postcss({
        plugins: [
          cssImport(),
          simpleVar(),
          nested(),
          cssnext(),
          cssnano()
        ]
      }),
      resolve(), // so Rollup can find `ms`
      babel({
        exclude: 'node_modules/**'
      }),
      commonjs(), // so Rollup can convert `ms` to an ES module
      //uglify()
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify 
  // `file` and `format` for each target)
  {
    input: 'index.js',
    external: ['d3', 'mytoolkit'],
    output: [
      { file: pkg.cjs, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    plugins: [
      postcss({
        plugins: [
          cssImport(),
          simpleVar(),
          nested(),
          cssnext(),
          cssnano()
        ]
      }),
      babel({
        exclude: 'node_modules/**'
      }),
    ]
  }
]