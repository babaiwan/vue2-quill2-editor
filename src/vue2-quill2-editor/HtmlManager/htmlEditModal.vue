<template>
  <div v-if="visible" class="ql-html-modal-mask" @mousedown.self="handleCancel">
    <div class="ql-html-modal" :style="{ width: width + 'px' }">
      <div class="ql-html-modal__header">
        <span class="ql-html-modal__title">{{ title }}</span>
        <span class="ql-html-modal__close" @click="handleCancel">&times;</span>
      </div>

      <!-- 工具条：格式化 / 压缩 / 撤销等 -->
      <div class="ql-html-editor__toolbar">
        <button type="button" class="ql-html-tool" title="格式化代码" @click="handleFormat">格式化</button>
        <button type="button" class="ql-html-tool" title="压缩为一行" @click="handleMinify">压缩</button>
        <span class="ql-html-editor__divider"></span>
        <button type="button" class="ql-html-tool" title="撤回（Ctrl+Z）" @click="handleUndo">撤回</button>
        <button type="button" class="ql-html-tool" title="重做（Ctrl+Y）" @click="handleRedo">重做</button>
        <span class="ql-html-editor__divider"></span>
        <span class="ql-html-editor__status">
          {{ lineCount }} 行 · {{ contentLength }} 字符
        </span>
      </div>

      <div class="ql-html-modal__body">
        <div class="ql-html-code" :style="{ height: minHeight + 'px' }">
          <!-- 行号 -->
          <div ref="gutter" class="ql-html-code__gutter">
            <div v-for="n in lineCount" :key="n" class="ql-html-code__ln">{{ n }}</div>
          </div>

          <div class="ql-html-code__main">
            <div class="ql-html-code__scroll" ref="scroll" @scroll="syncScroll">
              <!-- 高亮层（在下） -->
              <pre class="ql-html-code__highlight" aria-hidden="true"><code v-html="highlighted"></code></pre>
              <!-- 输入层（在上，文字透明、光标可见） -->
              <textarea
                  ref="textarea"
                  v-model="editContent"
                  class="ql-html-code__input"
                  spellcheck="false"
                  autocomplete="off"
                  autocorrect="off"
                  autocapitalize="off"
                  wrap="off"
                  @scroll="syncScroll"
                  @keydown="handleKeydown"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <div class="ql-html-modal__footer">
        <button type="button" class="ql-html-btn" @click="handleCancel">取消</button>
        <button type="button" class="ql-html-btn ql-html-btn--primary" @click="handleConfirm">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
import hljs from 'highlight.js/lib/core'
import xml from 'highlight.js/lib/languages/xml'
import { formatHtml, minifyHtml, escapeHtml } from './format'

// 只注册 html(xml) 语言，避免把整个 highlight.js 语言包打进来
if (!hljs.getLanguage('xml')) {
  hljs.registerLanguage('xml', xml)
}

export default {
  name: "htmlEditModal",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    // 需要编辑 / 插入的原始 html
    htmlContent: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '编辑 HTML'
    },
    width: {
      type: Number,
      default: 720
    },
    minHeight: {
      type: Number,
      default: 360
    },
    indentSize: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      editContent: '',
      // 撤回 / 重做栈
      undoStack: [],
      redoStack: [],
      // 记录是否正在程序化修改内容，避免把回退操作再次压栈
      isSilent: false
    }
  },
  computed: {
    lineCount() {
      const n = this.editContent ? this.editContent.split('\n').length : 1
      return Math.max(1, n)
    },
    contentLength() {
      return this.editContent ? this.editContent.length : 0
    },
    // 语法高亮结果（保留尾部换行，保证行高与输入层一致）
    highlighted() {
      const code = this.editContent || ''
      let html
      try {
        html = code
            ? hljs.highlight(code, { language: 'xml', ignoreIllegals: true }).value
            : ''
      } catch (e) {
        // 高亮失败时退回纯文本，不影响编辑
        html = escapeHtml(code)
      }
      // 与 textarea 换行行为保持一致
      return html.replace(/\n/g, ' \n')
    }
  },
  watch: {
    // 弹窗每次打开时，用外部传入的内容重置编辑区
    visible(val) {
      if (val) {
        this.isSilent = true
        this.editContent = formatHtml(this.htmlContent || '', this.indentSize)
        this.undoStack = []
        this.redoStack = []
        this.$nextTick(() => {
          this.isSilent = false
          if (this.$refs.textarea) {
            this.$refs.textarea.focus()
            this.$refs.textarea.setSelectionRange(0, 0)
          }
          this.syncScroll()
        })
      }
    },
    // 内容变化时记录历史
    editContent() {
      if (this.isSilent) return
      this.pushHistory()
    }
  },
  methods: {
    handleConfirm() {
      this.$emit('confirm', this.editContent)
      this.$emit('close')
    },
    handleCancel() {
      this.$emit('close')
    },

    // ---------- 格式化 ----------
    handleFormat() {
      if (!this.editContent || !this.editContent.trim()) return
      this.applyContent(formatHtml(this.editContent, this.indentSize))
    },
    handleMinify() {
      if (!this.editContent || !this.editContent.trim()) return
      this.applyContent(minifyHtml(this.editContent))
    },

    // ---------- 撤回 / 重做 ----------
    pushHistory() {
      const last = this.undoStack[this.undoStack.length - 1]
      if (last === this.editContent) return
      this.undoStack.push(this.editContent)
      // 限制栈深度，避免长时间编辑占用过多内存
      if (this.undoStack.length > 100) this.undoStack.shift()
      this.redoStack = []
    },
    handleUndo() {
      if (!this.undoStack.length) return
      const current = this.editContent
      const prev = this.undoStack.pop()
      this.redoStack.push(current)
      this.applyContent(prev, false)
    },
    handleRedo() {
      if (!this.redoStack.length) return
      const current = this.editContent
      const next = this.redoStack.pop()
      this.undoStack.push(current)
      this.applyContent(next, false)
    },
    // 以程序方式替换内容（不触发历史压栈）
    applyContent(next) {
      this.isSilent = true
      this.editContent = next
      this.$nextTick(() => {
        this.isSilent = false
        this.syncScroll()
      })
    },

    // ---------- 键盘处理：Tab 缩进 / 换行自动缩进 / 快捷键 ----------
    handleKeydown(evt) {
      const el = evt.target
      const ctrl = evt.ctrlKey || evt.metaKey

      // Ctrl+Z 撤回 / Ctrl+Y、Ctrl+Shift+Z 重做
      if (ctrl && !evt.shiftKey && evt.key.toLowerCase() === 'z') {
        evt.preventDefault()
        this.handleUndo()
        return
      }
      if (ctrl && (evt.key.toLowerCase() === 'y' || (evt.shiftKey && evt.key.toLowerCase() === 'z'))) {
        evt.preventDefault()
        this.handleRedo()
        return
      }

      const value = this.editContent || ''

      // Tab / Shift+Tab：整体缩进或反缩进（支持多行选区）
      if (evt.key === 'Tab') {
        evt.preventDefault()
        this.indentSelection(el, evt.shiftKey)
        return
      }

      // 回车：自动继承当前行缩进；若光标在开闭标签之间则额外缩进并补出结束标签
      if (evt.key === 'Enter') {
        evt.preventDefault()
        const start = el.selectionStart
        const end = el.selectionEnd
        const before = value.slice(0, start)
        const after = value.slice(end)
        const currentLine = before.slice(before.lastIndexOf('\n') + 1)
        const indent = (currentLine.match(/^[ \t]*/) || [''])[0]
        const pad = ' '.repeat(this.indentSize)

        const charBefore = before.slice(-1)
        const charAfter = after.slice(0, 1)
        const wantExtra = charBefore === '>' && charAfter === '<'

        const inserted = wantExtra
            ? '\n' + indent + pad + '\n' + indent
            : '\n' + indent

        this.isSilent = true
        this.editContent = before + inserted + after
        const caret = wantExtra
            ? start + 1 + indent.length + pad.length
            : start + inserted.length
        this.$nextTick(() => {
          this.isSilent = false
          el.selectionStart = el.selectionEnd = caret
          this.syncScroll()
        })
        return
      }
    },
    indentSelection(el, outdent) {
      const value = this.editContent || ''
      const start = el.selectionStart
      const end = el.selectionEnd
      const pad = ' '.repeat(this.indentSize)

      const lineStart = value.lastIndexOf('\n', start - 1) + 1
      const selEnd = end > start ? end : start
      let lineEnd = value.indexOf('\n', selEnd)
      if (lineEnd === -1) lineEnd = value.length

      // 无选中内容时仅插入缩进
      if (start === end && !outdent) {
        this.isSilent = true
        this.editContent = value.slice(0, start) + pad + value.slice(end)
        const caret = start + pad.length
        this.$nextTick(() => {
          this.isSilent = false
          el.selectionStart = el.selectionEnd = caret
        })
        return
      }

      const block = value.slice(lineStart, lineEnd)
      const lines = block.split('\n')
      let removedFirst = 0

      const newLines = lines.map((line, idx) => {
        if (outdent) {
          const strip = line.match(new RegExp('^[ ]{1,' + this.indentSize + '}'))
          const count = strip ? strip[0].length : 0
          if (idx === 0) removedFirst = count
          return line.slice(count)
        }
        return pad + line
      })

      const newBlock = newLines.join('\n')
      this.isSilent = true
      this.editContent = value.slice(0, lineStart) + newBlock + value.slice(lineEnd)

      this.$nextTick(() => {
        this.isSilent = false
        const shift = newBlock.length - block.length
        const newStart = outdent ? Math.max(lineStart, start - removedFirst) : start + pad.length
        const newEnd = Math.max(newStart, end + shift)
        el.selectionStart = newStart
        el.selectionEnd = newEnd
        this.syncScroll()
      })
    },

    // ---------- 滚动同步：高亮层 / 行号 跟随输入层 ----------
    syncScroll() {
      const input = this.$refs.textarea
      const scroll = this.$refs.scroll
      const gutter = this.$refs.gutter
      if (!input) return

      const top = input.scrollTop
      const left = input.scrollLeft
      if (scroll) scroll.scrollTop = top
      if (gutter) gutter.scrollTop = top
      const highlight = this.$refs.scroll && this.$refs.scroll.querySelector('.ql-html-code__highlight')
      if (highlight) {
        highlight.style.transform = `translate(${-left}px, ${-top}px)`
      }
    }
  }
}
</script>

<style scoped>
.ql-html-modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ql-html-modal {
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  max-width: 92vw;
  display: flex;
  flex-direction: column;
}

.ql-html-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.ql-html-modal__close {
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  color: #909399;
}

.ql-html-modal__close:hover {
  color: #303133;
}

/* ---------- 工具条 ---------- */
.ql-html-editor__toolbar {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid #ebeef5;
  background: #fafafa;
}

.ql-html-tool {
  padding: 4px 12px;
  margin-right: 6px;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  background: #fff;
  color: #606266;
  font-size: 12px;
  cursor: pointer;
  outline: none;
}

.ql-html-tool:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background: #ecf5ff;
}

.ql-html-editor__divider {
  width: 1px;
  height: 16px;
  margin: 0 8px;
  background: #dcdfe6;
}

.ql-html-editor__status {
  margin-left: auto;
  font-size: 12px;
  color: #909399;
}

/* ---------- 代码编辑区 ---------- */
.ql-html-modal__body {
  padding: 12px 16px;
}

.ql-html-code {
  display: flex;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
  background: #f8f8f8;
}

.ql-html-code:focus-within {
  border-color: #409eff;
}

.ql-html-code__gutter {
  flex: 0 0 auto;
  min-width: 42px;
  padding: 10px 0;
  overflow: hidden;
  text-align: right;
  background: #f0f2f5;
  border-right: 1px solid #ebeef5;
  user-select: none;
}

.ql-html-code__ln {
  padding: 0 10px 0 6px;
  font-family: Consolas, Monaco, 'Courier New', monospace;
  font-size: 13px;
  line-height: 20px;
  color: #9aa1ab;
}

.ql-html-code__main {
  flex: 1 1 auto;
  min-width: 0;
  position: relative;
}

.ql-html-code__scroll {
  position: relative;
  height: 100%;
  overflow: hidden;
}

/* 高亮层与输入层必须严格对齐：同字体、同行高、同 padding */
.ql-html-code__highlight,
.ql-html-code__input {
  margin: 0;
  padding: 10px 12px;
  border: 0;
  font-family: Consolas, Monaco, 'Courier New', monospace;
  font-size: 13px;
  line-height: 20px;
  white-space: pre;
  tab-size: 4;
}

.ql-html-code__highlight {
  position: absolute;
  top: 0;
  left: 0;
  width: max-content;
  min-width: 100%;
  min-height: 100%;
  box-sizing: border-box;
  pointer-events: none;
  background: transparent;
  will-change: transform;
}

.ql-html-code__highlight code {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}

.ql-html-code__input {
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  resize: none;
  outline: none;
  background: transparent;
  color: transparent;
  caret-color: #303133;
  overflow: auto;
}

/* 选中文字时的背景可见，但文字仍为透明以避免与高亮层重影 */
.ql-html-code__input::selection {
  background: #b3d8ff;
  color: transparent;
}

/* 高亮 token 配色：作用域限定在本组件内，避免与全局 highlight.css 冲突 */
.ql-html-code ::v-deep .hljs,
.ql-html-code ::v-deep .hljs * {
  background: transparent;
  color: #383a42;
}

.ql-html-code ::v-deep .hljs-tag,
.ql-html-code ::v-deep .hljs-punctuation {
  color: #383a42;
}

.ql-html-code ::v-deep .hljs-name,
.ql-html-code ::v-deep .hljs-selector-tag {
  color: #e45649;
  font-weight: 400;
}

.ql-html-code ::v-deep .hljs-attr,
.ql-html-code ::v-deep .hljs-attribute {
  color: #986801;
  font-weight: 400;
}

.ql-html-code ::v-deep .hljs-string,
.ql-html-code ::v-deep .hljs-quote {
  color: #50a14f;
}

.ql-html-code ::v-deep .hljs-comment {
  color: #a0a1a7;
  font-style: italic;
}

.ql-html-code ::v-deep .hljs-keyword,
.ql-html-code ::v-deep .hljs-meta {
  color: #4078f2;
}

.ql-html-code ::v-deep .hljs-number,
.ql-html-code ::v-deep .hljs-literal {
  color: #986801;
}

/* ---------- 底部按钮 ---------- */
.ql-html-modal__footer {
  display: flex;
  justify-content: flex-end;
  padding: 12px 16px;
  border-top: 1px solid #ebeef5;
}

.ql-html-btn {
  margin-left: 10px;
  padding: 7px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #fff;
  color: #606266;
  font-size: 13px;
  cursor: pointer;
  outline: none;
}

.ql-html-btn:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background: #ecf5ff;
}

.ql-html-btn--primary {
  background: #409eff;
  border-color: #409eff;
  color: #fff;
}

.ql-html-btn--primary:hover {
  background: #66b1ff;
  border-color: #66b1ff;
  color: #fff;
}
</style>
