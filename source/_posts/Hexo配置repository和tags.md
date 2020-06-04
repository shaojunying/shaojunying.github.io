---
title: Hexo配置categories和tags
categories: 
- 博客搭建
- Hexo
tags:
- 博客搭建
- Hexo
---

> 参考 https://www.zhihu.com/question/29017171/answer/364705653

## 问题

基于Hexo搭建页面之后categories和tags无法显示

## 解决方案(以categories为例)

首先使用如下命令创建一个categories文件夹,在文件夹内创建一个index.md

```
$ hexo new page "tags"
```

之后将`source\categories\index.md`的内容改为如下

```
---
title: 文章分类
type: "categories"
layout: "categories"
---
```

之后在博客中使用如下方式即可创建和使用categories

```
---
title: Hexo配置categories和tags
categories: 
- 博客搭建
- Hexo
---
```