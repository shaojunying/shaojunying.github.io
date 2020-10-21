---
title: Java并发的学习
date: 2020-10-18 21:45:33
tags:
---

## synchronized关键字

### 一个实例中的synchronized方法每次只能由一个线程运行

例如Bank类中有两个方法(存钱和取钱)被synchronized修饰,那么如果其中一个在执行,另一个就不能被另一个线程执行,(具体来说就是一个人不能进行存钱和取钱操作,即使在不同的线程下)

以下两种方式等价

```Java
synchronized void fun(){
    // ...
}
```
和
```Java
void fun(){
    synchronized(this){
        // ...
    }
}
```

### synchronized 静态方法

synchronized静态方法使用的锁是xxx.class,而非静态方法锁的是类的实例(this).两者都是只能同时由一个线程执行.

<!-- more -->