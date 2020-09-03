---
title: LeetCode 486.预测赢家题解
date: 2020-09-01 20:57:28
tags:
- LeetCode
---
# 暴力解法1(递归)

## 思路

使用一个总分数score表示玩家1和玩家2分数的差值,
在区间[start,end]内
- 玩家1尽可能使score的值大,从而使[0,len-1]之间的score最大,从而尽可能使玩家1分数>玩家2分数
- 玩家1尽可能使score的值小,从而使[0,len-1]之间的score最小,从而尽可能使玩家1分数<玩家2分数

之后每次选择都是,轮到玩家1时,将从左右边界中选择尽可能使score大的情况,轮到玩家2时与此相反.

## 代码

```java
class Solution {
   public boolean PredictTheWinner(int[] nums) {
       int len = nums.length;
       return dfs(nums, 0, len - 1, 1) >= 0;
   }

   private int dfs(int[] nums, int start,int end, int turn) {
       // [start, end]
       // 返回值: [start,end]玩家1分数能超过玩家2的最大值
       if (start == end){
           return nums[start] * turn;
       }

       // turn > 0 ==> 玩家1 ==> 比较正的结果
       // turn < 0 ==> 玩家2 ==> 比较负数的结果
       int left = dfs(nums, start + 1, end, turn * -1) + turn * nums[start];
       int right = dfs(nums, start, end - 1, turn * -1) + turn * nums[end];
       // 最终比较玩家1的分数是否>=玩家2 ==> 玩家1的分数减去玩家2也即score是否>=0 
       // ==> 对于一个固定区间[start,end],左右两个边界中玩家1选择使score尽可能大,从而保证[0,len-1]之间的结果尽可能大
       // ==> 同理,玩家2将选择使score尽可能小,促使玩家2-玩家1结果较大,从而保证[0,len-1]之间的结果尽可能小
       return Math.max(turn * left, turn * right) * turn;
   }9
}
```

# 暴力解法2

## 思路

基本同上, 本轮传参每次选择之后玩家1和2的分数,之后再选择最有利于自己的选择,最后返回本选择是否能使玩家1最终成功.

## 代码

```java
class Solution {
    public boolean PredictTheWinner(int[] nums) {
        int len = nums.length;
        return dfs(nums, 0, len - 1, true, 0, 0);
    }

    private boolean dfs(int[] nums, int start,int end, boolean is1, int score1, int score2) {
        // [start, end]
        // 边界
        if (start > end){
            return score1 >= score2;
        }

        if (is1){
            // 更新1的分数
            // left || right 只要左右选择中有一个可以使玩家1成功,玩家1就一定能成功/
            boolean left = dfs(nums, start + 1, end, false, score1 + nums[start], score2);
            if (left) return true;
            return dfs(nums, start, end - 1, false, score1 + nums[end], score2);
        }else {
            // 必须两个选择都使玩家1成功,也即玩家2失败,玩家2无论怎么选都一定失败,从而使玩家1成功.
            boolean left = dfs(nums, start + 1, end, true, score1, score2 + nums[start]);
            boolean right = dfs(nums, start, end - 1, true, score1, score2 + nums[end]);
            return left && right;
        }
    }
}
```

# 动态规划

## 思路

这里m(i,j)表示区间[i,j]内A选择可以取得的A的分数减去B的最大差值,那么[i,j]区间A选择取得的A,B最大差值就等于
1. [i+1, j]区间内B选择取得的BA最大插值,也等于A选择的AB最大差值.只是为了此时使B选.因此应该使nums[i]-(B选择BA的最大差值) ==>nums[i] - memo[i+1,j];
2. [i,j-1]区间,同上.
中的最大值

## 代码

```java
class Solution {
    public boolean PredictTheWinner(int[] nums) {
        // 记忆化搜索
        int len = nums.length;
        int[][] memo = new int[len][len];
        for (int i = 0; i < len; i++) {
            memo[i][i] = nums[i];
        }
        // memo[i][j] = max(nums[i]-memo[i+1][j],nums[j]-memo[i][j-1]);
        // (i,j)表示 从i到j
        for (int j = 1; j < len; j++) {
            for (int i = j - 1; i >= 0; i --){
                    memo[i][j] = Math.max(nums[i] - memo[i+1][j], nums[j]-memo[i][j-1]);
            }
        }

        return memo[0][len-1] >= 0;
    }
}

```