# 编译 XODE

## 配置 Github 环境

检查现有 SSH 密钥：确认你已有 SSH 密钥。运行以下命令列出现有密钥：

```bash
ls -al ~/.ssh
```

查找名为 id\_rsa 或 id\_rsa.pub 的文件。

生成新的 SSH 密钥（如需要）：如果你还没有 SSH 密钥，或想生成一个新的密钥，可以使用以下命令：

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

按照提示生成新密钥。请务必将 "your\_email@example.com" 替换为你的实际邮箱地址。

将 SSH 密钥添加到 SSH Agent：启动 SSH Agent 并添加你的私钥：

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa
```

将 SSH 密钥复制到剪贴板：使用以下命令输出你的 SSH 密钥并复制到剪贴板：

```bash
cat ~/.ssh/id_rsa.pub
```

将 SSH 密钥添加到 GitHub：

进入你的 GitHub 账户设置。  
导航至 "SSH and GPG keys" 或 "SSH keys"。  
点击 "New SSH key" 或 "Add SSH key"。  
将密钥粘贴到对应的输入框中，并为其设置一个标题。

克隆 Xode-Blockchain

```bash
git clone git@github.com:D2-Xode/xode-blockchain.git
cd xode-blockchain
```

## 配置 Rust 环境

安装 build-essential 软件包。

```bash
sudo apt install build-essential
```

安装 Rust 所需的支持软件包

```bash
sudo apt install --assume-yes git clang curl libssl-dev protobuf-compiler
sudo apt install --assume-yes git clang curl libssl-dev llvm libudev-dev make protobuf-compiler
```

运行以下命令下载 rustup 安装程序并使用它安装 Rust。

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

运行以下命令更新当前 shell，使其包含 Cargo

```bash
source $HOME/.cargo/env
```

运行以下命令，将 Rust 工具链默认设置为最新稳定版本

```bash
rustup default stable
rustup update
```

运行以下命令，将 nightly 版本及 nightly WebAssembly (wasm) 目标添加到你的开发环境中：

```bash
rustup update nightly
rustup target add wasm32-unknown-unknown --toolchain nightly
rustup default nightly-x86_64-unknown-linux-gnu
```

运行以下命令验证开发环境的配置。

```bash
rustup show
rustup +nightly show
```

安装智能合约所需的 WASM 支持

```bash
rustup target add wasm32-unknown-unknown
```

编译 Xode 并运行节点

```bash
cargo build
```

## 为树莓派 (aarch64) 环境编译

安装 cross crate

```bash
cargo install cross
```

安装 Docker

```bash
sudo apt update
```

安装几个前置软件包，使 apt 能够使用相关软件包

```bash
sudo apt install apt-transport-https ca-certificates curl software-properties-common
```

将官方 Docker 仓库的 GPG 密钥添加到系统中

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```

将 Docker 仓库添加到 APT 软件源

```bash
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

再次更新软件包

```bash
sudo apt update
```

确认将从 Docker 仓库进行安装

```bash
apt-cache policy docker-ce
```

安装 docker

```bash
sudo apt install docker-ce
```

检查 docker 状态

```bash
sudo systemctl status docker
```

使 docker 无需 sudo 即可使用

```bash
sudo usermod -aG docker ${USER}
su - ${USER}
groups
```

现在运行交叉编译

```bash
cross +nightly build --target aarch64-unknown-linux-gnu --release
```

## 使用 Zombienet 运行 XODE

测试 xode-node 二进制文件是否可以运行且已完整编译

```bash
./target/release/xode-node --version
```

下载 Polkadot 二进制文件（下载此二进制文件时，请确保你位于 zombienet 目录中）

```bash
wget https://github.com/paritytech/polkadot/releases/download/v1.0.0/polkadot
```

下载 Zombienet 二进制文件（下载此二进制文件时，请确保你位于 zombienet 目录中）

```bash
wget https://github.com/paritytech/zombienet/releases/download/v1.3.109/zombienet-linux-x64
```

为这两个二进制文件添加可执行权限

```bash
chmod +x polkadot
chmod +x zombienet-linux-x64
```

使用 Zombienet 运行 XODE

```bash
./zombienet-launch.sh
```
