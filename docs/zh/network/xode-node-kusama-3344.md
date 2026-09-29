# XODE 节点 (Kusama 3344)

::: warning 已停止使用
XODE 已从 Kusama（para ID 3344）迁移至 Polkadot 中继链（para ID 3417），因此本指南仅保留作参考。如需立即运行节点，请按照 [XODE 节点](/zh/network/xode-node) 指南操作。详情请参见[从 Kusama 到 Polkadot](/zh/introduction/xode-blockchain#from-kusama-to-polkadot)。
:::

## 硬件要求

* 8 核（Core i9 或同等性能处理器）  
* 32 GB 内存  
* 1 TB SSD 硬盘  
* Ubuntu 24 操作系统

## 第 1 步：下载 xode-node 二进制文件

### x86-64

```bash
curl -L "https://drive.usercontent.google.com/download?id=10zStcLL08V3hiCy507CBXMCKCb2VFQsM&confirm=xxx" -o xode-node
```

### aarch64

```bash
curl -L "https://drive.usercontent.google.com/download?id=1S8uBEuaZhSfJMCwKvbzWXAw_7J4EgPVE&confirm=xxx" -o xode-node
```

## 第 2 步：下载 Xode Blockchain Kusama 3344 链规范 (Chainspec)

```bash
wget --no-check-certificate 'https://docs.google.com/uc?export=download&id=19C8s1MdVubYjMFiLBmvwhWxTK6bPeyve' -O raw-xode-node-chainspec.json
```

## 第 3 步：为 xode-node 二进制文件添加可执行权限

```bash
chmod +x xode-node
```

## 第 4 步：创建 xode 基础路径目录

```bash
mkdir xode
```

## 第 5 步：创建 shell 脚本

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

### 参数说明

* /home/ubuntu/xode-node：指定 xode-node 二进制文件所在的目录  
* \--chain /home/ubuntu/raw-xode-node-chainspec.json：该参数告知命令，链规范文件位于 /home/ubuntu/raw-xode-node-chainspec.json   
* \--base-path /home/ubuntu/xode：该参数接收一个用于存储数据库的目录路径。在本示例中，数据将存储在 /home/ubuntu/xode  
* \--rpc-port 9944：指定节点运行所使用的端口（默认：9944）。  
* \--pruning archive：指定节点以归档模式运行。如果你希望节点以全节点方式运行，可以移除该参数。  
* \--telemetry-url "wss://telemetry.polkadot.io/submit/ 0"：使节点在遥测 (telemetry) 中可见。  
* \--name "your-node-name”：设置自定义节点名称，该名称将显示在遥测中。请将 "your-node-name” 替换为你想要的名称，例如 \--name "xode-node”

### 启用 RPC，请添加以下内容。

```bash
--rpc-external \
--unsafe-rpc-external \
--rpc-methods safe \
--rpc-cors '*'
```

### 运行启用 RPC 的全节点的完整示例。

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

## 第 6 步：为 xode-node.sh 添加可执行权限

```bash
chmod +x xode-node.sh
```

## 第 7 步：测试是否能正常运行

```bash
./xode-node.sh
```

## 第 8 步：创建服务

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

## 第 9 步：启用服务

```bash
sudo systemctl enable xode-collator.service
```

## 第 10 步：启动服务

```bash
sudo systemctl start xode-collator.service
```

## 第 11 步：等待 30 秒，然后检查服务是否正在运行

```bash
journalctl -f -u xode-collator
```

## 第 12 步：访问遥测 (telemetry) 网站查看你的节点

[https://telemetry.polkadot.io/\#/0x28cc1df52619f4edd9f0389a7e910a636276075ecc429600f1dd434e281a04e9](https://telemetry.polkadot.io/#/0x28cc1df52619f4edd9f0389a7e910a636276075ecc429600f1dd434e281a04e9) 
