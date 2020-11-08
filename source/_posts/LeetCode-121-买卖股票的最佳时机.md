---
title: LeetCode 121. 买卖股票的最佳时机
date: 2020-11-08 11:36:53
tags:
- LeetCode
- 动态规划
- 分治法
---

## 解法1(动态规划)

### 思路

- memo[i][0] 第i天的最低购买价格,
- memo[i][1] 第i天的最大利润(不一定第i天卖出,可能是从0到i之间任意一天卖出)
- `memo[i][0] = min(memo[i-1][0], prices[i])`
- `memo[i][1] = max(memo[i-1][1], prices[i]-memo[i-1][0])`
- memo[len-1][1]就是最后一天的最大利润

### 实现

```Java
class Solution {
    public int maxProfit(int[] prices) {
        if (prices.length == 0){
            return 0;
        }
        // memo[i][0] 第i天的最低购买价格
        // memo[i][1] 第i天的最大利润
        // memo[i][0] = min(memo[i-1][0], prices[i])
        // memo[i][1] = max(memo[i-1][1], prices[i]-memo[i-1][0])
        int[][] memo = new int[prices.length][2];
        memo[0][0] = prices[0];
        // memo[0][1] = 0;
        for (int i = 1; i < memo.length; i++){
            memo[i][0] = Math.min(memo[i-1][0], prices[i]);
            memo[i][1] = Math.max(memo[i-1][1], prices[i]-memo[i-1][0]);
        }
        return memo[memo.length-1][1];
    }
}
```
## 解法2(动态规划)

### 思路

- memo[i][0] 第i天的最低购买价格
- `memo[i][0] = min(memo[i-1][0], prices[i])`
- prices[i] - memo[i][0]表示第i天卖出可以获得的最大利润
- 最后需要遍历一遍,因为不能确定哪一天卖出能获得最大利润.

### 实现

```Java
class Solution {
    public int maxProfit(int[] prices) {
        if (prices.length == 0){
            return 0;
        }
        // memo[i][0] 第i天的最低购买价格
        // memo[i][0] = min(memo[i-1][0], prices[i])
        int[][] memo = new int[prices.length][1];
        memo[0][0] = prices[0];
        // memo[0][1] = 0;
        for (int i = 1; i < memo.length; i++){
            memo[i][0] = Math.min(memo[i-1][0], prices[i]);
        }
        int max = 0;
        for (int i = 0; i < memo.length; i++){
            max = Math.max(prices[i]-memo[i][0], max);
        }
        return max;
    }
}
```


## 解法3(动态规划,解法2的变种)

### 思路

上面是记录每天的可以持有的最低价格,下面换种思路,保存每天假如卖出的话的最大利润

- `nums[i]=prices[i]-prices[i-1]` 第i-1天的买入,第i天卖出的最大利润
- `nums[j]+nums[j+1]+...+nums[i]`表示第j-1天买入,第i天卖出的最大利润
- memo[i]表示以i结尾的最大连续子数组的和(第i天卖出股票的最大利润)
- `memo[i] = max(memo[i-1]+nums[i], 0)`
  - case1: 第i-1天不卖,改为第i天卖出股票
  - case2: 第i天不买也不卖,没有利润
- (这里的memo[i]相当于上面的prices[i]-memo[i][0])

### 实现

```Java
class Solution {
    public int maxProfit(int[] prices) {
        if (prices.length == 0){
            return 0;
        }
        int[] nums = new int[prices.length];
        for (int i = 1; i < nums.length; i++){
            nums[i] = prices[i] - prices[i-1];
        }
        // memo[i] ==> 以i结尾的连续子数组的最大和
        // memo[i] = max(memo[i-1]+nums[i], 0);
        int[] memo = new int[prices.length];
        for (int i = 1; i < nums.length; i++){
            memo[i] = Math.max(memo[i-1] + nums[i], 0);
        }
        int max = 0;
        for (int i = 0; i < memo.length; i++){
            max = Math.max(memo[i], max);
        }
        return max;
    }
}
```

## 解法4(分治法)

### 实现

```Java
class Solution {
    public int maxProfit(int[] prices) {
        if (prices.length == 0) {
            return 0;
        }
        int[] nums = new int[prices.length];
        for (int i = 1; i < nums.length; i++) {
            nums[i] = prices[i] - prices[i - 1];
        }
        // 分治法 求 nums的最大连续子数组的和
        return dfs(nums, 0, nums.length - 1);
    }

    private int dfs(int[] nums, int start, int end) {
        // [start, end]
        if (start > end) {
            return 0;
        }
        if (start == end) {
            return nums[start];
        }
        int mid = start + (end - start) / 2;
        int left = dfs(nums, start, mid - 1);
        int right = dfs(nums, mid + 1, end);
        int sum = nums[mid];
        int maxSum = sum;
        for (int i = mid + 1; i < end + 1; i++) {
            sum += nums[i];
            maxSum = Math.max(maxSum, sum);
        }
        sum = maxSum;
        for (int i = mid - 1; i > start -1; i --){
            sum += nums[i];
            maxSum = Math.max(maxSum, sum);
        }
        return Math.max(maxSum, Math.max(left, right));
    }
}
```