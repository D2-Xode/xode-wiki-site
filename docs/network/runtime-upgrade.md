# Runtime Upgrade

## Where runtime upgrades are released

XODE runtime upgrades are published on the [xode-blockchain releases page](https://github.com/D2-Xode/xode-blockchain/releases). Each release has notes on what changed, including the runtime's new `spec_version`, and comes with these files:

| File | What it is |
| --- | --- |
| `xode_runtime.compact.compressed.wasm` | The compiled runtime that the upgrade puts on chain |
| `xode-node` | Node binary for x86-64 |
| `xode-node-aarch64` | Node binary for ARM64 (aarch64) |
| `polkadot_raw_chain_spec.json` | Chain spec for XODE on Polkadot |

As of September 2026 the latest release is [v0.1.2.14](https://github.com/D2-Xode/xode-blockchain/releases/tag/v0.1.2.14), which raised `spec_version` to 14. To see which runtime the chain is running, open [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fpolkadot-rpcnode.xode.net#/explorer) connected to XODE: the runtime name and version show at the top left, for example `xode-runtime/14`.

The rest of this page shows how to try a runtime upgrade on a local test network.

## Runtime upgrade simulation using pallet-sudo

1. Download the Xode Binary

`x86_64`

```bash
curl -L "https://github.com/D2-Xode/xode-blockchain/releases/download/v0.1.2.14/xode-node" -o xode-node
```

2. Run the node using Zombienet  

```bash
./zombienet-launch.sh
```

3. Create a new terminal  

4. Modify the code (change version)  

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

5. Compile the code  

```bash
cargo build --release --package xode-node
```

6. Locate the wasm files

```text
./target/release/wbuild/xode-runtime/xode_runtime.compact.compressed.wasm
```

7. Open Polkadot.JS (Zombienet/Parachain).  Upload the WASM file using SUDO.  

   ![](./images/runtime-upgrade-1.png)  

8. To verify if you have the new runtime version: template-parachain/2  

   ![](./images/runtime-upgrade-2.png)

## Runtime upgrade simulation using pallet-democracy (OpenGov)
