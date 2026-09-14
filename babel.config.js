// 使用项目级配置（babel.config.js）而非文件相对的 .babelrc：
// .babelrc 在遇到 node_modules 下独立的 package.json 时会被 Babel 跳过，
// 那样 node_modules/quill 中的 class fields / static fields 就无法被转译。
// 浏览器目标由 .browserslistrc 提供。
module.exports = {
    presets: ['@babel/preset-env']
};
