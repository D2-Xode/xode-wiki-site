# XODE Blockchain

XODE Blockchain은 Polkadot 릴레이 체인(Relay Chain)과 병렬로 운영되는 독립적인 블록체인, 즉 파라체인(parachain) 3417입니다. XODE는 Kusama의 파라체인 3344로 시작했으며, 이후 Polkadot으로 이전했습니다(아래 [Kusama에서 Polkadot으로](#from-kusama-to-polkadot) 참조).

### 확장성

XODE Blockchain은 Polkadot 네트워크와 통합되어 여러 트랜잭션과 스마트 컨트랙트 실행을 동시에 처리합니다. 병렬로 실행됨으로써 XODE Blockchain은 네트워크의 전체 처리량과 확장성(scalability)을 높이며, 기존 블록체인 아키텍처에 비해 더 높은 트랜잭션 처리량을 제공합니다.

### 상호운용성

XODE Blockchain은 Polkadot 릴레이 체인을 통해 Polkadot Asset Hub 및 다른 파라체인 등 다른 블록체인과 통신할 수 있습니다. 이러한 상호운용성(interoperability)을 통해 서로 다른 파라체인 간은 물론, Polkadot에 연결된 다른 블록체인 네트워크와도 자산, 데이터, 메시지를 원활하게 교환할 수 있습니다.

### 사용자 정의 가능성

XODE Blockchain은 고유한 기능, 합의 메커니즘, 거버넌스 구조, 토큰 경제를 갖추고 있습니다. 이러한 유연성 덕분에 개발자는 탈중앙화 금융(DeFi), 대체 불가능한 토큰(NFTs), 공급망 관리, 신원 솔루션 등 특정 사용 사례에 맞게 블록체인을 조정할 수 있습니다.

### 공유 보안

XODE Blockchain은 Polkadot 네트워크의 공유 보안(shared security)의 이점을 누립니다. 파라체인은 자체 검증자(validator) 집합과 보안 인프라를 유지하는 대신, Polkadot 릴레이 체인의 검증자에 의존하여 트랜잭션을 보호하고 블록체인의 무결성을 보장합니다.

### 거버넌스

XODE Blockchain은 자체 거버넌스(governance) 메커니즘을 갖추고 있어, XON 보유자가 프로토콜 업그레이드, 파라미터 조정, 새로운 기능 추가에 관한 의사 결정 과정에 참여할 수 있습니다. 이를 통해 XODE 커뮤니티는 네트워크의 발전 방향에 대한 자율성과 통제권을 가질 수 있습니다.

## Kusama에서 Polkadot으로 {#from-kusama-to-polkadot}

XODE Blockchain은 처음에 Kusama 릴레이 체인에서 para ID 3344의 파라체인으로 운영되었습니다. 이후 Polkadot 릴레이 체인으로 이전하여 현재 para ID 3417로 운영되고 있습니다. XODE는 더 이상 Kusama 파라체인이 아닙니다.

<ParachainMigration />

| | 이전 | 현재 |
| --- | --- | --- |
| 릴레이 체인 | Kusama | Polkadot |
| Para ID | 3344 | 3417 |
| 보안 제공 | Kusama 검증자 | Polkadot 검증자 |

노드를 운영한다면 Polkadot 체인스펙을 사용하는 [XODE 노드](/ko/network/xode-node) 가이드를 따르세요. [XODE 노드 (Kusama 3344)](/ko/network/xode-node-kusama-3344) 가이드는 참고용으로만 남겨 두었습니다.

## XODE Blockchain은 Substrate로 구축되었습니다

Substrate는 Polkadot이 만든 블록체인 개발 프레임워크입니다. Substrate는 개발자에게 맞춤형 블록체인 네트워크와 탈중앙화 애플리케이션(DApps)을 구축할 수 있는 강력하고 유연한 플랫폼을 제공합니다. 

### 모듈성과 사용자 정의 가능성

Substrate의 모듈식 프레임워크를 활용하여 XODE Blockchain은 확장성, 프라이버시, 거버넌스 등 특정 요구 사항에 맞게 블록체인을 조정할 수 있습니다. XODE Blockchain은 사용자 정의 모듈을 손쉽게 통합하거나 기존 모듈 중에서 선택하여 기능을 최적화할 수 있습니다.

### 효율성과 성능

Substrate의 가볍고 효율적인 설계 덕분에 XODE Blockchain은 높은 처리량과 낮은 지연 시간으로 운영되며, 빠른 트랜잭션 처리와 향상된 사용자 경험을 제공합니다. 이러한 효율성은 XODE Blockchain이 대량의 트랜잭션을 효과적으로 처리하는 데 매우 중요합니다.

### 상호운용성

Substrate 기반 블록체인인 XODE Blockchain은 Polkadot 생태계 내의 다른 블록체인과 원활하게 연결되고 통신할 수 있습니다. 이러한 상호운용성을 통해 서로 다른 블록체인 네트워크 간에 자산과 데이터를 교환할 수 있어 XODE Blockchain의 유용성과 사용성이 향상됩니다.

### 보안

XODE Blockchain은 내장된 보안 메커니즘, 암호학적 기본 요소(cryptographic primitives), 안전한 개발을 위한 모범 사례 등 Substrate의 강력한 보안 기능을 그대로 계승합니다. 이를 통해 XODE Blockchain의 무결성과 신뢰성이 보장되며, 사용자의 자산과 데이터를 잠재적인 위협으로부터 보호합니다.
