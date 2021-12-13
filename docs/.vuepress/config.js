const head = require('./config/nav')

module.exports = {
    base: '/',
    title: '我是张大王',
    description: '勿以小而不为，勿以难而不攻。',
    markdown: {
        lineNumbers: true // 代码块显示行号
    },
    themeConfig: {
        // 你的GitHub仓库，请正确填写
        repo: 'https://github.com/kk8765/vuepress-blog',
        // 自定义仓库链接文字。
        repoLabel: 'GitHub',
        nav: [
            {text: '主页', link: ''},
            {text: '博客', link: '/blog/firstBlog/firstBlog.md'},
            {
                text: 'CSDN',
                items: [
                    // link：指向链接也可以是外网链接
                    {text: 'CSDN', link: 'https://blog.csdn.net/weixin_41724477?spm=1000.2115.3001.5343'},
                ]
            },
        ],
        sidebar: [
            ['/', '首页'],
            {
                title: '我的博客',
                children: [
                    ['/blog/firstBlog/firstBlog.md', '笔记：函数声明与函数表达式'],// 如果index命名会报错，何解？
                    ['/blog/secondBlog/secondBlog.md', '如何写出无法维护的代码。'],
                    ['/blog/thirdBlog/thirdBlog.md', '简单的原生js Ajax封装promise'],
                    ['/blog/fourthBlog/fourthBlog.md', '笔记：常用git命令'],
                    ['/blog/fifthBlog/fifthBlog.md', '兼容ie9以下Array.forEach，.map，.filter，String.trim方法']
                ]
            }

        ]
    },
    head
}
