## 이분탐색이란?

정렬된 컬렉션에서 특정 값을 검색하는 알고리즘이다.

How do we identify Binary Search?

As mentioned in earlier, Binary Search is an algorithm that divides the search space in 2 after every comparison. Binary Search should be considered every time you need to search for an index or element in a collection. If the collection is unordered, we can always sort it first before applying Binary Search.

이분탐색은 둘로 나누는 방식이다

이분탐색에서 사용되는 용어들
- 타겟 : 탐색하는 대상
- 인덱스 : 현재 탐색하고 있는 위치
- left, right : 검색 범위를 나타내는 인덱스들
- mid : 왼쪽 또는 오른쪽으로 검색해야하는지 여부를 결정하기 위해 조건을 적용하는 데 사용하는 색인

3 Parts of a Successful Binary Search

Binary Search is generally composed of 3 main sections:

Pre-processing - Sort if collection is unsorted.

Binary Search - Using a loop or recursion to divide search space in half after each comparison.

Post-processing - Determine viable candidates in the remaining space.

 

3 Templates for Binary Search

처음 이분탐색 문제를 만나면 당황스러울 것이다.
수백가지의 이분탐색 문제들을 연구한 결과 개발자에 따라 조금씩 구현 방법이 달랐다.
물론 공통적인 구현 방식은 단계마다 1/2로 나누는 방식이지만, 몇가지 질문들ㅇ ㅣ생겼다.

- 왜 구현 방법이 달라질까?
- 개발자의 생각은 무엇이었을까?
- 어떤 방식이 쉽고 더 나은 방식일까?

수많은 실패와 머리를 쥐어뜯은 끝에 우리는 3가지 대표적인 템플릿을 찾아냈다.
탈모를 멈추기 위해 그리고 이것을 좀더 쉽게 이해하기 위해 소개한다.

------

첫번째 탬플릿

이진 탐색의 가장 일반적인 형태이다.
주요 특징
- 가장 기본적인 형태
- 검색조건은 이웃된 요소(혹은 특정 요소를 감싸고있는)와의 비교 없이 결정된다.
- 각 단계에서 요소가 있는지 확인하기 때문에 사후처리가 필요하지 않다.
- 끝까지 도착하면 요소를 찾지 못한것 입니다.

```cpp
int binarySearch(vector<int>& nums, int target){
  if(nums.size() == 0)
    return -1;

  int left = 0;
  int right = nums.size() - 1;
  while(left <= right){
    // Prevent (left + right) overflow
    int mid = left + (right - left) / 2;
    if(nums[mid] == target){
      return mid;
    } else if(nums[mid] < target) {
      left = mid + 1;
    }
    else {
      right = mid - 1;
    }
  }

  // End Condition: left > right
  return -1;
}
```

문법특징:

- Initial Condition: left = 0, right = length-1
- Termination: left > right (즉 left <= right라면 계속 확인)
- Searching Left: right = mid-1
- Searching Right: left = mid+1

## 두번째 템플릿

```cpp
int binarySearch(vector<int>& nums, int target){
  if(nums.size() == 0)
    return -1;

  int left = 0;
  int right = nums.size();
  while(left < right){
    // Prevent (left + right) overflow
    int mid = left + (right - left) / 2;
    if(nums[mid] == target){
      return mid;
    } else if(nums[mid] < target) {
      left = mid + 1;
    }
    else {
      right = mid;
    }
  }

  // Post-processing:
  // End Condition: left == right
  if(left != nums.size() && nums[left] == target){
    return left;
  }

  return -1;
}
```

두번째 탬플릿은 향상된 형태의 이분탐색이다. 

배열에서 요소를 검색하거나 현재 인덱스와 오른쪽에 인접한 인덱스간의 조건을 검색하는 데 사용됩니다.

문법특징

- Initial Condition: left = 0, right = length
- Termination: left == right 즉 left < right인 동안
- Searching Left: right = mid
- Searching Right: left = mid+1


- 이진 검색을 구현하는 고급 방법입니다.
- 검색 조건은 요소의 바로 오른쪽 이웃에 액세스해야합니다
- 요소의 오른쪽 이웃을 사용하여 조건이 충족되는지 확인하고 왼쪽 또는 오른쪽으로 갈 것인지 결정
- 보증인 검색 공간의 크기는 각 단계마다 2 이상입니다
- 후 처리가 필요합니다. 하나의 요소가 남아 있으면 루프 / 재귀가 종료됩니다. 나머지 요소가 조건을 충족하는지 평가해야합니다.

### 예제 1

```js
/**
 * Definition for isBadVersion()
 * 
 * @param {integer} version number
 * @return {boolean} whether the version is bad
 * isBadVersion = function(version) {
 *     ...
 * };
 */

/**
 * @param {function} isBadVersion()
 * @return {function}
 */
var solution = function(isBadVersion) {
  /**
    * @param {integer} n Total versions
    * @return {integer} The first bad version
    */
  return function(n) {
    if(n === 0) return -1;
    let left = 0;
    let right = n;
    while(left < right){
      const mid = ~~(left + (right - left)/2);
      console.log(left, mid, right);
      if(isBadVersion(mid)){
        right = mid;
        // right값과 이후에 확인할 값에대한 관계가 존재한다.
        // 이후 확인할 값들이 badVersion이 아닐경우에는 결국 right값이 정답이 되기 때문
      } else {
        left = mid + 1;
      }
    }
    if(left !== n && isBadVersion(left)){
      return left;
    }
    return right;
  };
};
```

### 피크문제

미드위치에서 왼,오값을 비교했을때 왼쪽이 크면 내리막이다. 도대체 어디서부터 내리막이 시작된건지 찾기 위해 right값을 미드로 바꾼다.
반대로 오른쪽값이 왼쪽보다 클경우 어디까지가 오르막인지 찾기위해 left값에 mid값을 넣는다. `left < right`로 루프를 반복하며 left값과 right값이 같아지는 시점에 루프가 멈추게 된다. 그시점이 peak이다.

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var findPeakElement = function(nums) {
  let left = 0;
  let right = nums.length - 1;
  while(left < right){
    const mid = ~~(left + (right - left)/2);
    if(nums[mid] > nums[mid + 1]){ // 왼 > 오
      right = mid; // 왼쪽
    } else {
      left = mid + 1; // 오른쪽
    }
  }
  return left;
};
```

### Find Minimum in Rotated Sorted Array

Suppose an array sorted in ascending order is rotated at some pivot unknown to you beforehand.

(i.e.,  [0,1,2,4,5,6,7] might become  [4,5,6,7,0,1,2]).

Find the minimum element.

You may assume no duplicate exists in the array.

**Example 1:**

```
Input: [3,4,5,1,2] 
Output: 1
```

**Example 2:**

```
Input: [4,5,6,7,0,1,2]
Output: 0
```

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
// Input: [4,5,6,7,0,1,2]
// Output: 0
var findMin = function(nums) {
  if(nums.length === 0){
    return -1;
  }
  if(nums.length === 1){
    return nums[0];
  }
  
  let left = 0;
  let right = nums.length - 1;
  if(nums[right] > nums[0]){
    return nums[0];
  }
  
  while(left <= right){
    const mid = ~~(left + (right - left)/2);
    if(nums[mid] > nums[mid + 1]){
      return nums[mid + 1];
    }
    if(nums[mid - 1] > nums[mid]){
      return nums[mid];
    }
    
    if(nums[mid] > nums[0]){
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
};
```

## 세번째 템플릿

세번째 탬플릿은 현재 인덱스와 인접한 오른쪽, 왼쪽 인덱스간의 관계에 대한 조건이 있을때 사용된다.

```cpp

int binarySearch(vector<int>& nums, int target){
  if (nums.size() == 0)
    return -1;

  int left = 0, right = nums.size() - 1;
  while (left + 1 < right){
    // Prevent (left + right) overflow
    int mid = left + (right - left) / 2;
    if (nums[mid] == target) {
      return mid;
    } else if (nums[mid] < target) {
      left = mid;
    } else {
      right = mid;
    }
  }

  // Post-processing:
  // End Condition: left + 1 == right
  if(nums[left] == target) return left;
  if(nums[right] == target) return right;
  return -1;
}
```

### 주요 문법:

- Initial Condition: left = 0, right = length-1
- Termination: left + 1 == right
- Searching Left: right = mid
- Searching Right: left = mid


### 예시 2(못풀었음)
```js
/**
 * @param {number[]} arr
 * @param {number} k
 * @param {number} x
 * @return {number[]}
 */
var findClosestElements = function(arr, len, target) {
  // 구하는 길이가 없거나 arr가 없거나
  if(arr.length === 0 || len === 0) return [];
  // 가장작은 값보다 더작음
  if(arr[0] > target){
    return arr.slice(0,len);
  }
  // 가장 큰 값보다 더작음
  if(arr[arr.length - 1] < target){
    return arr.slice(arr.length-len, arr.length);
  }
  
  
  // 3개범위를 가져야 하는 이유는
  // mid값이 target이 아닐수 있음. 그러면 적당히 3개범위로 루프를 돌리고 2개범위일때 멈춘다.
  // 결과적으로 인접한 left, right값이 남게된다.
  
  let left = 0;
  let right = arr.length -1 ;
  let index = -1;
  while(left + 1 < right){
    const mid = ~~(left + (right - left)/2);
    if(arr[mid] === target){
      index = mid;
      break;
    } else if (arr[mid] < target){
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  const ans = [];
  if(index !== -1){
    left = index;
    right = index + 1;
  }
  // console.log(`init`,left,right,len);
  while(len){
    if(Math.abs(target - arr[left]) <= Math.abs(target - arr[right])){
      if(left >= 0){
        ans.push(arr[left])
        left--  
      } else if(right <= arr.length - 1){
        ans.push(arr[right])
        right++;
      }
    } else {
      if(right <= arr.length - 1){
        ans.push(arr[right])
        right++;
      } else if(left >= 0){
        ans.push(arr[left])
        left--  
      }
    }
    len--;
    // console.log(`left:${left},right:${right},len:${len}, ans:${ans}`);
  }
  return ans.sort((a,b) => a-b);
};
```