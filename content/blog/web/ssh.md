---
title: "SSH 기본개념 & SSH 깃헙 연결하기"
date: "2019-10-29 12:58:00 +0900"
description: ssh에 대한 기본개념과 ssh github 사용방법
categories: 네트워크
tags: ["ssh", "네트워크"]
---

![secure](./secure_unsplash.jpg)
> https://unsplash.com/@matthewhenry

<br>

**SSH**는 무엇이고 어떻게 사용하며 어떤 부분이 편리한지에 대해 알아본다.

- SSH 에 대한 더 많은 정보는 [링크](https://www.ssh.com/ssh/command/)를 참고하자.
- 아래 내용은 macOS환경에 대해서만 다룬다. 일반적인 개발서버는 리눅스환경이기 때문에 조금 더 많은 설정(open-ssh 설치를 포함)이 필요할 수 있다. 하지만 맥락은 크게 다르지 않다.

<br>

## SSH 소개

**SSH**(**S**ecure **Sh**ell)는 원격지 호스트 컴퓨터에 접속하기 위해 사용되는 인터넷 프로토콜이다. 뜻 그대로 보안 셸이다. 기존의 유닉스 시스템 셸에 원격 접속하기 위해 사용하던 텔넷은 암호화가 이루어지지 않아 계정 정보가 탈취될 위험이 높으므로, 여기에 암호화 기능을 추가하여 1995년에 나온 프로토콜이다.(SSH는 암호화 기법을 사용하기 때문에, 통신이 노출된다고 하더라도 이해할 수 없는 암호화된 문자로 보인다.) 셸로 원격 접속을 하는 것이므로 기본적으로 CLI 상에서 작업을 하게 된다. 기본 포트는 22번이다.

<br>

### SSH 키(key)
![how-does-ssh-protocol-work-920x272-SWKuhzNV](https://user-images.githubusercontent.com/16536810/59079319-2720dc80-891e-11e9-970e-467662d9465a.png)

<br>

서버에 접속할때 비밀번호 대신 key를 제출하는 방식이다. 비밀번호보다 높은 수준의 보안요건을 필요로 할때 사용된다.

<br>

**동작하는 방식**

SSH 키(Key)는 공개키(public key)와 비공개키(private key)로 이루어지는데 이 두개의 관계를 이해하는 것이 SSH Key를 이해하는데 핵심이다.([이전 게시물](/web/암호화) 참고) 키를 생성하면 공개키와 비공개키가 만들어진다. 이 중에 비공개키는 로컬 머신에 위치해야 하고, 공개키는 리모트 머신에 위치해야 한다.(로컬 머신은 SSH Client, 원격 머신은 SSH Server가 설치된 컴퓨터를 의미한다) SSH 접속을 시도하면 SSH Client가 로컬 머신의 비공개키와 원격 머신의 비공개키를 비교해서 둘이 일치하는지를 확인한다. 

<br>

### 주요 기능

SSH의 주요 기능은 다음과 같다.

- 보안 접속을 통한 rsh, rcp, rlogin, rexec, telnet, ftp 등을 제공.
- IP spoofing (IP스푸핑, 아이피 위/변조 기법중 하나)을 방지하기 위한 기능을 제공.
- X11 패킷 포워딩 및 일반적인 TCP/IP 패킷 포워딩을 제공.

<br>

## 사용방법

### SSH Key 만들기

macOS는 유닉스개열의 운영체제로 **OpenSSH**를 기본으로 포함하고 있기 대문에 **ssh-keygen**을 사용해 간단히 key 를 생성할 수 있다.

```sh
$ ssh-keygen -t rsa
# -t옵션으로 어떤 타입의 암호화 방식을 사용할 것인지 지정할 수 있다.(default가 rsa)
```

이제 어디에 key를 생성하여 저장할지를 묻는다. 엔터를 누르면 기본경로에 저장된다. 다른 경로를 원한다면 입력해주면 된다.

```
Generating public/private rsa key pair.
Enter file in which to save the key (기본경로):
```

다음은 ssh를 사용할때 비밀번호를 사용할지를 묻는다. 당연히 비밀번호를 설정하면 설정하지 않는것 보단 더 안전하다. 이 과정이 끝나면 key가 생성된다.

```
Created directory '경로'
Enter passphrase (empty for no passphrase):
```

key를 확인하고 싶다면 저장한 경로로 이동하면 된다.

```
$ ls -al /경로/

total 16
drwx------   4 user  staff   128  6  7 15:07 .
drwxr-xr-x+ 31 user  staff   992  6  7 15:05 ..
-rw-------   1 user  staff  1876  6  7 15:07 id_rsa
-rw-r--r--   1 user  staff   403  6  7 15:07 id_rsa.pub
```

이떄 `id_rsa`가 개인키 `id_rsa.pub`가 공개키이다. 권한을 보면 개인키는 사용자만이 읽고 쓸 수 있고(600), 공개키는 다른 사용자도 읽을 수 있는 권한(644)을 가지고있다. 접속하고자 하는 컴퓨터에 공개키을 등록해 놓으면, 이후 SSH로 접근할때 개인키와 비교하여 인증한다. 

```sh
# scp를 통해 원격컴퓨터에 공개키를 전송(다른방법도 상관없다)
$ scp [경로]/id_rsa.pub user@sever_ip:id_rsa.pub
```

<br>


![share_remote](https://user-images.githubusercontent.com/16536810/59088110-775d6600-8941-11e9-8e10-33cd1b9ecef4.png)

>  macOS는 기본적으로 SSH Server가 설치되어있다. macOS를 서버로 사용하고싶다면 **시스템환경 > 공유** 에서 원격로그인을 체크하면 외부에서 SSH를 통해 접근 가능하다.

<br>

이제 원격컴퓨터에서는 전달받은 `id_rsa.pub`를 `authorized_keys`파일에 등록한다. 만약 `.ssh`폴더가 없다면 새로 만들고 `chmod 700`로 설정해준다. (중요한 정보가 저장되어있기 때문에 소유자 외에 접근이 불가능하게 해줘야한다)

```sh
# 원격컴퓨터에 authorized_keys에 리다이렉션(추가) 해준다.
$ cat $HOME/id_rsa.pub >> $HOME/.ssh/authorized_keys
```

이제 SSH를 통해 접속 가능하다.

```sh
$ ssh user@sever_ip
# -v 옵션을 사용하면 디버그 모드로 접속과정의 로그를 확인할 수 있다. 
```

만약 개인키(`id_rsa`)의 위치를 변경한다면, `-i` 옵션으로 접속하면 된다.

```sh
$ ssh -i [변경된 경로] user@sever_ip
```

<br>

### Github에서 SSH사용하기

github에 ssh로 연결해두면 비밀번호 없이 연동할 수 있다. 물론 ssh키에 비밀번호(passphrase)를 설정한 경우에는 입력해야한다. 미리 만들어둔 공개키를 github 계정에 추가해주면 된다. 위 개념을 익혔다면 별도의 가이드 없이도 손쉽게 가능할것이다.

----

### 참고
- [ssh 커멘드](https://www.ssh.com/ssh/command/)