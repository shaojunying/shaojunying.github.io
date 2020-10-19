---
title: LeetCode 142 环形链表2
date: 2020-10-10 10:53:15
tags:
- LeetCode
- 双指针
- 哈希表
---

## 哈希表法

### 代码


<!-- more -->

```java
import java.util.HashSet;
import java.util.Set;

public class Solution {
    public ListNode detectCycle(ListNode head) {
        // 哈希表
        Set<ListNode> set = new HashSet<>();
        ListNode node = head;
        while (node != null){
            if (set.contains(node)){
                return node;
            }
            set.add(node);
            node = node.next;
        }
        return null;
    }
}
```

## 快慢指针法

### 快慢指针法为什么一定会相遇

- 快慢指针法中快指针每次向前移动两格,慢指针每次移动一格,如果链表中存在环,那么最终快慢指针一定会都进入环中.
- 假如慢指针到环起始点时快指针还需要n步才能到达环的起始点(n小于环的总长度len),那么n步之后快慢指针即可相遇,因为快慢指针的相对速度为1,每次移动之后快指针距离将会缩小一格,也因此快慢指针一定会相遇,且此时慢指针在环中移动的距离不超过环长度len.

### 思路

![示意图](环形链表2.png)
- 如图所示,a表示链表中非环部分的长度,b表示相遇前慢指针走过的长度,c表示环中剩余的长度
- 那么直到相遇慢指针走过的长度为(a+b),快指针走过的长度为a+(n+1)b+nc
- 因为快指针速度为慢指针的2倍,所以a+(n+1)b+nc = 2(a+b),化简可得a=c+(n-1)(b+c)
- 那么如果指针1从链表头部出发,慢指针从相遇点继续前进,最终两者将会在环的入点处相遇,因为指针1到达环的起始点时,慢指针一定经过若干圈的环内循环再次到达环起始点.

### 代码实现
```Java
public class Solution {
    public ListNode detectCycle(ListNode head) {
        ListNode fast = head, slow = head;
        while (fast!=null){
            // 快慢指针分别向前移动
            if (fast.next == null){
                return null;
            }
            fast = fast.next.next;
            slow = slow.next;
            if (fast == slow){
                // 指向相同节点,说明找到了环
                // 慢指针继续向前走,新创建一个指针指向起始点,两者的相遇点就是环的入点
                ListNode node = head;
                while (node != slow){
                    node = node.next;
                    slow = slow.next;
                }
                return node;
            }
        }
        // fast == null
        return null;
    }
}
```