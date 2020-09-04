---
title: LeetCode 220.存在重复元素 III
date: 2020-09-03 22:36:29
tags:
- LeetCode
---
# 暴力解法(复杂度:O(n2) 运行时间:661ms)

## 思路

遍历数组中所有元素,将每个元素与其后的k个元素作比较,判断是否满足条件

## 代码

```java
class Solution {
    public boolean containsNearbyAlmostDuplicate(int[] nums, int k, int t) {
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < Math.min(nums.length, i + k + 1); j++) {
                // 判断nums[i]和nums[j]的差值是否小于t
                if ( Math.abs((long)nums[i] - (long)nums[j])<= t){
                    return true;
                }
            }
        }
        return false;
    }
}
```

# 平衡二叉树(复杂度:O(n*log(min(k,n)) 运行时间:23 ms)

## 思路

暴力解法每一次都要遍历窗口中的所有元素来判断条件二是否满足,可以使用一个二叉树存储当前元素前的k个元素,之后判断区间内元素是否满足条件只需判断小于当前元素的最大元素和大于该元素的最小元素.在二叉树中元素个数大于k时从二叉树中删除最早插入的元素.

## 代码

```java
import java.util.TreeSet;

class Solution {
    public boolean containsNearbyAlmostDuplicate(int[] nums, int k, int t) {
        TreeSet<Integer> set = new TreeSet<>();
        for (int i = 0; i < nums.length; i++) {
            Integer successor = set.ceiling(nums[i]);
            if (successor != null && Math.abs(successor - nums[i]) <= t){
                return true;
            }
            Integer predecessor = set.floor(nums[i]);
            if (predecessor != null && Math.abs(predecessor - nums[i]) <= t){
                return true;
            }
            set.add(nums[i]);
            if (set.size() > k){
                set.remove(nums[i-k]);
            }
        }
        return false;
    }
}
```

# 桶排序(复杂度: O(n) 运行时间: 17ms)

## 思路

将所有元素放入若干个桶中,桶中分别保存[0,t],[t+1,2t+1]....,由于每个桶中包含的元素范围为[n*(t+1), (n+1)*(t+1)-1],所以要判断指定元素是否满足条件只需判断当前元素对应的桶和左右相邻的两个桶.并且也需要保证所有桶中的元素个数大于k的时候删除最早加入的元素.

## 代码

```java
import java.util.HashMap;
import java.util.Map;

class Solution {
    long getID(long a, long b){
        // Java中 -1/2 为 0 这里应该为 -1 所以修改
        if (a < 0)
            return (a + 1) / b - 1;
        else
            return a / b;
    }

    public boolean containsNearbyAlmostDuplicate(int[] nums, int k, int t) {
        // 将所有元素放入若干个桶中,桶中分别保存[0,t],[t+1,2t+1]....
        if (t < 0) return false;
        Map<Long, Long> map = new HashMap<>();
        long m = (long) t + 1;
        for (int i = 0; i < nums.length; i++) {
            long index = getID(nums[i], m);
            if (map.containsKey(index)){
                return true;
            }
            if (map.containsKey(index - 1) && Math.abs(map.get(index - 1) - nums[i]) <= t){
                return true;
            }
            if (map.containsKey(index + 1) && Math.abs(map.get(index + 1) - nums[i]) <= t){
                return true;
            }
            map.put(index, (long) nums[i]);
            if (map.size() > k){
                map.remove(getID(nums[i-k], m));
            }
        }
        return false;
    }
}

```
