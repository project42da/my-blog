---
title:  "throttle & debounce 폴리필"
date: "2019-05-07 14:00:00 +0900"
categories: javascript
tags: ["javascript", "throttle", "debounce", "hooks", "react", "polyfill"]
---

**throttle**과 **debounce**는 이벤트핸들링에 빼놓을 수 없는 요소이다. 검색기능이나 스크롤 이벤트와 같이 수십번의 콜백이 단 시간에 호출되는 이벤트를 핸들링할때 사용한다. 주로 lodash에서 불러와 사용하곤 했지만, 개념을 이해하기 위해 직접 만들어 보았다. lodash에는 `tailing`과 `leading` 옵션이 있지만 여기서는 생략하였다. (사실 있어도 `false`로 해놨던 적이 대부분이라..)

<br>

### throttle

throttle은 설정한 시간(delay)에 한번씩 이벤트를 발생시킨다. 만약 스크롤 이벤트의 콜백을 throttle 함수로 감싸고 `delay`를 1초로 설정했을때, 스크롤을 5초동안 끊임없이 이동했다면, 콜백은 5번 호출된다.

```js
function throttle(fn, delay) {
  var timer = null;
  return function () {
    var context = this;
    var args = arguments;
    if (!timer) {
      timer = setTimeout(function() {
        fn.apply(context, args);
        timer = null;
      }, delay);
    }
  };
}
```

<br>

### debounce

dobouce는 이벤트가 끝난뒤 설정한 시간(delay)이 지나야 콜백이 실행된다. throttle과 비슷해보이는데 결정적으로 다른점이 있다. debounce는 이벤트를 **그룹화** 한다는 것이다. 만약 스크롤 이벤트의 콜백을 debounce로 감싸고 `delay`를 1초로 설정했을때, 스크롤을 5초동안 끊임없이 이동했다면, 콜백은 1번 호출된다. 스크롤을 멈춘 뒤 1초안에 다시 스크롤을 움직이면 콜백이 일어나지 않고, 1초가 지나면 콜백 함수가 호출된다.

```js
function debounce(fn, delay) {
  var timer;
  return function() {
    var context = this;
    var args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function(){
      fn.apply(context, args);
    }, delay);
  }
}
```

<br/>

### ☯️ useDebounce

`useDebounce`는 리액트16.9 버전에 추가된 `useState`와 `useEffect`를 사용해 state의 변화를 debouncing하는 커스텀 Hooks이다. 

```js
import { useState, useEffect } from 'react';

export function useDebounce(value, delay) {
  // 디바운스 할 값을 관리하기위한 상태값과 setter함수
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 딜레이 이후 값을 업데이트한다.
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 딜레이 기간중에 value혹은 delay값이 업데이트 되었다면 이(cleanup)함수를 실행한다.
    return () => {
      clearTimeout(timer);
    };
  },[value, delay]); // delay값이나 value값이 업데이트 되었다면 다시 호출한다.

  return debouncedValue;
}
```

`useDebounce`를 사용한 SearchBar 컴포넌트이다. `keyword` 상태값이 input을 통해 계속 변경되어 `useDebounce`내의 `value`값이 계속 업데이트 되면서 `useEffect`의 콜백함수가 계속 실행된다. 이때 콜백함수의 return값으로 `clearTimeout`함수를 넣어줘 콜백이 실행되기 직전에 매번 `timer`를 클리어한다.

```jsx
import React, { useState, useEffect } from 'react';
import { useDebounce } from 'client/hooks';

const SearchBar = props => {
  const [keyword, setKeyword] = useState('');
  const [canSearch, setCanSearch] = useState(false);
  const debouncedKeyword = useDebounce(keyword, 250);

  useEffect(() => {
    if(debouncedKeyword && canSearch){
      searchApi(debouncedKeyword);
    }
  }, [debouncedKeyword]);
}
```

**참조**
- [https://rxmarbles.com/#debounce](https://rxmarbles.com/#debounce)
- [https://reactjs.org/docs/hooks-effect.html](https://reactjs.org/docs/hooks-effect.html)