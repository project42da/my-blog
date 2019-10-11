---
title: "HTTP"
date: "2019-10-03 12:58:00 +0900"
categories: 네트워크
tags: ["HTTP", "네트워크"]
---

### 헤더

<br>

### 메소드

- **GET** : 웹서버측에 리소스 요청한다.
  - 조건부 요청 : 캐시를 가지고 있지 않은 경우 `200 OK` 상태로 응답을 회신한다. 캐시된 리소스가 존재하고 리소스가 변경되지 않았다면 `304 Not Modified` 응답을 회신한다. 리소스가 변경되었다면 새로운 리소스와 함께 `200 OK` 응답을 회신한다.
- **POST** : 서버측에 데이터를 HTTP Body에 담아 웹서버로 전달한다.
- **PUT** : 리소스 전체를 갱신를 생신한다. 모든 필드 영역이 필요하다. 일부만 전달할 경우 초기값 혹은 `null`로 처리된다.
- **PATCH** : 리소스의 일부분을 갱신한다. 갱신하려는 일부 필드 영역이 필요하다.
- **DELETE** : 리소스를 삭제 한다.


<br>

### 상태코드

- **200** : 성공
- **3xx** : 리다이렉션
  - **304 Not modified** : 로컬 캐시 정보를 이용함
- **4xx** : 클라이언트측 에러
  - **401 Unauthorized** : 권한 없음
  - **404 Not Found** : 요청한 리소스가 발견되지 않음
- **5xx** : 서버측 에러
  - **500 Internal Server Error** : 서버 내부 오류
  - **502 Bad Gateway** : 잘못된 게이트웨이(접속한 프록시 서버에서 내부 망에 웹서버로부터 잘못된 응답을 받았을때)
  - **Service Unavailable** : 서비스 불가



```js
const http = require('http'); // native 모듈
// http모듈은 createServer라는 메소드를 지원한다. 
// createServer메소드는 1개의 매개변수를 받는다 callback
// callback은 두개의 매개 변수를 받는다. req,res
const server = http.createServer((req, res) => {
  // req 브라우저가 보내는 요청을 뜻하고
  // res는 req를 받아 응답할 내용이다.
  console.log(req);

  // startline 노드가 알아서 해줄거고
  // header과 body는 우리가 신경써야한다.


  // writeHead
  // status code
  // mime type이라는 객체를 넘겨줘야한다.
  res.writeHead(200, {
    'content-type': 'text/html'
  });
  // write메소드로 body를 적는다.
  res.write('<div>안녕</div>');
  
  // res을 끝낸다. 보낸뒤 실행할 콜백함수를 매개변수로 받을 수 있다.
  res.end(() => {
    console.log('보냇어');
  });
});

// createServer 메소드는 객체를 반환하는데 이 객체에는 listen이라는 메소드ㅡㄹ 포함한다.
// listen 메소드도 port라는 값을 받는다.

server.listen(3000);
```


```
$ curl -v localhost:3000
```

요청(Request) 

```
*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 3000 (#0)
> GET / HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/7.54.0
> Accept: */*
>
```

응답(response)이다. 


`HTTP/1.1 200 OK`인 이유는 `res.writeHead`로 상태코드 200을 보냈기 때문이다. `content-type: text/html` 역시 마찬가지다.

```
< HTTP/1.1 200 OK
< content-type: text/html
< Date: Thu, 03 Oct 2019 09:48:11 GMT
< Connection: keep-alive
< Transfer-Encoding: chunked
<
* Connection #0 to host localhost left intact
<div>안녕</div>
```

상태코드를 404로 바꾸면 

```
res.writeHead(404, {
  'content-type': 'text/html'
});
```

아래와 같은 응답을 받게된다. API를 만들때 정책에 따라 404없이 200에 빈배열을 보내주는것도 좋을 수 있다.

```
< HTTP/1.1 404 Not Found
< content-type: text/html
< Date: Thu, 03 Oct 2019 09:53:38 GMT
< Connection: keep-alive
< Transfer-Encoding: chunked
<
* Connection #0 to host localhost left intact
<div>404 Error</div>
```

여러 요청에 대해 리소스를 기준으로 나눠(REST를 준수하여) API를 만들고, 그 과정에 일부 경로(하위 계층 도메인)가 마이크로 서비스로 분리되기도 한다.

이 하찮은것 때문이 로직도 분기해야하고, 물론 express를 사용하면 알아서 해주는 부분이긴 하다.

서버 요청도 많아지기 때문에 이미지 서버를 분기해야한다.

http2 는 구글이 만들었었는데, 