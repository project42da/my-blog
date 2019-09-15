---
title: "display: flex"
date: "2017-11-14 00:00:00 +0900"
categories: CSS
tags: ["flex", "css"]

---

> React Native에서 사용하기위해 이 부분을 공부한다면, web에서 사용하는 flex를 먼저 공부하는것이 도움이 된다고 생각한다. React Native에서 사용할 때는 프로퍼티를 낙타표기법으로 표시하면 된다.

<br>

## Display Flex

flex 적용방법은 아주 간단하다. 정렬할 요소들(flex items)를 감싸고있는 컨테이너(flex container)의 css속성으로 `display:flex`를 지정해주는 것 만으로 손쉽게 적용할 수 있다.

```css
.container {
  display:flex
}
```

<br>

### Flex Axis & flex-direction

Flex의 축은 **주축(main axis)**과 **교차축(cross axis)**으로 구성 되어있는데, **기본값은 가로축이 주축**이다. 주축을 가로축으로 바꾸고 싶다면 `flex-direction` 속성을 변경하면 된다.(react-native에서는 column이 기본값이다.)

```
.container {
  flex-direction: row(기본값) | column
}
```

<br>

### flex-wrap


```
.container{
  flex-wrap: nowrap(기본값) | wrap | wrap-reverse
}
```

`nowrap`은 플렉스 컨테이너가의 주축을 기준으로 **모든 자식요소를 한줄에 배치**한다. `wrap`은 컨테이너 내에 아이템을 주축의 너비(혹은 높이)로 더이상 수용할 수 없으면 여러줄로 나눈다. (`whitespace` 속성과 비교하면 이해하기 쉽다)

`flex-direction`과 `flex-wrap`은 `flex-flow`라는 약칭으로 사용할 수 있다.

```css
.container {
  flex-flow: row nowrap;
  /*
   * flex-direction : row;
   * flex-wrap : nowrap;
  */
}
```

<br>

### justify-content

`justify-content`속성은 주축에서 자식요소(플렉스 아이템)들을 배치하는 방법을 정의한다.

```
.container {
  justify-content: flex-start(기본값) | flex-end | center | space-between | space-around
}
```

<script async src="//jsfiddle.net/project42da/ga8h9v3j/4/embed/result/"></script>

<br>

### align-items

`align-items`는 교차축에서 자식요소들을 정렬하는 방법을 정의한다. `justify-content`와 비슷하다.

```
.container {
  align-items: flex-start | flex-end | center | stretch(기본값) | baseline
}
```

<script async src="//jsfiddle.net/project42da/n98fkqvt/9/embed/result/"></script>

<br>

### align-self

`align-self`는 자식요소에 지정하는 속성값으로, 부보요소의 `align-items`을 무시하고 자신만의 값으로 정렬한다. 만약 해당 flex아이템의 `margin`값이 `auto`라면 `align-self`는 무시한다.

```
.flexItems {
  align-self: auto(기본값) | flex-start | flex-end | center | baseline | stretch
}
```

<script async src="//jsfiddle.net/project42da/fcj5x78m/3/embed/result/"></script>

<br>

### 참고

- [flexible box layout - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout)
- [baseline에 대하여](http://typedeck.com/baseline-grid/)