---
title: "자바스크립트 스코프 간단 정리"
date: "2019-10-31 12:58:00 +0900"
description: 자바스크립트 스코프에 대해 정리한다.
categories: javascript
tags: ["javascript" ]
---

![secure](./unsplash_scope.jpeg)
> https://unsplash.com/@reskp



시작하기 전에 🚩
- 이 글은 스코프와 관련 키워드에 대해 간략하게 정리 한 글이며, 코드를 포함하지 않는다.
- 이 글에서는 클로저는 다루지 않는다. 클로저를 정리하면 배보다 배꼽이 커지기 때문이다.
- `eval`, `with`같은 아무도 안쓰는걸 다루지 않는다.
- 이 글은 아래로 내려갈수록 (작성자의 기준에서는)덜 중요한 키워드를 다룬다.


<br>

### 스코프란?
변수에 값을 저장하거나 값을 가져오기 위하여 변수를 검색하는 방법에 대한 규칙을 말한다. 

<br>

### 스코프의 용도
식별자(변수, 함수 등)을 스코프내에 숨겨 충돌을 피하거나 외부에서 접근할 수 없도록 캡슐화 할 수 있다. 

<br>

### 스코프 생성

**함수 스코프(Function Scope)** 는 함수를 통해 경계가 나눠진 스코프를 말하며, **블록 스코프(Block Scope)**는 `for`, `while`, `if` 문 등 코드 블록(`{}`)을 통해 경계가 나눠진 스코프를 말한다. 단, `var`을 통해 선언된 변수는 블록 스코프를 이용할 수 없다.

<br>

### 스코프 동작 방법

식별자를 탐색할 때 현재 스코프에서 먼저 찾기 시작하고, 찾지 못하면 한단계 올라가며 이 과정을 반복하다 최상위 글로벌 스코프에서 찾지 못하면 검색을 멈춘다. 이때 다음과 같은 스코프를 검색하게 된다.

- **렉시컬 스코프**(Lexical Scope): 컴파일타임(정확히는 렉싱 타임)에 정의되어, 코드를 작성할때 함수가 선언된 위치에 따라 참조하는 식별자가 결정되는 스코프를 말한다.
- **다이나믹 스코프**(Dynamic Scope): 함수가 실행되는 컨텍스트에 따라 식별자가 결정되는 스코프를 말한다. 자바스크립트에서는 `this` 키워드만 해당된다.

<br>

### 스코프 검색 방법

스코프 검색 방법은 **왼쪽 방향(LHS) 검색**과 **오른쪽 방향(RHS) 검색**이 있다.

- **왼쪽 방향 검색**: 변수가 대입 연산자의 왼쪽에 있을때 수행한다. 만약 최상위 스코프까지 변수를 찾지 못하면 선언되지 않은 변수라고 판단하여 새로운 변수를 생성해 엔진에 넘겨준다. **strict 모드** 에서는 **ReferenceError**를 발생시킨다.
- **오른쪽 방향 검색**: 식별자의 값을 찾아내는 동작이다. 만약 식별자를 찾지 못하면 **ReferenceError**를 발생시킨다. 이때 식별자는 찾았지만 그 값을 가지고 불가능한 일을 하려고 한다면 **TypeError**를 발생시킨다.

---

### 컴파일레이션

자바스크립트 엔진은 전통적인 컴파일 언어에서 컴파일러가 하는 일의 상당 부분을 처리한다. 다만 기존 컴파일 언어와는 달리 컴파일레이션을 실시간으로 처리해 최적화할 시간이 많지 않다. 컴파일은 대략적으로 3단계로 나눠진다.

- **토크나이징/렉싱** : 문자열을 나누어 토큰(token)이라고 불리는 의미있는 조각으로 만드는 과정이다.
- **파싱** : 토큰 배열을 자바스크립트 문법 구조를 반영하여 트리 형태로 바꾸는 과정이다. 파싱의 결과로 만들어진 트리를 추상구문트리(AST)라 부른다.([링크](https://astexplorer.net/) 참조)
- **코드 생성** : AST를 컴퓨터에서 실행가능한 기계어 코드로 바꾸는 과정이다.(메모리 확보 등)

<br>


### JIT 컴파일(Just In Time Compliation)

JIT 컴파일은 인터프리트 방식과 정적 컴파일 방식을 혼합한 방식이다. 런타임에 인터프리트 방식으로 기계어 코드를 생성하고 실행하는데, 이 코드가 실행되는 동안 별도로 분리하여 최적화 컴파일러로 가져와 최적화한다. 이를 통해 추후 호출될때에 더 빠른속도로 실행될 수 있다.


---

### 참고
- [You Don't Know JS Yet: Scope & Closures - 2nd Edition](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/scope-closures/README.md)
- [자바스크립트 엔진의 최적화 기법 (1) - JITC, Adaptive Compilation](https://meetup.toast.com/posts/77)
- [AST Explorer](https://astexplorer.net/)