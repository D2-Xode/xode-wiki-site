# XODE 노드

Polkadot 릴레이 체인(para ID 3417)에서 XODE 노드를 실행하는 방법입니다.

노드 바이너리와 런타임 업그레이드는 [xode-blockchain 릴리스 페이지](https://github.com/D2-Xode/xode-blockchain/releases)에 게시됩니다. 아래 명령은 v0.1.2.14를 다운로드합니다. 더 새로운 릴리스를 사용하려면 `v0.1.2.14`를 해당 태그로 바꾸세요.

## 호스트에서 직접 XODE 노드 실행하기

최소 AWS 인스턴스 유형: t2.medium	

* vCPU: 2  
* RAM: 4.0GB  
* 스토리지: 500GB  
* 운영 체제: Ubuntu 22.0 이상

1단계: xode-node 바이너리 다운로드

### x86-64

```bash
curl -L "https://github.com/D2-Xode/xode-blockchain/releases/download/v0.1.2.14/xode-node" -o xode-node
```

### Aarch64

```bash
curl -L "https://github.com/D2-Xode/xode-blockchain/releases/download/v0.1.2.14/xode-node-aarch64" -o xode-node
```

2단계: xode 체인스펙(chainspec) 다운로드

```bash
wget --no-check-certificate 'https://github.com/D2-Xode/xode-blockchain/releases/download/v0.1.2.14/polkadot_raw_chain_spec.json' -O raw-xode-node-chainspec.json
```

3단계: xode-node 바이너리를 실행 가능하게 만들기

```bash
chmod +x xode-node
```

4단계: xode 기본 경로(base path) 디렉터리 만들기

```bash
mkdir xode
```

5단계: 셸 스크립트 만들기:

```bash
nano xode-node.sh
```

```bash
#!/bin/bash
/home/ubuntu/xode-node \
--chain /home/ubuntu/raw-xode-node-chainspec.json \
--base-path /home/ubuntu/xode \
--rpc-port 9944 \
--pruning archive \
--telemetry-url "wss://telemetry.polkadot.io/submit/ 0" \
--name "xode-node-name"
```

6단계: xode-node.sh를 실행 가능하게 만들기

```bash
chmod + xode-node.sh
```

7단계: 실행되는지 테스트하기

```bash
./xode-node.sh
```

8단계: 서비스 만들기:

```bash
sudo nano /etc/systemd/system/xode-collator.service
```

```ini
[Unit]
Description=Xode Node
[Service]
ExecStart=/home/ubuntu/xode-node.sh
Restart=always
RestartSec=120
[Install]
WantedBy=multi-user.target
```

9단계: 서비스 활성화

```bash
sudo systemctl enable xode-collator.service
```

10단계: 서비스 시작

```bash
sudo systemctl start xode-collator.service
```

11단계: 30초 동안 기다린 후 서비스가 실행 중인지 확인

```bash
journalctl -f -u xode-collator
```

12단계: 텔레메트리(telemetry) 사이트에서 노드 확인

[https://telemetry.polkadot.io/\#/0xb2985e778bb748c70e450dcc084cc7da79fe742cc23d3b040abd7028187de69c](https://telemetry.polkadot.io/#/0xb2985e778bb748c70e450dcc084cc7da79fe742cc23d3b040abd7028187de69c) 

## 컨테이너(Podman)를 사용하여 XODE 노드 실행하기

1단계: Podman 설치

```bash
sudo apt-get update
sudo apt-get -y install podman
```

2단계: xode-node 이미지 다운로드 

### x86-64: [https://hub.docker.com/r/xoderockson/xode-node-x86\_64](https://hub.docker.com/r/xoderockson/xode-node-x86_64%20)

```bash
podman pull docker.io/xoderockson/xode-node-x86_64
```

### aarch64: [https://hub.docker.com/r/xoderockson/xode-node-aarch64](https://hub.docker.com/r/xoderockson/xode-node-aarch64)

```bash
podman pull docker.io/xoderockson/xode-node-aarch64
```

3단계: 컨테이너를 실행하기 전에 먼저 로컬 디렉터리 만들기

이 디렉터리에는 데이터베이스가 저장됩니다(매우 중요)

```bash
mkdir xode
```

### x86-64

```bash
podman run -d --name xode-node --volume ./xode:/xode -it xoderockson/xode-node-x86_64 <NODENAME>
```

### aarch64

```bash
podman run -d --name xode-node --volume ./xode:/xode -it xoderockson/xode-node-aarch64 <NODENAME>
```

4단계: 서비스 활성화

```bash
podman generate systemd --new --name xode-node  > ./xode-node.service
mkdir -p ~/.config/systemd/user
mv ./xode-node.service ~/.config/systemd/user
systemctl --user enable xode-node.service
```

5단계: 자동 로그인 활성화

다음 파일을 편집합니다

```bash
sudo nano /lib/systemd/system/getty@.service
```

다음 줄을

```ini
ExecStart=-/sbin/agetty -o '-p -- \u' --noclear %I $TERM
```

다음과 같이 변경합니다

```ini
ExecStart=-/sbin/agetty --noissue --autologin [USERNAME] %I $TERM
```

## 컨테이너 유지 관리(Podman)

모든 컨테이너 중지

```bash
podman stop --all
```

컨테이너 실행 전 캐시 정리

```bash
podman container prune -f
```

실행 중인 컨테이너 및 이미지 표시

```bash
podman ps
podman images
```
