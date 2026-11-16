# XODE Solochain Node

These steps run a node for the XODE Solochain, a standalone Substrate chain with its own validators. Unlike the [XODE Node](/network/xode-node), it doesn't connect to the Polkadot Relay Chain.

| Property | Value |
|----------|-------|
| Chain | Xode (`xode`) |
| Token | XON, 12 decimals |
| SS58 prefix | 280 |
| Block time | 1 second |
| EVM chain ID | 34170 |

The node binary and chain spec are published on the [xode-solochain releases page](https://github.com/D2-Xode/xode-solochain-release/releases). The commands below download v0.1.0; for a newer release, replace `v0.1.0` with its tag.

## Running a XODE Solochain node directly in the host

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
Description=Xode Solochain Node
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

## Ports

| Port | Purpose |
|------|---------|
| 30333 | p2p. Open it so other nodes can reach yours. |
| 9944 | Substrate JSON-RPC (HTTP and WebSocket) |
| 9615 | Prometheus metrics |

RPC only listens on localhost by default. Add `--rpc-external` and `--rpc-cors all` to the script to reach it from other machines, and put it behind a firewall or proxy if you do.

Once the node is running, connect to it with [Polkadot-JS Apps](https://polkadot.js.org/apps/#/explorer?rpc=ws://localhost:9944).
