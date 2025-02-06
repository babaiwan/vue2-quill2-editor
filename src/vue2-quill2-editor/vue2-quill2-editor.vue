<template>
  <div>
    <div id="toolbar">
      <span class="ql-formats">
        <select class="ql-font">
          <option selected></option>
          <option value="宋体"></option>
          <option value="黑体"></option>
          <option value="微软雅黑"></option>
          <option value="楷体"></option>
          <option value="仿宋_GB2312"></option>
          <option value="幼圆"></option>
          <option value="仿宋"></option>
        </select>
      </span>
      <span class="ql-formats">
        <select class="ql-header">
          <option selected>正文</option>
          <option value="h1">标题1</option>
          <option value="h2">标题2</option>
          <option value="h3">标题3</option>
          <option value="h4">标题4</option>
        </select>
      </span>
      <span class="ql-formats">
        <select class="ql-size">
          <option value="42pt"></option>
          <option value="36pt"></option>
          <option value="26pt"></option>
          <option value="24pt"></option>
          <option value="22pt"></option>
          <option value="18pt"></option>
          <option value="16pt"></option>
          <option value="15pt"></option>
          <option value="14pt"></option>
          <option value="12pt"></option>
          <option selected value="五号"></option>
          <!--          <option value="13px">13px(默认)</option>-->
          <option value="9pt"></option>
          <option value="六号"></option>
          <option value="小六"></option>
        </select>
      </span>
      <span class="ql-formats">
        <select class="ql-lineHeight">
          <option selected value="1.42">1.42</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </span>
      <span class="ql-formats">
        <button class="ql-bold"></button>
        <button class="ql-italic"></button>
        <button class="ql-underline"></button>
        <button class="ql-strike"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-blockquote"></button>
        <button class="ql-code-block"></button>
        <button class="ql-image" value="image"></button>
        <button class="ql-video" value="video"></button>
      </span>
      <span class="ql-formats">
        <select class="ql-align"></select>
        <button class="ql-formula" type="button"></button>
        <button class="ql-list" value="ordered" type="button"></button>
        <button class="ql-list" value="bullet" type="button"></button>
      </span>
      <span class="ql-formats">
         <Popover style="display: inline-block" type="button" ref="tableGenerator">
          <!-- 这是表格生成器部分 -->
           <div id="md-table-gen-wrap" class="table_size_chooser">
            <div class="SizeChooser">
              <div id="md-table-info">选择Table的行列</div>
              <table id="md-table-gen-chooser">
                <tbody>
                  <tr v-for="row in tableSize[0]" :key="row">
                    <td
                        :ref="'md-table-cell-row-' + row + '-cell-' + cell"
                        v-for="cell in tableSize[1]"
                        :key="cell"
                        @mouseenter="hoverTableCell(row, cell)"
                        @click="insertTable(row, cell)"
                    ></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
           <template #reference>
            <button type="button">
              <svg
                  t="1628759217740"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="2162"
                  width="16"
                  height="16"
              >
                <path
                    d="M918.016 119.986H105.984c-23.197 0-42.002 18.803-42.002 42v700.029c0 23.196 18.805 42 42.002 42h812.032c23.195 0 42.002-18.803 42.002-42V161.986c0-23.197-18.807-42-42.002-42z m0 168.005v164.135H675.339V287.991H918.016zM390.661 657.474V494.127h242.677v163.347H390.661z m242.678 42.002v162.538H390.661V699.476h242.678zM348.66 657.474H105.983V494.127H348.66v163.347z m284.679-369.483v164.135H390.661V287.991h242.678z m42 206.136h242.677v163.347H675.339V494.127zM399.996 161.986c23.197 0 42.002 18.803 42.002 42.003 0 23.196-18.805 42-42.002 42s-42.003-18.803-42.003-42c0-23.199 18.806-42.003 42.003-42.003z m-126.005 0c23.195 0 42.002 18.803 42.002 42.003 0 23.196-18.806 42-42.002 42-23.198 0-42.003-18.803-42.003-42 0.001-23.199 18.805-42.003 42.003-42.003z m-126.005 0c23.195 0 42.002 18.803 42.002 42.003 0 23.196-18.806 42-42.002 42-23.198 0-42.003-18.803-42.003-42 0.001-23.199 18.805-42.003 42.003-42.003z m0 126.005H348.66v164.135H105.983l0.001-164.135h42.002z m-42.002 411.485h242.677v162.538H105.984V699.476z m569.355 162.538V699.476h242.677v162.538H675.339z"
                    fill=""
                    p-id="2163"
                ></path>
              </svg>
            </button>
          </template>
        </Popover>
        <colorPicker v-model="color" @change="handleColorChange"/>
        <button class="ql-clean" type="button"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-indent" value="+1" type="button"></button>
        <button class="ql-indent" value="-1" type="button"></button>
        <button class="ql-link" type="button"></button>
      </span>
    </div>
    <div id="editor">
    </div>

  </div>
</template>

<script>
import './css/quill.css'
import './css/highlight.css'
import './css/quillFont.css'
import './css/quillTable.css'
import Quill from 'quill'
import Vue from 'vue'
import Popover from "./Component/Popover";
import vcolorpicker from 'vcolorpicker';

Vue.use(vcolorpicker)

// 注册自定义插件
import {initEpEditor, defaultOption} from "./quillRegister";
// import axios from "axios";

initEpEditor(Quill)

export default {
  name: "vue2-quill2-editor",
  components: {Popover},
  props: {
    uploadFunction: {
      type: Function,
      required: false
    },
    value: String,
  },
  watch: {
    // 双向绑定 如果传入的值发生了改变,对应的影响编辑器的显示
    value(newVal, oldVal) {
      if (this.quill) {
        if (newVal && newVal !== this._content) {
          this._content = newVal
          this.quill.clipboard.dangerouslyPasteHTML(newVal)
        } else if (!newVal) {
          this.quill.setText('')
        }
      }
    },
    // 双向绑定 如果编辑器的值发生了改变 则对应的影响绑定的value
    content(newVal, oldVal) {
      if (this.quill) {
        if (newVal && newVal !== this._content) {
          this._content = newVal
          this.quill.clipboard.dangerouslyPasteHTML(newVal)
        } else if (!newVal) {
          this.quill.setText('')
        }
      }
    }
  },
  data() {
    return {
      quill: {},
      _content: '',
      tableSize: [10, 10],
      color: '#ff0000',
    }
  },
  mounted() {
    let vm = this

    defaultOption.modules.uploader = {
      handler: (range, fileList) => {
        vm.uploadFunction(range, fileList)
      }
    }

    this.quill = new Quill('#editor', defaultOption);

    this.quill.enable(false)

    // Set editor content
    if (this.value || this.content) {
      this.quill.clipboard.dangerouslyPasteHTML(this.value || this.content)
    }

    // Emit ready event
    this.quill.enable(true)

    // 双向绑定,如果修改了编辑器的值,那么绑定的值也要发生变化
    this.quill.on('text-change', (delta, oldDelta, source) => {
      let html = vm.quill.getSemanticHTML(0)
      const quill = vm.quill
      const text = vm.quill.getText()
      vm._content = html
      vm.$emit('input', vm._content)
      vm.$emit('change', {html, text, quill})
    });

    this.$emit('ready', this.quill)
  },
  methods: {
    triggerUpload() {
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      // 处理文件
    },
    handleColorChange(val) {
      this.quill.format('color', val);      // val =  #ffff  || red ....
    },
    hoverTableCell(row, cell) {
      // 清除之前赋予的color
      for (let r = 0; r < this.tableSize[0]; r++) {
        for (let c = 0; c < this.tableSize[1]; c++) {
          this.$refs[`md-table-cell-row-${(r + 1).toString()}-cell-${(c + 1).toString()}`].forEach(v => {
            v.style = ''
          })
        }
      }
      for (let r = 0; r < row; r++) {
        for (let c = 0; c < cell; c++) {
          this.$refs[`md-table-cell-row-${(r + 1).toString()}-cell-${(c + 1).toString()}`].forEach(v => {
            v.style = 'background:#DEF'
          })
        }
      }
    },
    insertTable(val1, val2) {
      let tableModule = this.quill.getModule('better-table')
      tableModule.insertTable(val1, val2)
      this.$refs.tableGenerator.showPopper = false
    },
  }
}
</script>

<style scoped>
.table_size_chooser {
  padding: 10px;
}

.SizeChooser table {
  border-spacing: 2px;
}

.SizeChooser td {
  width: 20px;
  height: 20px;
  border: 1px solid #ccc;
}

/deep/ .colorBtn {
  margin: 1px;
  cursor: pointer;
}
</style>
