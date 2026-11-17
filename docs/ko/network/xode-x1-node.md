# XODE X1 노드

이 단계는 자체 검증자를 가진 독립형 Substrate 체인인 XODE X1의 노드를 실행합니다. [XODE 노드](/ko/network/xode-node)와 달리 Polkadot 릴레이 체인에 연결되지 않습니다.

| 속성 | 값 |
|------|-----|
| 체인 | Xode (`xode`) |
| 토큰 | XON, 소수점 12자리 |
| SS58 접두사 | 280 |
| 블록 시간 | 1초 |
| EVM 체인 ID | 34170 |

노드 바이너리와 체인 스펙은 [xode-solochain-release 릴리스 페이지](https://github.com/D2-Xode/xode-solochain-release/releases)에 게시됩니다. 아래 명령은 v0.1.0을 다운로드합니다. 더 새로운 릴리스를 사용하려면 `v0.1.0`을 해당 태그로 바꾸세요.

## 호스트에서 XODE X1 노드 직접 실행하기

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
mkdir data
```

STEP 5: 셸 스크립트 만들기:

```bash
nano launch-node.sh
```

```bash
#!/bin/bash
BASE_DIR=/home/ubuntu

$BASE_DIR/xode-solochain-node \
--chain $BASE_DIR/xode-mainnet-raw.json \
--base-path $BASE_DIR/data \
--rpc-port 9944 \
--telemetry-url "wss://telemetry.polkadot.io/submit/ 0" \
--name "xode-x1-node-name"
```

파일을 `/home/ubuntu`가 아닌 다른 곳에 다운로드했다면 `BASE_DIR`을 바꾸고, `--name`에는 텔레메트리에 표시될 노드 이름을 입력하세요.

STEP 6: launch-node.sh를 실행 가능하게 만들기

```bash
chmod +x launch-node.sh
```

STEP 7: 실행되는지 테스트

```bash
./launch-node.sh
```

로그에 노드가 블록을 가져오는 모습이 보여야 합니다. 다음 단계로 넘어가기 전에 `Ctrl+C`로 중지하세요.

STEP 8: 서비스 만들기:

```bash
sudo nano /etc/systemd/system/xode-solochain.service
```

```ini
[Unit]
Description=Xode X1 Node
[Service]
ExecStart=/home/ubuntu/launch-node.sh
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

## XODE X1 검증자 실행하기

검증자는 블록을 생성하고 최종 확정합니다. 위의 노드와 비교해 고정된 노드 키, `--validator` 플래그, 그리고 온체인에 등록한 세션 키 세 가지가 추가됩니다. 매 세션(1시간)마다 본드와 위임된 스테이크의 합이 가장 높은 후보들이 검증자가 됩니다.

본드할 최소 100 XON과 수수료용 XON을 보유한 계정이 필요합니다. 아래 단계는 노드와 같은 최소 사양을 갖춘 머신에서 검증자를 처음부터 설정합니다.

STEP 1: xode-solochain-node 바이너리 다운로드

```bash
curl -L "https://github.com/D2-Xode/xode-solochain-release/releases/download/v0.1.0/xode-solochain-node" -o xode-solochain-node
```

STEP 2: 체인 스펙 다운로드

```bash
curl -L "https://github.com/D2-Xode/xode-solochain-release/releases/download/v0.1.0/xode-mainnet-raw.json" -o xode-mainnet-raw.json
```

STEP 3: 바이너리를 실행 가능하게 만들기

```bash
chmod +x xode-solochain-node
```

STEP 4: Polkadot 바이너리 다운로드

`polkadot` 바이너리는 노드 키를 생성하는 데에만 사용합니다.

```bash
curl -L "https://github.com/paritytech/polkadot-sdk/releases/download/polkadot-stable2512-2/polkadot" -o polkadot
chmod +x polkadot
```

STEP 5: 노드 키 생성

```bash
./polkadot key generate-node-key --file /home/ubuntu/node-key
```

이 파일에는 노드의 네트워크 개인 키가 들어 있습니다. 명령은 다른 노드가 내 노드를 찾을 때 쓰는 피어 ID를 출력합니다. 피어 ID를 기록해 두고, 파일은 비공개로 보관하며 잃어버리지 마세요. 노드는 시작할 때마다 같은 키가 필요합니다.

STEP 6: 실행 스크립트 만들기:

```bash
nano launch-node.sh
```

```bash
#!/bin/bash
BASE_DIR=/home/ubuntu

$BASE_DIR/xode-solochain-node \
--chain $BASE_DIR/xode-mainnet-raw.json \
--base-path $BASE_DIR/data \
--rpc-port 9944 \
--validator \
--node-key $(cat $BASE_DIR/node-key) \
--telemetry-url "wss://telemetry.polkadot.io/submit/ 0" \
--name "xode-x1-validator-name"
```

파일을 `/home/ubuntu`가 아닌 다른 곳에 다운로드했다면 `BASE_DIR`을 바꾸고, `--name`에는 검증자 이름을 입력하세요. 검증자에는 `--rpc-external`을 추가하지 마세요. RPC는 해당 머신에서만 접근할 수 있어야 합니다.

STEP 7: launch-node.sh를 실행 가능하게 만들기

```bash
chmod +x launch-node.sh
```

STEP 8: 서비스 만들기:

```bash
sudo nano /etc/systemd/system/xode-solochain.service
```

```ini
[Unit]
Description=Xode X1 Validator
[Service]
ExecStart=/home/ubuntu/launch-node.sh
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

다음 단계로 넘어가기 전에 노드 동기화가 끝날 때까지 기다리세요.

STEP 12: 세션 키 생성

검증자 머신에서 실행하세요:

```bash
curl -H "Content-Type: application/json" \
  -d '{"id":1, "jsonrpc":"2.0", "method":"author_rotateKeys", "params":[]}' \
  http://localhost:9944
```

응답의 `result`가 세션 키이며, `0x`로 시작하는 긴 16진수 문자열입니다. 대응하는 개인 키는 노드의 베이스 경로에 저장됩니다.

STEP 13: 세션 키를 온체인에 등록

[XODE X1에 연결된 Polkadot-JS Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fsolochain.xode.net#/explorer)를 여세요(RPC 엔드포인트 `wss://solochain.xode.net`).

**Developer → Extrinsics**로 이동해 검증자 계정으로 다음을 제출하세요:

* `session.setKeys`: `keys`에는 STEP 12의 16진수 문자열을, `proof`에는 `0x`를 입력

STEP 14: 후보 등록 및 본드

같은 계정으로 다음을 제출하세요:

1. `xodeStaking.registerCandidate`
2. `xodeStaking.bondCandidate`: `newBond`는 최소 100 XON. 최소 단위로 입력하므로 100 XON은 `100000000000000`입니다(소수점 12자리).

다음 세션이 시작될 때 계정이 검증자 집합에 들어갈 수 있습니다. 검증자가 되면 노드 로그에 직접 생성한 블록을 준비하고 가져오는 내용이 표시됩니다.

## 포트

| 포트 | 용도 |
|------|------|
| 30333 | p2p. 다른 노드가 접속할 수 있도록 열어 두세요. |
| 9944 | Substrate JSON-RPC (HTTP 및 WebSocket) |
| 9615 | Prometheus 메트릭 |

RPC는 기본적으로 localhost에서만 수신합니다. 다른 머신에서 접속하려면 스크립트에 `--rpc-external`과 `--rpc-cors all`을 추가하고, 이 경우 방화벽이나 프록시 뒤에 두세요.

노드가 실행되면 [Polkadot-JS Apps](https://polkadot.js.org/apps/#/explorer?rpc=ws://localhost:9944)로 연결할 수 있습니다.
