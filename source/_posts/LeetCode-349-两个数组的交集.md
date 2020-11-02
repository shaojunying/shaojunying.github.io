---
title: LeetCode 349. 两个数组的交集
author: 邵俊颖
date: 2020-11-02 17:18:33
tags:
- LeetCode
- 双指针
- 二分查找
- 哈希表
---
# 解法1

两轮遍历

```Java
class Solution {
    public int[] intersection(int[] nums1, int[] nums2) {
        Set<Integer> set = new HashSet<>();
        for (int i = 0; i < nums1.length; i ++){
            for (int j = 0; j < nums2.length; j ++){
                if(nums1[i] == nums2[j]){
                    set.add(nums1[i]);
                }
            }
        }
        int[] ans = new int[set.size()];
        int i = 0;
        for (Integer integer : set) {
            ans[i++] = integer;
        }
        return ans;
    }
}
```

# 解法2

使用hash表存储nums1中出现的元素，之后遍历nums2，将重复出现的添加到结果集合中

```java
class Solution {
    public int[] intersection(int[] nums1, int[] nums2) {
        Set<Integer> set1 = new HashSet<>();
        for (int num : nums1){
            set1.add(num);
        }
        Set<Integer> set = new HashSet<>();
        for (int num : nums2){
            if (set1.contains(num)){
                set.add(num);
            }
        }
        int[] ans = new int[set.size()];
        int i = 0;
        for (int num : set){
            ans[i++] = num;
        }
        return ans;
    }
}
```
# 解法3

使用两个hash表存储，之后取两个hash表的交集

```Java
class Solution {
    public int[] intersection(int[] nums1, int[] nums2) {
        Set<Integer> set1 = new HashSet<>();
        for (int num : nums1){
            set1.add(num);
        }
        Set<Integer> set2 = new HashSet<>();
        for (int num : nums2){
            set2.add(num);
        }
        if (set1.size() < set2.size()){
            Set<Integer> temp = set1;
            set1 = set2;
            set2 = temp;
        }
        Set<Integer> set = new HashSet<>();
        for (int num : set2){
            if (set1.contains(num)){
                set.add(num);
            }
        }
        int[] ans = new int[set.size()];
        int i = 0;
        for (int num : set){
            ans[i++] = num;
        }
        return ans;
    }
}
```

# 解法4

排序两个数组,之后使用双指针

```java
class Solution {
    public int[] intersection(int[] nums1, int[] nums2) {
        Arrays.sort(nums1);
        Arrays.sort(nums2);
        int i = 0, j = 0;
        Set<Integer> set = new HashSet<>();
        while(i < nums1.length && j < nums2.length){
            if (nums1[i] == nums2[j]){
                set.add(nums1[i]);
                i ++;
                j ++;
            }else if (nums1[i] > nums2[j]){
                j ++;
            }else{
                i ++;
            }
        }
        int[] ans = new int[set.size()];
        int index = 0;
        for (int num : set){
            ans[index++] = num;
        }
        return ans;
    }
}
```

# 解法5

排序一个数组,之后二分查找

```java
class Solution {
    public int[] intersection(int[] nums1, int[] nums2) {
        Arrays.sort(nums1);
        Set<Integer> set = new HashSet<>();
        for (int num : nums2){
            int left = 0, right = nums1.length;
            while(left < right){
                // [left, right)
                int mid = left + (right - left) / 2;
                if (nums1[mid] == num){
                    set.add(num);
                    break;
                }else if (nums1[mid] < num){
                    left = mid + 1;
                }else{
                    right = mid;
                }
            }
        }
        int[] ans = new int[set.size()];
        int index = 0;
        for (int num : set){
            ans[index++] = num;
        }
        return ans;
    }
}
```