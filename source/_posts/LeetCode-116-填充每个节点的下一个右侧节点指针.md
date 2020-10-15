---
title: LeetCode 116. 填充每个节点的下一个右侧节点指针
date: 2020-10-15 21:03:32
tags:
- LeetCode
- 二叉树
- 层序遍历
- 链表
---

## 递归遍历

### 思路

使用一个数组记录每一层被遍历的节点中最左侧的那个,之后将每层未遍历的最右侧节点指向它即可

### 代码实现

```java
class Solution {
    public Node connect(Node root) {
        List<Node> list = new LinkedList<>();
        dfs(root, list, 0);
        return root;
    }

    private void dfs(Node node, List<Node> list, int depth) {
        // depth:深度,从0开始
        if (node == null) {
            return;
        }
        // 处理当前节点
        if (list.size() < depth + 1) {
            node.next = null;
            list.add(node);
        }else {
            node.next = list.get(depth);
            list.set(depth, node);
        }
        // 右子树
        dfs(node.right, list, depth + 1);
        // 左子树
        dfs(node.left, list, depth + 1);
    }
}
```

## 层序遍历

### 思路

在层序遍历的过程中,将每一层的节点使用next指针依次相连

### 实现

```Java
class Solution {
    public Node connect(Node root) {
        Queue<Node> queue = new LinkedList<>();
        if (root != null) {
            queue.add(root);
        }
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                Node cur = queue.remove();
                if (i < size - 1){
                    cur.next = queue.element();
                }
                if (cur.left != null){
                    queue.add(cur.left);
                }
                if (cur.right != null){
                    queue.add(cur.right);
                }
            }
        }
        return root;
    }
}
```


## 使用已建立的next指针

### 思路

假设此时位于第i层,那么第i层节点之间的next指针已建立完毕,下面建立i+1层的next:

- 要建立的两个节点父节点(父节点位于第i层)相同,那么直接相连即可
- 父节点不同,则两个节点父节点一定通过next相连,且父节点在左边的是右节点,父节点在右边的是左节点.那么将左父节点的右孩子的next指针指向右父节点的左孩子.

### 实现

```java
class Solution {
    public Node connect(Node root) {
        if (root == null){
            return null;
        }
        Node curHead = root;
        while (curHead.left != null) {
            // 更新curHead下一层的next指针
            Node curNode = curHead;
            while (curNode != null){
                // 同一父节点
                curNode.left.next = curNode.right;
                // 跨父节点
                if (curNode.next != null){
                    curNode.right.next = curNode.next.left;
                }
                curNode = curNode.next;
            }
            curHead = curHead.left;
        }
        return root;
    }
}
```

