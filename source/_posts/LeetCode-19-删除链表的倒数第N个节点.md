---
title: LeetCode 19. 删除链表的倒数第N个节点
date: 2020-10-18 10:15:53
tags:
- LeetCode
- 双指针
- 链表
---

>[题目链接](https://leetcode-cn.com/problems/remove-nth-node-from-end-of-list/)

## 双指针解法

### 思路

n应该从1开始,因为链表的最后一个节点是倒数第一个节点

从链表的头开始,先向后前进n步
- ①如果中途遇到空指针说明n>链表长度,n是非法的
- ②如果在结尾遇到空指针,说明要删除的节点是链表的头节点
- 没有遇到空指针==>当前指针(快指针)前进一格,之后另一个指针(慢指针)从头开始,两个指针同时前进,直到遇到空指针.此时慢指针指向的是要删除节点的前驱节点,③删除慢指针的下一个节点即可.

### 代码

```Java
class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        assert n > 0;
        ListNode fast = head;
        // 快指针先前进n步
        int i = 0;
        while (i < n && fast != null){
            fast = fast.next;
            i++;
        }
        if (fast == null){
            if (i == n){
                // 要删除的是第一个节点
                head = head.next;
            } // n大于链表的长度,参数不合法
        }else {
            // 删除链表非头节点
            ListNode slow = head;
            while (fast.next != null){
                fast = fast.next;
                slow = slow.next;
            }
            // 删除slow.next
            ListNode next = slow.next;
            slow.next = next.next;
        }
        return head;
    }
}
```

### 问题解释

#### 为什么慢指针指向的是要删除节点的前驱节点

因为快指针前进了n+1次之后慢指针才和快指针同时前进,所以慢指针距离快指针n+1步,快指针指向null时慢指针指向倒数第n+1个节点,而倒数第n个节点的前驱节点就是倒数第n+1个节点.

#### 快指针会不会在前进过程中发生空指针异常

不会,在循环中都会进行判断,此时肯定不会,而在前n次循环结束之后,如果快指针为null,那么说明要删除的是第一个节点,也就不会向下执行.一旦向下执行就说明快指针不为空,也就不会发生空指针异常

## 双指针2

### 思路

该方法与前面方法相比在链表头部加一个哑节点,通过这种方式在寻找节点的前驱节点时不需要单独考虑头节点,因为头节点也有前驱节点(哑节点),从而将上面方法的②合并到③中.

### 代码实现

```Java
class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        assert n > 0;
        ListNode first = head;
        // 快指针先前进n步
        int i = 0;
        while (i < n && first != null) {
            first = first.next;
            i++;
        }
        if (i != n && first == null) {
            // n大于链表长度
            return head;
        }
        // 这里的哑节点最终指向要删除节点的前驱节点
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode second = dummy;
        while (first != null) {
            first = first.next;
            second = second.next;
        }
        // 要删除的是second.next
        second.next = second.next.next;
        return dummy.next;
    }
}
```

### 问题解释

#### 为什么哑节点最终指向要删除节点的前驱节点

快指针从头节点开始前进n步,此时快指针与头节点相距n步,也就与哑节点相距n+1步,所以最终快指针指向null时慢指针指向倒数第n+1个节点...