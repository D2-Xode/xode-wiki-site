# XODE X1 ノード

この手順では、独自のバリデーターを持つスタンドアロンの Substrate チェーンである XODE X1 のノードを実行します。[XODE ノード](/ja/network/xode-node) と異なり、Polkadot リレーチェーンには接続しません。

| 項目 | 値 |
|------|-----|
| チェーン | Xode（`xode`） |
| トークン | XON、小数点以下 12 桁 |
| SS58 プレフィックス | 280 |
| ブロック時間 | 1 秒 |
| EVM チェーン ID | 34170 |

ノードバイナリとチェーンスペックは [xode-solochain-release のリリースページ](https://github.com/D2-Xode/xode-solochain-release/releases) で公開されます。以下のコマンドは v0.1.1 をダウンロードします。より新しいリリースを使う場合は、`v0.1.1` をそのタグに置き換えてください。

## 公開 RPC エンドポイント

XODE X1 を利用するために自分でノードを運用する必要はありません。以下の公開エンドポイントは、同じホストで WebSocket（`wss://`）と HTTPS JSON-RPC の両方に対応しています。近い場所を選んでください。3 つとも同じチェーンを提供します。

| エンドポイント | 運営者 | 所在地 | 備考 |
|--------------|--------|--------|------|
| `wss://solochain.xode.net` | XODE | ソウル | プライマリ |
| `wss://x1rpc.xode.net` | RockSon | フランクフルト | アーカイブノード、全履歴 |
| `wss://x1rpc2.xode.net` | RockSon | 東京 | アーカイブノード、全履歴 |

Polkadot-JS Apps で開く: [solochain.xode.net](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fsolochain.xode.net#/explorer) · [x1rpc.xode.net](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fx1rpc.xode.net#/explorer) · [x1rpc2.xode.net](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fx1rpc2.xode.net#/explorer)

## ホスト上で XODE X1 ノードを直接実行する

最小 AWS インスタンスタイプ：t2.medium

* vCPU：2
* RAM：4.0GB
* ストレージ：500GB
* オペレーティングシステム：Ubuntu 22.04 以降、x86-64

STEP 1：xode-solochain-node バイナリのダウンロード

```bash
curl -L "https://github.com/D2-Xode/xode-solochain-release/releases/download/v0.1.1/xode-solochain-node" -o xode-solochain-node
```

STEP 2：チェーンスペックのダウンロード

```bash
curl -L "https://github.com/D2-Xode/xode-solochain-release/releases/download/v0.1.1/xode-mainnet-raw.json" -o xode-mainnet-raw.json
```

STEP 3：バイナリを実行可能にし、動作を確認する

```bash
chmod +x xode-solochain-node
./xode-solochain-node --version
```

STEP 4：ベースパス用ディレクトリの作成

```bash
mkdir data
```

STEP 5：シェルスクリプトの作成：

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

ファイルを `/home/ubuntu` 以外の場所にダウンロードした場合は `BASE_DIR` を変更し、`--name` にはテレメトリに表示するノード名を設定してください。

STEP 6：launch-node.sh を実行可能にする

```bash
chmod +x launch-node.sh
```

STEP 7：実行できるかテストする

```bash
./launch-node.sh
```

ログにノードがブロックをインポートしている様子が表示されます。次の手順に進む前に `Ctrl+C` で停止してください。

STEP 8：サービスの作成：

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

## XODE X1 バリデーターを実行する

バリデーターはブロックを生成し、ファイナライズします。上記のノードと比べて、固定のノードキー、`--validator` フラグ、オンチェーンに登録するセッションキーの 3 つが追加されます。各セッション（1 時間）ごとに、ボンドと委任ステークの合計が最も高い候補がバリデーターになります。

ボンド用に最低 100 XON と、手数料用の XON を保有するアカウントが必要です。以下の手順では、ノードと同じ最小要件を満たすマシンでバリデーターを一から設定します。

STEP 1：xode-solochain-node バイナリのダウンロード

```bash
curl -L "https://github.com/D2-Xode/xode-solochain-release/releases/download/v0.1.1/xode-solochain-node" -o xode-solochain-node
```

STEP 2：チェーンスペックのダウンロード

```bash
curl -L "https://github.com/D2-Xode/xode-solochain-release/releases/download/v0.1.1/xode-mainnet-raw.json" -o xode-mainnet-raw.json
```

STEP 3：バイナリを実行可能にする

```bash
chmod +x xode-solochain-node
```

STEP 4：Polkadot バイナリのダウンロード

`polkadot` バイナリはノードキーの生成にのみ使用します。

```bash
curl -L "https://github.com/paritytech/polkadot-sdk/releases/download/polkadot-stable2512-2/polkadot" -o polkadot
chmod +x polkadot
```

STEP 5：ノードキーの生成

```bash
./polkadot key generate-node-key --file /home/ubuntu/node-key
```

このファイルにはノードのネットワーク秘密鍵が保存されます。コマンドは、他のノードがあなたのノードを見つけるために使うピア ID を出力します。ピア ID を控えておき、ファイルは非公開で保管し、紛失しないでください。ノードは起動のたびに同じキーを必要とします。

STEP 6：起動スクリプトの作成：

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

ファイルを `/home/ubuntu` 以外の場所にダウンロードした場合は `BASE_DIR` を変更し、`--name` にはバリデーター名を設定してください。バリデーターには `--rpc-external` を追加しないでください。RPC はそのマシンからのみアクセスできるようにします。

STEP 7：launch-node.sh を実行可能にする

```bash
chmod +x launch-node.sh
```

STEP 8：サービスの作成：

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

次の手順に進む前に、ノードの同期が完了するまで待ってください。

STEP 12：セッションキーの生成

バリデーターのマシンで実行します：

```bash
curl -H "Content-Type: application/json" \
  -d '{"id":1, "jsonrpc":"2.0", "method":"author_rotateKeys", "params":[]}' \
  http://localhost:9944
```

応答の `result` がセッションキーで、`0x` で始まる長い 16 進数の文字列です。対応する秘密鍵はノードのベースパスに保存されます。

STEP 13：セッションキーをオンチェーンに登録

[XODE X1 に接続した Polkadot-JS Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fsolochain.xode.net#/explorer) を開きます（RPC エンドポイント `wss://solochain.xode.net`、または上の[公開 RPC エンドポイント](#公開-rpc-エンドポイント)表のいずれか）。

**Developer → Extrinsics** を開き、バリデーターのアカウントから次を送信します：

* `session.setKeys`：`keys` に STEP 12 の 16 進数文字列、`proof` に `0x` を指定

STEP 14：候補者登録とボンド

同じアカウントから次を送信します：

1. `xodeStaking.registerCandidate`
2. `xodeStaking.bondCandidate`：`newBond` は最低 100 XON。最小単位で入力するため、100 XON は `100000000000000`（小数点以下 12 桁）です。

次のセッション開始時に、アカウントがバリデーターセットに加わる可能性があります。バリデーターになると、ノードのログに自分が生成したブロックの準備とインポートが表示されます。

## ポート

| ポート | 用途 |
|--------|------|
| 30333 | p2p。他のノードが接続できるよう開放してください。 |
| 9944 | Substrate JSON-RPC（HTTP および WebSocket） |
| 9615 | Prometheus メトリクス |

RPC はデフォルトで localhost のみで待ち受けます。他のマシンから接続するには、スクリプトに `--rpc-external` と `--rpc-cors all` を追加し、その場合はファイアウォールやプロキシの背後に置いてください。

ノードが起動したら、[Polkadot-JS Apps](https://polkadot.js.org/apps/#/explorer?rpc=ws://localhost:9944) で接続できます。
