import Vue from 'vue';
import VueQuill2Editor from '../src'; // 引入你写的插件

Vue.use(VueQuill2Editor); // 安装插件

new Vue({
    el: '#app',
    template: '<VueQuill2Editor message="This is a test"/>', // 使用插件组件
});
