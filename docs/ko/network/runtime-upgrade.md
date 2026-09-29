# 런타임 업그레이드

## 런타임 업그레이드가 릴리스되는 곳

XODE 런타임 업그레이드는 [xode-blockchain 릴리스 페이지](https://github.com/D2-Xode/xode-blockchain/releases)에 게시됩니다. 각 릴리스에는 런타임의 새 `spec_version`을 포함한 변경 사항 설명과 다음 파일이 함께 제공됩니다.

| 파일 | 설명 |
| --- | --- |
| `xode_runtime.compact.compressed.wasm` | 업그레이드로 체인에 적용되는 컴파일된 런타임 |
| `xode-node` | x86-64용 노드 바이너리 |
| `xode-node-aarch64` | ARM64(aarch64)용 노드 바이너리 |
| `polkadot_raw_chain_spec.json` | Polkadot 기반 XODE의 체인스펙 |

2026년 9월 기준 최신 릴리스는 [v0.1.2.14](https://github.com/D2-Xode/xode-blockchain/releases/tag/v0.1.2.14)이며, `spec_version`을 14로 올렸습니다. 체인에서 실행 중인 런타임을 확인하려면 XODE에 연결된 [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fpolkadot-rpcnode.xode.net#/explorer)를 여세요. 왼쪽 위에 런타임 이름과 버전이 표시됩니다(예: `xode-runtime/14`).

이 페이지의 나머지 부분에서는 로컬 테스트 네트워크에서 런타임 업그레이드를 시험해 보는 방법을 설명합니다.

## pallet-sudo를 사용한 런타임 업그레이드(runtime upgrade) 시뮬레이션

1. Xode 바이너리 다운로드

`x86_64`

```bash
curl -L "https://github.com/D2-Xode/xode-blockchain/releases/download/v0.1.2.14/xode-node" -o xode-node
```

2. Zombienet을 사용하여 노드 실행  

```bash
./zombienet-launch.sh
```

3. 새 터미널 열기  

4. 코드 수정(버전 변경)  

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

5. 코드 컴파일  

```bash
cargo build --release --package xode-node
```

6. wasm 파일 위치 확인

```text
./target/release/wbuild/xode-runtime/xode_runtime.compact.compressed.wasm
```

7. Polkadot.JS(Zombienet/Parachain)를 엽니다. SUDO를 사용하여 WASM 파일을 업로드합니다.  

   ![](../../network/images/runtime-upgrade-1.png)  

8. 새 런타임 버전(template-parachain/2)이 적용되었는지 확인합니다  

   ![](../../network/images/runtime-upgrade-2.png)

## pallet-democracy(OpenGov)를 사용한 런타임 업그레이드 시뮬레이션
