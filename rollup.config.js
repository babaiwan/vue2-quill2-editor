import vue from 'rollup-plugin-vue';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: 'src/index.js',
    output: [
        {
            file: 'dist/vue-plugin.umd.js',
            format: 'umd',
            name: 'VuePlugin',
            globals: {
                vue: 'Vue'
            }
        },
        {
            file: 'dist/vue-plugin.esm.js',
            format: 'esm'
        }
    ],
    plugins: [
        resolve(),
        commonjs(),
        vue()
    ],
    external: ['vue']
};
