# XODE Node

These steps run a node for XODE on the Polkadot Relay Chain (para ID 3417).

Node binaries and runtime upgrades are published on the [xode-blockchain releases page](https://github.com/D2-Xode/xode-blockchain/releases). The commands below download v0.1.2.14; for a newer release, replace `v0.1.2.14` with its tag.

## Running a XODE node directly in the host

Minimum AWS Instance type: t2.medium	

* vCPU: 2  
* RAM: 4.0GB  
* Storage: 500GB  
* Operating System: Ubuntu 22.0 or higher

STEP 1: Downloading the xode-node binary

### x86-64

```bash
curl -L "https://github.com/D2-Xode/xode-blockchain/releases/download/v0.1.2.14/xode-node" -o xode-node
```

### Aarch64

```bash
curl -L "https://github.com/D2-Xode/xode-blockchain/releases/download/v0.1.2.14/xode-node-aarch64" -o xode-node
```

STEP 2: Download the xode chainspec

```bash
wget --no-check-certificate 'https://github.com/D2-Xode/xode-blockchain/releases/download/v0.1.2.14/polkadot_raw_chain_spec.json' -O raw-xode-node-chainspec.json
```

STEP 3: Make the xode-node binary executable

```bash
chmod +x xode-node
```

STEP 4: Make a xode base path directory

```bash
mkdir xode
```

STEP 5: Create a shell script:

```bash
nano xode-node.sh
```

```bash
#!/bin/bash
/home/ubuntu/xode-node \
--chain /home/ubuntu/raw-xode-node-chainspec.json \
--base-path /home/ubuntu/xode \
--rpc-port 9944 \
--pruning archive \
--telemetry-url "wss://telemetry.polkadot.io/submit/ 0" \
--name "xode-node-name"
```

STEP 6: Make the xode-node.sh executable

```bash
chmod + xode-node.sh
```

STEP 7: Test if it runs

```bash
./xode-node.sh
```

STEP 8: Create a service:

```bash
sudo nano /etc/systemd/system/xode-collator.service
```

```ini
[Unit]
Description=Xode Node
[Service]
ExecStart=/home/ubuntu/xode-node.sh
Restart=always
RestartSec=120
[Install]
WantedBy=multi-user.target
```

STEP 9: Enable the service

```bash
sudo systemctl enable xode-collator.service
```

STEP 10: Start the service

```bash
sudo systemctl start xode-collator.service
```

STEP 11: Wait for 30 seconds and check if the service is running

```bash
journalctl -f -u xode-collator
```

STEP 12: Check the telemetry site to view your node

[https://telemetry.polkadot.io/\#/0xb2985e778bb748c70e450dcc084cc7da79fe742cc23d3b040abd7028187de69c](https://telemetry.polkadot.io/#/0xb2985e778bb748c70e450dcc084cc7da79fe742cc23d3b040abd7028187de69c) 

## Running XODE node using container (Podman)

STEP 1: Install Podman

```bash
sudo apt-get update
sudo apt-get -y install podman
```

STEP 2: Download xode-node image 

### x86-64: [https://hub.docker.com/r/xoderockson/xode-node-x86\_64](https://hub.docker.com/r/xoderockson/xode-node-x86_64%20)

```bash
podman pull docker.io/xoderockson/xode-node-x86_64
```

### aarch64: [https://hub.docker.com/r/xoderockson/xode-node-aarch64](https://hub.docker.com/r/xoderockson/xode-node-aarch64)

```bash
podman pull docker.io/xoderockson/xode-node-aarch64
```

STEP 3: Run the container but first make a local directory

This directory will hold the database (very important)

```bash
mkdir xode
```

### x86-64

```bash
podman run -d --name xode-node --volume ./xode:/xode -it xoderockson/xode-node-x86_64 <NODENAME>
```

### aarch64

```bash
podman run -d --name xode-node --volume ./xode:/xode -it xoderockson/xode-node-aarch64 <NODENAME>
```

STEP 4: Enable service

```bash
podman generate systemd --new --name xode-node  > ./xode-node.service
mkdir -p ~/.config/systemd/user
mv ./xode-node.service ~/.config/systemd/user
systemctl --user enable xode-node.service
```

STEP 5: Enable auto login

Edit this file

```bash
sudo nano /lib/systemd/system/getty@.service
```

Change this line

```ini
ExecStart=-/sbin/agetty -o '-p -- \u' --noclear %I $TERM
```

To this line

```ini
ExecStart=-/sbin/agetty --noissue --autologin [USERNAME] %I $TERM
```

## Maintaining the container (Podman)

Stopping all containers

```bash
podman stop --all
```

Clearing the cache before running the container

```bash
podman container prune -f
```

Displaying the running containers and images

```bash
podman ps
podman images
```
