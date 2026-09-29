# XODE Blockchain

XODE Blockchain is an independent blockchain, parachain, that operates in parallel to the Polkadot Relay Chain as parachain 3417. XODE started on Kusama as parachain 3344 and has since moved to Polkadot (see [From Kusama to Polkadot](#from-kusama-to-polkadot) below).

### Scalable

XODE Blockchain integrates with the Polkadot network to process multiple transactions and smart contract executions simultaneously. By running in parallel, XODE Blockchain increases the overall throughput and scalability of the network, allowing for higher transaction throughput compared to traditional blockchain architectures.

### Interoperable

XODE Blockchain can communicate with other blockchains, e.g., Polkadot Asset Hub and other parachains, through the Polkadot Relay Chain. This interoperability allows for the seamless exchange of assets, data, and messages between different parachains, as well as with other blockchain networks connected to Polkadot.

### Customizability

XODE Blockchain has its own unique features, consensus mechanisms, governance structures, and token economies. This flexibility allows developers to tailor the blockchain  to specific use cases, such as decentralized finance (DeFi), non-fungible tokens (NFTs), supply chain management, identity solutions, and more.

### Shared Security

XODE Blockchain benefits from the shared security of the Polkadot network. Instead of maintaining their own validator set and security infrastructure, parachains rely on the validators of the Polkadot Relay Chain to secure their transactions and ensure the integrity of the blockchain.

### Governance

XODE Blockchain has its own governance mechanisms, allowing XON holders to participate in decision-making processes for protocol upgrades, parameter adjustments, and the addition of new features. This ensures XODE community has the autonomy and control over the evolution of the network.

## From Kusama to Polkadot {#from-kusama-to-polkadot}

XODE Blockchain first ran as a parachain on the Kusama Relay Chain with para ID 3344. It has since been moved to the Polkadot Relay Chain, where it runs with para ID 3417. XODE is no longer a Kusama parachain.

<ParachainMigration />

| | Before | Now |
| --- | --- | --- |
| Relay chain | Kusama | Polkadot |
| Para ID | 3344 | 3417 |
| Secured by | Kusama validators | Polkadot validators |

If you run a node, follow [XODE Node](/network/xode-node), which uses the Polkadot chain spec. The [XODE Node (Kusama 3344)](/network/xode-node-kusama-3344) guide is kept for reference only.

## XODE Blockchain was built using Substrate

Substrate is a blockchain development framework created by Polkadot. It provides developers with a powerful and flexible platform for building custom blockchain networks and decentralized applications (DApps). 

### Modularity and Customizability

Utilizing Substrate's modular framework, XODE Blockchain can tailor its blockchain to meet specific requirements, whether it's for scalability, privacy, or governance. XODE Blockchain can easily integrate custom modules or select from existing ones to optimize its functionality.

### Efficiency and Performance

Substrate's lightweight and efficient design ensures that XODE Blockchain operates with high throughput and low latency, facilitating fast transaction processing and improved user experience. This efficiency is crucial for XODE Blockchain to handle a large volume of transactions effectively.

### Interoperability

As a Substrate-based blockchain, XODE Blockchain can seamlessly connect and communicate with other blockchains within the Polkadot ecosystem. This interoperability allows for the exchange of assets and data across different blockchain networks, enhancing XODE Blockchain's utility and usability.

### Security

XODE Blockchain inherits the robust security features of Substrate, including built-in security mechanisms, cryptographic primitives, and best practices for secure development. This ensures the integrity and reliability of the XODE Blockchain, protecting users' assets and data from potential threats.
