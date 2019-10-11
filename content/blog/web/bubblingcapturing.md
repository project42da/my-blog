---
title: "이벤트 버블링(Bubbling) & 캡쳐링(Capturing)"
date: "2017-01-30 14:00:00 +0900"
categories: javascript
tags: ["javascript", "bubbing&capturing"]
---

버블링과 캡쳐링은 정반대로 동작한다. 

**이벤트 버블링**은 특정 DOM에서 이벤트가 발생하면 가장 하위 DOM부터 상위의 부모 DOM으로 한단계씩 전파된다.
반면 **이벤트 캡쳐링**은 최상위 부모DOM부터 가장 하위의 DOM까지 부모에서부터 전파되는 것을 의미한다. 

<br>

![eventflow](https://user-images.githubusercontent.com/16536810/64917913-891c9800-d7d1-11e9-90ee-eeed1a45d088.png)


(Eventflow - [DOM-Level-3-Events](https://www.w3.org/TR/DOM-Level-3-Events/#dom-event-architecture))


<br>

다음은 버블링과 캡쳐링에따라 이벤트가 어떤 순서로 호출되는지 보여준다.

<br>

### 버블링

<iframe height="265" style="width: 100%;" scrolling="no" title="bubbling" src="//codepen.io/project42da/embed/OJLwmNx/?height=265&theme-id=0&default-tab=html,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/project42da/pen/OJLwmNx/'>bubbling</a>
</iframe>

바깥에 위치한 회색 사각형은 가장 자식요소이다. 이 사각형을 클릭하면 `this`의 클릭이벤트 발생 후 이벤트핸들러가 걸려 있는 상위 부모요소들로 전파되어 이벤트리스너 함수가 순차적으로 호출된다. 이벤트 버블링은 이렇게 자식요소에서 상위부모요소로 전파된다.

<br>

### 캡쳐링

반면 이벤트 캡쳐링은 이와 반대로 부모요소으로부터 최하단 자식요소까지 순서대로 이벤트가 전파되면서, 이벤트를 구독하고있다면 구독하고 있는 이벤트에 대한 이벤트 리스너 함수를 호출한다.

<iframe height="265" style="width: 100%;" scrolling="no" title="capturing" src="//codepen.io/project42da/embed/pozZPRq/?height=265&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/project42da/pen/pozZPRq/'>capturing</a>
</iframe>

바깥에 있는 회색 사각형을 클릭하면, 가상 상위 부모요소의 이벤트부터 발생하는것을 알 수 있다.

<br>

이때 `addEventListener`함수의 두번째 인자로 전달된 `true`는 이벤트를 캡처링해야하는지 여부를 지정한다.

```
target.addEventListener(type, listener[, useCapture]);
```

- **type** : 이벤트의 이름을 지정하는 문자열. 대소문자 구별. (`click`, `keypress` 등..)
- **listener** : 이벤트가 발생할때 호출할 이벤트 리스너 함수.
- **useCapture** : 캠쳐링을 사용할지 여부를 지정하는 `Boolean`. default는 `false` 이다. (선택사항)

<br>

### event.stopPropagation()

이벤트는 propagation path라는 전파경로를 따라 캡쳐링단계, 타겟, 버블링단계 순서로 수행된다. 즉 이벤트핸들러를 호출할 수 있는 시점이 캡쳐링단계, 버블링단계 두 번 발생한다. `stopPropagation()`함수로 이벤트 전달을 막는다면, 이벤트 버블링 단계의 추가적인 이벤트 전달로 인한 자원소모를 아낄 수 있다.

<iframe height="265" style="width: 100%;" scrolling="no" title="stopPropagation" src="//codepen.io/project42da/embed/dybjWRO/?height=265&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/project42da/pen/dybjWRO/'>stopPropagation</a>
</iframe>

내부의 오랜지색 요소를 클릭하면 이벤트가 버블링되어 노란색 요소의 이벤트리스너 역시 호출되어야 하지만, `stroPropagation()`함수로 인해 전파되지 않아 이벤트 리스너가 호출되지 않는다.

`stopPropagation()`는 거의 모든 브라우저에서 지원한다.

<br>

<img src="https://user-images.githubusercontent.com/16536810/64918032-4065de80-d7d3-11e9-9bd3-50d13b0f63c0.png" width="100%">


---

### 참고
- 속깊은 자바스크립트
- [DOM-Level-3-Events](https://www.w3.org/TR/DOM-Level-3-Events/#dom-event-architecture)