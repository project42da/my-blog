---
title: "동적 계획법(Dynamic Programming)"
date: "2019-08-14T22:40:32.169Z"
description: "큰 문제를 작은 문제로 나누어 푼다"
category: "알고리즘"
tags: ["알고리즘", "다이나믹프로그래밍"]
---

> 큰 문제를 작은 문제로 나누어 푼다

**동적 계획법**(Dynamic Programming)이란 복잡한 문제를 간단한 여러 개의 작은 문제로 나누어 푸는 방법을 말한다. **부분 문제 반복**(Overlapping Subproblems)과 **최적 부분 구조**(Optimal Substructure)를 가지고 있는 알고리즘을 일반적인 방법에 비해 훨씬 적은 시간 내에 풀 수 있다.

<br>

### 동적 계획법의 특징
- 부분 문제 반복(Overlapping Subproblems): 작은 문제들이 중복된다.
- 최적 부분구조(Optimal Substructure): 분할된 작은 문제의 결과가 매번 같다. 

<br>

## 부분 문제 반복(Overlapping Subproblems)

분할정복과 동적 계획법은 작은 문제로 분할하여 문제를 해결한다는 점에서 유사하지만, 동적계획법의 특징은 분할된 문제들이 반복된다는 점이다. 동적계획법의 해결방법은 작은 문제들을 저장해 다시는 해당 문제를 계산하지 않는것이다. 그러므로 부분 문제 반복이 없다면 그다지 유용하지 못하다. (예를들어 이진탐색 같은경우) 피보나치 수열과 같은 경우 부분 문제 반복이 있기 때문에 동적 계획법을 사용하기에 적절하다.

<br>

**피보나치 수열을 동적계획법을 사용하지 않고 계산한 경우**

```
f(5) = f(4) + f(3) = 5
       |      |
       |      f(3) = f(2) + f(1) = 2
       |             |      |
       |             |      f(1) = 1
       |             |
       |             f(2) = 1
       |
       f(4) = f(3) + f(2) = 3
              |      |
              |      f(2) = 1
              |
              f(3) = f(2) + f(1) = 2
                     |      |
                     |      f(1) = 1
                     |
                     f(2) = 1
```

**피보나치 수열을 동적계획법을 사용하여 계산한 경우**

```
f(5) = f(4) + f(3) = 5
       |      |
       f(4) = f(3) + f(2) = 3
              |      |
              f(3) = f(2) + f(1) = 2
                     |      |
                     |      f(1) = 1
                     |
                     f(2) = 1
```

<br>

### Tabulation(Bottom Up)

> 기반을 닦아놓고 값을 구하는 방식

상향식 방법은 주로 반복문을 사용한다.

```ts
const f = [];
const fibo = (n:number): number => {
    f[0] = 0;
    f[1] = 1;

    for(let i = 2;i <= n; i++){
        f[i] = f[i-1] + f[i-2];
    }

    return f[n];
}

fibo(10);
```

<br>

### Memoization(Top Down)

> 큰 문제에서 작은 문제로 쭉 내려오는 방식

하향식 방법은 주로 재귀와 룩업테이블(Lookup Table)을 사용한다. 솔루션을 계산하기전 먼저 룩업테이블에서 값을 찾는다. 이미 계산된 값이 없다면 값을 계산하고 결과를 룩업 테이블에 삽입해 이후 재사용 가능하게 한다.


```ts
const lookup = []; // 계산된 값을 저장
const fibo = (n:number):number => {
    if(!lookup[n]){ // 이미 계산된 값이 없다며 값을 계산
        lookup[n] = fibo(n-1) + fibo(n-2);
    }
    return lookup[n];
}
```

<br>

## 최적 부분구조(Optimal Substructure)

주어진 문제가 최적 부분구조(Optimal Substructure)를 가지고 있다면 그 부분문제들을 최적화된 솔루션으로 해결 할 수 있다. 예를 들어 최단경로 문제는 다음과 같은 최적 부분구조의 특징을 갖는다. 

*만약 노드 x가 시작노드 u와 목적지노드 v사이의 최단 경로에 놓여진다면, u에서 v까지의 최단경로는 u에서 x까지의 최단경로와 x에서 v까지의 최단경로의 조합이 될 것이다.*

플로이드-워셜 알고리즘과 벨먼-포드 알고리즘같은 일반적인 **모든 꼭지점 쌍간의 최단 경로**(All-pairs Shortest Path) 알고리즘이 Dynamic Programming의 전형적인 예이다. 반면, 최장경로 문제는 최적 부분구조 특징을 갖지 않는다.

<br>

### 참고
- https://www.geeksforgeeks.org/tabulation-vs-memoization/
- https://www.geeksforgeeks.org/overlapping-subproblems-property-in-dynamic-programming-dp-1/
- https://www.geeksforgeeks.org/optimal-substructure-property-in-dynamic-programming-dp-2/