---
title: "Express 시작하기"
date: "2019-10-06 12:58:00 +0900"
categories: express
tags: ["express"]
---


익스프레스(Express)는 Node.js를 위한 웹프레임워크의 하나로, 웹애플리케이션, API 개발을 위해 설계되었다. 
수많은 HTTP유틸리티 메소드와 미들웨어를 사용해 쉽고 빠르게 강력한 API를 만들수 있으며, Node.js의 사실상의 표준 서버 프레임워크로 불리고 있다.

Express는 어떠한 형태를 강요하지 않는(Unopinionated) 프레임워크이다. 
내부에서 제안하는 툴들이 포함되어있는 루비온레일즈와 같은 프레임워크와는 달리, 아무것도 정해져있지 않아 자유롭게 원하는 툴을 추가 가능하지만, 동시에 프레임워크 자체에서 도움 받을 수 있는 것이 매우 적다는 단점이 있다.

<br>

### Express로 간단한 웹서버 만들기

흔히 Express 관련 튜토리얼을 보면 다음과 같은 코드가 나온다. 기본적인 웹서버이다. `express` 모듈을 불러오면 `module.exports` 를 통해 `createApplication` 이라는 함수를 반환한다. 이 함수를 통해 Express 애플리케이션을 실행한다.

<br>

**expressServer.js**

```js
const express = require('express');
const app = express(); // createApplication()

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

특별한 기능이 없음에도 `http`모듈과의 차이가 느껴진다. 기능을 더 추가할수록 `http` 모듈만으로는 불편해진다.

<br>

#### HTTP요청

현재는 모든 HTTP 요청과 경로에 대하여 index.html 파일을 전달하지만, 실제 웹서버는 다수의 HTTP요청과 경로들을 다뤄야 한다. `all()` 메소드는 첫번째 인자로 넘겨준 경로(`path`)에 대하여 **GET, POST, DELETE, PUT** 등을 비롯한 모든 HTTP 요청을 처리한다. Express는 각 HTTP Method를 다룰 수 있는 메소드를 `get()`,`post()`, `put()`, `delete()`의 형태로 제공한다.

<br>

이러한 메소드들은 기본적으로 두개의 인자를 받는다.

- `path` : **미들웨어 함수가 호출될 경로**이다.
- `callback` : 해당 라우트 요청 이후 실행될 콜백함수로 **미들웨어 함수** 혹은 미들웨어 함수의 배열이다.

<br>

```js
app.all('/', (req,res) => {
  // Express가 기본으로 header를 다루기 때문에 신경쓸 필요 없다.(status code, mime-type 등)
  // 파일을 보낼수도 있다.
  res.sendFile(path.resolve(__dirname, '../example1.html'))

  // res.send(`<div>Hello</div>`);
  // express는 end도 핸들링 한다. 역시 신경쓰지 않아도된다. 
});
```

처음 특정 경로를 요청하면 상태코드 **200 OK**을 받게되지만, 이후로는 **304 Not modified**를 받는다. Express가 HTTP Body를 인코딩해 리소스가 변경되었는지 확인하고 Etag를 생성해 버전을 식별하고 상태코드를 알아서 설정하기 때문이다.

<br>

#### static 파일 다루기

만약 `http`모듈만으로 리소스를 다룬다면 다음과 같이 모든 리소스에 대하여 각각을 다루는 코드를 작성해야한다.

```js
const server = http.createServer((req, res) => {
  if(req.url === '/image1.png' ||
     req.url === '/image2.png' ||
     req.url === '/image3.png'
    }){
    res.writeHead(200, {
      'content-type': 'image/png'
    });
    const image = fs.createReadStream(`.${req.url}`)
    image.pipe(res);
  }else {
    //...
  }
}
```

브라우저는 HTML에 포함된 리소스들을 GET 요청을 통해 불러오는데 이 모든 리소스가 변경되거나 추가될때마다 매번 새로운 라우트를 추가 및 수정해야 한다는것은 말도 안되는 일이다. Express의 내장 미들웨어인 `express.static()`를 사용하여 리소스가 저장된 폴더를 지정하면 리소스에 대한 GET 요청을 자동으로 처리해준다. 

```js
// express에 내장되어있는 static미들웨어 사용.
app.use(express.static(root, [options]))
```


<br>

#### 미들웨어(Middleware)

미들웨어는 클라이언트의 요청(Request Obejct)과 서버의 응답(Response Object)에 접근하여 특정한 작업을 수행한다. 미들웨어 함수는 일반적으로 3개의 인자를 받는다. 이때 3번째 인자인 `next`는 다음 미들웨어를 실행하는 함수이다.

```js
function middleware(req,res,next){
  doSomethind();
}
```

<br>

미들웨어는 지정된 경로(`path`)에 대해서 실행되며 하나의 경로에 대하여 여러개의 미들웨어를 지정할 수 있다. 만약 특정 미들웨어 함수내에서 `next`함수를 호출하지 않으면 해당 미들웨어 이후로 지정된 미들웨어는 실행되지 않는다.

```js
app.use('/posts', (req,res,next) => {
  logger(req,res);
  next(); // 다음 미들웨어를 실행한다.
});

app.all('/posts', (req, res, next) => {
  doSomethingWithDB();
  next(); // 다음 미들웨어를 실행한다.
});

app.get('/posts', (req, res, next) => {
  res.send('Response: GET /posts');
  // next함수를 실행하지 않았기 때문에 이후로 지정된 미들웨어는 실행되지 않는다.
});

app.all('/posts', (req, res, next) => {
  console.log('실행되지 않는다.');
});
```

<br>

### 참조
- https://expressjs.com/
