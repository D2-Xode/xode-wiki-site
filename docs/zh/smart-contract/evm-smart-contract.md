# EVM 智能合约

XODE 区块链可以运行以太坊智能合约。您可以使用 Solidity 编写合约，并通过您已熟悉的以太坊工具（如 MetaMask、Remix、Hardhat、ethers.js 和 Web3.js）来部署和使用这些合约。

这一支持来自 `pallet-revive`，即 Polkadot SDK 中用于以太坊兼容合约的智能合约模块。它是 Polkadot 平行链（para ID 3417）上 XODE 运行时的一部分，与 [WASM 智能合约](/zh/smart-contract/wasm-smart-contract) 中介绍的 ink! 合约并行运行。

## 工作原理

以太坊工具与 XODE 使用的是不同的"语言"：这些工具使用以太坊 JSON-RPC，而 XODE 节点使用 Substrate RPC。一个名为 `eth-rpc` 的小型适配器位于两者之间，负责进行转换。

1. 您的钱包或开发工具向 `eth-rpc` 发送一个以太坊请求，例如"部署此合约"。
2. `eth-rpc` 将其转换为 XODE 交易，并发送到 XODE 节点。
3. 在链上，`pallet-revive` 执行合约并存储其状态。

XODE 运行时接受两种合约代码：

* **EVM 字节码**：Solidity 编译器（`solc`）的常规输出，与以太坊上使用的相同。现有的合约和工具无需任何修改即可使用。
* **PolkaVM 字节码**：使用 `resolc` 编译的 Solidity，`resolc` 是 Polkadot 为其基于 RISC-V 的虚拟机提供的编译器。这是可选的。

## 网络信息

| 设置项 | 值 |
| --- | --- |
| 链 ID | `3417`（十六进制 `0xd59`） |
| 货币符号 | `XON` |
| 以太坊工具中显示的小数位数 | 18 |
| Substrate RPC（主网） | `wss://polkadot-rpcnode.xode.net` |
| 以太坊 RPC | 自行运行 `eth-rpc`（见下文） |

链 ID 与 XODE 的 para ID 相同，均为 3417。

### XON 小数位数

XON 在 XODE 链上本身有 12 位小数，但以太坊工具默认使用 18 位。`pallet-revive` 会在两者之间进行转换，因此 1 XON 在 MetaMask 中显示为 1 XON。只有在处理原始数值时才需要关注这一转换：在以太坊一侧，1 XON 表示为 `1000000000000000000`（10¹⁸），而不是 `1000000000000`（10¹²）。

## 设置以太坊 RPC 适配器

以太坊工具需要一个以太坊 RPC URL。本 wiki 目前尚未列出 XODE 的公共以太坊 RPC，因此以下步骤将在您自己的计算机上运行 `eth-rpc` 适配器。

第 1 步：安装或更新 Rust。`eth-rpc` 需要 Rust 1.91 或更高版本。

```bash
rustup update stable
rustup default stable
rustc --version
```

第 2 步：安装 `eth-rpc`

```bash
cargo install pallet-revive-eth-rpc --locked
```

第 3 步：启动一个要连接的 XODE 节点。用于开发时，可以从 [xode-blockchain](https://github.com/D2-Xode/xode-blockchain) 仓库运行本地节点（参见[编译 XODE](/zh/network/compiling-xode)）：

```bash
./target/release/xode-node --dev --rpc-port 9944
```

第 4 步：启动 `eth-rpc` 并将其指向该节点

```bash
eth-rpc --node-rpc-url ws://127.0.0.1:9944 --rpc-port 8545
```

如果要连接 XODE 主网而不是本地节点，请使用主网 Substrate RPC 作为节点 URL：

```bash
eth-rpc --node-rpc-url wss://polkadot-rpcnode.xode.net --rpc-port 8545
```

第 5 步：检查其是否正常响应。返回结果中应包含链 ID `0xd59`。

```bash
curl -X POST http://127.0.0.1:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'
```

## 将 XODE 添加到 MetaMask

1. 打开 MetaMask，然后依次进入 Settings → Networks → Add network → Add a network manually。
2. 填写以下信息：

| 字段 | 值 |
| --- | --- |
| Network name | `Xode` |
| RPC URL | `http://127.0.0.1:8545` |
| Chain ID | `3417` |
| Currency symbol | `XON` |

3. 保存，然后切换到 Xode 网络。

## 使用 Remix 部署合约

本示例部署一个用于存储数字的小型合约。

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Storage {
    uint256 private number;

    event NumberChanged(uint256 newNumber);

    function store(uint256 newNumber) public {
        number = newNumber;
        emit NumberChanged(newNumber);
    }

    function retrieve() public view returns (uint256) {
        return number;
    }
}
```

1. 打开 [Remix](https://remix.ethereum.org)，创建一个名为 `Storage.sol` 的文件，并粘贴上面的代码。
2. 在 Solidity compiler 选项卡中，点击 Compile Storage.sol。
3. 在 Deploy & run transactions 选项卡中，将 Environment 设置为 Injected Provider - MetaMask。确认 MetaMask 当前处于 Xode 网络。
4. 点击 Deploy，并在 MetaMask 中确认交易。
5. 部署完成后，使用一个数字调用 `store`，然后调用 `retrieve` 读取该值。

## 使用 Hardhat 部署合约

在 `hardhat.config.js` 中将 XODE 添加为一个网络：

```js
require('@nomicfoundation/hardhat-toolbox')

module.exports = {
  solidity: '0.8.20',
  networks: {
    xode: {
      url: 'http://127.0.0.1:8545',
      chainId: 3417,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
}
```

然后使用 `--network xode` 进行部署，例如：

```bash
npx hardhat run scripts/deploy.js --network xode
```

不要将私钥写入代码中。本示例从 `PRIVATE_KEY` 环境变量中读取私钥。

## 账户与地址

XODE 账户有两种形式，两者都可以使用合约。

* **以太坊账户**（`0x…` 地址，例如来自 MetaMask）可以直接与以太坊工具配合使用。
* **Polkadot 账户**（SS58 地址，例如来自 Xterium、Talisman 或 Polkadot.js）也拥有一个以太坊风格的 `0x…` 地址。在将 Polkadot 账户用于以太坊工具或合约之前，需要调用一次 `revive.mapAccount()` 来注册该地址。在 Polkadot.js Apps 中，该调用位于 Developer → Extrinsics 下。

## 内置合约（预编译合约）

XODE 运行时在固定地址上包含一些内置合约。您的合约和工具可以像调用其他合约一样调用它们。

### 作为 ERC-20 代币的资产

在 XODE `Assets` 模块中创建的每一种资产（例如 XAV）都可以作为标准 ERC-20 代币使用，无需部署代币合约。它支持标准的 ERC-20 函数，包括 `totalSupply`、`balanceOf`、`transfer`、`approve` 和 `transferFrom`。

每种资产的 ERC-20 地址由其资产 ID 构成：

```text
0x[asset ID as 8 hex digits]000000000000000000000000[01200000]
```

例如，XAV 的资产 ID 为 `1000000004`，十六进制为 `3b9aca04`，因此其 ERC-20 地址为：

```text
0x3b9aca0400000000000000000000000001200000
```

要在 MetaMask 中使用某种资产，请选择 Import tokens 并粘贴其 ERC-20 地址。

来自 XODE `PoolAssets` 模块的流动性池代币也以相同方式工作，只是末尾为 `03200000` 而不是 `01200000`。

### XCM

位于 `0x00000000000000000000000000000000000a0000` 的 XCM 预编译合约允许合约发送跨链（XCM）消息。

## 押金

合约需要为其使用的链上存储付费。当您部署合约或合约存储数据时，会从付费账户中冻结一笔以 XON 计的押金。存储被释放时，押金将被退还。

## Solidity 还是 ink!？

| | EVM (Solidity) | WASM (ink!) |
| --- | --- | --- |
| 语言 | Solidity | 使用 ink! 的 Rust |
| 运行时模块 | `pallet-revive` | `pallet-contracts` |
| 工具 | MetaMask, Remix, Hardhat, ethers.js | cargo-contract, Polkadot.js |
| 最适合 | 移植以太坊合约、以太坊开发者 | Rust 开发者 |

来源：[XODE 运行时](https://github.com/D2-Xode/xode-blockchain/blob/main/runtime/src/configs/mod.rs) 中的 `pallet-revive` 设置，以及 xode-blockchain 仓库中的[以太坊支持指南](https://github.com/D2-Xode/xode-blockchain#ethereum-support)。
