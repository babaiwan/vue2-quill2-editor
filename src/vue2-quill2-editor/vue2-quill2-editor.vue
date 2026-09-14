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
      <span class="ql-formats">
        <button class="ql-html" type="button" title="插入/编辑 HTML">
          <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
            <path d="M204 160h616c22.1 0 40 17.9 40 40v624c0 22.1-17.9 40-40 40H204c-22.1 0-40-17.9-40-40V200c0-22.1 17.9-40 40-40z m40 80v544h536V240H244z m96 120l-72 84 72 84-30 26-96-110 96-110 30 26z m204 0l30-26 96 110-96 110-30-26 72-84-72-84z m-98-30l56 16-60 220-56-16 60-220z" fill="currentColor"></path>
          </svg>
        </button>
      </span>
    </div>
    <div id="editor">
    </div>

    <html-edit-modal
        :visible="htmlModalVisible"
        :html-content="htmlModalContent"
        :title="htmlModalTitle"
        @confirm="handleHtmlConfirm"
        @close="closeHtmlModal"
    />
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
import HtmlEditModal from "./HtmlManager/htmlEditModal";
import vcolorpicker from 'vcolorpicker';

Vue.use(vcolorpicker)

// 注册自定义插件
import {initEpEditor, createOptions} from "./quillRegister";
// import axios from "axios";

initEpEditor(Quill)

export default {
  name: "vue2-quill2-editor",
  components: {Popover, HtmlEditModal},
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
      // html 编辑弹窗状态
      htmlModalVisible: false,
      htmlModalContent: '',
      htmlModalTitle: '插入 HTML',
      // 当前正在编辑的 html-embed 节点（为空表示新增）
      editingHtmlBlock: null,
      // 最后一次有效光标位置
      lastRange: null,
    }
  },
  mounted() {
    let vm = this

    // 每个实例使用独立配置，避免互相覆盖
    const options = createOptions()

    if (typeof this.uploadFunction === 'function') {
      options.modules.uploader = {
        handler: (range, fileList) => {
          vm.uploadFunction(range, fileList)
        }
      }
    }

    this.quill = new Quill('#editor', options);

    // 记录最后一次有效的光标位置，供插入 html 时定位
    this.quill.on('selection-change', (range) => {
      if (range) {
        vm.lastRange = range
      }
    })

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

    // 暴露给 toolbar（ql-html 按钮）与 htmlManager 浮动工具栏的入口：
    // 不传参数 => 新增；传入 html-embed 节点 => 编辑
    this.quill.openHtmlEditor = (domNode) => {
      vm.openHtmlModal(domNode)
    }

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
    /**
     * 打开 html 编辑弹窗
     * @param domNode 传入已有 html-embed 节点表示编辑，否则为新增
     */
    openHtmlModal(domNode) {
      if (!this.quill) return
      if (domNode) {
        this.editingHtmlBlock = domNode
        this.htmlModalTitle = '编辑 HTML'
        this.htmlModalContent = domNode.innerHTML
        // 关闭 htmlManager 自带的浮层
        if (this.quill.htmlManager) {
          this.quill.htmlManager.hideOverlay()
        }
      } else {
        this.editingHtmlBlock = null
        this.htmlModalTitle = '插入 HTML'
        this.htmlModalContent = ''
      }
      this.htmlModalVisible = true
    },
    closeHtmlModal() {
      this.htmlModalVisible = false
      this.editingHtmlBlock = null
    },
    handleHtmlConfirm(html) {
      this.htmlModalVisible = false
      if (!this.quill) return

      const text = (html || '').trim()
      let index

      if (this.editingHtmlBlock) {
        // 编辑已有的 html 块：先定位并删除原节点，再在相同位置插入新内容
        const blot = Quill.find(this.editingHtmlBlock)
        index = blot ? this.quill.getIndex(blot) : this.quill.getLength()
        this.editingHtmlBlock = null
        this.quill.deleteText(index, 1, 'user')
      } else {
        index = this.lastRange ? this.lastRange.index : this.quill.getLength()
      }

      if (!text) {
        this.quill.setSelection(index, 0, 'user')
        return
      }

      // 包装为 html-embed 块，便于再次点击编辑 / 整体删除
      const blob = /class\s*=\s*["'][^"']*html-embed/i.test(text)
          ? text
          : `<div class="html-embed">${text}</div>`

      this.quill.setSelection(index, 0, 'silent')
      this.quill.clipboard.dangerouslyPasteHTML(index, blob, 'user')
      this.quill.setSelection(index + 1, 0, 'silent')
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
