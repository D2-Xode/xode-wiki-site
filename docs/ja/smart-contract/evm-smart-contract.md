# EVM スマートコントラクト

XODE ブロックチェーンでは Ethereum のスマートコントラクトを実行できます。Solidity でコントラクトを記述し、MetaMask、Remix、Hardhat、ethers.js、Web3.js など、使い慣れた Ethereum のツールでデプロイして利用できます。

この機能は、Ethereum 互換コントラクト向けの Polkadot SDK のスマートコントラクトモジュールである `pallet-revive` によって提供されています。`pallet-revive` は Polkadot パラチェーン（パラ ID 3417）上の XODE ランタイムに組み込まれており、[WASM スマートコントラクト](/ja/smart-contract/wasm-smart-contract)で説明している ink! コントラクトと並行して動作します。

## 仕組み

Ethereum のツールと XODE は、異なる言語で通信します。ツールは Ethereum JSON-RPC を使用し、XODE ノードは Substrate RPC を使用します。その間に `eth-rpc` という小さなアダプターが入り、両者を変換します。

1. ウォレットや開発ツールが、「このコントラクトをデプロイする」といった Ethereum のリクエストを `eth-rpc` に送信します。
2. `eth-rpc` がそれを XODE のトランザクションに変換し、XODE ノードに送信します。
3. オンチェーンでは、`pallet-revive` がコントラクトを実行し、その状態を保存します。

XODE ランタイムは、2 種類のコントラクトコードを受け付けます。

* **EVM バイトコード**：Ethereum で使われている、Solidity コンパイラー（`solc`）の通常の出力です。既存のコントラクトやツールを変更せずにそのまま使用できます。
* **PolkaVM バイトコード**：RISC-V ベースの仮想マシン向けの Polkadot のコンパイラーである `resolc` でコンパイルした Solidity です。こちらは任意です。

## ネットワーク情報

| 設定 | 値 |
| --- | --- |
| チェーン ID | `3417`（16 進数で `0xd59`） |
| 通貨シンボル | `XON` |
| Ethereum ツールで表示される小数桁数 | 18 |
| Substrate RPC（メインネット） | `wss://polkadot-rpcnode.xode.net` |
| Ethereum RPC | `eth-rpc` を自分で実行します（下記参照） |

チェーン ID は XODE のパラ ID と同じ 3417 です。

### XON の小数桁数

XON は XODE 上では小数点以下 12 桁ですが、Ethereum のツールは 18 桁を前提としています。`pallet-revive` が両者の間で変換を行うため、MetaMask では 1 XON は 1 XON として表示されます。この変換が関係するのは生の数量を扱う場合のみです。Ethereum 側では、1 XON は `1000000000000`（10¹²）ではなく `1000000000000000000`（10¹⁸）になります。

## Ethereum RPC アダプターのセットアップ

Ethereum のツールには Ethereum RPC の URL が必要です。この Wiki ではまだ XODE の公開 RPC を掲載していないため、以下の手順では `eth-rpc` アダプターを自分のコンピューター上で実行します。

STEP 1：Rust をインストールまたは更新します。`eth-rpc` には Rust 1.91 以降が必要です。

```bash
rustup update stable
rustup default stable
rustc --version
```

STEP 2：`eth-rpc` をインストールします

```bash
cargo install pallet-revive-eth-rpc --locked
```

STEP 3：接続先の XODE ノードを起動します。開発用には、[xode-blockchain](https://github.com/D2-Xode/xode-blockchain) リポジトリからローカルノードを実行します（[XODE のコンパイル](/ja/network/compiling-xode)を参照）。

```bash
./target/release/xode-node --dev --rpc-port 9944
```

STEP 4：`eth-rpc` を起動し、ノードに接続します

```bash
eth-rpc --node-rpc-url ws://127.0.0.1:9944 --rpc-port 8545
```

ローカルノードではなく XODE メインネットを利用する場合は、ノードの URL としてメインネットの Substrate RPC を指定します。

```bash
eth-rpc --node-rpc-url wss://polkadot-rpcnode.xode.net --rpc-port 8545
```

STEP 5：応答があることを確認します。応答にはチェーン ID `0xd59` が含まれているはずです。

```bash
curl -X POST http://127.0.0.1:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'
```

## MetaMask に XODE を追加する

1. MetaMask を開き、Settings → Networks → Add network → Add a network manually に進みます。
2. 次の内容を入力します。

| 項目 | 値 |
| --- | --- |
| Network name | `Xode` |
| RPC URL | `http://127.0.0.1:8545` |
| Chain ID | `3417` |
| Currency symbol | `XON` |

3. 保存してから、Xode ネットワークに切り替えます。

## Remix でコントラクトをデプロイする

この例では、数値を保存する小さなコントラクトをデプロイします。

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

1. [Remix](https://remix.ethereum.org) を開き、上記のコードで `Storage.sol` というファイルを作成します。
2. Solidity compiler タブで、Compile Storage.sol をクリックします。
3. Deploy & run transactions タブで、Environment を Injected Provider - MetaMask に設定します。MetaMask が Xode ネットワークに接続されていることを確認してください。
4. Deploy をクリックし、MetaMask でトランザクションを承認します。
5. デプロイが完了したら、数値を指定して `store` を呼び出し、続けて `retrieve` を呼び出して値を読み取ります。

## Hardhat でコントラクトをデプロイする

`hardhat.config.js` に XODE をネットワークとして追加します。

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

その後、`--network xode` を指定してデプロイします。例：

```bash
npx hardhat run scripts/deploy.js --network xode
```

秘密鍵はコードに含めないでください。この例では、秘密鍵を環境変数 `PRIVATE_KEY` から読み込んでいます。

## アカウントとアドレス

XODE のアカウントには 2 つの形式があります。どちらもコントラクトを利用できます。

* **Ethereum アカウント**（MetaMask などの `0x…` アドレス）は、Ethereum のツールですぐに利用できます。
* **Polkadot アカウント**（Xterium、Talisman、Polkadot.js などの SS58 アドレス）にも、Ethereum 形式の `0x…` アドレスがあります。Polkadot アカウントを Ethereum のツールやコントラクトで使用する前に、`revive.mapAccount()` を呼び出してそのアドレスを一度登録してください。Polkadot.js Apps では、この呼び出しは Developer → Extrinsics にあります。

## 組み込みコントラクト（プリコンパイル）

XODE ランタイムには、固定アドレスに配置された組み込みコントラクトが含まれています。コントラクトやツールから、他のコントラクトと同じように呼び出せます。

### ERC-20 トークンとしてのアセット

XAV など、XODE の `Assets` モジュールで作成されたすべてのアセットは、トークンコントラクトをデプロイしなくても標準の ERC-20 トークンとして使用できます。`totalSupply`、`balanceOf`、`transfer`、`approve`、`transferFrom` をはじめとする標準の ERC-20 関数に対応しています。

各アセットの ERC-20 アドレスは、そのアセット ID から構成されます。

```text
0x[asset ID as 8 hex digits]000000000000000000000000[01200000]
```

たとえば、XAV のアセット ID は `1000000004` で、16 進数では `3b9aca04` となるため、ERC-20 アドレスは次のとおりです。

```text
0x3b9aca0400000000000000000000000001200000
```

MetaMask でアセットを使用するには、Import tokens を選択し、その ERC-20 アドレスを貼り付けます。

XODE の `PoolAssets` モジュールの流動性プールトークンも同様に使用できます。ただし、末尾は `01200000` ではなく `03200000` になります。

### XCM

`0x00000000000000000000000000000000000a0000` にある XCM プリコンパイルを使うと、コントラクトからクロスチェーン（XCM）メッセージを送信できます。

## デポジット

コントラクトは、使用するオンチェーンストレージの費用を支払います。コントラクトをデプロイしたり、コントラクトがデータを保存したりすると、支払いを行うアカウントから XON のデポジットが保留されます。デポジットはストレージが解放されると返却されます。

## Solidity と ink! のどちらを選ぶか

| | EVM（Solidity） | WASM（ink!） |
| --- | --- | --- |
| 言語 | Solidity | Rust（ink!） |
| ランタイムモジュール | `pallet-revive` | `pallet-contracts` |
| ツール | MetaMask, Remix, Hardhat, ethers.js | cargo-contract, Polkadot.js |
| 適した用途 | Ethereum コントラクトの移植、Ethereum 開発者 | Rust 開発者 |

出典：xode-blockchain リポジトリ内の [XODE ランタイム](https://github.com/D2-Xode/xode-blockchain/blob/main/runtime/src/configs/mod.rs)の `pallet-revive` 設定、および [Ethereum Support ガイド](https://github.com/D2-Xode/xode-blockchain#ethereum-support)。
