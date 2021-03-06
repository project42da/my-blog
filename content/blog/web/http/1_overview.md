---
title: "HTTP Overview"
date: "2019-10-11 12:58:00 +0900"
description: http 기본개념. message, method, mimetype 등...
categories: 네트워크
tags: ["HTTP", "네트워크"]
---

HTTP는 신뢰성 있는 데이터 전송 프로토콜(TCP)를 사용하기 때문에 전송 중 파괴되거나 중복되거나 왜곡되지 않는다. 개발자는 인터넷 결함이나 약점에 대한 걱정없이 기능 구현에 집중할 수 있다.

<br>

### 웹 클라이언트와 서버

웹 콘텐츠는 웹 서버에 존재한다. 웹 클라이언트는 서버에게 HTTP 요청을 보내고 서버는 요청된 데이터를 HTTP응답으로 돌려준다.

![서버 클라이언트 모델](./client-server.png)

<br>

HTTP를 이용해 웹서버의 리소스를 요청하여 브라우저에 보여주는 과정을 단순화하면 다음과 같은 순서로 이루어진다.

- 브라우저가 URL에서 호스트명과 포트번호(있다면)를 추출한다.
- DNS를 통해 URL을 IP로 변환한다.
- 브라우저와 웹서버 사이에 TCP 커넥션을 맺는다.
- 브라우저가 서버에 HTTP 요청을 보낸다.
- 서버는 브라우저에 HTTP 응답을 돌려준다.
- TCP 커넥션이 닫히면, 브라우저가 서버에서 받아온 리소스를 보여준다.

<br>

### 메시지(Message)

HTTP 트랜잭션은 요청명령(클라이언트에서 서버로 보내는)과 응답 결과(서버가 클라이언트에게 돌려주는)로 구성되어있다. 이 상호 작용은 HTTP 메시지라고 불리는 데이터 덩어리를 이용해 이루어진다.
HTTP 메시지는 단순한 줄 단위의 문자열이다. 바이너리 형식이 아닌 일반 텍스트이기 때문에 읽고 쓰기 쉽다. HTTP 메시지는 다음 세 부분으로 이루어 진다.

- **시작줄(start-line)** : 메시지의 첫 줄은 시작줄로 요청이라면 무엇을 해야 하는지 응답이라면 무슨일이 일어났는지 나타낸다.
- **헤더(headers)** : 시작줄 다음에는 0개 이상의 헤더 필드가 이어진다. 각 헤더 필드는 쉬운 구문분석을 위해 `:`로 구분되어 이름과 값으로 구성된다. 헤더는 빈 줄로 끝난다.
- **본문(body)** : 빈 줄 다음에는 어떤 종류의 데이터든 필요에 따라 들어갈 수 있다. 요청의 본문은 웹서버로 데이터를 실어 보내며, 응답의 본문은 클라이언트로 데이터를 반환한다. 시작줄이나 헤더와 달리 본문은 이진데이터를 포함할 수 있다.

<br>

### 리소스와 미디어타입

대표적인 웹 리소스는 텍스트, HTML, 이미지등 모든 종류의 정적 파일이다. HTTP를 통해 오고가는 객체(리소스를 포함하는)에는 **MIME 타입**이라는 데이터 포맷 라벨을 붙인다. 웹브라우저는 서버로부터 받은 응답 결과에서 MIME타입을 통해 다룰 수 있는 데이터 포맷인지 확인한다. 브라우저는 수백가지의 타입을 다룰 수 있으며 특별한 포맷의 파일을 다루기 위해 외부 플러그인 소프트웨어를 실행한다.

<br>

MIME타입은 `/`로 구분된 주 타입(primary object type)과 부 타입(specific subtype)으로 이루어진 문자열 라벨이다. HTTP 메시지의 헤더에 **Content-Type**의 값으로 명시한다.

```
Content-Type: [MIME 타입]
```

<br>

대표적인 타입은 다음과 같다.

- `text/html` : HTML 문서
- `text/plain` : plain ASCII 텍스트 문서
- `application/json` : json 파일
- `application/x-www-form-urlencoded` : querystring으로 서버에 전송하는 form 데이터
- `multipart/form-data` : 각각의 파트마다 Content-Type 이 존재하는 form 데이터
- `image/jpeg` : jpeg 이미지

<br>

### 메서드(Method)

HTTP는 HTTP 메서드라고 불리는 여러 종류의 **요청 명령**을 지원한다. 모든 HTTP 요청 메시지는 한개의 메서드를 갖는다. 메서드는 서버에게 어떤 동작이 취해져야 하는지 말해준다.

- **GET** : 웹서버측에 리소스 요청한다.
  - 조건부 요청 : 캐시를 가지고 있지 않은 경우 `200 OK` 상태로 응답을 회신한다. 캐시된 리소스가 존재하고 리소스가 변경되지 않았다면 `304 Not Modified` 응답을 회신한다. 리소스가 변경되었다면 새로운 리소스와 함께 `200 OK` 응답을 회신한다.
- **POST** : 서버측에 데이터를 HTTP Body에 담아 웹서버로 전달한다.
- **PUT** : 리소스 전체를 갱신를 생신한다. 모든 필드 영역이 필요하다. 일부만 전달할 경우 초기값 혹은 `null`로 처리된다.
- **PATCH** : 리소스의 일부분을 갱신한다. 갱신하려는 일부 필드 영역이 필요하다.
- **DELETE** : 리소스를 삭제 한다.

<br>

### 상태코드

모든 HTTP 응답 메시지는 상태 코드와 함께 반환된다. 상태코드는 클라이언트에게 요청이 성공했는지 아니면 추가 조치가 필요한지 알려준다. 상태코드는 세자리 숫자이다. 각 상태 코드에 텍스트로된 사유(reason phrase)도 함께 보내지는데, 이 구문은 단지 설명만을 위해 포함된것일뿐 실제 응답 처리에는 숫자로 된 코드가 사용된다.

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

---

### 간단한 실습

터미널에서 **curl** 을 사용하여 서버에 요청을 보내면 전송되는 요청 메시지와 서버에서 돌아오는 응답메시지를 터미널에서 확인할 수 있다. 이때 클라이언트는 터미널이 된다.


```
$ curl -v localhost:3000
```


서버는 Node.js를 사용해 간단하게 구현해보았다. 

```js
const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'content-type': 'text/html'
  });

  res.write('<div>본문</div>');
  res.end('<div>끝</div>',() => {
    console.log('전송완료');
  });
});

server.listen(3000);
```

<br>

**요청(Request) 메시지**

시작줄에서 **GET** 요청임을 보여준다. 그 다음 줄부터 3줄의 헤더가 `:`를 기준으로 값과 이름 쌍으로 명시되어있고 헤더의 끝을 나타내는 빈줄이 있다. 본문은 전달하지 않았다.

```
> GET / HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/7.54.0
> Accept: */*
>
```

**응답(response) 메시지**

시작줄에는 HTTP 버전번호(HTTP/1.1) 상태코드와 사유(200 OK)가 적혀있다. `res.writeHead`로 상태코드 200을 명시했기 때문이다. 같은이유로 헤더 필드 영역에는 `content-type: text/html` 가 적혀있다. 헤더의 끝을 뜻하는 빈줄 이후 본문에 서버에서 전송한 데이터가 들어있다.

```
< HTTP/1.1 200 OK
< content-type: text/html
< Date: Thu, 03 Oct 2019 09:48:11 GMT
< Connection: keep-alive
< Transfer-Encoding: chunked
<
<div>본문</div>
<div>끝</div>
```


----

### 참고
- HTTP 완벽가이드
- https://developer.mozilla.org/en-US/docs/Web/HTTP