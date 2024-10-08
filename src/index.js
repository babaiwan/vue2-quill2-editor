import Vue2Quill2Editor from './vue2-quill2-editor/vue2-quill2-editor.vue';
import epui from 'ep-ui';
import vcolorpicker from 'vcolorpicker';

const MyComponent = {
    install(Vue) {
        // 自动注册插件
        Vue.use(epui);
        Vue.use(vcolorpicker);

        // 注册组件
        Vue.component('Vue2Quill2Editor', Vue2Quill2Editor);
    }
};

// 在 UMD 环境下安装插件
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(MyComponent);
}

export default MyComponent;
