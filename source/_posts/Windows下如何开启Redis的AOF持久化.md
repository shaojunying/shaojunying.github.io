---
title: Windows下如何开启Redis的AOF持久化
date: 2020-10-06 19:31:37
tags:
- Redis
- 数据库
- Windows
---
## 方式1(命令行中开启)

1. 通过命令 redis-server命令启动redis或者redis-server —service-start启动redis服务
2. 通过redis-cli进入redis命令行
3. 执行config set appendonly yes 即可启动redis的AOF持久化

<!--more-->

*注意: 此修改只在该命令行中生效,重新启动redis之后将失效.*


## 方式2(修改redis.windows.conf开启)

1. 打开redis.windows.conf修改appendonly no为appendonly yes
2. 执行 redis-server redis.windows.conf 启动redis
3. 执行redis-cli即可.

*注意:此种方式需要窗口在执行完第2.步之后不能关闭命令行窗口,关闭之后将不能访问redis服务.*

## 方式3(修改redis.windows-service.conf开启)(推荐)

1. 打开redis.windows-service.conf修改appendonly no为appendonly yes
2. 执行redis-server --service-install redis.windows.conf命令重新安装redis服务
3. 通过redis-server —service-start启动redis服务
4. 执行redis-cli即可

*注意:此种方式是修改redis服务的启动方式,启动之后可以关闭窗口,服务不会因为窗口的关闭而关闭.*
## 开启过程中遇到的其他问题

### 问题1

- [7948] 06 Oct 19:08:11.903 # Can't open the append-only file: Input/output error

![问题1截图](1.png)

使用管理员模式重新启动命令行即可