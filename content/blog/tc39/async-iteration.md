---
title: "ES9: Async Iteration"
date: "2019-10-29 12:58:00 +0900"
description: 대칭키, 공개키 방식에 대한 간단한 개념
categories: 네트워크
tags: ["tc39", "async", 'iterator', 'es9', "번역"]
---

![logo](./logo.png)

<br>

배경지식 🚩
- **이터러블(Iterable)**은 `[Symbol.iterator]()` 메소드가 구현된 객체를 말하며, 이 메소드는 이터레이터(Iterator)를 반환한다.
- **이터레이터(Iterator)**는 `{ value, done }` 쌍의 이터레이터 결과 객체(Iterater Result Object)를 반환하는 `next`메소드가 구현되어있다.
- **제네레이터 함수(Generator functions)**는 호출시점에는 코드블록이 실행되지 않으며 제네레이터(Genrator) 객체를 반환한다. 제네레이터 객체는 이터러블과 이터레이터 인터페이스를 모두 준수한다.

<br>

## 개요와 동기

이터레이터(Iterator) 인터페이스(ECMAScript 2015에서 소개됨)는 순차적으로 데이터를 접근하는 프로토콜이다. 기본적인 인터페이스는 `{ value, done }` 튜플을 반환하는 `next()` 메소드가 이며, `done`은 이터레이터가 끝에 도달했는지 여부를 나타내는 boolean, `value`는 수차적으로 산출되는 값을 나타낸다.

<br>

이터레이터는 *동기식(synchronous)* 데이터 소스를 나타내는데에 적합하다. 자바스크립트 개발자가 마주치게 되는 많은 데이터 소스가 동기식이지만(예를들어 메모리상의 배열이나 자료구조와 같은) 그렇지 않은 것들도 많다. 예를들어 I/O 접근이 필요한 모든 데이터 소스는 일반적으로 이벤트 기반이거나 스트리밍 비동기 API를 사용한다. 불행히도, 이터레이터는 그러한 데이터 소스를 나타내는데 사용할 수 없다.

<br>

(프로미스의 반복자도 충분하지 않다. 그 이유는 비동기 결정만 허용할 뿐 아니라, done 상태의 동기 결정까지도 요구하기 때문이다.)

<br>

비동기 데이터 소스에 대한 데이터 접근 프로토콜을 제공하기 위해 AyncsIterator 인터페이스를 소개한다. 비동기 이터레이션을 지원하는 `for-await-of`와 비동기 제네레이터 함수이다.🎉

<br>

## 비동기 이터레이터와 비동기 이터러블(Async iterators and async iterables)

비동기 이터레이터(Async Iterator)는 `next()` 메소드가 `{ value, done }` 쌍을 위한 프로미스(Promise)를 반환한다는 것을 제외하면 기존의 동기식 이터레이터와 유사하다. 위에서 언급했듯이 이터레이터의 다음 값과 done 상태를 모두 알 수 없기 때문에 이터레이터 결과 쌍에 대한 프로미스를 반환해야 한다.

```js
const { value, done } = syncIterator.next();
asyncIterator.next().then(({ value, done }) => /* ... */);
```

<br>

또한 비동기 이터레이터를 통용되기 위하여 사용될 새로운 심볼(symbol)인 `Symbol.asyncIterator`를 소개한다. 
이것은 `Symbol.iterator`가 일반 동기식 이터러블인 것을 알려줬던 것과 마찬가지로, 임의의 객체가 비동기 이터러블임을 알려준다. 이것을 사용할 수 있는 클래스의 예는 아마도 읽을 수 있는 스트림(readable stream)이 될것이다.

<br>

비동기 이터레이터의 내부 설계에는 **요청 큐**의 설계가 포함되어 있다. 이전 요청의 결과가 해결되기 전에 이터레이터 메소드가 여러 번 호출 될 수 있으므로, 모든 이전 요청 조작이 완료 될 때까지 각 메소드 호출을 내부적으로 큐에 넣어야한다.

<br>

## 비동기 반복문: `for-await-of`


비동기 이터러블 객체를 반복하는 `for-of` 반복문의 변형을 소개한다. 사용 예는 다음과 같다:

```js
for await (const line of readLines(filePath)) {
  console.log(line);
}
```

비동기 `for-of` 문은 비동기 함수, 비동기 제네레이터 함수(뒤에 보게될)와 함께 사용 가능하다.
루프를 실행하는동안 `[Symbol.asyncIterator]()`메소드를 사용하여 데이터소스에서 비동기 이터레이터가 생성된다.
매번 다음값에 접근할때마다 이터레이터 메서드를 통해 반환된 프로미스(Promise)에 `await`가 암시적으로 적용된다.

<br>

## 비동기 제네레이터 함수(Async generator functions)
비동기 제네레이터 함수는 제네레이터의 기능과 유사하지만 다음과 같은 차이점이 있다:
- 호출시에 직접 `{ value, done }`을 반환하는것 대신에, `next`, `throw`, `return` 메소드를 가진 **비동기 제네레이터 객체**를 반환하며, `return`(Promise)을 통해서 `{ value, done }`을 반환한다.
- `await` 와 `for-await-of`를 사용할 수 있다.
-  `yield*`의 동작은 비동기 이터러블(iterables)에 위임을 지원하도록 수정되었다.

<br>

예를 들면 다음과 같다.

```js
async function* readLines(path){
  let file = await fileOpen(path);
  
  try{
    while(!file.EOF){
      yield await file.readLine();
    }
  } finally {
    await file.close();
  }
}
```

이 함수는 비동기 제네레이터 객체를 반환하며, 이전 예제의 `for-await-of`문과 함께 사용 가능하다.

<br>


### 예시

```js
const getRandomTime = (() => {
  const randomTime = [100,200,300,400];
  const length = randomTime.length;
  let index = 0;
  return () => {
    index = (index + 1 + length)%length;
    return randomTime[index];
  }
})();

const login = async ({ id, password }) => {
  return await new Promise(resolve => {
    const wait = setTimeout(() => {
      clearTimeout(wait);
      resolve(`${id}계정 로그인 성공`);
    }, 1000);
  });
}

// users/:id
const parseProfile = async userId => {
  const someParsingLogic = () => 
    new Promise(resolve => {
      const src = 'http://someurl.com';
      const wait = setTimeout(() => {
        clearTimeout(wait);
        resolve({
          userId,
          name:`철수${userId}`,
          src,
        });
      }, getRandomTime());
    });

  return await someParsingLogic();
}

async function* parseProfileAll(formData, range){
  yield await login(formData);
	let index = 0;
	while(index++ < range){
		yield await parseProfile(index);
	}
}

(async () =>{
  for await (const n of parseProfileAll('hacker', '123123', 10)) {
    console.log(n); // 매번 루프마다 [Symbol.asyncIterator]()메소드를 통해 반환된, Promise에 암시적으로 await가 적용된다.
  }    
})();
```
--- 

### 참고
- https://github.com/tc39/proposal-async-iteration
- https://tc39.es/proposal-async-iteration/