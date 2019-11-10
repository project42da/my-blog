---
title: "자바스크립트 클로저 간단 정리"
date: "2019-11-02 12:58:00 +0900"
description: 자바스크립트 클로저에 대해 정리한다.
categories: javascript
tags: ["javascript" ]
---

![자바스크립트 로그](./logo.png)

<br>

자바스크립트는 [렉시컬 스코프](../scope) 방식을 사용한다. 렉시컬 스코프는 그 스코프를 감싸고 있는 함수가 종료되면, 함수가 포함하고 있던 스코프에 대한 메모리가 함께 해제되기 때문에 더이상 해당 스코프를 참조할 수 없다. 하지만 자바스크립트에서는 함수가 종료된 이후에도 렉시컬 스코프 밖에서 스코프에 참조할 수 있는 방법이 존재한다.

<br>

### 그게 바로 클로저 인데..., 클로저가 뭐라구요?

[You Don't Know JS](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/scope-closures/README.md)라는 책에서는 비슷하지만 미묘하게 다른 2가지 정의로 클로저를 설명한다.

<br>

1. 클로저는 **함수가 속한 렉시컬 스코프를 기억하여 함수가 렉시컬 스코프 밖에서 실행될 때에도 이 스코프에 접근할 수 있게 하는 것**을 말한다.
  > Closure is when a function is able to remember and access its lexical scope even when that function is executing outside its lexical scope.

2. ...**함수가 참조하고 있는 렉시컬 스코프**를 클로저라고 부른다.
  > ...`bar()` still has a reference to that scope, and that reference is called closure.

이처럼 한 책에서 조차 두 가지 정의를 내릴 정도로 클로저에 대한 정의는 제각각이다. 어떤 글에서는 스코프를 기억하는 함수 자체를 클로저라고 하고, 그 함수와 함수를 둘러싼 환경을 모두 합쳐 클로저라고 하기도 한다. 
이러한 미묘한 차이가 '클로저가 뭔가요?'라는 물음에 선뜻 답변하기 어려운 이유일 것이다. 

사실 Javascript 개발자라면 클로저를 읽어내고 응용하는 능력의 차이가 있을뿐, 누구나 클로저를 알고는 있다.

하지만 어떠한 상황에서 *안다는 것을 증명*하기 위해서는 자신이 알고있는 클로저에 대한 정의를 말로서 설명할 필요가 있다.

<br>

> **함수가 속한 렉시컬 스코프를 기억하여 함수가 렉시컬 스코프 밖에서 실행될 때에도 이 스코프에 접근할 수 있는데, 이때 함수가 접근할 수 있는 렉시컬 스코프를 클로저라고 부른다.**

<br>

이때 스코프는 자바스크립트의 객체나 변수와 같이 식별자로 접근할 수 있는 개념이 아니라 엔진의 부품으로서 **자바스크립트 코드로 직접 접근할 수 없다**. 따라서 스코프 혹은 환경에 포함된 식별자를 참조하고 접근할 수 있다는 의미 정도로 해석하는 것이 좋다. 명세에 나온 스코프와 관련된 실행 컨텍스트(Execution Context)나 어휘 환경(Lexical Environment)에 대한 정확한 이해도 중요하나, 이들은 명세가 업데이트되면 변경되기 때문에 변하지 않는 개념을 이해하는것이 중요하다.

<br>

위 정의는 클로저에 대한 정확한 설명이 아닐 수 있다. 그래도 좋다. 이제 어디서든 클로저를 설명 할 수 있게 되었다. 

<br>

### 클로저 예시

아래코드는 가장 접하기 쉬운 클로저의 예시이다.

```js
const wrapper = () => {
  const x = 'lexical 스코프';
  const inner = fn => {
    fn(x);
  }
  return inner;
}

const otherScopeText = 'lexical스코프 밖에서';
const innerFn = wrapper();
innerFn(lexicalScopeText => {
  console.log(`inner함수가 ${otherScopeText} 실행될때에도, 
    ${lexicalScopeText}에 접근할 수 있다.`);
});

```

`wrapper`함수가 반환하는 `inner`함수는 이 함수가 선언된 렉시컬 스코프 밖에서 실행되었다. 이때 `wrapper`의 실행이 끝났음에도 `inner`함수를 외부에서 호출 할 수 있다는 점과 `inner`함수가 자신이 선언된 렉시컬 스코프의 변수 `x`를 참조할 수 있다는 점에 주목해야한다.

<br>

다음으로 유명한 예시인 `for` 반복문이다. 이 코드는 0부터 4까지의 수열을 출력하려는 의도로 만들어졌지만, 의도대로 동작하지 않는다.

```js
for(var i=0; i<5; i++){
  setTimeout(() => {
    console.log(i); // 5를 출력한다.
  }, 0);
}
```

왜냐하면 `var`를 통해 선언된 변수 `i`가 `for`문으로 이루어진 블록 스코프가 아닌 전역 스코프에 위치하기 때문이다. 따라서 Timer 쓰레드를 통하여 비동기 적으로 실행될 콜백함수 내의 `console.log`는 루프가 모두 돌고나서 전역 스코프에 남아있는 `i`를 참조하게 된다. 의도한 대로 수열을 출력하려면 함수 스코프를 이용해야 한다.

```js
for(var i=0; i<5; i++){
  (() => {
    // 아무리 var라고해도 함수 스코프를 빠져나가진 못한다.
    var j = i;
    setTimeout(() => {
      console.log(j); // 정상적으로 수열을 출력한다.
    }, 0);
  })();
}
```

즉시 실행 함수(IIFE)를 통하여 만들어진 스코프와 그 안에서 선언된 변수 `j`를 `console.log`가 참조하여 의도대로 수열을 출력한다.

사실 이 문제는 `var`을 `let`으로 변경하는것 만으로도 해결할 수 있는데, `for`문의 시작부분에서의 `let`선언은 한번만 선언되는 것이 아니라, 매번 반복때마다 선언되고 이전 반복이 끝난 값으로 초기화된다. 

```js
for(let i=0; i<5; i++){
  setTimeout(() => {
    console.log(i); // 5를 출력한다.
  }, 0);
}
```

<br>

### 클로저 응용

외부와는 격리되고 함수내에서는 접근 가능한 클로저의 특성을 응용하면 여러가지 유용한 기능들을 만들 수 있다. 
[React Hooks의 내부가 클로저로 구현되어 동작한다](https://www.netlify.com/blog/2019/03/11/deep-dive-how-do-react-hooks-really-work/)고 한다.

아래 코드는 클로저를 사용하여 객체안에서는 접근할 수 있지만 외부로부터는 격리되는 **private 필드**를 만든것이다.

```js
const myInstance = (() => {
// highlight-start
  let privateVar = '';
  const privateMethod = () => {}
// highlight-end

  return { // public interface
    publicMethod1 () {
      // 이 안에서 모든 프라이빗 멤버들을 접근할 수 있다.
    },
    publicMethod2 () { }
  };
})();
```
> 클로저라는 주제와는 무관하지만 [앞으로는 클래스 내에서 `#`으로 시작하는 필드를 통해 private 필드를 정의](https://github.com/tc39/proposal-class-fields#private-fields)할 수 있게 된다.

---

### 참고
- [You Don't Know JS Yet: Scope & Closures - 2nd Edition](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/scope-closures/README.md)
- [자바스크립트의 스코프와 클로저](https://meetup.toast.com/posts/86)