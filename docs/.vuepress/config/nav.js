const newLink = require('./newLink')
const sideLink = newLink.map((item) => {
  return [
    item.link,
    item.text
  ]
})
module.exports = {
  head: [ // 注入到当前页面的 HTML <head> 中的标签
    ['link', { rel: 'icon', href: './kk.jpg' }], // 增加一个自定义的 favicon(网页标签的图标)
  ],
  nav: [
    {text: '主页', link: '/'},
    {
      text: '博客',
      link: '/blog/firstBlog/firstBlog.md',
      items: newLink
    },
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
      children: sideLink
    }

  ]
}