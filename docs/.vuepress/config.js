const { head, nav, sidebar } = require('./config/nav')
const newLink = require('./config/newLink')
const sideLink = newLink.map((item) => {
    return [
        item.link,
        item.text
    ]
})

module.exports = {
    base: '/',
    title: '我是张大王',
    description: '炽热坦诚，好运常在',
    markdown: {
        lineNumbers: true // 代码块显示行号
    },
    themeConfig: {
        // 你的GitHub仓库，请正确填写
        repo: 'https://github.com/kk8765/vuepress-blog',
        // 自定义仓库链接文字。
        repoLabel: 'GitHub',
        nav,
        sidebar
    },
    head
}
