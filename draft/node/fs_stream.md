---
title: "Node.js 스트림(Stream)"
date: "2019-10-05 12:58:00 +0900"
categories: Stream
tags: ["Node.js", "stream"]
---


![stream](./stream_unsplash.jpg)
> https://unsplash.com/@pmpablo

<br>

### 스트림(Stream)이 무엇?

스트림은 Node.js에서 스트리밍 데이터 작업을 위한 추상 인터페이스이다. Node.js에서 파일을 처리하는 다른 방법으로는 버퍼가 있는데, 버퍼의 경우 리소스로 부터 오는 모든 데이터를 읽어들인 후 콜백에 전달한다. 

만약 큰 파일을 읽어야 하는 경우 파일과 같은 크기의 버퍼를 만들어야 하기 때문에 메모리 효율이 좋지 않다. 

또한 V8의 버퍼는 0x3FFFFFF바이트로 대략 1GB보다 클 수 없다. 스트림의 경우 데이터가 버퍼에 수집될때 까지 기다리지 않고, 작은 덩어리(chunk)로 나눠 전달하기 때문에 읽는 즉시 처리할 수 있다. 

유튜브와 같은 동영상 스트리밍 역시 같은 방식으로 생각할 수 있는데, 커다란 동영상을 작은 덩어리로 나눠 내려 받는 즉시 시청이 가능해 (한꺼번에 모두 다운받아 시청하는 방법에 비하여) 시간의 효율도 좋다.

<br>

#### 몇가지 예시

거의 모든 Node.js 애플리케이션은 어떤 방식으로든 스트림을 사용한다. 다음은 HTTP 서버를 구현하는 Node.js 애플리케이션에서 스트림을 사용하는 예이다. **읽기 가능한 스트림(Readable)**을 만들어 HTTP 응답으로 전달하였다. `res`역시 스트림이다.

```js
const fs = require('fs');
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'content-type': 'text/html'
  });
  const html = fs.createReadStream('./home.html');
  html.pipe(res);
});

server.listen(3000);
```

대표적인 자동화 도구인 Gulp의 플러그인과 React 서버사이드 렌더링을 적용할때도 스트림을 사용한다. 이때 사용되는 스트림은 **읽기 쓰기가 모두 가능하며 전송 과정에서 데이터를 변환하는 스트림(Transform)**이다.

**Gulp**

```js
const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');

exports.default = () => (
  gulp.src('src/**/*.css')
    .pipe(autoprefixer())
    .pipe(gulp.dest('dist'));
);
```

**React**

```js
import { renderToNodeStream } from 'react-dom/server';

app.get('/', (req,res) => { 
  const componentStream = renderToNodeStream(AppComponent);
  componentStream.pipe(res);
});

```
<br>

## API

스트림 모듈을 사용하는 방법:

```js
const stream = require('stream');
```

<br>

Node.js가 제공하는 스트림들은 다음 네 가지 타입 중 하나이다.

- **Readable** : 읽기 가능한 스트림이다. (`fs.createReadStream()`)
- **Writable** : 쓰기가능한 스트림이다. (`fs.createWriteStream()`)
- **Duplex** : 읽기와 쓰기가 모두 가능한 스트림이다. (예를 들어 `net.Socket`)
- **Transform** : 읽기와 쓰기가 모두 가능하며, 데이터 변환이 가능한 특별한 종류의 스트림이다. (예를들어 `zlib`, `crypto`).

> 모든 스트림은 EventEmitter의 인스턴스이다. Readable 스트림은 EventEmiter API를 사용해 스트림에서 데이터를 읽을 수 있는지 여부, 데이터읽기 종료, 에러 등의 여부를 알린다.

<br>

#### 객체모드

스트림은 문자열이나 `Buffer` 객체 뿐 아니라 다른 타입과 함께도 작동 가능하다. 이러한 스트림은 **객체 모드**로 작동하는 것으로 간주하며, 스트림을 작성할때 `objectMode` 옵션을 사용해 전환 가능하다. 

- **바이너리 모드** : 데이터가 버퍼 또는 문자열과 같은 덩어리(chunk)형태로 스트리밍 되는 모드이다.
- **객체 모드** : 데이터를 일련의 객체들로 취급된다. 기존의 스트림을 객체모드로 전환하는 것은 안전하지 않다.

<hr>

### Readable

Readable 스트림은 소비될(consumed) 데이터 소스를 나타낸다. Readable 스트림은 **흐름(flowing)**, **멈춤(paused, non-flowing)** 두 가지 모드로 동작한다. 이러한 모드는 객체모드 여부와는 상관없으며 멈춤 혹은 흐름 모드와 관계없이 객체모드거나 아닐 수 있다.

- 흐름모드에서는 내부 시스템이 자동으로 데이터를 읽고 이벤트를 사용하여 가능한 빨리 응용프로그램에 전달한다.
- 멈춤 모드에서는 `readable.read()` 메소드를 호출해 데이터를 읽는다. `readable.read()` 메소드는 멈춤모드에서 작동하는 읽기 가능한 스트림에서만 명시적으로 호출한다. 흐름모드에서 `readable.read()`는 내부 버퍼가 완전히 비워 질 때까지 자동으로 호출된다.

<br>

모든 Readable 스트림은 멈춤모드에서 시작되지만, 다음 중 하나의 방법을 통해 흐름모드로 전환된다.

- `data` 이벤트 핸들러를 추가함
- `stream.resume()` 메소드를 호출함
- `stream.pipe()` 메소드를 호출하여 `Writable` 스트림에 데이터를 보냄


<br>

#### 흐름모드, 멈춤모드 비교

`process.stdin`은 표준 입력 메소드로 Readable 스트림이다. `while`루프를 사용하며 내부 버퍼에 더 이상 데이터가 없을때 까지 반복한다. `read()`메소드는 `null`을 반환한다.

<br>

**readableStdin.js**
```js
const myReadableStream = process.stdin;

myReadableStream.on('readable', () => {
  let chunk;
  while(null !== (chunk = myReadableStream.read())){
    console.log(`${chunk.toString()} (${chunk.length})`);
  }
})
.on('end', () => process.stdout.write('End of stream'));
```

**textFile**
```txt
I'am curious what will happen.
```

파이프 연산자를 사용해 textFile을 출력하여 `readableStdin.js`의 표준 입력으로 리다이렉션하면, 예상대로 작동하는것을 확인할 수 있다. 스트리밍 인터페이스가 언어와 관계없이 프로그램간 통신을 할 수 있게 해주는 보편적인 인터페이스임을 보여준다.

```
$ cat textFile | node readableStdin.js

---------

I'am curious what will happen.
 (31)
End of stream
```

별도로 멈춤상태라고 명시되어있지 않은 스트림에 `data`리스너를 등록하면 **흐름모드**로 전환된다. 흐름모드애서는 `read()`를 사용해 데이터를 받지 않고 데이터가 도착하자 마자 해당 리스너에 전달된다. 이 코드를 흐름모드로 작성하면 다음과 같다.

```js
const myReadableStream = process.stdin;

myReadableStream.on('data', chunk => {
  console.log(`${chunk.toString()} (${chunk.length})`);
})
.on('end', () => process.stdout.write('End of stream'));
```

`resume()`, `pause()` 메소드를 사용하면 수동으로 두 모드를 전환 할 수 있다.

```js
if(myReadableStream.isPaused()) myReadableStream.resume();
```

<hr>

### Writable

`Writable` 스트림은 데이터의 목적지를 나타낸다.

WritableStream.close

WritableStream.drain


finish

end

#### 백프레셔

Node.js 스트림에서 스트림이 데이터를 읽어들이는 속도보다 더 빠르게 데이터를 쓸 경우 

<br>

### Duplex & Transform




```js
const { Duplex } = require('stream');

class MyDuplex extends Duplex {
  constructor(source, options) {
    super(options);
    this._source = source;
  }

  _write(chunk, encoding, callback) {
    // The underlying source only deals with strings
    if (Buffer.isBuffer(chunk)) chunk = chunk.toString();
    this._source.writeSomeData(chunk);
    callback();
  }

  _read(size) {
    this._source.fetchSomeData(size, (data, encoding) => {
      this.push(Buffer.from(data, encoding));
    });
  }
}
```