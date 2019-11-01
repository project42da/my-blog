---
title: "ES9: Async Iteration"
date: "2019-10-29 12:58:00 +0900"
description: 대칭키, 공개키 방식에 대한 간단한 개념
categories: 네트워크
tags: ["ts39", "async", 'iterator', 'es9']
---

![logo](./logo.png)

<br>

## 개요와 동기

이터레이터(Iterator) 인터페이스(ECMAScript 2015에서 소개됨)는 순차적으로 데이터를 접근하는 프로토콜이다. 기본적인 인터페이스는 `{ value, donw }` 튜플을 반환하는 `next()` 메소드가 이며, `done`은 이터레이터가 끝에 도달했는지 여부를 나타내는 boolean, `value`는 수차적으로 산출되는 값을 나타낸다.

<br>

이터레이터는 *동기식(synchronous)* 데이터 소스를 나타내는데에 적합하다. 자바스크립트 개발자가 마주치게 되는 많은 데이터 소스가 동기식이지만(예를들어 메모리상의 배열이나 자료구조와 같은) 그렇지 않은 것들도 많다. 예를들어 I/O 접근이 필요한 모든 데이터 소스는 일반적으로 이벤트 기반이거나 스트리밍 비동기 API를 사용한다. 불행히도, 이터레이터는 그러한 데이터 소스를 나타내는데 사용할 수 없다.

<br>

(프로미스와 이터레이터를 함께 사용하면 비동기 값을 허용하지만, done에서는 동기로 마무리 되기 때문에 충분하지 않다.)

<br>

비동기 데이터 소스에 대한 데이터 접근 프로토콜을 제공하기 위해 AyncsIterator 인터페이스를 소개한다. 비동기 이터레이션을 지원하는 `for-await-of`와 비동기 제네레이터 함수이다.🎉

<br>

## Async iterators 와 async iterables

비동기 이터레이터(Async Iterator)는 `next()` 메소드가 `{ value, done }`을 위해 프로미스를 반환한다는 것을 제외하면 기존의 동기식 이터레이터와 유사하다.
Promise를 반환해야 하는 이유는 위에서 언급한 바와 같이 다음 값과 done 상태를 모두 알 수 없기 때문이다.

```js
const { value, done } = syncIterator.next();
asyncIterator.next().then(({ value, done }) => /* ... */);
```

<br>

또한 비동기 이터레이터를 널리 사용하기 위하여 사용될 새로운 심볼(symbol)인 `Symbol.asyncIterator`를 소개한다. 
이전에 임의의 객체가 `Symbol.iterator`를 사용하여 일반 동기식 이터러블인 것을 알려줬던것 처럼, 비동기 이터러블임을 알려준다. 
이것을 사용할 수 있는 클래스의 예는 아마도 읽을 수 있는 스트림(readable stream)이 될것이다.

<br>

비동기 이터레이터의 내부 설계에는 **요청 큐**의 설계가 포함되어 있다. 이전 요청의 결과가 해결되기 전에 이터레이터 메소드가 여러 번 호출 될 수 있으므로, 모든 이전 요청 조작이 완료 될 때까지 각 메소드 호출을 내부적으로 큐에 넣어야한다.

<br>

## The async iteration statement: `for-await-of`

We introduce a variation of the `for-of` iteration statement which iterates over async iterable objects. An example usage would be:

```js
for await (const line of readLines(filePath)) {
  console.log(line);
}
```

비동기 `for-of` 문은 비동기 함수, 비동기 제네레이터 함수(뒤에 보게될)와 함께 사용 가능하다.

During execution, an async iterator is created from the data source using the `[Symbol.asyncIterator]()` method.

Each time we access the next value in the sequence, we implicitly `await` the promise returned from the iterator method.

<br>

## Async generator 함수
비동기 제네레이터 함수는은 제네레이터의 기능과 유사하지만 다음과 같은 차이점이 있다:
- 호출시에 직접 `{value, done}`을 반환하는것 대신에, `next`, `throw`, `return` 메소드를 가진 **비동기 제네레이터 객체**를 반환하며, `return`(Promise)을 통해서 `{ value, done }`을 반환한다.
- `await` 와 `for-await-of`를 사용할 수 있다.
-  `yield*`의 동작은 비동기 이터러블(iterables)에 위임을 지원하도록 수정되었다.

<br>

예를 들면 다음과 같다.

<br>

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


나만의 예제 코드

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
    console.log(n);
  }    
})();
```
--- 

### 참고
- https://github.com/tc39/proposal-async-iteration
- https://tc39.es/proposal-async-iteration/