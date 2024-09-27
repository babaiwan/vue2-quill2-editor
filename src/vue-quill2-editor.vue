<template>
  <div>
    <div id="editor">
      <p>Hello World!</p>
      <p>Some initial <strong>bold</strong> text</p>
      <p><br/></p>
    </div>

  </div>
</template>

<script>
import Quill from 'quill'

export default {
  name: "vue-quill2-editor",
  data() {
    return {
      quill: {}
    }
  },
  created() {
    this.quill = new Quill('#editor', {
      theme: 'snow'
    });
  }
}
</script>

<style scoped>

</style>
