---
title: Leetcode 347.前 K 个高频元素 题解
date: 2020-09-07 21:19:41
tags:
- LeetCode
---

# 堆

## 算法

1. 首先记录每个数字的频次 ==> O(n)
2. 构建一个包含k个元素的最大堆 ==> O(nlog(k))
3. 将堆中的所有元素转为一个数组 ==> O(k)

<!-- more -->

复杂度:O(nlogk)

## 实现

### 使用PriorityQueue

```java
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.PriorityQueue;

class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        assert nums.length >= k;
        // 堆排序
        // 1. 统计每个数字对应的频次
        Map<Integer, Integer> map = new HashMap<>();
        for (int num : nums) {
            int count = map.computeIfAbsent(num, i->0);
            map.put(num, count + 1);
        }
        // 2. 构建一个最多包含k个元素的最大堆
        PriorityQueue<Integer> heap = new PriorityQueue<>(k,(o1, o2) -> map.get(o2)-map.get(o1));
        heap.addAll(map.keySet());
        // 3. 将最大堆转化为数组
        int[] ans = new int[k];
        for (int i = 0; i < k; i++) {
            ans[i] = heap.remove();
        }
        return ans;
    }
}
```

### 自己实现 heap

TODO


# 快排

## 算法

1. 统计每个数字的频次
2. 依照快排找到频次最大的k个数字

## 实现

TODO



# 桶排序

## 算法

1. 统计每个数字的频次 ==> O(n)
2. 统计每个频次对应的数字 ==> O(n)
3. 依次选择最大频次的K个数字 ==> O(n+k)

第3.步通过从nums.length开始遍历,从而找到频次最大的K个数字

复杂度: O(n)

## 实现

```java
import java.util.*;

class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        assert nums.length >= k;
        // 1.统计每个数字对应的频次
        Map<Integer,Integer> map = new HashMap<>();
        for (int num : nums) {
            int count = map.computeIfAbsent(num, i -> 0);
            map.put(num, count+1);
        }
        // 2.记录每个频次对应的数字
        Map<Integer, LinkedList<Integer>> frequency2Nums = new HashMap<>();
        map.forEach((key,value)->{
            List<Integer> list = frequency2Nums.computeIfAbsent(value, i->new LinkedList<>());
            list.add(key);
        });
        // 3.取出频次最大的k个数字
        int[] ans = new int[k];
        for (int i = 0, j = nums.length; j >= 0 && i < ans.length; j --){
            List<Integer> list = frequency2Nums.get(j);
            if (list != null) {
                for (int m = 0; m < list.size() && i < ans.length; m++, i++) {
                    ans[i] = list.get(m);
                }
            }
        }
        return ans;
    }
}
```