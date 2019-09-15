---
title:  "논리연산자(Logical Operator) &&"
date:   "2017-05-04 02:31:00 +0900"
categories: javascript
tags: ["논리연산자"]
---

### 요약

- `&&` 연산은 먼저 좌변의 값이 truthy 값인지 확인한다.
- truthy 라면, 우변을 평가하고 **우변의 값을 반환한다.**
- falsy 라면, 우변을 평가하지 않고 **좌변의 값을 반환한다.**

<br>

논리 연산자 `&&`는 여러 경우에 사용되지만 주로 조건문에서 참이될 확률이 낮은 함수를 먼저 실행하기 위해 사용하거나, 객체 프로퍼티가 존재하는지 여부를 확인하기 위해 사용하고 있다. 

```js
// 1. 참이될 확률이 낮은 함수를 앞에 둔 경우
if ( lowProbability() && highProbability()){
    // do something...
}

// 2. 참이될 확률이 높음 함수를 앞에 둔 경우
if ( highProbability() && lowProbability()){
    // do something...
}
```

위 코드에서 두 경우는 경우에 따라 상당한 효율차이를 보이는데, 만약 `highProbability` 함수가 앞쪽에 위치하는 경우 `lowProbability`의 참불 여부를 확인하기 위해 자주 실행되지만, 1번 경우와 같이 `lowProbability` 함수가 앞쪽에 위치하여 먼저 실행한다면, `highProbability` 함수는 매우 낮은 확률로 실행되게 된다. 이처럼 `&&` 연산은 단순히 두 조건이 모두 참인지를 비교할 뿐만 아니라, 코드의 실행 여부를 제어할 수 있다.

<br>

객체 프로퍼티가 존재하는지 여부를 확인하기 위해 사용하는 경우 존재하지 않는 프로퍼티에 접근을 시도하여 에러가 발생하는것을 막아준다.
다음 코드에서는 `book`객체가 없을경우 `ReferenceError` 가 발생하고 `category` 프로퍼티가 없을경우는 `TypeError`가 발생한다.

```js
// book객체에 category이라는 프로퍼티가 없을수도 혹은 book객체 자체가 없을수도 있다.
const len = book.category.length;
```

`book`과 `book.category`이 적어도 존재하는것을 확인하기 전까지는, `book.category.length`에 접근해서는 안된다.(`category`가 문자열 혹은 배열인지를 확인하는것은 생략)

```js
// 1. 구체적이고 확실한 방법
let len;
if(book){
    if(book.category){
        len = book.category.length;
    }
}

// 2. 관용적인 방법. subtitle.length 값 또는 undefined가 반환된다.
const len = book && book.subtitle && book.subtitle.length;
```

그런대 이때 `&&` 연산이 `book.subtitle.length`를 반환함으로서 단순히 `true`, `false`만을 반환하는 논리 연산이 아니라는것을 알 수 있다. 이것은 자바스크립트 만의 특징이 아니라, 타입이 유동적인 파이썬과 같은 언어에서도 동일하게 발생한다. 

```js
// 자바스크립트
true  && true      // t && t returns true
true  && false     // t && f returns false
false && true      // f && t returns false
false && (3 == 4)  // f && f returns false
"Cat" && "Dog"     // t && t returns "Dog" ??
false && "Cat"     // f && t returns false
"Cat" && false     // t && f returns false
```

위를 통해 알수있는 특징 발견할 수 있는데, 좌변이 **truthy**값(`false`, `null`, `NaN`, 0 , "", `undefined`을 제외한 값들)이면 항상 우변의 값을 평가하고 우변의 값(혹은 논리값)을 반환 한다는 것이다. 만약 좌변의 값이 `falsy` 값이라면 `&&` 연산자는 항상 좌변의 값을 반환한다.

```js
false && true  // returns false
null && true  // returns null
NaN && true   // returns NaN
"" && true   // returns ""
undefined && true   // returns undefined
```

강타입 언어인 C의 경우 무조건 `0`혹은 `1`을 반환하는데 우변의 값이 truthy인지 확인하여 `1`을 반환하는게 아닌지 추측해본다.

```c
// 의 경우
char c = 'c';
char d = 'd';

printf("%d", c && d); // 1
printf("%c", c && d); // 아스키코드의 1번문자
```

---

### 참조

- [MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/%EB%85%BC%EB%A6%AC_%EC%97%B0%EC%82%B0%EC%9E%90(Logical_Operators))
- [위키백과](https://ko.wikipedia.org/wiki/%EB%85%BC%EB%A6%AC_%EC%97%B0%EC%82%B0)