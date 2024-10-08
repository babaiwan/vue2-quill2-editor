## How to use
```
<template>
  <div class="demo">
    <vue2-quill2-editor
      :upload-function="uploadFunction"
      :upload-response-handlers="uploadResponseHandlers"
    >
    </vue2-quill2-editor>
  </div>
</template>

<script>
import axios from "axios";
import Vue from 'vue'
import Editor from 'vue2-quill2-editor/dist/index'

Vue.use(Editor)

export default {
  components: {Editor},
  data() {
    return {}
  },
  methods: {
    uploadFunction(formData) {
      const headers = {
        'eptoken': '7856456e-7b5d-4f3a-be37-a98d0ba51d8d',
        'Content-Type': 'application/json'
      }

      // 业务字段(按需添加)
      formData.append("linkId", "999"); // 示例 linkId
      formData.append("linkType", "journal"); // 示例 linkType
      formData.append("inText", 1); // 示例 inText

      return axios.post('http://localhost:8090/file/upload', formData, {headers})
    },
    uploadResponseHandlers(val) {
      return val.data.data   // return where is the url
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
