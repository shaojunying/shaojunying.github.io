---
title: Java中Map的学习
date: 2020-11-03 19:48:21
tags:
- Java
- 集合类
---

## HashMap

### 一些属性

- 默认初始容量为16,负载因子为0.75
- 如果key为空,那么hash值直接为0
- 计算hash数组下标的算法:
  - 将hash值右移16位 ^(异或) hash
  - 将得到的值与(capacity-1)取与
- 默认情况下,总结点数大于64时
  - 数组中某链表长度大于8时,链表会被转化为红黑树
  - 当长度小于等于6时,红黑树会被转化为链表

## HashMap和HashTable的区别

### 线程安全

HashMap为线程安全的,而HashTable为线程不安全的,但是效率较高

### 父类不同

HashMap继承自AbstractMap,HashTable继承自Dictionary

### 对null的支持不同

前者支持null为key,后者不支持

### 数组索引的计算方式不同

- HashMap
  - hash值右移16位之后与原hash值取异或,之后再对(capacity-1)取与
  - capacity大小总是2的次幂
- HashTable
  - 去掉符号位的剩下31位对capacity取余作为数组索引

## 注意

- HashMap和LinkedHashMap允许key为null
- TreeMap的key不允许为null
- ConcurrentHashMap的key和value都不允许为null

## 对HashMap的分析

### put

```Java
final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
                boolean evict) {
    Node<K,V>[] tab; Node<K,V> p; int n, i;
    if ((tab = table) == null || (n = tab.length) == 0)
        // 表为null或者里面没有元素
        n = (tab = resize()).length;
    if ((p = tab[i = (n - 1) & hash]) == null)
        // 没有发生碰撞
        tab[i] = newNode(hash, key, value, null);
    else {
        // 发生碰撞
        Node<K,V> e; K k;
        if (p.hash == hash &&
            ((k = p.key) == key || (key != null && key.equals(k))))
            // p.key 和 key 相等
            // 之后将新value赋值到e上
            e = p;
        else if (p instanceof TreeNode)
            // 红黑树 ==> 将新元素插入红黑树中
            e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
        else {
            // 链表 ==> 将新元素插入到链表中
            for (int binCount = 0; ; ++binCount) {
                if ((e = p.next) == null) {
                    // p是最后一个节点,新元素应该插入链表尾部
                    p.next = newNode(hash, key, value, null);
                    // 插入之后超过threshold ==> 将链表转化为红黑树
                    if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                        treeifyBin(tab, hash);
                    break;
                }
                // 在链表中找到key相等的节点
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    break;
                p = e;
            }
        }
        // 用新value覆盖原来的旧value
        if (e != null) { // existing mapping for key
            V oldValue = e.value;
            if (!onlyIfAbsent || oldValue == null)
                e.value = value;
            // 空函数
            afterNodeAccess(e);
            return oldValue;
        }
    }
    // 插入成功新结点
    ++modCount;
    // 需要进行扩容
    if (++size > threshold)
        resize();
    // 空函数
    afterNodeInsertion(evict);
    return null;
}
```

### resize

```java
final Node<K,V>[] resize() {
    Node<K,V>[] oldTab = table;
    // 旧表为空
    int oldCap = (oldTab == null) ? 0 : oldTab.length;
    int oldThr = threshold;
    int newCap, newThr = 0;
    if (oldCap > 0) {
        // 旧表不为空
        if (oldCap >= MAXIMUM_CAPACITY) {
            // 容量大于最大容量了 ==> 不扩容了 ==> 直接返回
            threshold = Integer.MAX_VALUE;
            return oldTab;
        }
        else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY &&
                 oldCap >= DEFAULT_INITIAL_CAPACITY)
            //扩容之后的容量小于最大容量 and 旧容量大于默认初始容量
            newThr = oldThr << 1; // double threshold
    }
    else if (oldThr > 0) // initial capacity was placed in threshold
        // 初始容量被保存在旧 threshold 中
        newCap = oldThr;
    else {               // zero initial threshold signifies using defaults
        newCap = DEFAULT_INITIAL_CAPACITY;
        newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY);
    }
    if (newThr == 0) {
        // 
        float ft = (float)newCap * loadFactor;
        newThr = (newCap < MAXIMUM_CAPACITY && ft < (float)MAXIMUM_CAPACITY ?
                  (int)ft : Integer.MAX_VALUE);
    }
    threshold = newThr;
    @SuppressWarnings({"rawtypes","unchecked"})
        Node<K,V>[] newTab = (Node<K,V>[])new Node[newCap];
    table = newTab;
    if (oldTab != null) {
        // 旧表不为空,将旧表的元素复制到新表上
        for (int j = 0; j < oldCap; ++j) {
            Node<K,V> e;
            if ((e = oldTab[j]) != null) {
                // 坐标为j的地方存在元素
                oldTab[j] = null;
                if (e.next == null)
                    // 只有一个元素
                    newTab[e.hash & (newCap - 1)] = e;
                else if (e instanceof TreeNode)
                    ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);
                else { // preserve order
                    Node<K,V> loHead = null, loTail = null;
                    Node<K,V> hiHead = null, hiTail = null;
                    Node<K,V> next;
                    do {
                        next = e.next;
                        if ((e.hash & oldCap) == 0) {
                            if (loTail == null)
                                loHead = e;
                            else
                                loTail.next = e;
                            loTail = e;
                        }
                        else {
                            if (hiTail == null)
                                hiHead = e;
                            else
                                hiTail.next = e;
                            hiTail = e;
                        }
                    } while ((e = next) != null);
                    if (loTail != null) {
                        loTail.next = null;
                        newTab[j] = loHead;
                    }
                    if (hiTail != null) {
                        hiTail.next = null;
                        newTab[j + oldCap] = hiHead;
                    }
                }
            }
        }
    }
    return newTab;
}
```
