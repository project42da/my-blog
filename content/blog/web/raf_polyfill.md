---
title:  "requestAnimationFrame() 폴리필"
date:   "2019-05-05 21:00:00 +0900"
categories: Javascript
tags: ["javascript", "requestAnimationFrame", "polyfill"]
---

### `requestAnimationFrame()` 란?

**requestAnimationFrame (이하 rAF)**은 브라우저에게 수행하기를 원하는 애니메니션을 알리고 다음 리페인트가 진행되기 전에 해당 애니메이션을 업데이트하는 콜백 함수를 호출한다. 이 함수는 리페인트 이전에 실행할 콜백 함수를 인자로 받는다.

```js
let start = null;
const element = document.getElementById('SomeElementYouWantToAnimate');
element.style.position = 'absolute';

const step = timestamp => {
  if (!start) start = timestamp;
  const progress = timestamp - start;
  element.style.left = Math.min(progress / 10, 200) + 'px';
  if (progress < 2000) {
    window.requestAnimationFrame(step);
  }
}

window.requestAnimationFrame(step);
```

이 함수는 위 예시 코드와 같이 요소를 움직이거나, 비동기적인 반복작업을 할때에 사용하게 된다. 하지만 구형 브라우저에서는 이를 지원하지 않기 때문에 폴리필링이 필요하다. rAF의 동작을 대해 조금 더 확실하게 이해하기 위해 직접 만들어 보았다.


### timestamp

`window.requestAnimationFrame()`의 인자로는 다음 리페인트를 위한 애니메이션을 업데이트할때 호출할 콜백함수를 받는다. 이 콜 백함수에는 함수를 실행할때 시점을 나타내는 `performance.now()` 의 반환값과 유사한 `DOMHighResTimeStamp`가 전달된다.

```js
(function(global){
  var nowOffest = Date.now(); // 브라우저의 실행시점
  var timeStamp = function(){
    // performance가 있는지 확인
    if(global.performance && 
       typeof global.performance.now && 
       typeof global.performance.now === 'function'
    ){
      return global.performance.now();
    }
    // fallback
    return Date.now() - nowOffest;
  }

})(window);
```

### prefix

모던 브라우저들은 대부분 raf를 지원한다. 따라서 브라우저별로 프리픽스가 붙어있는 함수들을 감싸주는것으로 충분하다.

```js
(function(global){
  // timeStamp...

  var prefix='';
  if('mozRequestAnimationFrame' in global){
    prefix = 'moz';
  }else if ('webkitRequestAnimationFrame' in global){
    prefix = 'webkit';
  }

  if(!!prefix){
      global.requestAnimationFrame = function(callback){
        return global[prefix + 'RequestAnimationFrame'](function(){
          callback(timeStamp());
        });
    }

    global.cancelAnimationFrame = global[prefix + 'CancelAnimationFrame'];
  }
})(window);
```

raf를 지원하고 있지 않은 구형 브라우저들은 `setTimeout()`함수를 사용해 폴리필링한다.

```js
if(!!prefix){
  // raf를 지원하는경우
}else{
  var lastTime = Date.now(); // 클로저
  global.requestAnimationFrame = function(callback){
    var currentTime = Date.now();
    var delay = lastTime - currentTime + 16;
    
    if(delay < 0){
      delay = 0;
    }

    lastTime = currentTime;

    return setTimeout(function(){
      lastTime = Date.now();
      callback(timeStamp());
    }, delay);
  };

  global.cancelAnimation = clearTimout;
}
```

<br>

### 결과

```js
(function(global){
  // timeStamp...
  var nowOffest = Date.now(); // 브라우저의 실행시점
  var timeStamp = function(){
    // performance가 있는지 확인
    if(global.performance && 
       typeof global.performance.now && 
       typeof global.performance.now === 'function'
    ){
      return global.performance.now();
    }
    // fallback
    return Date.now() - nowOffest;
  }

  var prefix='';
  if('mozRequestAnimationFrame' in global){
    prefix = 'moz';
  }else if ('webkitRequestAnimationFrame' in global){
    prefix = 'webkit';
  }

  if(!!prefix){
      global.requestAnimationFrame = function(callback){
        return global[prefix + 'RequestAnimationFrame'](function(){
          callback(timeStamp());
        });
    }

    global.cancelAnimationFrame = global[prefix + 'CancelAnimationFrame'];
  }else{
    var lastTime = Date.now(); // 클로저
    global.requestAnimationFrame = function(callback){
      var currentTime = Date.now(),
          delay = lastTime - currentTime + 16;
      if(delay < 0){
        delay = 0;
      }
      lastTime = currentTime;

      return setTimeout(function(){
        lastTime = Date.now();
        callback(timeStamp());
      }, delay);
    };

    global.cancelAnimation = clearTimout;
  }
})(window);
```

<br>

### 참조
- https://gist.github.com/paulirish/1579671