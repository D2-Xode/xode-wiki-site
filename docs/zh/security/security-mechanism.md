# 安全机制

## 简介

Xode 平行链通过密码学验证、共识协议（AURA 和 GRANDPA）以及中继链验证，实现了稳健的区块验证和交易安全机制。这些机制确保了交易完整性、防范欺诈，并在 Polkadot 生态系统内提供经济安全保障。

## 安全机制

### 共识机制：Xode 平行链采用混合共识方式

* AURA 用于区块生产：通过轮询式的区块生产方式确保活性，验证人按照既定顺序被选中来生产区块。  
* GRANDPA（GHOST-based Recursive ANcestor Deriving Prefix Agreement，基于 GHOST 的递归祖先派生前缀协议）用于最终性：通过就区块链达成共识来确保最终性。

### 状态证明与欺诈防范

* Merkle 证明：用于高效、安全的存储验证。  
* 链上治理与运行时升级：通过民主决策防止未经授权的变更。

### 跨链安全（XCMP 和 HRMP）

* XCMP（Cross-Chain Message Passing，跨链消息传递）：确保平行链之间的安全通信。  
* HRMP（Horizontal Relay-routed Message Passing，经中继路由的水平消息传递）：一种确保消息完整性的临时消息传递协议。

### 经济安全

* 罚没条件：验证人和收集人可能因不当行为（例如双重签名、宕机）而受到惩罚。  
* 交易手续费与基于权重的执行：防止垃圾交易和 DoS 攻击。  
* 绑定与质押要求：确保验证人在网络中拥有经济利益。

## 更多信息

Xode 质押：[XODE 质押](/zh/network/xode-staking)   
Polkadot 安全协议：[https://wiki.polkadot.network/docs/learn-parachains-protocol](https://wiki.polkadot.network/docs/learn-parachains-protocol) 
