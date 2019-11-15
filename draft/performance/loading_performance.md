---
title: "Critical Rendering Path"
date: "2019-11-03 12:58:00 +0900"
description: '랜더링 최적화에 대해서 설명'
categories: web
tags: ["optimization", "web"]
---

HTML이 없다면 페이지가 렌더링 되지 않게 때문에 반드시 필요하다.

CSS가 없는 페이지는 사용성이 떨어지기 때문에 역시 반드시 필요하다.
미디어 쿼리를 통해 특정 조건에서만 CSS파일을 다운로드 하도록 하여 초기 렌더링에 걸리는 시간을 최적화할 수 있다.

```html
<link href="style.css" rel="stylesheet"> 
<link href="tablet.css" rel="stylesheet" media="(min-width: 768px)">
```

첫번째 스타일 시트 선언은 미디어 쿼리를 제공하지 않아 모든 경우에 적용된다. 즉 항상 렌더링을 차단한다. 
반면 두번째 스타일 시트 선언은 너비가 768px 이상일때만 다운로드되기 때문에 이 조건에 해당하지 않는 경우 렌더링을 차단하지 않는다.
이때 테블릿 사용자의 경우 항상 두 개의 스타일시트 파일을 다운로드 해야 하기 때문에 오히려 성능상 좋지 않을것이다. 모바일 사용자와 태블릿 사용자의 비율을 비교하여 하나의 파일로 합치는게 유리한지 결정해야한다. 

JS의 경우 렌더링이 끝난 직후 


기본적으로 너무 큰 파일인 경우를 제외하면 다수의 파일보다는 파일을 합쳐서 한번에 보내는게 좋다.

네트워크 지연(Network Latency)

https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-blocking-css?hl=ko
https://developers.google.com/web/fundamentals/performance/critical-rendering-path/adding-interactivity-with-javascript?hl=ko
https://developers.google.com/web/fundamentals/performance/critical-rendering-path/measure-crp?hl=ko
https://developers.google.com/web/fundamentals/performance/critical-rendering-path/analyzing-crp?hl=ko
https://developers.google.com/web/fundamentals/performance/critical-rendering-path/page-speed-rules-and-recommendations?hl=ko


## CRP란

## 리소스

불필요한거 안불러오기, GET요청 줄이기, 위치, 

## 