## How to use
```js
<template>
  <div class="demo">
    <vue2-quill2-editor
      ref="vue2Quill2Editor"
      :upload-function="uploadFunction"
    >
    </vue2-quill2-editor>
    <CmsJournal></CmsJournal>
  </div>
</template>

<script>
import axios from 'axios'
import Vue from 'vue'
import Editor from 'vue2-quill2-editor/dist/index'
Vue.use(Editor)

export default {
  components: {Editor},
  data () {
    return {}
  },
  methods: {
    uploadFunction (range, fileList) {
      const headers = {
        'eptoken': '7856456e-7b5d-4f3a-be37-a98d0ba51d8d',
        'Content-Type': 'application/json'
      }

      let file = fileList[0]
      const fileName = file.name.toString()

      // 使用FormData构建请求
      const formData = new FormData()
      formData.append('file', file) // 添加文件
      formData.append('fileName', fileName)
      formData.append('linkId', '999')        //  示例字段
      formData.append('linkType', 'journal') //  示例字段
      formData.append('inText', 1)           // 示例字段

      axios.post('http://localhost:8090/file/upload', formData, {headers}).then(json => {
        const Delta = this.$refs.vue2Quill2Editor.quill.constructor.import('delta'); // 使用构造函数访问

        // 下面三行必填
        const cursorPosition = this.$refs.vue2Quill2Editor.quill.getSelection().index
        this.$refs.vue2Quill2Editor.quill.updateContents(new Delta().retain(cursorPosition).insert({image: json.data.data}))
        this.$refs.vue2Quill2Editor.quill.setSelection(cursorPosition + 1, 0)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>


```
