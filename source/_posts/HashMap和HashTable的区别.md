---
title: HashMap和HashTable的区别
categories: 
- Java
---

## 线程安全

- HashTable为所有方法添加了synchronize关键字,保证了每个方法的线程安全性,但是降低了效率
- HashMap不保证线程安全性,但是效率相对较高

## 继承的类不同

- HashTable继承的是Dictionary类
- HashMap继承的是AbstractMap类

## 对null的支持

- HashTable的key和value均不支持null,调用put时如果value为null将抛出NullPointerException,计算hash值会直接调用key的hashcode方法,如果key为空也将抛出异常
- HashMap的key和value均支持null.HashMap对value值没有任何要求,在计算hashcode时会判断hashcode是否为null,如果为null,则直接用0作为hash值

## 初始化和扩容方式不同

- HashTable在调用构造函数时直接初始化了数组.默认初始容量为11.扩容时HashTable会将新容量设置为原来容量的2倍+1
- HashMap在调用构造函数时只记录初始容量,在第一次put才会初始化数组.默认初始化容量为16.容量参数如果不是2的幂,会被转化为2的幂.扩容时新容量为原来容量的2倍

## hash值的计算方法不同

- HashTable会将hashcode去掉符号位(后31位)对数组长度取余作为数组的下标
- 如果key位null,则下标直接为0.HashMap会对hashcode的高16位和低16位做异或运算(`(h = key.hashCode()) ^ (h >>> 16)`).之后将(`(n-1)&hash`)作为数组的下标.