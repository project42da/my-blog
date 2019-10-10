---
title: "Node.js 이벤트루프"
date: "2019-10-04 12:58:00 +0900"
categories: Nodejs
tags: ["Nodejs", "event-loop"]
---


https://medium.com/the-node-js-collection/what-you-should-know-to-really-understand-the-node-js-event-loop-and-its-metrics-c4907b19da4c

https://tk-one.github.io/2019/02/07/nodejs-event-loop/

https://meetup.toast.com/posts/89

https://sjh836.tistory.com/149

https://nodejs.org/ko/docs/guides/event-loop-timers-and-nexttick/


https://hamait.tistory.com/930

이벤트 루프란?

이벤트는 가능하다면 언제나 시스템 커널에 작업을 떠넘겨 Node.js가 논블로킹 I/O작업을 수행하도록 해준다.
현대 커널은 멀티 스레드이기 때문에 백그라운드에서 다수의 작업을 실행할 수 있다.

이러한 작업중 하나가 완료되면 커널이 Node.js에게 알려주어 적절한 콜백을 poll큐에 추가할 수 있게 하여 언젠가 실행되게 한다.


```
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

각 박스는 이벤트루프의 단계를 의미하며, 각 단계는 실행할 콜백의 큐를 가진다. 

- timers: 이 단계는 `setTimeout()`과 `setInterval()`로 스케줄링한 콜백을 실행합니다.
- pending callbacks: 다음 루프로 연기된 I/O 콜백들을 실행합니다.
- idle, prepare: 내부적으로만 사용됩니다.
- poll: 새로운 I/O 이벤트를 가져옵니다. I/O와 연관된 콜백(클로즈 콜백, 타이머로 스케줄링된 콜백, `setImmediate()`를 제외한 거의 모든 콜백)을 실행합니다. 노드는 필요하다면 이곳에서 블록되기도 한다.
- check: `setImmediate()`을 통해 등록된 콜백들이 호출된다.
- close callbacks: 일부 close 이벤트 콜백들이 실행된다. (예를 들어 `socket.on('close', ...)`)

### Timers

타이머 단계의 콜백은 지정한 시간이 지난 후에 스케쥴링 될 수 있는 가장 빠른 시간에 실행된다. 즉 지정한 시간에 실행되는게 아니라 지정된 시간 후 가능한 가장 빠른 시점에 실행된다.



```js
const fs = require('fs');

const timeoutScheduled = Date.now();
setTimeout(() => {
  const delay = Date.now() - timeoutScheduled;

  console.log(`${delay}ms have passed since I was scheduled`);
}, 100);

// 이 작업이 완료되는데 95ms가 걸린다고 가정한다.
fs.readFile('/path/to/file', () => {
  const startCallback = Date.now();

  // 10ms가 걸릴 어떤 작업을 진행한다.
  while (Date.now() - startCallback < 10) { /* 10ms 동안 실행 */}
});
```

fs.readFile() 이 파일읽기를 끝마치고 10ms가 걸리는 콜백이 poll큐에 추가되어 실행된 다음 완료된 뒤 가장 빠른 타이머의 지정된 시간에 도달했는지 확인하고 도달했다면 타이머의 콜백을 실행하기 위해 Timers단계로 돌아간다. 이때 이미 100ms가 지난 105ms에 콜백이 실행된다.


```js
doRequest();
fs.readFile('multitask.js', 'utf8', () => {
   console.log('fs:', Date.now() - start());
});
doHash();
doHash();
```

개발자가 javascript 코드를 작성한다. --> v8 --> C++;

javascript에서 가져다 쓰는 native module중 일부의 출처는 C++

process.binding() => env->setMethod();

v8::TypeName
