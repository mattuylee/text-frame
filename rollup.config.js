import * as path from 'path';
import { terser } from "rollup-plugin-terser";
import typescript from 'rollup-plugin-typescript2';
import serve from 'rollup-plugin-serve';

const devMode = process.env.NODE_ENV === 'development';
const shouldServe = !!process.env.SERVE;
const filename = 'text-frame' + (devMode ? '' : '-min') + '.js';
const plugins = [
  typescript({
    clean: true,
    tsconfig: './tsconfig.json'
  }),
  !devMode && terser(),
  shouldServe && serve({
    open: true,
    contentBase: './',
    openPage: '/example/index.html',
    port: 5000
  })
].filter(Boolean);

export default {
  input: 'src/text-frame.ts',
  output: [
    {
      file: path.resolve('dist', 'esm', filename),
      format: 'esm',
      sourcemap: devMode
    },
    {
      file: path.resolve('dist', 'umd', filename),
      format: 'umd',
      name: 'TextFrame',
      sourcemap: devMode
    }
  ],
  plugins: plugins,
  watch: {
    include: ['src/**/*', 'example/*']
  }
}