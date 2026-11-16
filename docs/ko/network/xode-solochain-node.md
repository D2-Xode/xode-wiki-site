# XODE 솔로체인 노드

이 단계는 자체 검증자를 가진 독립형 Substrate 체인인 XODE 솔로체인의 노드를 실행합니다. [XODE 노드](/ko/network/xode-node)와 달리 Polkadot 릴레이 체인에 연결되지 않습니다.

| 속성 | 값 |
|------|-----|
| 체인 | Xode (`xode`) |
| 토큰 | XON, 소수점 12자리 |
| SS58 접두사 | 280 |
| 블록 시간 | 1초 |
| EVM 체인 ID | 34170 |

노드 바이너리와 체인 스펙은 [xode-solochain 릴리스 페이지](https://github.com/D2-Xode/xode-solochain-release/releases)에 게시됩니다. 아래 명령은 v0.1.0을 다운로드합니다. 더 새로운 릴리스를 사용하려면 `v0.1.0`을 해당 태그로 바꾸세요.

## 호스트에서 XODE 솔로체인 노드 직접 실행하기

최소 AWS 인스턴스 유형: t2.medium

* vCPU: 2
* RAM: 4.0GB
* 스토리지: 500GB
* 운영체제: Ubuntu 22.04 이상, x86-64

STEP 1: xode-solochain-node 바이너리 다운로드

```bash
curl -L "https://github.com/D2-Xode/xode-solochain-release/releases/download/v0.1.0/xode-solochain-node" -o xode-solochain-node
```

STEP 2: 체인 스펙 다운로드

```bash
curl -L "https://github.com/D2-Xode/xode-solochain-release/releases/download/v0.1.0/xode-mainnet-raw.json" -o xode-mainnet-raw.json
```

STEP 3: 바이너리를 실행 가능하게 만들고 실행되는지 확인

```bash
chmod +x xode-solochain-node
./xode-solochain-node --version
```

STEP 4: 베이스 경로 디렉터리 만들기

```bash
mkdir xode-solochain
```

STEP 5: 셸 스크립트 만들기:

```bash
nano xode-solochain-node.sh
```

```bash
#!/bin/bash
/home/ubuntu/xode-solochain-node \
--chain /home/ubuntu/xode-mainnet-raw.json \
--base-path /home/ubuntu/xode-solochain \
--rpc-port 9944 \
--pruning archive \
--name "xode-solochain-node-name"
```

STEP 6: xode-solochain-node.sh를 실행 가능하게 만들기

```bash
chmod +x xode-solochain-node.sh
```

STEP 7: 실행되는지 테스트

```bash
./xode-solochain-node.sh
```

로그에 노드가 블록을 가져오는 모습이 보여야 합니다. 다음 단계로 넘어가기 전에 `Ctrl+C`로 중지하세요.

STEP 8: 서비스 만들기:

```bash
sudo nano /etc/systemd/system/xode-solochain.service
```

```ini
[Unit]
Description=Xode Solochain Node
[Service]
ExecStart=/home/ubuntu/xode-solochain-node.sh
Restart=always
RestartSec=120
[Install]
WantedBy=multi-user.target
```

STEP 9: 서비스 활성화

```bash
sudo systemctl enable xode-solochain.service
```

STEP 10: 서비스 시작

```bash
sudo systemctl start xode-solochain.service
```

STEP 11: 30초 기다린 후 서비스가 실행 중인지 확인

```bash
journalctl -f -u xode-solochain
```

## 포트

| 포트 | 용도 |
|------|------|
| 30333 | p2p. 다른 노드가 접속할 수 있도록 열어 두세요. |
| 9944 | Substrate JSON-RPC (HTTP 및 WebSocket) |
| 9615 | Prometheus 메트릭 |

RPC는 기본적으로 localhost에서만 수신합니다. 다른 머신에서 접속하려면 스크립트에 `--rpc-external`과 `--rpc-cors all`을 추가하고, 이 경우 방화벽이나 프록시 뒤에 두세요.

노드가 실행되면 [Polkadot-JS Apps](https://polkadot.js.org/apps/#/explorer?rpc=ws://localhost:9944)로 연결할 수 있습니다.
