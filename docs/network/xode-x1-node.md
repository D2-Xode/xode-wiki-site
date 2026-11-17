# XODE X1 Node

These steps run a node for XODE X1, a standalone Substrate chain with its own validators. Unlike the [XODE Node](/network/xode-node), it doesn't connect to the Polkadot Relay Chain.

| Property | Value |
|----------|-------|
| Chain | Xode (`xode`) |
| Token | XON, 12 decimals |
| SS58 prefix | 280 |
| Block time | 1 second |
| EVM chain ID | 34170 |

The node binary and chain spec are published on the [xode-solochain-release releases page](https://github.com/D2-Xode/xode-solochain-release/releases). The commands below download v0.1.0; for a newer release, replace `v0.1.0` with its tag.

## Running a XODE X1 node directly in the host

Minimum AWS Instance type: t2.medium

* vCPU: 2
* RAM: 4.0GB
* Storage: 500GB
* Operating System: Ubuntu 22.04 or higher, x86-64

STEP 1: Download the xode-solochain-node binary

```bash
curl -L "https://github.com/D2-Xode/xode-solochain-release/releases/download/v0.1.0/xode-solochain-node" -o xode-solochain-node
```

STEP 2: Download the chain spec

```bash
curl -L "https://github.com/D2-Xode/xode-solochain-release/releases/download/v0.1.0/xode-mainnet-raw.json" -o xode-mainnet-raw.json
```

STEP 3: Make the binary executable and check that it runs

```bash
chmod +x xode-solochain-node
./xode-solochain-node --version
```

STEP 4: Make a base path directory

```bash
mkdir xode-solochain
```

STEP 5: Create a shell script:

```bash
nano xode-solochain-node.sh
```

```bash
#!/bin/bash
/home/ubuntu/xode-solochain-node \
--chain /home/ubuntu/xode-mainnet-raw.json \
--base-path /home/ubuntu/xode-solochain \
--rpc-port 9944 \
--pruning archive \
--name "xode-solochain-node-name"
```

STEP 6: Make the xode-solochain-node.sh executable

```bash
chmod +x xode-solochain-node.sh
```

STEP 7: Test if it runs

```bash
./xode-solochain-node.sh
```

The log should show the node importing blocks. Stop it with `Ctrl+C` before the next step.

STEP 8: Create a service:

```bash
sudo nano /etc/systemd/system/xode-solochain.service
```

```ini
[Unit]
Description=Xode X1 Node
[Service]
ExecStart=/home/ubuntu/xode-solochain-node.sh
Restart=always
RestartSec=120
[Install]
WantedBy=multi-user.target
```

STEP 9: Enable the service

```bash
sudo systemctl enable xode-solochain.service
```

STEP 10: Start the service

```bash
sudo systemctl start xode-solochain.service
```

STEP 11: Wait for 30 seconds and check if the service is running

```bash
journalctl -f -u xode-solochain
```

## Running a XODE X1 validator

A validator authors and finalizes blocks. It's set up like the node above, with three additions: a fixed node key, the `--validator` flag, and session keys registered on-chain. Each session (1 hour), the candidates ranked highest by bond plus delegated stake become the validators.

You need an account holding at least 100 XON to bond, plus some XON for fees.

STEP 1: Download the Polkadot binary

The `polkadot` binary is used only to generate the node key.

```bash
curl -L "https://github.com/paritytech/polkadot-sdk/releases/download/polkadot-stable2512-2/polkadot" -o polkadot
chmod +x polkadot
```

STEP 2: Generate a node key

```bash
./polkadot key generate-node-key --file /home/ubuntu/node-key
```

The file holds the node's private network key. The command prints the node's peer ID, which other nodes use to find yours. Note it down, keep the file private, and don't lose it: the node needs the same key every time it starts.

STEP 3: Add `--validator` and `--node-key` to the shell script

```bash
nano xode-solochain-node.sh
```

```bash
#!/bin/bash
/home/ubuntu/xode-solochain-node \
--chain /home/ubuntu/xode-mainnet-raw.json \
--base-path /home/ubuntu/xode-solochain \
--rpc-port 9944 \
--pruning archive \
--validator \
--node-key $(cat /home/ubuntu/node-key) \
--name "xode-x1-validator-name"
```

Don't add `--rpc-external` to a validator. Its RPC should only be reachable from the machine itself.

STEP 4: Restart the service and wait for the node to finish syncing

```bash
sudo systemctl restart xode-solochain.service
journalctl -f -u xode-solochain
```

STEP 5: Generate session keys

Run this on the validator machine:

```bash
curl -H "Content-Type: application/json" \
  -d '{"id":1, "jsonrpc":"2.0", "method":"author_rotateKeys", "params":[]}' \
  http://localhost:9944
```

The `result` in the reply is your session keys, a long hex string starting with `0x`. The node keeps the matching private keys in its base path.

STEP 6: Register the session keys on-chain

Open [Polkadot-JS Apps connected to XODE X1](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fsolochain.xode.net#/explorer) (RPC endpoint `wss://solochain.xode.net`).

Go to **Developer → Extrinsics** and, from your validator account, submit:

* `session.setKeys`, with `keys` set to the hex string from STEP 5 and `proof` set to `0x`

STEP 7: Register as a candidate and bond

From the same account, submit:

1. `xodeStaking.registerCandidate`
2. `xodeStaking.bondCandidate`, with `newBond` of at least 100 XON. Enter it in the smallest unit, so 100 XON is `100000000000000` (12 decimals).

Your account can join the validator set at the start of the next session. Once it's a validator, the node log shows it preparing and importing blocks it authored.

## Ports

| Port | Purpose |
|------|---------|
| 30333 | p2p. Open it so other nodes can reach yours. |
| 9944 | Substrate JSON-RPC (HTTP and WebSocket) |
| 9615 | Prometheus metrics |

RPC only listens on localhost by default. Add `--rpc-external` and `--rpc-cors all` to the script to reach it from other machines, and put it behind a firewall or proxy if you do.

Once the node is running, connect to it with [Polkadot-JS Apps](https://polkadot.js.org/apps/#/explorer?rpc=ws://localhost:9944).
