---
title: "React Hooks (기본)"
date: "2019-09-30 12:58:00 +0900"
categories: React
tags: ["React", "hooks"]
---

리액트 훅을 사용하면 함수형 컴포넌트에서도 클래스형 컴포넌트의 기능(상태값, 생명주기 등)을 사용할 수 있게 된다.
훅은 단순한 함수이기 때문에 손쉽개 여러 컴포넌트에서 재사용 가능한 코드를 만들어 낼 수 있고, 클래스형 컴포넌트에서 변화율 혹은 관련도와 관계없이 라이프사이클에 묶여 여러코드가 뒤엉켜 작성되어야 했던것과 달리, 훅을 사용하면 **분리 및 관리하기에 용이**하다.(Information Expert) 이를 통해 필요한 로직과 상태를 캡슐화(capsulization)하여 커스텀 훅을 만들어 낼 수도 있다. (**[useDebounce 훅](/web/throttle_debounce/)**) 이미 많은 리액트 관련 라이브러리들이 훅을 지원하고 있다.

<br>

훅을 이해하는데 **[링크](https://www.netlify.com/blog/2019/03/11/deep-dive-how-do-react-hooks-really-work/)**에서 소개하는 간단한 React Hooks 복사본 코드를 따라해 보는것이 이해에 많은 도움이 되었다. 내용을 이해하기 위해서는 클로저에 대한 기본적인 지식이 필요하다.

<br>

## useState 

`useState` 훅을 사용하면 함수형 컴포넌트에서 상태값을 관리할 수 있다.

```js
import React, { useState } from 'react';
```

`useState` 훅은 어떤 값을 받아 배열을 반환하는 단순한 함수이다. 배열의 첫번째 요소는 상태값이고 `useState`를 호출할때 넘겨준 값이 초기값이 된다. 배열의 두번째 요소는 `setState` 메소드와 유사한 상태값을 변경하는 함수이다. 일반적으로 두 요소를 비구조화 할당(Destructuring Assignment)을 이용해 사용한다.

```js
const Counter = () => {
  const [count, setCount] = useState(0); // 배열의 비구조화 할당

  const handleCount = e => {
    e.preventDefault();
    setCount(count + 1);
  }

  return(
    <button onClick={handleCount}>{count}</button>
  );
}
```

<br>

### 다수의 상태 관리

`useState` 함수를 실행할 때 마다 새로운 상태값을 반환하기 때문에 다수의 상태를 관리할 수 있다.

```js
const Person = () => {
  const [age, setAge] = useState(0);
  const [name, setName] = useState('');

  // ...생략
}
```

또한 클래스형 컴포넌트와 마찬가지로 상태값을 객체형으로 관리할 수도 있다. 하지만 클래스형 컴포넌트의 `setState` 메서드와 단리 `useState`는 이전 성태값을 지우고 할당되기 때문에 비구조화 할당을 통해 새로운 객체를 전달해야 한다. 

```js
const Person = () => {
  const [data, setData] = useState({
    age: 0,
    name: '',
  });
}
```

<br>

### useState 구현하기

다음은 클로저를 사용해 만든 간단한 React 복사본이다. 위에서 살펴본 `useState` 와 함께 필요한 몇가지 변수들이 구현되어있다. 몇가지 주목할 부분을 살펴보자.

<br>

- `useState`함수 내부에는 `setState`라는 내장함수가 있다. `setState`는 모듈내에 위치한 `hooks`와 `currentHook`변수에 접근할 수 있다.
- `useState`함수를 호출할때 마다 `currentHook` 변수의 값이 `1`씩 증가한다. 이때 `currentHook`의 값을 `setStateHookIndex`에 저장하고, **`setState`가 이 값을 참조하는 클로저가 되어 매번 해당 훅의 위치를 기억해 상태값을 관리**하게 된다. 리액트는 실제로 훅이 사용된 순서를 배열로 저장하고 **저장된 순서를 기반으로 훅을 관리**한다.
- `render` 함수를 호출할때 마다 `currentHook` 변수의 값을 `0`으로 초기화한다. `render`함수 내에서 컴포넌트가 실행되면 `currentHook`의 값이 컴포넌트내에서 `useState`를 실행한 만큼 계속 늘어나기 때문이다.

```js
const MyReact = (function() {
  let hooks = [];
  let currentHook = 0;
  
  return {
    render(Component) {
      const Comp = Component();
      Comp.render();
      currentHook = 0; // 다음 렌더를 위해 인덱스 값을 초기화
      return Comp;
    },
    
    useState(initialState) {
      hooks[currentHook] = hooks[currentHook] || initialState;
      const setStateHookIndex = currentHook;

      // useState를 실행했을 당시의 setStateHookIndex값을 기억한다.
      const setState = newState => {
        hooks[setStateHookIndex] = newState;
        return hooks[setStateHookIndex];
      }

      return [hooks[currentHook++], setState];
    },
  }
})();
```

<br>

### 함수형 컴포넌트에 적용

위에서 만든 MyReact와 `useState` 함수를 `Person` 컴포넌트에 적용해 보았다.

```js
function Counter() {
  const [count, setCount] = MyReact.useState(0);
  const [text, setText] = MyReact.useState('');

  return {
    click: () => setCount(count + 1),
    type: txt => setText(txt),
    // DOM을 랜더링 하는 대신 콘솔에 상태값을 보여주기로 한다.
    render: () => console.log('render:', { count, text }),
  };
}

var App = MyReact.render(Counter); // 초기값 render: {count: 0, text: ""}
App.click();
App.type('텍스트입력');
App = MyReact.render(Counter); // render: {count: 1, text: "텍스트입력"}
App.click();
App = MyReact.render(Counter); // render: {count: 2, text: "텍스트입력"}
```

<br>

## useEffect

`useEffect` 훅을 사용하면 상태값의 변화에 따른 부수효과를 다룰 수 있다. 이를 이용해 컴포넌트의 생명주기 메서드를 만들어 낼 수 있고, 동시에 상태값에 관련된 기능을 모을 수 있어 코드관리가 용이해진다.

```js
const Counter = () => {
  const [count, setCount] = useState(0);

  // count가 상태값이 변경되면 발생되는 부수효과
  useEffect(() => {
    console.log('count의 부수효과', count);
    return () => console.log('count의 부수효과 발생 직전', count);
  }, [count]);
}
```

`useEffect`의 첫번째 매개변수로 등록된 콜백함수는(이후 콜백함수) **특정 상태값이 변경되었을때 작동하는 부수효과**이다. 콜백함수는 또 다른 함수를 반환할 수 있는데, 반환된 함수는 컴포넌트가 언마운트 되었을때 그리고 콜백함수가 호출되기 직전에 호출되고 이 함수가 참조하는 상태값은 변경되기 직전의 값이다. 

```
[컴포넌트가 마운트 되었을때]
count의 부수효과 0

[count값이 변경되었을때]
count의 부수효과 발생 직전 0 => 반환된 함수가 콜백함수가 호출되기 직전에 호출됨
count의 부수효과 1
count의 부수효과 발생 직전 1
count의 부수효과 2
```

두번째 매개변수로는 배열을 받는데, 이 배열의 요소의 값이 변경되면 콜백함수가 호출된다. 매개변수로 빈배열을 넣으면 컴포넌트가 마운트될때만 콜백함수를 호출하고, 컴포넌트가 언마운트될때만 콜백함수가 반환한 함수를 호출한다.(`componentDidMount`, `componentWillUnmount`와 같은 용도로 사용 가능하다) 만약 아무것도 넣지 않으면 모든 상태 변경에 반응하여 콜백함수가 호출된다.

<br>

**useEffect 훅의 두번째 매개변수와 콜백함수 호출 관계 정리**

- 빈 배열(`[]`) : 마운트/언마운트시 콜백 호출
- 아무것도 넣지 않았을 경우 : 모든 상태 변경에 대하여 콜백 호출
- 특정 상태를 요소로 넣은 배열 : 해당 상태가 변경되었을 경우 콜백 호출

<br>

### useEffect 구현하기

useEffect은 두개의 매개변수를 받기 때문에 `callback` 과 `dependencies`를 받는다. (콜백함수가 반환하는 함수에 대해서는 구현하지 않는다)

```js
const MyReact = (function() {
  let hooks = [];
  let currentHook = 0;
  
  return {
    render(Component) {
      const Comp = Component();
      Comp.render();
      currentHook = 0; // 다음 렌더를 위해 인덱스 값을 초기화
      return Comp;
    },
// highlight-start
    useEffect(callback, dependencies) {
      const hasNoDependencies = !dependencies;
      const states = hooks[currentHook]; // type: array | undefined
      const hasChangedStates = states ? 
        !dependencies.every((el, i) => el === states[i]) : true;
      if (hasNoDependencies || hasChangedStates) {
        callback(); // 상태값이 없거나 의존하는 값이 없으면 무조건 호출된다.
        hooks[currentHook] = dependencies;
      }
      currentHook++; // 이번 훅에 대한 작업이 끝났음.
    },
// highlight-end
    useState(initialState) {
      hooks[currentHook] = hooks[currentHook] || initialState;
      const setStateHookIndex = currentHook;

      // useState를 실행했을 당시의 setStateHookIndex값을 기억한다.
      const setState = newState => {
        hooks[setStateHookIndex] = newState;
        return hooks[setStateHookIndex];
      }

      return [hooks[currentHook++], setState];
    },
  }
})();
```

앞서 만든 `Person` 컴포넌트에 `useEffect` 함수를 적용해 보았다.

```js
const { useState, useEffect, render } = MyReact;

function Counter() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

// highlight-start
  useEffect(
    console.log('count의 부수효과', count);
  ,[count]);
// highlight-end

  return {
    click: () => setCount(count + 1),
    type: txt => setText(txt),
    render: () => console.log('render:', { count, text }),
  };
}

var App = render(Counter); 
// count의 부수효과 0 => 마운트시 호출
// render: {count: 0, text: ""}
App.click();
App = render(Counter);
// count의 부수효과 1
// render: {count: 1, text: ""}
App.type('텍스트입력');
App = render(Counter);
// text 상태값 변경에 대해서는 부수효과가 발생하지 않음.
// render: {count: 1, text: "텍스트입력"} 
App.click();
App = render(Counter);
// count의 부수효과 2
// render: {count: 2, text: "텍스트입력"}
```

<br>

### 정리
- 훅은 클로저로 구현되었다.
- 훅은 함수가 참조하는 인덱스 변수(역시 클로저)를 통해 배열에 값을 할당하고 가져오는것 뿐이다.(Not Magic, just Arrays)


<br>

### 참고

- https://www.netlify.com/blog/2019/03/11/deep-dive-how-do-react-hooks-really-work/