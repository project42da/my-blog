---
title: "낮은 버전 브라우저에서 적용해본 폴리필"
date: "2018-09-12 08:00:00 +0900"
categories: javascript
tags: ["javascript", "polyfill"]

---

구형 IE브라우저에서는 작동하지 않는 메서드가 많다. UI개발팀에서는 IE9수준(혹은 IE8까지도)의 브라우저까지도 지원하기 때문에 해당 브라우저에서 돌아가는 메서드들은 폴리핑해야한다.

### `Event.target`

EventTarget API는 모든 브라우저에서 지원한다고 하지만, 구형 IE브라우저에서는 Event객체의 `target` 프로퍼티를 지원하지 않기도 한다고 한다.(?) 때문에, `target`프로퍼티가 없을경우 IE에서의 비표준 방법인 `srcElement`를 사용할 수 있도록 조건을 추가한다.

```js
var target = e.target || e.srcElement;
```

### `Event.preventDefault()`

IE8에서는 Event객체의 `preventDefault()` 함수를 지원하지 않는다. 따라서 `e.returnValue = false;`로 대체한다.

```js
function handleSubmit(e){
  if(e.preventDefault){
    e.preventDefault();
  }else{
    e.returnValue = false;
  }
}
```

### `Array.prototype.indexOf()`

IE8에서는 `Array`의 `indexOf` 메서드를 지원하지 않는다.

```js
if (!Array.indexOf) {
  Array.prototype.indexOf = function (value, start) {
    for (var i = (start || 0); i < this.length; i++) {
      if (this[i] == value) {
        return i;
      }
    }
    return -1;
  }
}
```

### `document.getElementsByClassName()`

IE8에서는 `document.getElementsByClassName()`나 `querySelector`와 같은 함수를 지원하지 않는다.

```js
if (!document.getElementsByClassName) {
  document.getElementsByClassName = function (name) {
    var all, regex, results = [];
    all = document.getElementsByTagName("*");
    regex = new RegExp("(^|\\s)" + name + "(\\s|$)");
    for (var i = 0; i < all.length; i++) {
      if (regex.test(all[i].className)) {
        results.push(all[i]);
      }
    }
    return results;
  }
}
```

### `Element.classList`

`Element.classList`는 요소의 클래스 속성의 컬렉션인 활성 `DOMTokenList`를 반환하는 읽기전용 프로퍼티이다. IE8에서는 이 프로퍼티를 지원하지 않는다. 따라서 `className`을 배열로 변환해 사용한다.

```js
function classList(el){
  return el.classList || el.className.split(" ");
}

var chk = Array.prototype.indexOf.call(classList(target), "checked");
if(chk === -1 || chk === undefined){
  target.className += " checked";
} else {
  target.className = "chk_item";
}
```

### `Element.addEventListener()`

`addEventListener()`도 지원하지 않는다. `attachEvent()`로 대체한다.

```js
if(check.addEventListener){
  check.addEventListener("click", handleCheckList);
  btn.addEventListener("click", handleSubmit);
}else{
  check.attachEvent("onclick", handleCheckList);
  btn.attachEvent("onclick", handleSubmit);
}
```

### `String.prototype.includes()`

`String.prototype.includes()`는 IE 브라우저에서 지원하지 않는다. `indexOf`를 활용하여 폴리필링 한다.

```js
if(!String.prototype.includes){
  String.prototype.includes = function(toSearch, position){
    if(!toSearch) return false;
    if(!position) position = 0;
    const start = Math.min(Math.max(position, 0), this.length);
    return String.prototype.indexOf.call(this, toSearch, start) !== -1;
  }
}
```