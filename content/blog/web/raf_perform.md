---
title: "requestAnimationFrame()과 퍼포먼스"
date: "2019-05-08 12:00:00 +0900"
categories: "Javascript"
tags: ["javascript", "requestAnimationFrame"]
---

**requestAnimationFrame(이하 rAF)** 는 다음과 같은 특징이 있다.

- 브라우저가 레이아웃을 계산하는 것보다 더 자주 또는 덜 자주 호출되지 않는다.(**정확한 주기로 호출**)
- 브라우저가 레이아웃을 계산하기 바로 전에 호출된다.(**정확한 타이밍에 호출**).
- 레이아웃 변경 (DOM 또는 CSSOM 변경)에 rAF를 사용하는것이 적절하다.
- rAF는 브라우저에서 관련 레이아웃을 렌더링하는 다른 것들과 마찬가지로 [수직동기화(V-SYNC)](https://namu.wiki/w/%EC%88%98%EC%A7%81%EB%8F%99%EA%B8%B0%ED%99%94)된다.

<br>

### rAF를 throttle/debounce용도로 사용하기

```js
var scheduledAnimationFrame;
function readAndUpdatePage(){
    console.log('read and update');
    scheduledAnimationFrame = false;
}

function onScroll (evt) {
  // 마지막 스크롤 위치를 저장한다.
  lastScrollY = window.scrollY;

  // rAF의 콜백이 여러번 일어남을 방지한다.(임계영역)
  if (scheduledAnimationFrame){
    return;
  }

  scheduledAnimationFrame = true;
  requestAnimationFrame(readAndUpdatePage);
}

window.addEventListener('scroll', onScroll);
```

이 패턴은 굉장히 유명하고 아주 자주 사용되지만, 실제로는 아무 의미가 없다. 스크롤 이벤트는 브라우저가 스크롤 위치 변경을 렌더링할 때 마다 트리거된다. 즉, 스크롤 이벤트가 페이지 렌더링과 동기화됨을 의미한다. 말 그대로 rAF가 제공해 주는것과 동일한 결과를 갖게 된다. 그러므로 rAF로 이것을 throttle한다는 것은 전혀 의미가 없으며, 그것은 이미 이 자체가 throttle된 결과임을 뜻한다.

이것은 위 예시코드에 다음과 같이 `console.log`를 추가해 `'rAF가 여러번 발생하는것을 방지함'` 이라는 문구가 얼마나 자주 출력되는지를 통해 확인할 수 있다.

> **전혀 출력되지 않는다.**  만약 출력된다면 브라우저 버그이다.

```js
// Prevent multiple rAF callbacks.
if (scheduledAnimationFrame){
  console.log('rAF가 여러번 발생하는것을 방지함');
  return;
}
```

그런데 이와 유사하지만 다른 이유로 의미가 있는 패턴이 있다.

```js
function writeLayout(){
  element.classList.add('is-foo');
}

window.addEventListener('scroll', () => {
  let box = element.getBoundingClientRect();
  if(box.top > pos){
    requestAnimationFrame(writeLayout);
  }
});
```

이 패턴을 사용하면 레이아웃 스래싱을 성공적으로 줄이거나 제거 할 수 있다. 아이디어는 간단하다. 스크롤 리스너의 내부에서 레이아웃을 읽고 DOM을 수정해야한다고 결정한 다음 rAF를 사용하여 DOM을 수정하는 함수를 호출한다. 왜 이것이 도움이 될까?

<br>

### 레이이웃 스레싱(Layout Thrashing)

언제든 DOM을 수정되면, 직전 레이아웃은 효력이 없어지며(invalidated) reflow가 일어납니다. 브라우저는 일반적으로 현재작업이나 프래임이 끝날때까지 기다리지만, 현재 작업이나 프래임이 완료되기 전에 javscript를 통해 기하학적인 값(geometric value)을 묻는다면, 브라우저는 즉시 레이아웃을 reflow해야 한다. 이것을 **강제 동기식 레이아웃** 이라 하며, 이것이 반복됨(레이아웃 스레싱)으로서 성능 저하가 유발된다.

> 데스크탑 브라우저에서 레이아웃 스레싱의 부작용은 심하지 않지만,<br>모바일에서는 심각한 성능 저하가 있다.

이때 rAF를 사용하여 DOM을 읽는 로직은 현재 프레임에서 실행하고, DOM을 수정하기 위한 로직은 rAf와 함께 사용해 다음 프레임에서 함께 실행하도록 예약하여 레이아웃 스레싱이 줄일 수 있다.([데모](https://googlesamples.github.io/web-fundamentals/tools/chrome-devtools/rendering-tools/forcedsync.html))

이 패턴은 아주 훌륭하기 때문에, 다음과 같이 헬퍼 메서드를 만들어 사용하는 것을 제안한다.

```js
/**
 * @param fn {Function}
 * @param [throttle] {Boolean|undefined}
 * @return {Function}
 *
 * @example
 * // generate rAFed function
 * jQuery.fn.addClassRaf = bindRaf(jQuery.fn.addClass);
 *
 * //use rAFed function
 * $('div').addClassRaf('is-stuck');
 */
function bindRaf(fn, throttle){
  var isRunning, that, args;
  var run = function(){
    isRunning = false;
    fn.apply(that, args);
  };

  return function(){
    that = this;
    args = arguments;

    if(isRunning && throttle){
      return;
    }

    isRunning = true;
    requestAnimationFrame(run);
  };
}
```

### Conclusion

- 단순히 스크롤 이벤트의 throttle용도로 rAF를 사용함은 적절하지 않다.
- rAF는 애니메이션 혹은 레이아웃 스레싱을 줄이기 위한 용도로 사용함이 적절하다.

<br>

### 참고

- [avoid-large-complex-layouts-and-layout-thrashing](https://developers.google.com/web/fundamentals/performance/rendering/avoid-large-complex-layouts-and-layout-thrashing?hl=ko)
- [preventing-layout-thrashing](http://wilsonpage.co.uk/preventing-layout-thrashing/)
- [Scroll Optimization with window.requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event#Scroll_optimization_with_window.requestAnimationFrame)