---
title: LeetCode 257.二叉树的所有路径
date: 2020-09-04 13:57:19
tags:
- LeetCode
---

# 深度优先遍历

## 思路

深度优先遍历所有的节点,遇到叶节点就将字符串加入

易错点:

`if (root == null)`是递归的终止条件,不能用于判断是否是叶节点,叶节点的判断应该是`if (root.left == null && root.right == null)`,也即一个节点左右节点都为空.

## 代码1(使用全局变量递归)

```java
class Solution {
    StringBuilder builder = new StringBuilder();
    List<String> ans = new LinkedList<>();
    public List<String> binaryTreePaths(TreeNode root) {
        dfs(root);
        return ans;
    }
    private void dfs(TreeNode root){
        if (root == null) return;
        // 节点中整数位数不确定,因此应该统计加入整数之前字符串长度.
        int len = builder.length();
        if (root.left == null && root.right == null){
            builder.append(root.val);
            ans.add(builder.toString());
            builder.delete(len, builder.length());
        }else {
            builder.append(root.val).append("->");
            dfs(root.left);
            dfs(root.right);
            builder.delete(len,builder.length());
        }
    }
}
```

## 代码2

```java
class Solution {
    public List<String> binaryTreePaths(TreeNode root) {
        List<String> paths = new LinkedList<>();
        dfs(root, paths, "");
        return paths;
    }
    private void dfs(TreeNode root, List<String> paths, String path){
        if (root == null) return;
        if (root.left == null && root.right == null){
            paths.add(path+root.val);
        }else {
            dfs(root.left, paths, path + root.val + "->");
            dfs(root.right, paths, path + root.val + "->");
        }
    }
}
```

# 广度优先遍历

## 代码

```java
class Solution {
    public List<String> binaryTreePaths(TreeNode root) {
        List<String> paths = new LinkedList<>();
        if (root == null) return paths;
        Queue<TreeNode> nodeQueue = new LinkedList<>();
        Queue<String> pathQueue = new LinkedList<>();
        nodeQueue.add(root);
        pathQueue.add(root.val + "->");
        while (!nodeQueue.isEmpty()){
            TreeNode node = nodeQueue.remove();
            String path = pathQueue.remove();
            if (node.left == null && node.right == null){
                paths.add(path.substring(0,path.length()-2));
            }else {
                if (node.left != null) {
                    nodeQueue.add(node.left);
                    pathQueue.add(path + node.left.val + "->");
                }
                if (node.right != null){
                    nodeQueue.add(node.right);
                    pathQueue.add(path + node.right.val + "->");
                }
            }
        }
        return paths;
    }
}
```