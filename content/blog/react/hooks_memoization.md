---
title: "React Hooks: 메모이제이션 훅(useMemo, useCallback)"
date: "2019-11-03 12:58:00 +0900"
description: 'useMemo, useCallback'
categories: React
tags: ["react", "hooks"]
---

`useMemo`와 `useCallback`는 리액트의 내장훅 메모이제이션기능을 지원하는 훅이다.


### useCallback

`useCallback`은 랜더링 성능을 최적화 하기 위해 제공되는 훅이다. 훅을 사용하면 상태값이 변경되어 컴포넌트가 랜더링 될 때마다 변경된 상태값을 참조하지 않는 함수까지도 새로 생성하게 되며, 이 함수를 `props`로 전달받게된 자식 컴포넌트도 랜더링이 일어나게 된다. 함수는 객체이기 때문에 생성시마다 매번 래퍼런스가 변경되어, `React.PureComponent`나 `React.mome`기능을 사용해도 불필요한 랜더링을 막을 수 없다.


### useMemo

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a,b), [a,b]);
```

퍼포먼스 최적화를 하기위한 훅이다.
useMemo 훅은 메모이제이션된 값을 반환한다. 

**App.jsx**

```js
const [countOne, setCountOne] = useState(0);
const [countTwo, setCountTwo] = useState(0);

const incrementOne = () => {
  setCountOne(countOne + 1);
}

const incrementTwo = () => {
  setCountTwo(countTwo + 1);
}

const someExpensiveTask = () => { /* 오래걸리는 작업 */ }
const memoResult = useMemo(someExpensiveTask, [countOne]);

return (
  <>
    {memoResult}
    <Button onClick={increment} count={countOne}>
    <Button onClick={increment} count={countTwo}>
  </>
)
```

**Button.jsx**
```js
const Button = props => {
  console.log("Re-rendering");
  return <button onClick={props.onClick}>{count}</button>
}
```

배열이 없는 경우 매 랜더링마다 새 값을 계산하게 된다.

useMemo에 전달된 함수는 렌더링 중에 실행되기 때문에 랜더링과 관련된 작업을 전달하는것이 적절하다. 랜더링과 관계 없는 사이드 이펙드의 경우는 useEffect를 사용하는 것이 좋다.


### 정리
- useMemo와 useCallback의 가장 큰 차이점은 값, 함수 이다.