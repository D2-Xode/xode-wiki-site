# XODE のコンパイル

## GitHub 環境のセットアップ

既存の SSH キーの確認：既存の SSH キーがあることを確認してください。次のコマンドを実行して、既存のキーを一覧表示します。

```bash
ls -al ~/.ssh
```

id\_rsa または id\_rsa.pub という名前のファイルを探してください。

新しい SSH キーの生成（必要な場合）：SSH キーがない場合、または新しいキーを生成したい場合は、次のコマンドを使用できます。

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

プロンプトに従って新しいキーを生成してください。"your\_email@example.com" は必ず実際のメールアドレスに置き換えてください。

SSH キーを SSH エージェントに追加：SSH エージェントを起動し、秘密鍵を追加します。

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa
```

SSH キーをクリップボードにコピー：次のコマンドを使用して SSH キーをクリップボードにコピーします。

```bash
cat ~/.ssh/id_rsa.pub
```

SSH キーを GitHub に追加：

GitHub のアカウント設定を開きます。  
「SSH and GPG keys」または「SSH keys」に移動します。  
「New SSH key」または「Add SSH key」をクリックします。  
表示されたフィールドにキーを貼り付け、タイトルを付けます。

Xode-Blockchain をクローンします

```bash
git clone git@github.com:D2-Xode/xode-blockchain.git
cd xode-blockchain
```

## Rust 環境のセットアップ

build-essential パッケージをインストールします。

```bash
sudo apt install build-essential
```

Rust 用のサポートパッケージをインストールします

```bash
sudo apt install --assume-yes git clang curl libssl-dev protobuf-compiler
sudo apt install --assume-yes git clang curl libssl-dev llvm libudev-dev make protobuf-compiler
```

次のコマンドを実行して rustup インストールプログラムをダウンロードし、それを使用して Rust をインストールします。

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

次のコマンドを実行して、現在のシェルに Cargo を含めるように更新します

```bash
source $HOME/.cargo/env
```

次のコマンドを実行して、Rust ツールチェーンのデフォルトを最新の安定版に設定します

```bash
rustup default stable
rustup update
```

次のコマンドを実行して、nightly リリースと nightly WebAssembly（wasm）ターゲットを開発環境に追加します。

```bash
rustup update nightly
rustup target add wasm32-unknown-unknown --toolchain nightly
rustup default nightly-x86_64-unknown-linux-gnu
```

次のコマンドを実行して、開発環境の構成を確認します。

```bash
rustup show
rustup +nightly show
```

スマートコントラクト用の WASM サポートをインストールします

```bash
rustup target add wasm32-unknown-unknown
```

Xode をコンパイルしてノードを実行します

```bash
cargo build
```

## Raspberry Pi（aarch64）環境向けのコンパイル

cross クレートをインストールします

```bash
cargo install cross
```

Docker をインストールします

```bash
sudo apt update
```

apt がパッケージを利用できるようにするための前提パッケージをいくつかインストールします

```bash
sudo apt install apt-transport-https ca-certificates curl software-properties-common
```

公式 Docker リポジトリの GPG キーをシステムに追加します

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```

Docker リポジトリを APT ソースに追加します

```bash
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

もう一度パッケージを更新します

```bash
sudo apt update
```

Docker リポジトリからインストールしようとしていることを確認します

```bash
apt-cache policy docker-ce
```

Docker をインストールします

```bash
sudo apt install docker-ce
```

Docker のステータスを確認します

```bash
sudo systemctl status docker
```

sudo を使わずに Docker を使用できるようにします

```bash
sudo usermod -aG docker ${USER}
su - ${USER}
groups
```

クロスコンパイルを実行します

```bash
cross +nightly build --target aarch64-unknown-linux-gnu --release
```

## Zombienet を使用した XODE の実行

xode-node バイナリが完全にコンパイルされ、動作することをテストします

```bash
./target/release/xode-node --version
```

Polkadot バイナリをダウンロードします（このバイナリをダウンロードする際は、zombienet ディレクトリにいることを確認してください）

```bash
wget https://github.com/paritytech/polkadot/releases/download/v1.0.0/polkadot
```

Zombienet バイナリをダウンロードします（このバイナリをダウンロードする際は、zombienet ディレクトリにいることを確認してください）

```bash
wget https://github.com/paritytech/zombienet/releases/download/v1.3.109/zombienet-linux-x64
```

2 つのバイナリを実行可能にします

```bash
chmod +x polkadot
chmod +x zombienet-linux-x64
```

Zombienet を使用して XODE を実行します

```bash
./zombienet-launch.sh
```
