---
title: Java中的Stack
date: 2020-10-28 15:37:35
tags:
- Java
- 数据结构
---

> 本文参考自刘宇波老师的[Java 程序员，别用 Stack？！](https://mp.weixin.qq.com/s?__biz=MzU4NTIxODYwMQ==&mid=2247485646&idx=1&sn=044c6359c49f65935333e6e6c6366f91),是对于这篇文章的学习总结

## Java中Stack的问题

```Java
//...
class Stack<E> extends Vector<E> 
//..
```
如上是Java中Stack的源码,通过阅读源码可知,Stack继承自Vector,Vector是一个动态数组,如下是Vector源码的一部分.

```Java
//...
public class Vector<E> // xxx
{
    // ...
    public void add(int index, E element) {
        insertElementAt(element, index);
    }
    // ...
}
````

通过阅读源码可知,Vector有一个函数`void add(int index, E element)`,该函数可以在数组的任意位置添加一个元素,而Stack是继承Vector的,所以Stack也可以调用`void add(int index, E element)`在栈中任意位置添加元素.而这个操作显然不合理.

## Java官方推荐实现

在Stack的Doc注释中可以看到这样一段话,
> A more complete and consistent set of LIFO stack operations is provided by the Deque interface and its implementations, which should be used in preference to this class. For example:

`Deque<Integer> stack = new ArrayDeque<Integer>();`

如上,Java推荐使用双端队列Deque实现栈,使用双端队列可以避免原来栈可以在任意位置插入元素的情况.

但是双端队列可以在队列两端进行插入和删除,而栈应该只能在一段进行,因此该实现仍有缺陷,因为可以调用`stack.remove`删除栈底的元素

## 最优实现

```Java
class MyStack<T>{
    private Deque<T> deque = new ArrayDeque<>();

    public void push(T val){
        deque.addFirst(val);
    }

    public T pop(){
        return deque.removeFirst();
    }

    public T top(){
        return deque.getFirst();
    }
    
    public int size(){
        return deque.size();
    }
    
    public boolean isEmpty(){
        return deque.isEmpty();
    }
}
```

如上是最优实现,底层使用Deque实现,但是对外只暴露push,pop等修改操作,保证了只能从一端操作栈.

## 为什么使用ArrayDeque而不是LinkedList作为Deque的底层实现

ArrayDeque底层基于动态数组,动态数组在触发扩容时复杂度时O(n),平均复杂度是O(1),LinkedList底层是基于链表的,平均复杂度为O(1),但是每次修改都需要申请、释放节点,导致在数据规模较大时,链表要比动态数组慢

```java
public class test {
    public static void main(String[] args) {
        Deque<Integer> stack1 = new ArrayDeque<>();
        Deque<Integer> stack2 = new LinkedList<>();
        int size = 10000000;
        long start1 = System.currentTimeMillis();
        for (int i = 0; i < size; i++) {
            stack1.addFirst(i);
        }
        System.out.println(System.currentTimeMillis() - start1);

        long start2 = System.currentTimeMillis();
        for (int i = 0; i < size; i++) {
            stack2.addFirst(i);
        }
        System.out.println(System.currentTimeMillis() - start2);

    }
}
```

如上是一段测试代码,输出结果如下,

```
4808
6688
```

可以看到,向栈中压入1000万条数据时,ArrayDeque用时4808毫秒,而LinkedList用时6688.因此应该使用ArrayDeque作为Deque的底层实现.