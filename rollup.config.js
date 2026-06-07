import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/energy-flow-card.ts',
  output: {
    file: 'dist/energy-flow-card.js',
    format: 'es',
    sourcemap: false
  },
  plugins: [
    nodeResolve(),
    typescript({
      tsconfig: './tsconfig.json'
    }),
    terser({
      output: {
        comments: false
      }
    })
  ]
};
