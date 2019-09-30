---
title: "React Hooks"
date: "2019-09-30 12:58:00 +0900"
categories: React
tags: ["React", "hooks"]
---

리액트 훅은 함수형 컴포넌트에서도 클래스형 컴포넌트의 기능(상태값, 생명주기 등)을 사용할 수 있게 한다.
훅은 단순한 함수이기 때문에 손쉽개 여러 컴포넌트에서 재사용 가능한 코드를 만들어 낼 수 있고, 변화율 혹은 관련도에 따라 분리하여 관리하기 용의하다.

하단 참고 링크에서 소개하는 간단한 React Hooks 복사본 코드를 따라해보니 이해에 많은 도움이 되었다. 이를 이해하기 위해서는 클로저에 대한 기본적인 지식이 필요하다.

### useState 구현하기

클로저를 사용하는 간단한 React 복사본을 만들어 보았다. `useState`함수 내부에는 `setState`라는 내장함수가 있다. `setState`는 모듈내에 위치한 `_state`를 접근할 수 있다.

```js
const MyReact = (function() {
  let _state; // 모듈 스코프 내에 위치
  
  return {
    render(Component) {
      const Comp = Component();
      Comp.render();
      return Comp;
    },
    
    useState(initialState) {
      _state = _state || initialState;
      function setState(newState) {
        _state = newState;
      }
      return [_state, setState];
    }
  }
})();
```

### 함수형 컴포넌트에 적용

만들어본 MyReact와 `useState` 함수를 적용해 보았다.

```js
function Counter() {
  const [count, setCount] = MyReact.useState(0);
  return {
    click: () => setCount(count + 1),
    // DOM을 랜더링 하는 대신 콘솔에 상태값을 보여주기로 한다.
    render: () => console.log('render:', { count }),
  };
}

const App;
App = MyReact.render(Counter); // render: { count: 0 }
App.click();
App = MyReact.render(Counter); // render: { count: 1 }
```

특별한 
### 마법이 아니라 그저 배열일 뿐이다.

- https://www.netlify.com/blog/2019/03/11/deep-dive-how-do-react-hooks-really-work/