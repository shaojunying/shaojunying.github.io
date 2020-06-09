---
title: CPU管理
categories: 
- 计算机基础
- 操作系统
---

## CPU的工作原理

`取指执行`:根据PC(程序计数器)中的地址,从内存中取得相应的指令,之后执行该指令

## 管理CPU最直观的方法

`设置好PC的初值`

## 该做法的一个问题

### 问题展示

#### 循环中有IO
```Java
import java.util.Date;

public class Solution {
    public static void main(String[] args) {
        Date date = new Date();
        long start = date.getTime();
        int a = 0;
        for (int i = 0; i < 100000; i++) {
            a ++;
            System.out.println(i);
        }
        System.out.println(new Date().getTime() - start);
    }
}
```

上面一段代码的执行结果为

```
1640
```

#### 循环中没有IO

```Java
public class Solution {
    public static void main(String[] args) {
        Date date = new Date();
        long start = date.getTime();
        int a = 0;
        for (int i = 0; i < 1000000000; i++) {
            a ++;
            a += 2;
        }
        System.out.println(new Date().getTime() - start);
    }
}
```
上面一段代码的执行结果为

```
4
```

可以看到`包含IO的程序`每轮循环的执行时间为`1.6*10-2`ms，而`不包含IO的程序`每轮循环执行时间为`4*10-9`ms，IO是非常耗时的操作。如果在程序进行IO操作时CPU一直等待，那么程序的执行效率将会非常低。

### 解决办法

为了解决这个问题，可以在程序正在执行IO等耗时操作时，CPU先执行其他进程，待IO操作执行完毕之后，再将CPU切换回来，继续执行该程序的后续操作。这样可以实现多个程序的并发，显著提高CPU的利用率。

`并发`: 同时出发，交替执行。