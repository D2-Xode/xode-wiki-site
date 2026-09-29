# XODE Blockchain

XODE Blockchain 是一条独立的区块链（平行链 3417），与 Polkadot 中继链并行运行。XODE 最初是 Kusama 上的平行链 3344，之后已迁移至 Polkadot（参见下文的[从 Kusama 到 Polkadot](#from-kusama-to-polkadot)）。

### 可扩展

XODE Blockchain 与 Polkadot 网络集成，可同时处理多笔交易和智能合约执行。通过并行运行，XODE Blockchain 提升了网络的整体吞吐量和可扩展性，与传统区块链架构相比可实现更高的交易吞吐量。

### 互操作

XODE Blockchain 可以通过 Polkadot 中继链与其他区块链（例如 Polkadot Asset Hub 及其他平行链）进行通信。这种互操作性使不同平行链之间以及与连接到 Polkadot 的其他区块链网络之间能够无缝交换资产、数据和消息。

### 可定制

XODE Blockchain 拥有自己独特的功能、共识机制、治理结构和代币经济。这种灵活性使开发者能够针对特定用例定制区块链，例如去中心化金融（DeFi）、非同质化代币（NFT）、供应链管理、身份解决方案等。

### 共享安全

XODE Blockchain 受益于 Polkadot 网络的共享安全。平行链无需维护自己的验证人集合和安全基础设施，而是依靠 Polkadot 中继链的验证人来保障其交易安全并确保区块链的完整性。

### 治理

XODE Blockchain 拥有自己的治理机制，允许 XON 持有者参与协议升级、参数调整和新增功能等决策过程。这确保了 XODE 社区对网络的演进拥有自主权和控制权。

## 从 Kusama 到 Polkadot {#from-kusama-to-polkadot}

XODE Blockchain 最初作为 Kusama 中继链上的平行链运行，para ID 为 3344。之后它已迁移至 Polkadot 中继链，目前以 para ID 3417 运行。XODE 已不再是 Kusama 平行链。

<ParachainMigration />

| | 以前 | 当前 |
| --- | --- | --- |
| 中继链 | Kusama | Polkadot |
| Para ID | 3344 | 3417 |
| 安全保障 | Kusama 验证人 | Polkadot 验证人 |

如需运行节点，请按照使用 Polkadot 链规范的 [XODE 节点](/zh/network/xode-node) 指南操作。[XODE 节点 (Kusama 3344)](/zh/network/xode-node-kusama-3344) 指南仅保留作参考。

## XODE Blockchain 基于 Substrate 构建

Substrate 是由 Polkadot 创建的区块链开发框架。它为开发者提供了一个强大而灵活的平台，用于构建自定义区块链网络和去中心化应用（DApp）。

### 模块化与可定制性

借助 Substrate 的模块化框架，XODE Blockchain 可以根据特定需求定制其区块链，无论是在可扩展性、隐私还是治理方面。XODE Blockchain 可以轻松集成自定义模块，或从现有模块中进行选择，以优化其功能。

### 效率与性能

Substrate 轻量而高效的设计确保了 XODE Blockchain 以高吞吐量和低延迟运行，从而实现快速的交易处理和更好的用户体验。这种效率对于 XODE Blockchain 高效处理大量交易至关重要。

### 互操作性

作为基于 Substrate 的区块链，XODE Blockchain 可以与 Polkadot 生态系统中的其他区块链无缝连接和通信。这种互操作性使资产和数据能够在不同的区块链网络之间交换，从而增强了 XODE Blockchain 的实用性和易用性。

### 安全性

XODE Blockchain 继承了 Substrate 强大的安全特性，包括内置的安全机制、密码学原语以及安全开发的最佳实践。这确保了 XODE Blockchain 的完整性和可靠性，保护用户的资产和数据免受潜在威胁。
