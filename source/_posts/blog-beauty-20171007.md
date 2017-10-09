---
title: 博客美化进程
tags:
  - testing
  - 搭建博客
categories:
  - 日常
date: 2017-10-07 23:49:32
---
# Teeeemoji 的博客美化进程

要美化的地方右好多好多, 要添加的新功能也有好多

## 待办事项
- LOGO
- favicon 更换

<!-- more -->
## clear 事项
- 音乐列表功能, 尝试能不能使用网易云音乐的服务
参考 [weqeo 的博文](http://weqeo.com/2016/10/11/Hexo%E4%B8%AD%E6%92%AD%E6%94%BE%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E7%9A%84%E5%AE%9E%E8%B7%B5/)
感觉加入网易云音乐的功能非常非常的鸡肋
切换文章, 啪地音乐就断了...
使用非常简单, 网易云音乐可以直接生成 iframe 的播放器, 插入页面的 layout 中就可以了
我最终决定不实用这个功能
- 全站 https 加密
这个看了看, 我目前没有必要用, 申请友链的话, 我就用 teeeemoji.github.io 就可以了,哈哈
- 使用 topPost
 参照文档[Material topPost](https://material.viosey.com/docs/#/config/services?id=toppost)
安装好包, 然后在某个文章的 front-matter 中配置 top: true, 搞定, 置顶某一篇文章
- Rss 订阅服务
查半天不知道 rss 有什么用,都是再说怎么用 rss 或者说 rss 的原理的
算了, 参照 [Material Rss](https://material.viosey.com/docs/#/config/services?id=rss)弄一弄, 以后有用到的时候再说吧
配置使用 hexo-generator-feed 的 readme.md 中的默认配置
- 加入搜索系统
使用 Google 的搜索服务好像不顶用啊, 站内搜索毛都没有
使用本地搜索体验杠杠的,即时搜索+suggest 既视感, 但是由于要加载 search.xml, 这个文件看起来并不小, 所以网站速度可以想象
参考 [Material 搜索系统](https://material.viosey.com/docs/#/config/services?id=%e6%9c%ac%e5%9c%b0%e6%90%9c%e7%b4%a2)
还有一种搜索系统, [Swiftype](http://swiftype.com/)略嫌麻烦, 所以不再尝试了
- 数据统计与分析
参考文档 [Material 数据统计与分析](https://material.viosey.com/docs/#/config/services?id=%e6%95%b0%e6%8d%ae%e7%bb%9f%e8%ae%a1%e4%b8%8e%e5%88%86%e6%9e%90)
加入 [百度统计](tongji.baidu.com) 用邮箱注册一个百度统计账号, 贼简单
加入 [cnzz(友盟)](http://www.umeng.com/)
同样用邮箱注册一个友盟账号, 加入非常简单
加入 [google analytics](analytics.google.com)
同样用163邮箱注册一个google账号, 加入非常简单
- 评论第三方服务
使用 [LiveRe(来必力)](https://livere.com/)
使用方法参考[Material 第三方服务](https://material.viosey.com/docs/#/config/services)
- 文章添加缩略图
这个缩略图, 指的是文章列表显示的每一篇文章头部的图片
1. 默认的随机缩略图
放置在 img/gallaxy/ 目录下, 从 [NASA]() 下载的一堆太空美图, 图片质量没得说, 照顾网站速度与主机流量, 都是用的是中等画质的图片
2. 文章定制的缩略图
文章的 front-matter 中设置字段 thumbnail
P.S. [Hexo 官方文档](https://hexo.io)中对 front-matter 的介绍中没看到, 全靠自己灵光一闪实验出来的
个人介绍: 只是一个人,因为很想你
一句话: 日事清,不贰过 
- 更换背景图
直接使用我电脑桌面图片了, 风格我自己表示很满意
- 添加菜单
左侧菜单列表内容, 参考 [Viosey's Blog](https://blog.viosey.com/)
home,归档,分类,gallery,about,friends links,tags,timeline,Articles
- 添加 pages
上面说的每一个菜单, 其实都对应一个页面, 用下面这种方式先添加页面, 然后按照文档进行配置(有几个页面连配置都不需要)
```
$ hexo new page 'xxx'
```
添加方式参考 [Material 独立页面](https://material.viosey.com/docs/#/pages)
