---
title: LeetCode 77组合题解
date: 2020-09-08 21:28:19
tags:
- LeetCode
---

# 回溯1

## 实现

```java
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

class Solution {
    List<List<Integer>> ans = new LinkedList<>();
    public List<List<Integer>> combine(int n, int k) {
        dfs(1, n+1, k,new LinkedList<>());
        return ans;
    }

    private void dfs(int i, int n, int k, List<Integer> list) {
        if (list.size() == k) {
            ans.add(new ArrayList<>(list));
            return;
        }
        if (i == n) return;
        // TODO 遍历和是否选择每个元素
        for (int j = i; j < n; j++) {
            // 选择j
            list.add(j);
            dfs(j + 1, n, k, list);
            list.remove(list.size()-1);
        }
    }
}
```

# 回溯

## 算法

类似上边,只不过上面是每次遍历每个元素作为开头,这里考虑每个元素`选择`和`不选择`的两种情况.依据的原理是`C(n,k) = C(n-1,k)+C(n-1,k-1)`,其中等号左边从n个元素中选择k个元素,等号右边表示不选当前元素和选当前元素的情况.

## 实现

```java
class Solution {
    List<List<Integer>> ans = new LinkedList<>();
    public List<List<Integer>> combine(int n, int k) {
        dfs(1, n+1, k,new LinkedList<>());
        return ans;
    }

    private void dfs(int i, int n, int k, List<Integer> list) {
        if (list.size() == k) {
            ans.add(new ArrayList<>(list));
            return;
        }
        if (i == n) return;
        // 选择元素i
        list.add(i);
        dfs(i+1, n, k,list);
        list.remove(list.size()-1);
        // 不选择元素i
        dfs(i+1, n, k, list);
    }
}
```