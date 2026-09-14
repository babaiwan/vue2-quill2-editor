/**
 * 轻量的 HTML 格式化工具（不引入 prettier 等重型依赖）
 * 支持缩进整理、压缩，以及对 <pre>/<script>/<style>/<textarea> 内部内容的原样保护。
 *
 * 格式化策略：仅块级标签换行；行内标签与文本保持在同一行，
 * 避免因插入换行而在渲染时产生多余空格（例如 <p>a<b>b</b>c</p> 必须保持 a b c 连在一起）。
 */

// 空元素（自闭合）标签
const VOID_TAGS = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr'
])

// 行内元素：不换行，与相邻文本保持在同一行
const INLINE_TAGS = new Set([
    'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'data', 'dfn', 'em',
    'i', 'img', 'input', 'kbd', 'label', 'mark', 'meter', 'progress', 'q',
    'rp', 'rt', 'ruby', 's', 'samp', 'select', 'small', 'span', 'strong',
    'sub', 'sup', 'textarea', 'time', 'u', 'var', 'wbr',
    // 常见内联图形 / 媒体元素
    'svg', 'path', 'circle', 'rect', 'line', 'polygon', 'polyline', 'g', 'text', 'use'
])

// 内部内容需原样保留的标签
const RAW_TAGS = new Set(['pre', 'script', 'style', 'textarea'])

// 这里用字符串拼接而非直接写实体，避免源码中的实体被工具链转义丢失
const ENTITY_MAP = {
    '&': '&' + 'amp;',
    '<': '&' + 'lt;',
    '>': '&' + 'gt;',
    '"': '&' + 'quot;',
    "'": '&' + '#39;'
}

export function escapeHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, (ch) => ENTITY_MAP[ch])
}

/**
 * 规范化标签写法：折叠属性间的多余空白
 */
function normalizeTag(raw) {
    return raw.replace(/\s+/g, ' ').replace(/\s+>/g, '>').trim()
}

/**
 * 格式化 HTML：按标签层级缩进
 * @param {string} source
 * @param {number} indentSize 缩进空格数
 * @returns {string}
 */
export function formatHtml(source, indentSize = 2) {
    if (source == null || !String(source).trim()) return ''

    const text = String(source)
    const pad = ' '.repeat(Math.max(0, indentSize))
    const out = []
    const len = text.length

    let depth = 0
    // 当前行缓冲：累积行内标签与文本，遇到块级边界时落行
    let buffer = ''
    let i = 0

    const indentOf = (d) => pad.repeat(Math.max(0, d))

    const flush = () => {
        // 行内连续空白折叠为单个空格；首尾空白裁掉，避免引入多余空格
        const line = buffer.replace(/[ \t\r\n\f]+/g, ' ').trim()
        if (line) out.push(indentOf(depth) + line)
        buffer = ''
    }

    const emit = (line) => {
        if (line) out.push(indentOf(depth) + line)
    }

    while (i < len) {
        if (text[i] !== '<') {
            // 文本节点：先攒进 buffer，随行内内容一起落行
            const next = text.indexOf('<', i)
            const stop = next === -1 ? len : next
            buffer += text.slice(i, stop)
            i = stop
            continue
        }

        // 注释：块级处理，独占一行
        if (text.startsWith('<!--', i)) {
            const end = text.indexOf('-->', i)
            const stop = end === -1 ? len : end + 3
            flush()
            emit(text.slice(i, stop).trim())
            i = stop
            continue
        }

        const tagEnd = text.indexOf('>', i)
        if (tagEnd === -1) {
            // 未闭合的标签：作为文本输出，避免死循环
            buffer += text.slice(i)
            break
        }

        const raw = text.slice(i, tagEnd + 1)
        const nameMatch = raw.match(/^<\/?\s*([a-zA-Z0-9-]+)/)
        const name = nameMatch ? nameMatch[1].toLowerCase() : ''
        const isClose = /^<\s*\//.test(raw)
        const isDecl = /^<[!?]/.test(raw)
        const isSelfClose = /\/>\s*$/.test(raw) || VOID_TAGS.has(name)

        // 原样保留块：pre / script / style / textarea
        if (!isClose && !isDecl && RAW_TAGS.has(name)) {
            const closeStart = text.toLowerCase().indexOf('</' + name, tagEnd + 1)
            flush()
            if (closeStart !== -1) {
                const closeEnd = text.indexOf('>', closeStart)
                const stop = closeEnd === -1 ? len : closeEnd + 1
                const inner = text.slice(tagEnd + 1, closeStart)
                const closeTag = normalizeTag(text.slice(closeStart, stop))
                // pre 对空白敏感，内部内容必须一字不改：
                // 开标签 + 原始内容 + 闭标签 作为整体输出，不在内部插入任何换行
                emit(normalizeTag(raw) + inner + closeTag)
                i = stop
                continue
            }
            emit(normalizeTag(raw))
            i = tagEnd + 1
            continue
        }

        const isInline = !isDecl && name !== '' && INLINE_TAGS.has(name)

        if (isInline) {
            // 行内标签：与文本同一行，不改变缩进层级
            buffer += normalizeTag(raw)
            i = tagEnd + 1
            continue
        }

        // 块级标签（含未知标签）：独占行
        if (isClose) {
            flush()
            depth = Math.max(0, depth - 1)
            emit(normalizeTag(raw))
        } else if (isDecl || isSelfClose) {
            flush()
            emit(normalizeTag(raw))
        } else {
            flush()
            emit(normalizeTag(raw))
            depth += 1
        }

        i = tagEnd + 1
    }

    flush()
    return out.join('\n')
}

/**
 * 压缩 HTML：去掉注释与标签间的空白，保护 pre/script/style/textarea 内容
 * @param {string} source
 * @returns {string}
 */
export function minifyHtml(source) {
    if (source == null || !String(source).trim()) return ''

    const text = String(source)
    const blocks = []

    // 先占位保护原样块
    let result = text.replace(
        /<(pre|script|style|textarea)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,
        (match) => {
            blocks.push(match)
            return '\u0000' + (blocks.length - 1) + '\u0000'
        }
    )

    result = result
        .replace(/<!--[\s\S]*?-->/g, '')   // 去掉注释
        .replace(/>\s+</g, '><')            // 标签之间的空白
        .replace(/\s{2,}/g, ' ')            // 连续空白折叠
        .trim()

    // 还原占位块
    result = result.replace(/\u0000(\d+)\u0000/g, (match, index) => blocks[Number(index)])
    return result
}
