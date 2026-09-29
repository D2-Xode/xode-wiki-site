# XODE 节点

以下步骤用于在 Polkadot 中继链上运行 XODE（para ID 3417）节点。

节点二进制文件和运行时升级发布在 [xode-blockchain 发布页面](https://github.com/D2-Xode/xode-blockchain/releases)。以下命令下载的是 v0.1.2.14；如需使用更新的版本，请将 `v0.1.2.14` 替换为对应的标签。

## 直接在主机上运行 XODE 节点

最低 AWS 实例类型：t2.medium	

* vCPU：2  
* 内存：4.0GB  
* 存储：500GB  
* 操作系统：Ubuntu 22.0 或更高版本

第 1 步：下载 xode-node 二进制文件

### x86-64

```bash
curl -L "https://github.com/D2-Xode/xode-blockchain/releases/download/v0.1.2.14/xode-node" -o xode-node
```

### Aarch64

```bash
curl -L "https://github.com/D2-Xode/xode-blockchain/releases/download/v0.1.2.14/xode-node-aarch64" -o xode-node
```

第 2 步：下载 xode 链规范 (chainspec)

```bash
wget --no-check-certificate 'https://github.com/D2-Xode/xode-blockchain/releases/download/v0.1.2.14/polkadot_raw_chain_spec.json' -O raw-xode-node-chainspec.json
```

第 3 步：为 xode-node 二进制文件添加可执行权限

```bash
chmod +x xode-node
```

第 4 步：创建 xode 基础路径目录

```bash
mkdir xode
```

第 5 步：创建 shell 脚本：

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

第 6 步：为 xode-node.sh 添加可执行权限

```bash
chmod + xode-node.sh
```

第 7 步：测试是否能正常运行

```bash
./xode-node.sh
```

第 8 步：创建服务：

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

第 9 步：启用服务

```bash
sudo systemctl enable xode-collator.service
```

第 10 步：启动服务

```bash
sudo systemctl start xode-collator.service
```

第 11 步：等待 30 秒，然后检查服务是否正在运行

```bash
journalctl -f -u xode-collator
```

第 12 步：访问遥测 (telemetry) 网站查看你的节点

[https://telemetry.polkadot.io/\#/0xb2985e778bb748c70e450dcc084cc7da79fe742cc23d3b040abd7028187de69c](https://telemetry.polkadot.io/#/0xb2985e778bb748c70e450dcc084cc7da79fe742cc23d3b040abd7028187de69c) 

## 使用容器 (Podman) 运行 XODE 节点

第 1 步：安装 Podman

```bash
sudo apt-get update
sudo apt-get -y install podman
```

第 2 步：下载 xode-node 镜像 

### x86-64：[https://hub.docker.com/r/xoderockson/xode-node-x86\_64](https://hub.docker.com/r/xoderockson/xode-node-x86_64%20)

```bash
podman pull docker.io/xoderockson/xode-node-x86_64
```

### aarch64：[https://hub.docker.com/r/xoderockson/xode-node-aarch64](https://hub.docker.com/r/xoderockson/xode-node-aarch64)

```bash
podman pull docker.io/xoderockson/xode-node-aarch64
```

第 3 步：运行容器，但首先要创建一个本地目录

该目录将用于存放数据库（非常重要）

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

第 4 步：启用服务

```bash
podman generate systemd --new --name xode-node  > ./xode-node.service
mkdir -p ~/.config/systemd/user
mv ./xode-node.service ~/.config/systemd/user
systemctl --user enable xode-node.service
```

第 5 步：启用自动登录

编辑此文件

```bash
sudo nano /lib/systemd/system/getty@.service
```

将这一行

```ini
ExecStart=-/sbin/agetty -o '-p -- \u' --noclear %I $TERM
```

修改为这一行

```ini
ExecStart=-/sbin/agetty --noissue --autologin [USERNAME] %I $TERM
```

## 维护容器 (Podman)

停止所有容器

```bash
podman stop --all
```

在运行容器前清理缓存

```bash
podman container prune -f
```

显示正在运行的容器和镜像

```bash
podman ps
podman images
```
