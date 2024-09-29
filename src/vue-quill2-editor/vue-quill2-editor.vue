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
        <ep-popover ref="tableGenerator" placement="bottom" width="250" trigger="hover">
                  <div>
                    <div id="md-table-gen-wrap" class="table_size_chooser" ref="md-table-gen-wrap">
                      <div class="SizeChooser">
                        <span id="md-table-info">选择Table的行列</span>
                        <table id="md-table-gen-chooser" ref="md-table-gen-chooser">
                          <tbody>
                            <tr v-for="row in tableSize[0]">
                              <td
                                  v-for="cell in tableSize[1]"
                                  :ref="'md-table-cell-row-' + row + '-cell-' + cell"
                                  @mouseenter="hoverTableCell(row, cell)"
                                  @click="insertTable(row, cell)"
                              ></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <button slot="reference" type="button">
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
                </ep-popover>
                <button class="ql-color-picker" type="button">
                  <colorPicker v-model="color" v-on:change="handleColorChange"/>
                </button>
                <ep-popover placement="top" trigger="hover">
                  <div style="width: 120px;font-size: 12px;height: 32px">清除样式</div>
                  <button slot="reference" @click="deleteFormat" type="button">
                    <svg
                        t="1640141890477"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="2896"
                        width="14"
                        height="14"
                    >
                      <path
                          d="M876.564398 512.149985h30.697002c7.699248 0 15.398496 0 22.997754-2.599746 33.296748-8.999121 46.095498-43.495752 37.096378-104.889757-3.799629-28.197246-24.297627-46.095498-54.99463-46.095498H614.290011v-24.297627c0-65.293624-3.799629-130.487257 0-195.780881C616.889757 75.792598 589.992384 18.198223 537.49751 2.899717c-15.398496-3.799629-38.39625-3.799629-51.195 0C458.105263 13.098721 421.008886 39.996094 413.409628 79.692218c-2.599746 12.79875-3.799629 24.297627-3.799629 35.796504v243.076262H113.938873c-40.896006 0-60.094131 19.198125-60.094131 61.394004v7.699249c0 72.892882 7.699248 80.59213 80.592129 84.491748 2.599746 0 6.399375 1.299873 10.199004 1.299873-28.197246 145.885753-56.294502 290.471634-86.991504 435.057514-7.699248 35.796504 0 62.693878 30.697002 75.492628h844.417537c29.397129-12.79875 38.39625-38.39625 31.996876-72.892882-30.597012-145.985744-58.794258-290.571624-88.191388-438.957133zM509.300264 54.094717c31.996875 0 52.494874 22.997754 52.494873 61.394005 0 74.192755 1.299873 147.185626 1.299873 221.378381v21.797871H459.405136V115.488722c0-37.096377 19.198125-60.194122 49.895128-61.394005zM102.439996 460.954985v-51.195001h818.820037V460.954985H102.439996z m200.880383 511.750024c8.999121-63.993751 17.898252-133.087003 26.897373-199.580509 1.299873-11.498877 2.599746-21.797871 3.799629-31.996876 1.299873-15.398496-3.799629-28.197246-19.198125-30.697002-17.898252-2.599746-28.197246 6.399375-30.697002 22.997754-6.399375 42.195879-11.498877 83.191876-17.898252 125.387755-3.799629 37.096377-8.999121 75.492628-14.098624 113.888878H103.739869c33.296748-153.585001 66.493506-307.070013 101.090128-460.655014h610.340397c33.296748 153.585001 66.493506 307.070013 101.090127 460.655014h-612.940142z"
                          p-id="2897"
                      ></path>
                    </svg>
                  </button>
                </ep-popover>
      </span>
      <span class="ql-formats">
        <button class="ql-indent" value="+1" type="button"></button>
        <button class="ql-indent" value="-1" type="button"></button>
        <button class="ql-text-indent" value="+1" type="button">
          <svg
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <g>
              <title>Layer 1</title>
              <image
                  stroke="null"
                  x="1"
                  y="1"
                  width="16"
                  height="16"
                  id="svg_1"
                  xlink:href="data:image/png;base64,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"
              />
            </g>
          </svg>
        </button>
        <button class="ql-text-indent" value="-1" type="button" style="padding-top: 4px">
          <svg
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <g>
              <title>Layer 1</title>
              <image
                  x="0"
                  y="0"
                  width="16"
                  height="16"
                  id="svg_2"
                  xlink:href="data:image/png;base64,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"
              />
            </g>
          </svg>
        </button>
      </span>
      <span class="ql-formats" style="min-width: 120px; position: relative">
        <button style="min-width: 45px;" @click="triggerUpload">附件</button>
        <input type="file" ref="fileInput" style="display: none;" @change="handleFileChange">
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

// 组件库
import "ep-ui/theme/lib/ionicons2/ionicons2.min.css"  // 旧图标库。必须，message等组件及老项目用到了
import Vue from 'vue'
import epui from "ep-ui";
import vcolorpicker from 'vcolorpicker';

Vue.use(epui)
Vue.use(vcolorpicker)

// 注册自定义插件
import {initEpEditor, defaultOption} from "./quillRegister";

initEpEditor(Quill)

export default {
  name: "vue-quill2-editor",
  props: {
    uploadFunction: {
      type: Function,
      required: false
    }
  },
  data() {
    return {
      quill: {},
      tableSize: [10, 10],
      color: '#ff0000',
    }
  },
  mounted() {
    let vm = this
    defaultOption.modules.imageUploader = {
      upload: (files) => {
        return new Promise((resolve, reject) => {
          const fileName = files.name.toString()
          var reader = new FileReader()
          reader.readAsDataURL(files)
          reader.onload = function (evt) {
            let fileString = evt.target.result
            if (!files) {
              this.$pop('请选择文件')
            } else {
              vm.uploadFunction({
                fileName: fileName,
                fileContent: fileString
              }).then(json => {
                const Delta = Quill.import('delta')
                const cursorPosition = this.quill.getSelection().index
                const newlineChar = '\n'
                const numNewlines = 2 // Number of newlines to insert
                let deltaOps = []
                for (let i = 0; i < numNewlines; i++) {
                  deltaOps.push({insert: newlineChar, linebreak: true})
                }
                deltaOps.push({insert: {attachment: json.data}})
                const newDelta = new Delta().retain(cursorPosition).insert(deltaOps)
                this.quill.updateContents(newDelta)
                this.quill.setSelection(cursorPosition + numNewlines + 1, 0)
              })
            }
          }
        })
      }
    }
    this.quill = new Quill('#editor', defaultOption);
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
    deleteFormat() {
      let range = this.quill.getSelection()
      if (range != null && range.length != 0) {
        this.quill.removeFormat(range.index, range.length, 'api')
      }
    },
    hoverTableCell(row, cell) {
      // 清除之前赋予的color
      for (let r = 0; r < this.tableSize[0]; r++) {
        for (let c = 0; c < this.tableSize[1]; c++) {
          this.$refs[`md-table-cell-row-${(r + 1).toString()}-cell-${(c + 1).toString()}`].forEach(v => {
            v.bgColor = ''
          })
        }
      }
      for (let r = 0; r < row; r++) {
        for (let c = 0; c < cell; c++) {
          this.$refs[`md-table-cell-row-${(r + 1).toString()}-cell-${(c + 1).toString()}`].forEach(v => {
            v.bgColor = '#DEF;'
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

</style>
