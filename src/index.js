import VueQuill2Editor from './vue-quill2-editor/vue-quill2-editor.vue';

const MyComponent = {
    install(Vue) {
        Vue.component('VueQuill2Editor', VueQuill2Editor);
    }
};

export default MyComponent;

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(MyComponent);
}
