---
title: "apply 함수"
date: "2017-05-21 12:58:00 +0900"
categories: Javascript
tags: ["javascript"]

---

`apply()` 함수는 두 개의 인자를 받는다. 사용 방법은 다음과 같다.

```
func.apply(thisArg, [argsArray]);
```

- `thisArg` : 함수에 지정될 `this`
- `argsArray` : 함수에 인자로 전달될 유사배열객체

이때 유사배열객체란 배열과 같이 index로 접근 가능하며, `length` 프로퍼티가 있는 객체를 말한다.

<br>

### thisArg

첫번째 인자는 `thisArg` 호출될 함수에게 지정될 **this**의 값이다. `apply()`를 사용하면 이미 존재하는 함수`func`를 `thisArg` 의 메서드처럼 호출해 사용할 수 있다. 

아래의 코드에서는 String 객체의 프로토타입 메서드를 만들었다. 이 함수는 문자열 자료형에서만 사용 가능해야 하지만, `apply()`를 사용하면 다른 자료형에서도 자유롭게 사용 가능하다. 

```js
String.prototype.using = function(){
    console.log("이 함수를 " + this.__proto__.constructor.name + " 자료형 에서 사용하였다.");
    console.log(arguments);
    return;
}

console.log(String.prototype.using.apply(true, [ 1, 2, 3 ]));
// 이 함수를 Boolean 자료형 에서 사용하였다. 를 출력
// Arguments(3) [1, 2, 3, callee: (...), Symbol(Symbol.iterator): ƒ]
```

<br>

### argsArray

두번째 인자 `argsArray`는 **유사배열객체**를 받는다. 이때 주의해야할 점은 두번째 인자를 의도대로 사용하려면 **객체자료형이면서**(`typeof` 에서 `object`가 출력되는) `length` 프로퍼티를 가지고 있고 **마치 배열처럼 사용할수 있어야 한다**는 점이다.

<br>

- 문자열의 경우

    ```js
    // 기본형 문자열
    console.log(String.prototype.using.apply(null, "string"));
    // Uncaught TypeError: CreateListFromArrayLike called on non-object

    // 생성자로 만든 문자열
    var string = new String("string");
    console.log(String.prototype.using.apply(null, string));
    // Arguments(6) ["s", "t", "r", "i", "n", "g", callee: (...), Symbol(Symbol.iterator): ƒ]
    ```

- 객체의 경우

    ```js
    // length 프로퍼티가 없는 경우
    obj = {0:0, 1:1, 2:2}
    console.log(String.prototype.using.apply(true, obj));
    // Arguments [callee: (...), Symbol(Symbol.iterator): ƒ]

    // length 프로퍼티가 있는 경우
    obj = {0:0, 1:1, 2:2, length:3}
    console.log(String.prototype.using.apply(true, obj));
    // Arguments(3) ["0", "1", "2", callee: (...), Symbol(Symbol.iterator): ƒ]

    // length 프로퍼티가 있으나 key가 숫자가 아닌경우
    obj = {"영":0, "일":1, "이":2, length:3}
    console.log(String.prototype.using.apply(true, b));
    // Arguments(3) [undefined, undefined, undefined, callee: (...), Symbol(Symbol.iterator): ƒ]
    ```

<br>

### 참고

- [MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)
