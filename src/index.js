import Vue2Quill2Editor from './vue2-quill2-editor/vue2-quill2-editor.vue';
import vcolorpicker from 'vcolorpicker';

const MyComponent = {
    install(Vue) {
        // 注册插件
        Vue.use(vcolorpicker);

        // 注册组件
        Vue.component('Vue2Quill2Editor', Vue2Quill2Editor);
    }
};

export default MyComponent;

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(MyComponent);
}
