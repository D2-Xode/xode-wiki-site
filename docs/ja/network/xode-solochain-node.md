# XODE ソロチェーンノード

この手順では、独自のバリデーターを持つスタンドアロンの Substrate チェーンである XODE ソロチェーンのノードを実行します。[XODE ノード](/ja/network/xode-node) と異なり、Polkadot リレーチェーンには接続しません。

| 項目 | 値 |
|------|-----|
| チェーン | Xode（`xode`） |
| トークン | XON、小数点以下 12 桁 |
| SS58 プレフィックス | 280 |
| ブロック時間 | 1 秒 |
| EVM チェーン ID | 34170 |

ノードバイナリとチェーンスペックは [xode-solochain のリリースページ](https://github.com/D2-Xode/xode-solochain-release/releases) で公開されます。以下のコマンドは v0.1.0 をダウンロードします。より新しいリリースを使う場合は、`v0.1.0` をそのタグに置き換えてください。

## ホスト上で XODE ソロチェーンノードを直接実行する

最小 AWS インスタンスタイプ：t2.medium

* vCPU：2
* RAM：4.0GB
* ストレージ：500GB
* オペレーティングシステム：Ubuntu 22.04 以降、x86-64

STEP 1：xode-solochain-node バイナリのダウンロード

```bash
curl -L "https://github.com/D2-Xode/xode-solochain-release/releases/download/v0.1.0/xode-solochain-node" -o xode-solochain-node
```

STEP 2：チェーンスペックのダウンロード

```bash
curl -L "https://github.com/D2-Xode/xode-solochain-release/releases/download/v0.1.0/xode-mainnet-raw.json" -o xode-mainnet-raw.json
```

STEP 3：バイナリを実行可能にし、動作を確認する

```bash
chmod +x xode-solochain-node
./xode-solochain-node --version
```

STEP 4：ベースパス用ディレクトリの作成

```bash
mkdir xode-solochain
```

STEP 5：シェルスクリプトの作成：

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

STEP 6：xode-solochain-node.sh を実行可能にする

```bash
chmod +x xode-solochain-node.sh
```

STEP 7：実行できるかテストする

```bash
./xode-solochain-node.sh
```

ログにノードがブロックをインポートしている様子が表示されます。次の手順に進む前に `Ctrl+C` で停止してください。

STEP 8：サービスの作成：

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

STEP 9：サービスの有効化

```bash
sudo systemctl enable xode-solochain.service
```

STEP 10：サービスの開始

```bash
sudo systemctl start xode-solochain.service
```

STEP 11：30 秒待ってからサービスが実行中か確認する

```bash
journalctl -f -u xode-solochain
```

## ポート

| ポート | 用途 |
|--------|------|
| 30333 | p2p。他のノードが接続できるよう開放してください。 |
| 9944 | Substrate JSON-RPC（HTTP および WebSocket） |
| 9615 | Prometheus メトリクス |

RPC はデフォルトで localhost のみで待ち受けます。他のマシンから接続するには、スクリプトに `--rpc-external` と `--rpc-cors all` を追加し、その場合はファイアウォールやプロキシの背後に置いてください。

ノードが起動したら、[Polkadot-JS Apps](https://polkadot.js.org/apps/#/explorer?rpc=ws://localhost:9944) で接続できます。
