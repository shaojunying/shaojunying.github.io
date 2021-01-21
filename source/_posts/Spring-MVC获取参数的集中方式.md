---
title: Spring MVC获取参数的集中方式
date: 2021-01-21 14:09:44
tags:
- Java
- 面试
- Spring MVC
---
## Spring MVC获取Request参数的几种方式

- RequestBody 获取方法体中的参数 不可用于get
- RequestParam 获取路径中问号后面的数据

    例子： [http://www.baidu.com?](http://www.baidu.com?id)keyword=1, 可以用来获取keyword参数

- PathVariable 获取路径中的数据

    例子： [http://www.baidu.com/{id}](http://www.baidu.com/{id}) , 可以获取id参数