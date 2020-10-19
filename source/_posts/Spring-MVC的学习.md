---
title: Spring MVC的学习
date: 2020-08-19 15:09:55
tags:
- Java
- Spring
---

## 三层架构

- 表现层
- 业务层
- 数据层

<!-- more -->

## MVC

- Model: 模型层
- View: 视图层
- Controller: 控制层

MVC三层集体解决表现层的问题。

![](MVC.png)

## 核心组件

前端控制器: `DispatcherServlet`

过程: 
![](MVC原理.png)

如图，前端控制器会收到浏览器发来的请求，之后匹配相应的Controller，Controller会处理该请求并返回model给前端控制器，前端控制器会再将model传给View Template，View Template会生成一个HTML并返回给前端控制器，之后前端控制器将网页作为response返回给浏览器。