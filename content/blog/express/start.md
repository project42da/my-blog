---
title: "Express 시작하기"
date: "2019-10-06 12:58:00 +0900"
categories: express
tags: ["express"]
---


익스프레스(Express)는 Node.js를 위한 웹프레임워크의 하나로, 웹애플리케이션, API 개발을 위해 설계되었다. 
수많은 HTTP유틸리티 메소드와 미들웨어를 사용해 쉽고 빠르게 강력한 API를 만들수 있으며, Node.js의 사실상의 표준 서버 프레임워크로 불리고 있다.

Express는 어떠한 형태를 강요하지 않는(Unopinionated) 프레임워크이다. 
내부에서 제안하는 툴들이 포함되어있는 루비온레일즈와 같은 프레임워크와는 달리, 아무것도 정해져있지 않아 자유롭게 원하는 툴을 추가 가능한 동시에 프레임워크 자체에서 도움 받을 수 있는 것이 매우 적다는 단점이 있다.

<br>

### Express로 웹서버 만들기

흔히 Express 관련 튜토리얼을 보면 다음과 같은 코드가 나온다. 기본적인 웹서버이다. `express` 모듈을 불러오면 `module.exports` 를 통해 `createApplication` 이라는 함수를 반환한다. 이 함수를 통해 Express 애플리케이션을 실행한다.

<br>

**expressServer.js**

```js
const createApplication = require('express');
const app = createApplication();

app.all('*', (req,res) => {
  // Express가 header에 대한 부분을 알아서 처리해준다.
  // 개발자는 body부분만 신경쓰면된다.
  res.sendFile('./index.html');
});

app.listen(3000);
```

Express로 서버를 만들면 HTTP요청에 대한 응답에 대해 개발자가 신경써야하는 범위가 줄어든다. 
Node.js 내장 모듈인 `http`를 사용하면 HTTP응답의 header 부분 까지도 개발자가 신경써야한다.

**server.js**

```js
const http = require('http');
const server = http.createServer((req,res) => {
    // 시작줄은 Node.js가 알아서 처리해준다.
    // header와 body는 개발자가 신경써야 한다.
    // 상태코드와 mime-type 객체를 넘겨줘야한다.
    res.writeHead(200, {
        'content-type': 'text/html'
    });
    const html = fs.createReadStream('./index.html');
    html.pipe(res);
});

server.listen(3000);
```

현재는 별로 기능이 없지만 `http`모듈과의 차이가 느껴진다. 기능을 더 추가할수록 `http` 모듈만으로는 불편해진다.

<br>

#### 라우트(Route) 기능 추가

현재는 모든 url에 대하여 index.html 파일을 전달하지만, 실제 웹서버는 다수의 url을 다뤄야 한다. `.all()` 메소드는 기본적으로 두개의 인자를 받는다.

- `route`
- `callback` : 해당 라우트 요청 이후 실행될 콜백

```js
app.all('/', (req,res) => {
  // Express handles the basic headers 신경쓸 필요 없다.(status code, mime-type)
  // 처음에 localhost:3000에 접속하면 200으로 받지만,
  // 그다음에는 304 Not modified로 받는다.
  // 파일을 보낼수도 있다.
  res.sendFile(path.resolve(__dirname, '../example1.html'))

  // res.send(`<div>안뇽</div>`);
  // express는 end도 핸들링 한다. 역시 신경쓰지 않아도된다. 
});
```
<br>

#### static 파일


static을 추가할수 있다.
웹사이트의 리소스들 모두 get을 통해 불러오는데 이 모든 리소스의 변경과 추가때마다 매번 새로운 라우트를 추가 및 수정해야한다는것은 말도안된다.

<br>

#### 미들웨어(Middleware)

미들웨어는 
request obejct와 respons object에 접근하는 함수이다. 

- Application-level middleware
- Router-level middleware
- Error-handling middleware
- Built-in middleware
- Third-party middleware