---
title: Java中集合类的学习
date: 2020-11-03 13:57:22
tags:
- Java
- 集合类
---

## Collection的各个实现类

<!-- more -->

![](Collection.png)

## List

List的实现类有三个，分别是ArrayList、LinkedList、Vector

元素可以为null

### ArrayList

- ArrayList底层是数组，进行增删时需要调用naive方法进行拷贝复制

- ArrayList初始容量为10，每次扩容先扩容为原来的1.5倍，如果仍然不够，就直接将容量设置为目标容量。

#### 线程安全的ArrayList

要使用线程安全的ArrayList，可以使用方法
```Java
List<Object> list = Collections.synchronizedList(new ArrayList<>());
```
,之后list的每个方法都是在原来的ArrayList外加了一个锁,如下所示:
```Java
public int hashCode() {
    synchronized (mutex) {return list.hashCode();}
}
```

##### 注意事项

阅读源码可知,在遍历list时,需要自己通过如下方式加锁(list.iterator()没有进行任何并发处理)

```java
List list = Collections.synchronizedList(new ArrayList());
// ...
synchronized (list) {
    Iterator i = list.iterator(); // Must be in synchronized block
    while (i.hasNext())
        foo(i.next());
}
```

### LinkedList

- LinkedList底层是双向链表

### Vector

Vector是线程安全的，但是现在已经很少用了。原因：
- 所有方法都被synchronized修饰，效率较低
- 每次扩容扩容为原来的2倍，较耗费内存

### 总结

- ArrayList在尾部增删元素不需要移动元素，效率比较高，如果需要随机在任意位置增删元素，则应该选择LinkedList

- LinkedList主要用于实现队列和栈

