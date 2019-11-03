---
title: "React Hooks: 메모이제이션 훅(useMemo, useCallback)"
date: "2019-11-03 12:58:00 +0900"
description: 'useMemo, useCallback'
categories: React
tags: ["react", "hooks"]
---

리액트의 내장훅 중 `useMemo`와 `useCallback`은 이전 상태값을 기억해 성능을 최적화하는 용도로 사용된다.

### useMemo

### useCallback

`useCallback`은 랜더링 성능을 최적화 하기 위해 제공되는 훅이다. 훅을 사용하면 상태값이 변경되어 컴포넌트가 랜더링 될 때마다 변경된 상태값을 참조하지 않는 함수까지도 새로 생성하게 되며, 이 함수를 `props`로 전달받게된 자식 컴포넌트도 랜더링이 일어나게 된다. 함수는 객체이기 때문에 생성시마다 매번 래퍼런스가 변경되어, `PureComponent`나 `mome`기능을 사용해도 불필요한 랜더링을 막을 수 없다.

