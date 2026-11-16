# XODE 独立链节点

以下步骤用于运行 XODE 独立链（Solochain）的节点。它是一条拥有自己验证人的独立 Substrate 链，与 [XODE 节点](/zh/network/xode-node) 不同，它不连接 Polkadot 中继链。

| 属性 | 值 |
|------|-----|
| 链 | Xode（`xode`） |
| 代币 | XON，12 位小数 |
| SS58 前缀 | 280 |
| 出块时间 | 1 秒 |
| EVM 链 ID | 34170 |

节点二进制文件和链规范发布在 [xode-solochain 发布页面](https://github.com/D2-Xode/xode-solochain-release/releases)。以下命令下载 v0.1.0；如需更新的版本，请将 `v0.1.0` 替换为对应标签。

## 在主机上直接运行 XODE 独立链节点

最低 AWS 实例类型：t2.medium

* vCPU：2
* 内存：4.0GB
* 存储：500GB
* 操作系统：Ubuntu 22.04 或更高版本，x86-64

STEP 1：下载 xode-solochain-node 二进制文件

```bash
curl -L "https://github.com/D2-Xode/xode-solochain-release/releases/download/v0.1.0/xode-solochain-node" -o xode-solochain-node
```

STEP 2：下载链规范

```bash
curl -L "https://github.com/D2-Xode/xode-solochain-release/releases/download/v0.1.0/xode-mainnet-raw.json" -o xode-mainnet-raw.json
```

STEP 3：使二进制文件可执行并检查能否运行

```bash
chmod +x xode-solochain-node
./xode-solochain-node --version
```

STEP 4：创建基础路径目录

```bash
mkdir xode-solochain
```

STEP 5：创建 shell 脚本：

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

STEP 6：使 xode-solochain-node.sh 可执行

```bash
chmod +x xode-solochain-node.sh
```

STEP 7：测试能否运行

```bash
./xode-solochain-node.sh
```

日志中应能看到节点正在导入区块。进入下一步之前，按 `Ctrl+C` 停止它。

STEP 8：创建服务：

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

STEP 9：启用服务

```bash
sudo systemctl enable xode-solochain.service
```

STEP 10：启动服务

```bash
sudo systemctl start xode-solochain.service
```

STEP 11：等待 30 秒后检查服务是否正在运行

```bash
journalctl -f -u xode-solochain
```

## 端口

| 端口 | 用途 |
|------|------|
| 30333 | p2p。请开放此端口，以便其他节点连接到你的节点。 |
| 9944 | Substrate JSON-RPC（HTTP 和 WebSocket） |
| 9615 | Prometheus 指标 |

RPC 默认只监听 localhost。如需从其他机器访问，请在脚本中添加 `--rpc-external` 和 `--rpc-cors all`，并将其置于防火墙或代理之后。

节点运行后，可以通过 [Polkadot-JS Apps](https://polkadot.js.org/apps/#/explorer?rpc=ws://localhost:9944) 连接。
