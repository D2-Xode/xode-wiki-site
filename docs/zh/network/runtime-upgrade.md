# 运行时升级

## 运行时升级的发布位置

XODE 的运行时升级发布在 [xode-blockchain 发布页面](https://github.com/D2-Xode/xode-blockchain/releases)。每个版本都附有更新说明（包括运行时新的 `spec_version`）以及以下文件：

| 文件 | 说明 |
| --- | --- |
| `xode_runtime.compact.compressed.wasm` | 升级时部署到链上的已编译运行时 |
| `xode-node` | 适用于 x86-64 的节点二进制文件 |
| `xode-node-aarch64` | 适用于 ARM64（aarch64）的节点二进制文件 |
| `polkadot_raw_chain_spec.json` | Polkadot 上 XODE 的链规范 |

截至 2026 年 9 月，最新版本为 [v0.1.2.14](https://github.com/D2-Xode/xode-blockchain/releases/tag/v0.1.2.14)，它将 `spec_version` 提升到了 14。要查看链上正在运行的运行时，请打开连接到 XODE 的 [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fpolkadot-rpcnode.xode.net#/explorer)：左上角会显示运行时名称和版本，例如 `xode-runtime/14`。

本页其余部分介绍如何在本地测试网络上试验运行时升级。

## 使用 pallet-sudo 模拟运行时升级

1. 下载 Xode 二进制文件

`x86_64`

```bash
curl -L "https://github.com/D2-Xode/xode-blockchain/releases/download/v0.1.2.14/xode-node" -o xode-node
```

2. 使用 Zombienet 运行节点  

```bash
./zombienet-launch.sh
```

3. 新建一个终端  

4. 修改代码（更改版本号）  

`runtime/src/lib.rs`

```rust
#[sp_version::runtime_version]
pub const VERSION: RuntimeVersion = RuntimeVersion {
    spec_name: create_runtime_str!("template-parachain"),
    impl_name: create_runtime_str!("template-parachain"),
    authoring_version: 1,
    spec_version: 2, // Modify only this
    impl_version: 0,
    apis: RUNTIME_API_VERSIONS,
    transaction_version: 1,
    state_version: 1,
};
```

5. 编译代码  

```bash
cargo build --release --package xode-node
```

6. 找到 wasm 文件

```text
./target/release/wbuild/xode-runtime/xode_runtime.compact.compressed.wasm
```

7. 打开 Polkadot.JS（Zombienet/平行链）。使用 SUDO 上传 WASM 文件。  

   ![](../../network/images/runtime-upgrade-1.png)  

8. 验证是否已获得新的运行时版本：template-parachain/2  

   ![](../../network/images/runtime-upgrade-2.png)

## 使用 pallet-democracy (OpenGov) 模拟运行时升级
