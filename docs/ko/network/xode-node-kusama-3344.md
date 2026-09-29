# XODE 노드 (Kusama 3344)

::: warning 더 이상 사용되지 않음
XODE는 Kusama(para ID 3344)에서 Polkadot 릴레이 체인(para ID 3417)으로 이전했으므로, 이 가이드는 참고용으로만 남겨 두었습니다. 지금 노드를 실행하려면 [XODE 노드](/ko/network/xode-node) 가이드를 따르세요. 자세한 내용은 [Kusama에서 Polkadot으로](/ko/introduction/xode-blockchain#from-kusama-to-polkadot)를 참조하세요.
:::

## 요구 사항

* 8코어(Core i9 또는 동급)  
* 32 GB RAM  
* 1 TB SSD 드라이브  
* Ubuntu 24 운영 체제

## 1단계: xode-node 바이너리 다운로드

### x86-64

```bash
curl -L "https://drive.usercontent.google.com/download?id=10zStcLL08V3hiCy507CBXMCKCb2VFQsM&confirm=xxx" -o xode-node
```

### aarch64

```bash
curl -L "https://drive.usercontent.google.com/download?id=1S8uBEuaZhSfJMCwKvbzWXAw_7J4EgPVE&confirm=xxx" -o xode-node
```

## 2단계: Xode Blockchain Kusama 3344 체인스펙(chainspec) 다운로드

```bash
wget --no-check-certificate 'https://docs.google.com/uc?export=download&id=19C8s1MdVubYjMFiLBmvwhWxTK6bPeyve' -O raw-xode-node-chainspec.json
```

## 3단계: xode-node 바이너리를 실행 가능하게 만들기

```bash
chmod +x xode-node
```

## 4단계: xode 기본 경로(base path) 디렉터리 만들기

```bash
mkdir xode
```

## 5단계: 셸 스크립트 만들기

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
--name "xode-node"
```

### 설명

* /home/ubuntu/xode-node : xode-node 바이너리의 경로를 지정합니다  
* \--chain /home/ubuntu/raw-xode-node-chainspec.json 이 인수는 체인 사양 파일이 /home/ubuntu/raw-xode-node-chainspec.json에 있음을 명령에 알려줍니다   
* \--base-path /home/ubuntu/xode : 이 인수는 데이터베이스가 저장될 디렉터리 경로를 받습니다. 이 예시에서는 데이터가 /home/ubuntu/xode에 저장됩니다  
* \--rpc-port 9944 : 노드가 실행될 포트를 지정합니다(기본값: 9944).  
* \--pruning archive : 노드가 아카이브(archive) 모드로 실행되도록 지정합니다. 대신 풀 노드(full node)로 실행하려면 이 인수를 제거하면 됩니다.  
* \--telemetry-url "wss://telemetry.polkadot.io/submit/ 0" : 텔레메트리(telemetry)에 노드가 표시되도록 합니다.  
* \--name "your-node-name” :텔레메트리에 표시될 사용자 지정 노드 이름을 설정합니다. "your-node-name”을 원하는 이름으로 바꾸세요. 예: \--name "xode-node”

### RPC를 활성화하려면 다음 줄을 추가하세요.

```bash
--rpc-external \
--unsafe-rpc-external \
--rpc-methods safe \
--rpc-cors '*'
```

### RPC가 활성화된 풀 노드 실행 전체 예시.

```bash
#!/bin/bash
/home/ubuntu/xode-node \
--chain /home/ubuntu/raw-xode-node-chainspec.json \
--base-path /home/ubuntu/xode \
--rpc-port 9944 \
--pruning archive \
--rpc-external \
--unsafe-rpc-external \
--rpc-methods safe \
--rpc-cors '*' \
--telemetry-url "wss://telemetry.polkadot.io/submit/ 0" \
--name "xode-node"
```

## 6단계: xode-node.sh를 실행 가능하게 만들기

```bash
chmod +x xode-node.sh
```

## 7단계: 실행되는지 테스트하기

```bash
./xode-node.sh
```

## 8단계: 서비스 만들기

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

## 9단계: 서비스 활성화

```bash
sudo systemctl enable xode-collator.service
```

## 10단계: 서비스 시작

```bash
sudo systemctl start xode-collator.service
```

## 11단계: 30초 동안 기다린 후 서비스가 실행 중인지 확인

```bash
journalctl -f -u xode-collator
```

## 12단계: 텔레메트리 사이트에서 노드 확인

[https://telemetry.polkadot.io/\#/0x28cc1df52619f4edd9f0389a7e910a636276075ecc429600f1dd434e281a04e9](https://telemetry.polkadot.io/#/0x28cc1df52619f4edd9f0389a7e910a636276075ecc429600f1dd434e281a04e9) 
