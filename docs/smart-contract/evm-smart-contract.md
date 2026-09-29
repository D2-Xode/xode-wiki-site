# EVM Smart Contract

XODE Blockchain runs Ethereum smart contracts. You can write contracts in Solidity and deploy and use them with the Ethereum tools you already know, such as MetaMask, Remix, Hardhat, ethers.js and Web3.js.

This support comes from `pallet-revive`, the Polkadot SDK's smart contract module for Ethereum-compatible contracts. It is part of the XODE runtime on the Polkadot parachain (para ID 3417) and runs alongside the ink! contracts described in [WASM Smart Contract](/smart-contract/wasm-smart-contract).

## How it works

Ethereum tools and XODE speak different languages: the tools use Ethereum JSON-RPC, and a XODE node uses Substrate RPC. A small adapter called `eth-rpc` sits between them and translates.

1. Your wallet or development tool sends an Ethereum request, such as "deploy this contract", to `eth-rpc`.
2. `eth-rpc` turns it into a XODE transaction and sends it to a XODE node.
3. On chain, `pallet-revive` runs the contract and stores its state.

The XODE runtime accepts two kinds of contract code:

* **EVM bytecode**: the normal output of the Solidity compiler (`solc`), as used on Ethereum. Existing contracts and tools work without changes.
* **PolkaVM bytecode**: Solidity compiled with `resolc`, Polkadot's compiler for its RISC-V based virtual machine. This is optional.

## Network details

| Setting | Value |
| --- | --- |
| Chain ID | `3417` (hex `0xd59`) |
| Currency symbol | `XON` |
| Decimals shown in Ethereum tools | 18 |
| Substrate RPC (mainnet) | `wss://polkadot-rpcnode.xode.net` |
| Ethereum RPC | Run `eth-rpc` yourself (see below) |

The chain ID is the same as XODE's para ID, 3417.

### XON decimals

XON has 12 decimals on XODE itself, but Ethereum tools expect 18. `pallet-revive` converts between the two, so 1 XON is shown as 1 XON in MetaMask. The conversion only matters if you work with raw amounts: on the Ethereum side, 1 XON is `1000000000000000000` (10¹⁸) instead of `1000000000000` (10¹²).

## Set up the Ethereum RPC adapter

Ethereum tools need an Ethereum RPC URL. This wiki doesn't list a public one for XODE yet, so these steps run the `eth-rpc` adapter on your own computer.

STEP 1: Install or update Rust. `eth-rpc` needs Rust 1.91 or later.

```bash
rustup update stable
rustup default stable
rustc --version
```

STEP 2: Install `eth-rpc`

```bash
cargo install pallet-revive-eth-rpc --locked
```

STEP 3: Start a XODE node to connect to. For development, run a local node from the [xode-blockchain](https://github.com/D2-Xode/xode-blockchain) repository (see [Compiling XODE](/network/compiling-xode)):

```bash
./target/release/xode-node --dev --rpc-port 9944
```

STEP 4: Start `eth-rpc` and point it at the node

```bash
eth-rpc --node-rpc-url ws://127.0.0.1:9944 --rpc-port 8545
```

To work with XODE mainnet instead of a local node, use the mainnet Substrate RPC as the node URL:

```bash
eth-rpc --node-rpc-url wss://polkadot-rpcnode.xode.net --rpc-port 8545
```

STEP 5: Check that it responds. The reply should contain the chain ID, `0xd59`.

```bash
curl -X POST http://127.0.0.1:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'
```

## Add XODE to MetaMask

1. Open MetaMask, then go to Settings → Networks → Add network → Add a network manually.
2. Enter the following:

| Field | Value |
| --- | --- |
| Network name | `Xode` |
| RPC URL | `http://127.0.0.1:8545` |
| Chain ID | `3417` |
| Currency symbol | `XON` |

3. Save, then switch to the Xode network.

## Deploy a contract with Remix

This example deploys a small contract that stores a number.

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

1. Open [Remix](https://remix.ethereum.org) and create a file called `Storage.sol` with the code above.
2. On the Solidity compiler tab, click Compile Storage.sol.
3. On the Deploy & run transactions tab, set Environment to Injected Provider - MetaMask. Check that MetaMask is on the Xode network.
4. Click Deploy and confirm the transaction in MetaMask.
5. When it is deployed, call `store` with a number, then call `retrieve` to read it back.

## Deploy a contract with Hardhat

Add XODE as a network in `hardhat.config.js`:

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

Then deploy with `--network xode`, for example:

```bash
npx hardhat run scripts/deploy.js --network xode
```

Keep private keys out of your code. The example reads the key from the `PRIVATE_KEY` environment variable.

## Accounts and addresses

XODE accounts come in two forms. Both can use contracts.

* **Ethereum accounts** (`0x…` addresses, for example from MetaMask) work with Ethereum tools straight away.
* **Polkadot accounts** (SS58 addresses, for example from Xterium, Talisman or Polkadot.js) also have an Ethereum-style `0x…` address. Before you use a Polkadot account with Ethereum tools or contracts, register that address once by calling `revive.mapAccount()`. In Polkadot.js Apps, the call is under Developer → Extrinsics.

## Built-in contracts (precompiles)

The XODE runtime includes built-in contracts at fixed addresses. Your contracts and tools can call them like any other contract.

### Assets as ERC-20 tokens

Every asset created in the XODE `Assets` module, such as XAV, can be used as a standard ERC-20 token without deploying a token contract. It supports the standard ERC-20 functions, including `totalSupply`, `balanceOf`, `transfer`, `approve` and `transferFrom`.

Each asset's ERC-20 address is built from its asset ID:

```text
0x[asset ID as 8 hex digits]000000000000000000000000[01200000]
```

For example, XAV has asset ID `1000000004`, which is `3b9aca04` in hex, so its ERC-20 address is:

```text
0x3b9aca0400000000000000000000000001200000
```

To use an asset in MetaMask, choose Import tokens and paste its ERC-20 address.

Liquidity pool tokens from the XODE `PoolAssets` module work the same way, with `03200000` at the end instead of `01200000`.

### XCM

An XCM precompile at `0x00000000000000000000000000000000000a0000` lets contracts send cross-chain (XCM) messages.

## Deposits

Contracts pay for the on-chain storage they use. When you deploy a contract or it stores data, a deposit in XON is held from the account that pays. The deposit is returned when the storage is freed.

## Solidity or ink!?

| | EVM (Solidity) | WASM (ink!) |
| --- | --- | --- |
| Language | Solidity | Rust with ink! |
| Runtime module | `pallet-revive` | `pallet-contracts` |
| Tools | MetaMask, Remix, Hardhat, ethers.js | cargo-contract, Polkadot.js |
| Best for | Porting Ethereum contracts, Ethereum developers | Rust developers |

Source: the `pallet-revive` settings in the [XODE runtime](https://github.com/D2-Xode/xode-blockchain/blob/main/runtime/src/configs/mod.rs) and the [Ethereum Support guide](https://github.com/D2-Xode/xode-blockchain#ethereum-support) in the xode-blockchain repository.
