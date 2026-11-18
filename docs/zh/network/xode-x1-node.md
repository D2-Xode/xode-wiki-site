# XODE X1 节点

以下步骤用于运行 XODE X1 的节点。它是一条拥有自己验证人的独立 Substrate 链，与 [XODE 节点](/zh/network/xode-node) 不同，它不连接 Polkadot 中继链。

| 属性 | 值 |
|------|-----|
| 链 | Xode（`xode`） |
| 代币 | XON，12 位小数 |
| SS58 前缀 | 280 |
| 出块时间 | 1 秒 |
| EVM 链 ID | 34170 |

节点二进制文件和链规范发布在 [xode-solochain-release 发布页面](https://github.com/D2-Xode/xode-solochain-release/releases)。以下命令下载 v0.1.1；如需更新的版本，请将 `v0.1.1` 替换为对应标签。

## 在主机上直接运行 XODE X1 节点

最低 AWS 实例类型：t2.medium

* vCPU：2
* 内存：4.0GB
* 存储：500GB
* 操作系统：Ubuntu 22.04 或更高版本，x86-64

STEP 1：下载 xode-solochain-node 二进制文件

```bash
curl -L "https://github.com/D2-Xode/xode-solochain-release/releases/download/v0.1.1/xode-solochain-node" -o xode-solochain-node
```

STEP 2：下载链规范

```bash
curl -L "https://github.com/D2-Xode/xode-solochain-release/releases/download/v0.1.1/xode-mainnet-raw.json" -o xode-mainnet-raw.json
```

STEP 3：使二进制文件可执行并检查能否运行

```bash
chmod +x xode-solochain-node
./xode-solochain-node --version
```

STEP 4：创建基础路径目录

```bash
mkdir data
```

STEP 5：创建 shell 脚本：

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

如果文件没有下载到 `/home/ubuntu`，请修改 `BASE_DIR`，并将 `--name` 设置为节点在遥测中显示的名称。

STEP 6：使 launch-node.sh 可执行

```bash
chmod +x launch-node.sh
```

STEP 7：测试能否运行

```bash
./launch-node.sh
```

日志中应能看到节点正在导入区块。进入下一步之前，按 `Ctrl+C` 停止它。

STEP 8：创建服务：

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

## 运行 XODE X1 验证人

验证人负责出块并对区块进行最终确认。与上面的节点相比，它增加了三项：固定的节点密钥、`--validator` 参数，以及在链上注册的会话密钥。每个会话（1 小时）中，按绑定金额加委托质押排名最高的候选人成为验证人。

你需要一个至少持有 100 XON 用于绑定、另有少量 XON 用于手续费的账户。以下步骤在满足节点最低配置的机器上从头搭建验证人。

STEP 1：下载 xode-solochain-node 二进制文件

```bash
curl -L "https://github.com/D2-Xode/xode-solochain-release/releases/download/v0.1.1/xode-solochain-node" -o xode-solochain-node
```

STEP 2：下载链规范

```bash
curl -L "https://github.com/D2-Xode/xode-solochain-release/releases/download/v0.1.1/xode-mainnet-raw.json" -o xode-mainnet-raw.json
```

STEP 3：使二进制文件可执行

```bash
chmod +x xode-solochain-node
```

STEP 4：下载 Polkadot 二进制文件

`polkadot` 二进制文件仅用于生成节点密钥。

```bash
curl -L "https://github.com/paritytech/polkadot-sdk/releases/download/polkadot-stable2512-2/polkadot" -o polkadot
chmod +x polkadot
```

STEP 5：生成节点密钥

```bash
./polkadot key generate-node-key --file /home/ubuntu/node-key
```

该文件保存节点的网络私钥。命令会输出节点的 Peer ID，其他节点通过它找到你的节点。请记下 Peer ID，妥善保管该文件且不要丢失：节点每次启动都需要同一个密钥。

STEP 6：创建启动脚本：

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

如果文件没有下载到 `/home/ubuntu`，请修改 `BASE_DIR`，并将 `--name` 设置为验证人名称。不要给验证人添加 `--rpc-external`。它的 RPC 应只能从本机访问。

STEP 7：使 launch-node.sh 可执行

```bash
chmod +x launch-node.sh
```

STEP 8：创建服务：

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

进入下一步之前，请等待节点同步完成。

STEP 12：生成会话密钥

在验证人机器上运行：

```bash
curl -H "Content-Type: application/json" \
  -d '{"id":1, "jsonrpc":"2.0", "method":"author_rotateKeys", "params":[]}' \
  http://localhost:9944
```

返回结果中的 `result` 就是会话密钥，是一个以 `0x` 开头的长十六进制字符串。对应的私钥保存在节点的基础路径中。

STEP 13：在链上注册会话密钥

打开[已连接到 XODE X1 的 Polkadot-JS Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fsolochain.xode.net#/explorer)（RPC 端点 `wss://solochain.xode.net`）。

进入 **Developer → Extrinsics**，用你的验证人账户提交：

* `session.setKeys`：`keys` 填入 STEP 12 中的十六进制字符串，`proof` 填 `0x`

STEP 14：注册为候选人并绑定

用同一个账户提交：

1. `xodeStaking.registerCandidate`
2. `xodeStaking.bondCandidate`：`newBond` 至少为 100 XON。以最小单位输入，100 XON 即 `100000000000000`（12 位小数）。

你的账户可在下一个会话开始时加入验证人集合。成为验证人后，节点日志会显示它正在准备并导入自己生成的区块。

## 端口

| 端口 | 用途 |
|------|------|
| 30333 | p2p。请开放此端口，以便其他节点连接到你的节点。 |
| 9944 | Substrate JSON-RPC（HTTP 和 WebSocket） |
| 9615 | Prometheus 指标 |

RPC 默认只监听 localhost。如需从其他机器访问，请在脚本中添加 `--rpc-external` 和 `--rpc-cors all`，并将其置于防火墙或代理之后。

节点运行后，可以通过 [Polkadot-JS Apps](https://polkadot.js.org/apps/#/explorer?rpc=ws://localhost:9944) 连接。
