---
title: Get和Post cookie和session区别
date: 2021-01-21 14:09:02
tags:
- 网页开发
---
# Get和Post区别

- Get是从服务端请求资源,而post是向服务端发送资源
- Get的参数附在URL后面,Post是存储在消息主体中,相对来说Post更安全一些
- Get的的URL有最大长度限制,也就导致了传输的数据不能过大

# Cookie和Session

- Cookie保存在客户端,Session保存在服务端
- Session比较难以支持分布式,因为一个服务器不知道另一个服务器中存的session
- Cookie不能存储敏感的信息,否则会不安全
- Session会增加服务器的内存压力