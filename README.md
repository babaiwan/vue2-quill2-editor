## How to use
```
<template>
  <div class="demo">
    <vue-quill2-editor
      :upload-function="uploadFunction"
      :upload-response-handlers="uploadResponseHandlers"
    >
    </vue-quill2-editor>
  </div>
</template>

<script>
import axios from "axios";
import Vue from 'vue'
import VueQuillEditor from 'vue2-quill2-editor/dist/VueQuill2Editor'

Vue.use(VueQuillEditor)

export default {
  components: {VueQuillEditor},
  data() {
    return {}
  },
  methods: {
    uploadFunction(params) {
      const headers = {
        'eptoken': '7856456e-7b5d-4f3a-be37-a98d0ba51d8d',
        'Content-Type': 'application/json'
      }
      const uploadParams = Object.assign(params, {
        linkId: '999',
        linkType: 'journal',
        inText: 1
      })
      return axios.post('http://localhost:8090/file/upload', uploadParams, {headers})
    },
    uploadResponseHandlers(val) {
      debugger
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
