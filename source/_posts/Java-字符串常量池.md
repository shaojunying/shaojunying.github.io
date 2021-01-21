---
title: Java 字符串常量池
date: 2021-01-21 14:23:48
tags:
---

## 简述
### Java6及之前
字符串常量池存储在永久代中.new String对象需要指向常量池中的字符串
#### "1"
- 在常量池中创建字符串
- 返回其引用
#### new String("1")
- 在常量池中创建字符串
- 在堆中创建对象,对象内容指向常量池中的字符串
- 返回引用

### Java7及之后
字符串常量池存储在堆中,常量池可以指向堆中已存在的字符串
#### "1"
常量池中既可能存储字符串,也可能存储的是字符串的引用

## 案例
```Java
// 程序1
String s1 = new String("1");
s1.intern();
String s2 = "1";
System.out.println(s1 == s2);

String s3 = new String("1") + new String("1");
s3.intern();
String s4 = "11";
System.out.println(s3 == s4);
```
程序1在Java6之前,结果为false, false.在Java7之后结果为false, true

```Java
//程序2
String s1 = new String("1");
s1.intern();
String s2 = "1";
System.out.println(s1 == s2);

String s3 = new String("1") + new String("1");
String s4 = "11";
s3.intern();
System.out.println(s3 == s4);
```
程序2在Java7之后仍然为false, false