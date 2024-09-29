import VueQuill2Editor from './vue-quill2-editor/vue-quill2-editor.vue';
import epui from 'ep-ui';
import vcolorpicker from 'vcolorpicker';

const MyComponent = {
    install(Vue) {
        // 自动注册插件
        Vue.use(epui);
        Vue.use(vcolorpicker);

        // 注册组件
        Vue.component('VueQuill2Editor', VueQuill2Editor);
    }
};

export default MyComponent;

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(MyComponent);
}
