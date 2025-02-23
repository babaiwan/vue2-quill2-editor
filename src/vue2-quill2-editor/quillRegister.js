import QuillBetterTable from './betterTable/quill-better-table'
import ImageResize from './ImageResize/ImageResize'
import HtmlManager from './HtmlManager/htmlManager'
import {MSWORD_MATCHERS} from './ClipBoard/matcher'
import hljs from 'highlight.js'
import {registerFontSize} from './Font/fontSize'
import {registerFontFamily} from './Font/fontFamily'
import {registerLineHeight} from './LineHeight/lineHeight'
import {registerTextIndent} from './Indent/Indent'
import ImageUploader from './ImageUploader/quill.imageUploader'
import {registerImageBlot} from './ImageUploader/loadingImage'
import Quill from "quill";

function registerImageUploader(Quill) {
    Quill.register('modules/imageUploader', ImageUploader)
}

function registerTable(Quill) {
    Quill.register({'modules/better-table': QuillBetterTable}, true)
}

function registerImageResize(Quill) {
    Quill.register('modules/imageResize', ImageResize)
}

function registerHtmlBlock(Quill) {
    Quill.register('modules/htmlManager', HtmlManager)
}

function registerScriptBlock(Quill) {
    const block = Quill.import('blots/block')

    class ScriptBlock extends block {
        static create(value) {
            const node = super.create(value)
            node.text = value
            return node
        }
    }

    // blotName
    ScriptBlock.blotName = 'ScriptBlock'
    // class名将用于匹配blot名称
    ScriptBlock.className = 'ScriptBlock'
    // 标签类型自定义
    ScriptBlock.tagName = 'script'
    Quill.register(ScriptBlock, true)
}

function registerColor(Quill) {
    let inline = Quill.import('blots/inline')

    class myColorInline extends inline {
        static create(value) {
            const node = super.create(value)
            node.innerText = typeof value === 'object' ? value.text : value
            node.style.color = value.color
            return node
        }

        static transformValue(value) {
            let handleArr = value.split('\n')
            handleArr = handleArr.map((e) => e.replace(/^[\s]+/, '').replace(/[\s]+$/, ''))
            return handleArr.join('')
        }

        static value(node) {
            return {text: node.outerText, color: node.style.color}
        }
    }

    // blotName
    myColorInline.blotName = 'myColorInline'
    // class名将用于匹配blot名称
    myColorInline.className = 'myColorInline'
    // 标签类型自定义
    myColorInline.tagName = 'span'
    Quill.register(myColorInline, true)
}

/**
 * 重载createLink
 * */
function registerLinkBlot(Quill) {
    const Inline = Quill.import('blots/inline')

    class linkBlock extends Inline {
        static create(value) {
            console.log('createLink')
            console.log(value)
            const node = super.create(value)
            node.setAttribute('href', this.sanitize(value))
            node.setAttribute('rel', 'noopener noreferrer')
            node.setAttribute('target', '_blank')
            console.log(node)
            return node
        }

        static formats(domNode) {
            return domNode.getAttribute('href')
        }

        static sanitize(url) {
            return sanitize(url, this.PROTOCOL_WHITELIST) ? url : this.SANITIZED_URL
        }

        /**
         * 重载该方法，format: text -> link
         * */
        format(name, value) {
            if (name !== this.statics.blotName || !value) {
                super.format(name, value)
            } else {
                this.domNode.setAttribute('href', this.constructor.sanitize(value))
            }
        }
    }

    linkBlock.blotName = 'linkBlock'
    linkBlock.tagName = 'A'
    linkBlock.SANITIZED_URL = 'about:blank'
    linkBlock.PROTOCOL_WHITELIST = ['http', 'https', 'mailto', 'tel']

    function sanitize(url, protocols) {
        const anchor = document.createElement('a')
        anchor.href = url
        const protocol = anchor.href.slice(0, anchor.href.indexOf(':'))
        return protocols.indexOf(protocol) > -1
    }

    Quill.register(linkBlock)
}

hljs.configure({
    // optionally configure hljs
    languages: ['javascript', 'ruby', 'python', 'sql', 'java']
})

var bindings = {
    // This will overwrite the default binding also named 'tab'
    delete: {
        key: 'Delete',
        handler: function (range, context) {
            if (context.line.statics.blotName === 'table-cell-line') {
                return false
            } else {
                return true
            }
        }
    }
}

export const defaultOption = {
    theme: 'snow',
    boundary: document.body,
    modules: {
        toolbar: {
            container: '#toolbar'
            // handlers:handlers
        },
        'better-table': {
            operationMenu: {
                items: {
                    insertColumnLeft: {
                        text: '左侧插入列'
                    },
                    insertColumnRight: {
                        text: '右侧插入列'
                    },
                    insertRowUp: {
                        text: '顶部插入行'
                    },
                    insertRowDown: {
                        text: '底部插入行'
                    },
                    mergeCells: {
                        text: '合并单元格'
                    },
                    unmergeCells: {
                        text: '取消合并表格单元格'
                    },
                    deleteColumn: {
                        text: '删除列'
                    },
                    deleteRow: {
                        text: '删除行'
                    },
                    deleteTable: {
                        text: '删除表格'
                    }
                },
                background: {
                    color: '#333'
                },
                color: {
                    colors: ['green', 'red', 'yellow', 'blue', 'white'],
                    text: 'background:'
                }
            }
        },
        imageResize: {
            // See optional "config" below
        },
        syntax: {
            hljs: {
                highlight: function (language, text) {
                    // 返回highlight函数
                    let result = hljs.highlightAuto(text)
                    return result
                }
            }
        },
        // insertsAfter: true,
        htmlManager: true,
        clipboard: {
            matchers: MSWORD_MATCHERS
        },
        uploader: {
            handler: function (range, files) {
                console.log('do nothing')
            }
        },
        keyboard: {
            bindings: bindings
        }
    },
    placeholder: 'Insert text here ...',
    readOnly: false
}

export function initEpEditor(Quill) {
    var icons = Quill.import('ui/icons');
    icons.align[''] = '<svg t="1709021933768" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5540" width="18" height="18"><path d="M674.082 192.05H92.062c-17.673 0-32 14.327-32 32s14.327 32 32 32h582.021c17.673 0 32-14.327 32-32s-14.328-32-32.001-32zM923.938 481.242H92.062c-17.673 0-32 14.327-32 32s14.327 32 32 32h831.877c17.673 0 32-14.327 32-32s-14.328-32-32.001-32zM673.938 767.726H92.062c-17.673 0-32 14.327-32 32s14.327 32 32 32h581.877c17.673 0 32-14.327 32-32s-14.328-32-32.001-32z" fill="" p-id="5541"></path></svg>'
    icons.align['center'] = '<svg t="1709021950245" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5714" width="18" height="18"><path d="M220.99 192.162h582.02c17.673 0 32 14.327 32 32s-14.327 32-32 32H220.99c-17.673 0-32-14.327-32-32s14.327-32 32-32zM96.062 481.354h831.877c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32H96.062c-17.673 0-32-14.327-32-32 0-17.673 14.327-32 32-32zM221.062 767.838h581.877c17.673 0 32 14.327 32 32s-14.327 32-32 32H221.062c-17.673 0-32-14.327-32-32s14.327-32 32-32z" fill="" p-id="5715"></path></svg>'
    icons.align['right'] = '<svg t="1709021974345" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5922" width="18" height="18"><path d="M341.918 192.05h582.021c17.673 0 32 14.327 32 32s-14.327 32-32 32H341.918c-17.673 0-32-14.327-32-32s14.327-32 32-32zM92.062 481.242h831.877c17.673 0 32 14.327 32 32s-14.327 32-32 32H92.062c-17.673 0-32-14.327-32-32s14.327-32 32-32zM342.062 767.726h581.877c17.673 0 32 14.327 32 32s-14.327 32-32 32H342.062c-17.673 0-32-14.327-32-32s14.327-32 32-32z" fill="" p-id="5923"></path></svg>'
    icons.align['justify'] = '<svg t="1709021985591" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6130" width="18" height="18"><path d="M923.938 192.05H92.062c-17.673 0-32 14.327-32 32s14.327 32 32 32h831.877c17.673 0 32-14.327 32-32s-14.328-32-32.001-32zM923.938 481.242H92.062c-17.673 0-32 14.327-32 32s14.327 32 32 32h831.877c17.673 0 32-14.327 32-32s-14.328-32-32.001-32zM923.938 767.726H92.062c-17.673 0-32 14.327-32 32s14.327 32 32 32h831.877c17.673 0 32-14.327 32-32s-14.328-32-32.001-32z" fill="" p-id="6131"></path></svg>'

    registerImageBlot(Quill)
    registerImageUploader(Quill)
    registerTextIndent(Quill)
    registerTable(Quill)
    registerFontSize(Quill)
    registerFontFamily(Quill)
    registerImageResize(Quill)
    registerHtmlBlock(Quill)
    registerScriptBlock(Quill)
    registerColor(Quill)
    registerLinkBlot(Quill)
    registerLineHeight(Quill)
}
