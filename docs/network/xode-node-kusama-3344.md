# XODE Node (Kusama 3344)

::: warning No longer in use
XODE has moved from Kusama (para ID 3344) to the Polkadot Relay Chain (para ID 3417), so this guide is kept for reference only. To run a node today, follow [XODE Node](/network/xode-node). See [From Kusama to Polkadot](/introduction/xode-blockchain#from-kusama-to-polkadot) for details.
:::

## Requirements

* 8 Core (Core i9 or equivalent)  
* 32 GB RAM  
* 1 TB SSD Drive  
* Ubuntu 24 Operating System

## STEP 1: Downloading the xode-node binary

### x86-64

```bash
curl -L "https://drive.usercontent.google.com/download?id=10zStcLL08V3hiCy507CBXMCKCb2VFQsM&confirm=xxx" -o xode-node
```

### aarch64

```bash
curl -L "https://drive.usercontent.google.com/download?id=1S8uBEuaZhSfJMCwKvbzWXAw_7J4EgPVE&confirm=xxx" -o xode-node
```

## STEP 2: Download the Xode Blockchain Kusama 3344 Chainspecs

```bash
wget --no-check-certificate 'https://docs.google.com/uc?export=download&id=19C8s1MdVubYjMFiLBmvwhWxTK6bPeyve' -O raw-xode-node-chainspec.json
```

## STEP 3: Make the xode-node binary executable

```bash
chmod +x xode-node
```

## STEP 4: Make a xode base path directory

```bash
mkdir xode
```

## STEP 5: Create a shell script

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
--name "xode-node"
```

### Description

* /home/ubuntu/xode-node : This specifies the directory of the xode-node binary  
* \--chain /home/ubuntu/raw-xode-node-chainspec.json This argument tells the command that the chain specification file is located at /home/ubuntu/raw-xode-node-chainspec.json   
* \--base-path /home/ubuntu/xode : This argument accepts a directory path where the database will be stored. In this example, the data will be stored in /home/ubuntu/xode  
* \--rpc-port 9944 : This specifies the port on which the node will run (default: 9944).  
* \--pruning archive : This specifies that the node will run in archive mode. If you want the node to run as a full node instead, you can remove this argument.  
* \--telemetry-url "wss://telemetry.polkadot.io/submit/ 0" : This makes the node visible in telemetry.  
* \--name "your-node-name” :This sets a custom node name that will be reflected in telemetry. Replace "your-node-name” with your desired name, e.g., \--name "xode-node”

### Enable RPC add the following line.

```bash
--rpc-external \
--unsafe-rpc-external \
--rpc-methods safe \
--rpc-cors '*'
```

### Full example of running a full node with RPC enabled.

```bash
#!/bin/bash
/home/ubuntu/xode-node \
--chain /home/ubuntu/raw-xode-node-chainspec.json \
--base-path /home/ubuntu/xode \
--rpc-port 9944 \
--pruning archive \
--rpc-external \
--unsafe-rpc-external \
--rpc-methods safe \
--rpc-cors '*' \
--telemetry-url "wss://telemetry.polkadot.io/submit/ 0" \
--name "xode-node"
```

## STEP 6: Make the xode-node.sh executable

```bash
chmod +x xode-node.sh
```

## STEP 7: Test if it runs

```bash
./xode-node.sh
```

## STEP 8: Create a service

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

## STEP 9: Enable the service

```bash
sudo systemctl enable xode-collator.service
```

## STEP 10: Start the service

```bash
sudo systemctl start xode-collator.service
```

## STEP 11: Wait for 30 seconds and check if the service is running

```bash
journalctl -f -u xode-collator
```

## STEP 12: Check the telemetry site to view your node

[https://telemetry.polkadot.io/\#/0x28cc1df52619f4edd9f0389a7e910a636276075ecc429600f1dd434e281a04e9](https://telemetry.polkadot.io/#/0x28cc1df52619f4edd9f0389a7e910a636276075ecc429600f1dd434e281a04e9) 
