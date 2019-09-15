---
title:  "will-change"
date:   "2019-04-29 15:00:00 +0900"
categories: CSS
tags: ["css", "will-change", "javascript", "transform"]
---

Chrome 53버전부터 애니메이션 성능과 그래픽 성능 개선하기 위해 새로운 동작을 선보였다. 하지만 그 영향으로 웹 사이트가 갑자기 흐릿하게 보이는 현상이 있었다. 이전 버전의 Chrome 포함한 다른 모든 브라우저는 동일한 애니메이션을 아름답게 렌더링한다. 논란의 핵심은 `will-change` 속성이다.

<br>

### 요약

- javascript를 통해 `transform` 애니메이션을 사용할때 `will-change` 를 쓰면 흐려지는 대신 빨라진다.


<br>

### will-change 란?

```css
.div{
    will-change: transform;
}
```

`will-change` 속성이 없는 모든 콘텐츠는 `scale`이 변경되면 다시 레스터화(re-rastered)한다. 즉, `will-change`란 변형은 효과적으로 래스터화 시간을 추가하지 않고 **"신속하게 변형을 적용하십시오"** 라는 의미다. 이는 javascript 조작을 통해 발생하는 scale 조정에만 적용되며 CSS 애니메이션에는 적용되지 않는다.

<br>

### FE 개발자가 알아야 하는 부분

`will-change: transform` 속성은 콘텐츠를 이후의 `transform` 변화에 의해 변경되지 않는 고정된 비트맵으로 강제하는것으로 간주한다. 이로 인해 개발자는 해당 비트맵에 적용되는 이동(`translate`)하거나 회전(`rotate`)시키거나 크기변형(`scale`)와 같은 `transform` 애니메이션의 속도를 높일 수 있다.

<br>

<iframe height="265" style="width: 100%;" scrolling="no" title="will-change" src="//codepen.io/project42da/embed/oNvMWKe/?height=265&theme-id=dark&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/project42da/pen/oNvMWKe/'>will-change</a> by CHUN MINWOO
  (<a href='https://codepen.io/project42da'>@project42da</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

위처럼 `will-change` 속성을 사용하면서 javascript로 애니메이션을 작용하는 경우, 애니매이션의 속도가 빨라지는 대신 고정된 비트맵으로 강제하여 요소가 흐려질 수 있다.

<br>

### will-change: transform의 사용처

예를들어 매우 빠른(60fps) 애니메이션 속도를 유지하는 것이 중요하며, 각 프레임에서 높은 품질의 레스터화가 필요하지 않을것으로 예상되는 요소에 사용하는 것이 적합하다. 그렇지 않으면 `will-change: transform` 사용을 피하는게 좋다.

성능 수준을 절충하여 최적화하려면 애니메이션이 시작될 때 `will-change: transform` 을 추가하고 끝나면 제거하자. 하지만 `will-change: transform` 을 추가하거나 제거할때에 일회성 성능 비용(one-time preformance cost)이 소요된다는 점은 염두해야 한다.

#### 추가적인 고려 사항

`will-change: transform` 을 제거하면 레스터화(re-rastered) 되어 콘텐츠가 선명하게 크기가 변형되지만, 그 다음 프레임에서 적용된다.(`requestAnimationFrame` 에 의하여) 그러므로 `will-change: transform` 속성이 있는 레이어가 다시 래스터(re-rastered)를 트리거하고 애니메이션을 계속 진행하려면, 우선 `will-change: transform` 을 제거한 다음 `requestAnimationFrame` 콜백에 다시 추가해야한다.

<br>

만약 애니메이션 중 언제든지 현재 크기에서 레스터화(re-rastered)하고 싶다면, 위 기술을 적용해 다음 프레임에서 `will-change` 를 제거했다가 다시 추가하는것이 좋다. 다만 이 방법은 composited layer를 잃어버리는 부작용을 초래 할 수 있다.(일회성 성능 비용) 만약 이것이 문제가 된다면, `tansform: translateZ(0)` 과 같이 레이어를 분리하여 유지하는것이 좋다. 프론트엔드 개발자는 `will-change: transform` 을 추가하거나 및 제거하여 요소 및 애니메이션 프레임 단위로 품질과 속도 사이에서 트레이드 오프 해야한다.

<br>



### 참조

- [css-will-change-transform-rasterization/](https://googlechrome.github.io/samples/css-will-change-transform-rasterization/)
- [greensock](https://greensock.com/will-change)
- [bugs.chromium.org](https://bugs.chromium.org/p/chromium/issues/detail?id=596382)
- https://docs.google.com/document/d/1f8WS99F9GORWP_m74l_JfsTHgCrHkbEorHYu72D4Xag/edit
- https://docs.google.com/document/d/1CsDfsMxZaM094VhTDrHXF86_rmFnpjM8xL3iEh7HWgg/edit