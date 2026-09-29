# EVM 스마트 컨트랙트

XODE 블록체인은 이더리움 스마트 컨트랙트를 실행합니다. Solidity로 컨트랙트를 작성하고, MetaMask, Remix, Hardhat, ethers.js, Web3.js 등 이미 익숙한 이더리움 도구로 배포하고 사용할 수 있습니다.

이 기능은 이더리움 호환 컨트랙트를 위한 Polkadot SDK의 스마트 컨트랙트 모듈인 `pallet-revive`를 통해 제공됩니다. `pallet-revive`는 Polkadot 파라체인(para ID 3417)에서 동작하는 XODE 런타임의 일부이며, [WASM 스마트 컨트랙트](/ko/smart-contract/wasm-smart-contract)에서 설명하는 ink! 컨트랙트와 함께 실행됩니다.

## 작동 방식

이더리움 도구와 XODE는 서로 다른 언어를 사용합니다. 도구는 이더리움 JSON-RPC를 사용하고, XODE 노드는 Substrate RPC를 사용합니다. 그 사이에서 `eth-rpc`라는 작은 어댑터가 둘을 연결하여 요청을 변환합니다.

1. 지갑이나 개발 도구가 "이 컨트랙트를 배포하라"와 같은 이더리움 요청을 `eth-rpc`로 보냅니다.
2. `eth-rpc`는 이를 XODE 트랜잭션으로 변환하여 XODE 노드로 전송합니다.
3. 온체인에서는 `pallet-revive`가 컨트랙트를 실행하고 그 상태를 저장합니다.

XODE 런타임은 두 가지 종류의 컨트랙트 코드를 지원합니다.

* **EVM 바이트코드**: 이더리움에서 사용되는 Solidity 컴파일러(`solc`)의 일반적인 출력물입니다. 기존 컨트랙트와 도구를 수정 없이 그대로 사용할 수 있습니다.
* **PolkaVM 바이트코드**: RISC-V 기반 가상 머신을 위한 Polkadot의 컴파일러인 `resolc`로 컴파일한 Solidity 코드입니다. 이는 선택 사항입니다.

## 네트워크 정보

| 설정 | 값 |
| --- | --- |
| 체인 ID | `3417` (16진수 `0xd59`) |
| 통화 기호 | `XON` |
| 이더리움 도구에 표시되는 소수 자릿수 | 18 |
| Substrate RPC (메인넷) | `wss://polkadot-rpcnode.xode.net` |
| 이더리움 RPC | `eth-rpc`를 직접 실행 (아래 참조) |

체인 ID는 XODE의 para ID인 3417과 동일합니다.

### XON 소수 자릿수

XON은 XODE 자체에서는 소수 자릿수가 12이지만, 이더리움 도구는 18을 기대합니다. `pallet-revive`가 둘 사이를 변환하므로 MetaMask에서 1 XON은 1 XON으로 표시됩니다. 이 변환은 원시 금액(raw amount)을 다룰 때만 의미가 있습니다. 이더리움 측에서 1 XON은 `1000000000000` (10¹²)이 아니라 `1000000000000000000` (10¹⁸)입니다.

## 이더리움 RPC 어댑터 설정

이더리움 도구에는 이더리움 RPC URL이 필요합니다. 이 위키에는 아직 XODE용 공개 RPC URL이 등록되어 있지 않으므로, 아래 단계에서는 `eth-rpc` 어댑터를 로컬 컴퓨터에서 실행합니다.

STEP 1: Rust를 설치하거나 업데이트합니다. `eth-rpc`는 Rust 1.91 이상이 필요합니다.

```bash
rustup update stable
rustup default stable
rustc --version
```

STEP 2: `eth-rpc` 설치

```bash
cargo install pallet-revive-eth-rpc --locked
```

STEP 3: 연결할 XODE 노드를 시작합니다. 개발용으로는 [xode-blockchain](https://github.com/D2-Xode/xode-blockchain) 저장소에서 로컬 노드를 실행합니다([XODE 컴파일하기](/ko/network/compiling-xode) 참조).

```bash
./target/release/xode-node --dev --rpc-port 9944
```

STEP 4: `eth-rpc`를 시작하고 노드를 가리키도록 설정

```bash
eth-rpc --node-rpc-url ws://127.0.0.1:9944 --rpc-port 8545
```

로컬 노드 대신 XODE 메인넷을 사용하려면, 메인넷 Substrate RPC를 노드 URL로 지정합니다.

```bash
eth-rpc --node-rpc-url wss://polkadot-rpcnode.xode.net --rpc-port 8545
```

STEP 5: 정상적으로 응답하는지 확인합니다. 응답에는 체인 ID인 `0xd59`가 포함되어야 합니다.

```bash
curl -X POST http://127.0.0.1:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'
```

## MetaMask에 XODE 추가하기

1. MetaMask를 열고 Settings → Networks → Add network → Add a network manually로 이동합니다.
2. 다음 정보를 입력합니다.

| 항목 | 값 |
| --- | --- |
| Network name | `Xode` |
| RPC URL | `http://127.0.0.1:8545` |
| Chain ID | `3417` |
| Currency symbol | `XON` |

3. 저장한 뒤 Xode 네트워크로 전환합니다.

## Remix로 컨트랙트 배포하기

이 예제에서는 숫자 하나를 저장하는 간단한 컨트랙트를 배포합니다.

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

1. [Remix](https://remix.ethereum.org)를 열고 위 코드로 `Storage.sol` 파일을 만듭니다.
2. Solidity compiler 탭에서 Compile Storage.sol을 클릭합니다.
3. Deploy & run transactions 탭에서 Environment를 Injected Provider - MetaMask로 설정합니다. MetaMask가 Xode 네트워크에 연결되어 있는지 확인합니다.
4. Deploy를 클릭하고 MetaMask에서 트랜잭션을 승인합니다.
5. 배포가 완료되면 숫자를 넣어 `store`를 호출한 다음, `retrieve`를 호출하여 저장된 값을 다시 읽어옵니다.

## Hardhat으로 컨트랙트 배포하기

`hardhat.config.js`에 XODE를 네트워크로 추가합니다.

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

그런 다음 `--network xode` 옵션으로 배포합니다. 예를 들면 다음과 같습니다.

```bash
npx hardhat run scripts/deploy.js --network xode
```

개인 키를 코드에 포함하지 마십시오. 위 예제는 `PRIVATE_KEY` 환경 변수에서 키를 읽어옵니다.

## 계정과 주소

XODE 계정에는 두 가지 형태가 있으며, 둘 다 컨트랙트를 사용할 수 있습니다.

* **이더리움 계정**(예: MetaMask의 `0x…` 주소)은 이더리움 도구에서 바로 사용할 수 있습니다.
* **Polkadot 계정**(예: Xterium, Talisman, Polkadot.js의 SS58 주소)에도 이더리움 형식의 `0x…` 주소가 있습니다. Polkadot 계정을 이더리움 도구나 컨트랙트에서 사용하기 전에 `revive.mapAccount()`를 호출하여 해당 주소를 한 번 등록해야 합니다. Polkadot.js Apps에서는 Developer → Extrinsics에서 이 호출을 찾을 수 있습니다.

## 내장 컨트랙트 (프리컴파일)

XODE 런타임에는 고정된 주소에 내장 컨트랙트가 포함되어 있습니다. 여러분의 컨트랙트와 도구는 다른 컨트랙트와 마찬가지로 이를 호출할 수 있습니다.

### ERC-20 토큰으로서의 자산

XAV와 같이 XODE `Assets` 모듈에서 생성된 모든 자산은 토큰 컨트랙트를 배포하지 않고도 표준 ERC-20 토큰으로 사용할 수 있습니다. `totalSupply`, `balanceOf`, `transfer`, `approve`, `transferFrom` 등 표준 ERC-20 함수를 지원합니다.

각 자산의 ERC-20 주소는 자산 ID로부터 만들어집니다.

```text
0x[asset ID as 8 hex digits]000000000000000000000000[01200000]
```

예를 들어 XAV의 자산 ID는 `1000000004`이며, 이는 16진수로 `3b9aca04`이므로 ERC-20 주소는 다음과 같습니다.

```text
0x3b9aca0400000000000000000000000001200000
```

MetaMask에서 자산을 사용하려면 Import tokens를 선택하고 해당 ERC-20 주소를 붙여넣습니다.

XODE `PoolAssets` 모듈의 유동성 풀 토큰도 같은 방식으로 동작하며, 끝부분이 `01200000` 대신 `03200000`입니다.

### XCM

`0x00000000000000000000000000000000000a0000`에 있는 XCM 프리컴파일을 통해 컨트랙트가 크로스체인(XCM) 메시지를 보낼 수 있습니다.

## 예치금

컨트랙트는 사용하는 온체인 스토리지에 대한 비용을 지불합니다. 컨트랙트를 배포하거나 컨트랙트가 데이터를 저장하면, 비용을 지불하는 계정에서 XON 예치금(deposit)이 보류됩니다. 스토리지가 해제되면 예치금은 반환됩니다.

## Solidity와 ink! 중 무엇을 선택할까요?

| | EVM (Solidity) | WASM (ink!) |
| --- | --- | --- |
| 언어 | Solidity | ink!를 사용하는 Rust |
| 런타임 모듈 | `pallet-revive` | `pallet-contracts` |
| 도구 | MetaMask, Remix, Hardhat, ethers.js | cargo-contract, Polkadot.js |
| 적합한 경우 | 이더리움 컨트랙트 이식, 이더리움 개발자 | Rust 개발자 |

출처: [XODE 런타임](https://github.com/D2-Xode/xode-blockchain/blob/main/runtime/src/configs/mod.rs)의 `pallet-revive` 설정 및 xode-blockchain 저장소의 [Ethereum Support 가이드](https://github.com/D2-Xode/xode-blockchain#ethereum-support).
