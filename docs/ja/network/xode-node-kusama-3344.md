# XODE ノード（Kusama 3344）

::: warning 現在は使用されていません
XODE は Kusama（para ID 3344）から Polkadot リレーチェーン（para ID 3417）へ移行したため、このガイドは参考用として残しています。現在ノードを実行する場合は、[XODE ノード](/ja/network/xode-node) のガイドに従ってください。詳しくは [Kusama から Polkadot へ](/ja/introduction/xode-blockchain#from-kusama-to-polkadot) を参照してください。
:::

## 要件

* 8 コア（Core i9 または同等品）  
* 32 GB RAM  
* 1 TB SSD ドライブ  
* Ubuntu 24 オペレーティングシステム

## STEP 1：xode-node バイナリのダウンロード

### x86-64

```bash
curl -L "https://drive.usercontent.google.com/download?id=10zStcLL08V3hiCy507CBXMCKCb2VFQsM&confirm=xxx" -o xode-node
```

### aarch64

```bash
curl -L "https://drive.usercontent.google.com/download?id=1S8uBEuaZhSfJMCwKvbzWXAw_7J4EgPVE&confirm=xxx" -o xode-node
```

## STEP 2：Xode Blockchain Kusama 3344 のチェーンスペックをダウンロードする

```bash
wget --no-check-certificate 'https://docs.google.com/uc?export=download&id=19C8s1MdVubYjMFiLBmvwhWxTK6bPeyve' -O raw-xode-node-chainspec.json
```

## STEP 3：xode-node バイナリを実行可能にする

```bash
chmod +x xode-node
```

## STEP 4：xode のベースパスディレクトリを作成する

```bash
mkdir xode
```

## STEP 5：シェルスクリプトを作成する

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

### 説明

* /home/ubuntu/xode-node：xode-node バイナリの場所を指定します  
* \--chain /home/ubuntu/raw-xode-node-chainspec.json：この引数は、チェーンスペックファイルが /home/ubuntu/raw-xode-node-chainspec.json にあることをコマンドに伝えます   
* \--base-path /home/ubuntu/xode：この引数には、データベースを保存するディレクトリパスを指定します。この例では、データは /home/ubuntu/xode に保存されます  
* \--rpc-port 9944：ノードが使用するポートを指定します（デフォルト：9944）。  
* \--pruning archive：ノードをアーカイブモードで実行することを指定します。代わりにフルノードとして実行したい場合は、この引数を削除してください。  
* \--telemetry-url "wss://telemetry.polkadot.io/submit/ 0"：ノードをテレメトリーに表示させます。  
* \--name "your-node-name”：テレメトリーに表示されるカスタムノード名を設定します。"your-node-name” を希望する名前に置き換えてください（例：\--name "xode-node”）

### RPC を有効にするには、次の行を追加します。

```bash
--rpc-external \
--unsafe-rpc-external \
--rpc-methods safe \
--rpc-cors '*'
```

### RPC を有効にしたフルノードを実行する完全な例です。

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

## STEP 6：xode-node.sh を実行可能にする

```bash
chmod +x xode-node.sh
```

## STEP 7：動作するかテストする

```bash
./xode-node.sh
```

## STEP 8：サービスを作成する

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

## STEP 9：サービスを有効化する

```bash
sudo systemctl enable xode-collator.service
```

## STEP 10：サービスを開始する

```bash
sudo systemctl start xode-collator.service
```

## STEP 11：30 秒待ってから、サービスが実行されているか確認する

```bash
journalctl -f -u xode-collator
```

## STEP 12：テレメトリーサイトでノードを確認する

[https://telemetry.polkadot.io/\#/0x28cc1df52619f4edd9f0389a7e910a636276075ecc429600f1dd434e281a04e9](https://telemetry.polkadot.io/#/0x28cc1df52619f4edd9f0389a7e910a636276075ecc429600f1dd434e281a04e9) 
