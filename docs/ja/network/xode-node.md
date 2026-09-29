# XODE ノード

この手順では、Polkadot リレーチェーン上の XODE（para ID 3417）のノードを実行します。

ノードバイナリとランタイムアップグレードは [xode-blockchain のリリースページ](https://github.com/D2-Xode/xode-blockchain/releases) で公開されます。以下のコマンドは v0.1.2.14 をダウンロードします。より新しいリリースを使う場合は、`v0.1.2.14` をそのタグに置き換えてください。

## ホスト上で XODE ノードを直接実行する

最小 AWS インスタンスタイプ：t2.medium	

* vCPU：2  
* RAM：4.0GB  
* ストレージ：500GB  
* オペレーティングシステム：Ubuntu 22.0 以降

STEP 1：xode-node バイナリのダウンロード

### x86-64

```bash
curl -L "https://github.com/D2-Xode/xode-blockchain/releases/download/v0.1.2.14/xode-node" -o xode-node
```

### Aarch64

```bash
curl -L "https://github.com/D2-Xode/xode-blockchain/releases/download/v0.1.2.14/xode-node-aarch64" -o xode-node
```

STEP 2：xode チェーンスペックのダウンロード

```bash
wget --no-check-certificate 'https://github.com/D2-Xode/xode-blockchain/releases/download/v0.1.2.14/polkadot_raw_chain_spec.json' -O raw-xode-node-chainspec.json
```

STEP 3：xode-node バイナリを実行可能にする

```bash
chmod +x xode-node
```

STEP 4：xode のベースパスディレクトリを作成する

```bash
mkdir xode
```

STEP 5：シェルスクリプトを作成する：

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

STEP 6：xode-node.sh を実行可能にする

```bash
chmod + xode-node.sh
```

STEP 7：動作するかテストする

```bash
./xode-node.sh
```

STEP 8：サービスを作成する：

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

STEP 9：サービスを有効化する

```bash
sudo systemctl enable xode-collator.service
```

STEP 10：サービスを開始する

```bash
sudo systemctl start xode-collator.service
```

STEP 11：30 秒待ってから、サービスが実行されているか確認する

```bash
journalctl -f -u xode-collator
```

STEP 12：テレメトリーサイトでノードを確認する

[https://telemetry.polkadot.io/\#/0xb2985e778bb748c70e450dcc084cc7da79fe742cc23d3b040abd7028187de69c](https://telemetry.polkadot.io/#/0xb2985e778bb748c70e450dcc084cc7da79fe742cc23d3b040abd7028187de69c) 

## コンテナ（Podman）を使用して XODE ノードを実行する

STEP 1：Podman をインストールする

```bash
sudo apt-get update
sudo apt-get -y install podman
```

STEP 2：xode-node イメージをダウンロードする 

### x86-64：[https://hub.docker.com/r/xoderockson/xode-node-x86\_64](https://hub.docker.com/r/xoderockson/xode-node-x86_64%20)

```bash
podman pull docker.io/xoderockson/xode-node-x86_64
```

### aarch64：[https://hub.docker.com/r/xoderockson/xode-node-aarch64](https://hub.docker.com/r/xoderockson/xode-node-aarch64)

```bash
podman pull docker.io/xoderockson/xode-node-aarch64
```

STEP 3：コンテナを実行する（事前にローカルディレクトリを作成します）

このディレクトリにはデータベースが保存されます（非常に重要です）

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

STEP 4：サービスを有効化する

```bash
podman generate systemd --new --name xode-node  > ./xode-node.service
mkdir -p ~/.config/systemd/user
mv ./xode-node.service ~/.config/systemd/user
systemctl --user enable xode-node.service
```

STEP 5：自動ログインを有効化する

次のファイルを編集します

```bash
sudo nano /lib/systemd/system/getty@.service
```

次の行を

```ini
ExecStart=-/sbin/agetty -o '-p -- \u' --noclear %I $TERM
```

次の行に変更します

```ini
ExecStart=-/sbin/agetty --noissue --autologin [USERNAME] %I $TERM
```

## コンテナ（Podman）のメンテナンス

すべてのコンテナを停止する

```bash
podman stop --all
```

コンテナを実行する前にキャッシュをクリアする

```bash
podman container prune -f
```

実行中のコンテナとイメージを表示する

```bash
podman ps
podman images
```
