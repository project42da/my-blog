---
title: "Fetch API 사용법(for fun)"
date: "2019-06-28 00:00:00 +0900"
categories: javascript
tags: ["javascript", "fetch", "async", "for fun"]

---

**Fetch API**는 Promise 객체를 반환한다. 그래서 가장 쉽고 기본적인 방법은 Promise객체 형태를 그대로 사용하는 것이다.

```js
const fetcher = () => {
  fetch('http://localhost:4000/api/posts')
    .then(res => res.json()) // HTTP Response 이며, 실제 JSON이 아니기 때문에 `json()`함수로 변환한다.
    .then(data => console.log(data));
}
```

만약 **async/await** 사용하면 좀 더 직관적이며, 심지어 data를 반환할수도 있다.

```js
const fetcher = async () => {
  const response = await fetch('http://localhost:4000/api/posts');
  const data = await response.json();
  console.log(data);
}
```

위 코드를 async/await를 **generator**와 **promise**를 통해 직접 구현하면 다음과 같다.

```js
function* fetcher(next){
  const response = yield fetch('http://localhost:4000/api/posts')
    .then(res => next(res));
  const data = yield Promise.resolve(response)
    .then(data => data.json())
    .then(data => next(data));

  console.log(data);
}

const execute = gene => { 
    const next = v => iter.next(v);
    const iter = gene(next);
    iter.next();
}

execute(fetcher);
```

