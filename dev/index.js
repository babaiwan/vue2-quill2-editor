import Vue from 'vue';
import Vue2Quill2Editor from '../src'; // 引入你写的插件

Vue.use(Vue2Quill2Editor); // 安装插件

new Vue({
    el: '#app',
    template: '<Vue2Quill2Editor message="This is a test"/>', // 使用插件组件
});
