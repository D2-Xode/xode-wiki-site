# 보안 메커니즘

## 소개

Xode Parachain은 암호학적 검증, 합의 프로토콜(AURA 및 GRANDPA), 릴레이 체인 검증을 통해 강력한 블록 검증 및 트랜잭션 보안 메커니즘을 구현합니다. 이러한 메커니즘은 트랜잭션 무결성을 보장하고, 사기를 방지하며, Polkadot 생태계 내에서 경제적 보안을 제공합니다.

## 보안 메커니즘

### 합의 메커니즘: Xode Parachain은 하이브리드 합의 방식을 사용합니다

* 블록 생성을 위한 AURA: 정해진 순서에 따라 선택된 검증자(validator)가 블록을 생성하는 라운드 로빈(round-robin) 방식의 블록 생성을 통해 활성(liveness)을 보장합니다.  
* 최종성을 위한 GRANDPA (GHOST-based Recursive ANcestor Deriving Prefix Agreement): 블록 체인에 대한 합의에 도달하여 최종성(finality)을 보장합니다.

### 상태 증명과 사기 방지

* 머클 증명(Merkle Proofs): 효율적이고 안전한 스토리지 검증에 사용됩니다.  
* 온체인 거버넌스와 런타임 업그레이드: 민주적인 의사 결정을 통해 승인되지 않은 변경을 방지합니다.

### 크로스체인 보안 (XCMP 및 HRMP)

* XCMP (Cross-Chain Message Passing): 파라체인 간의 안전한 통신을 보장합니다.  
* HRMP (Horizontal Relay-routed Message Passing): 메시지 무결성을 보장하는 임시 메시지 전달 프로토콜입니다.

### 경제적 보안

* 슬래싱(Slashing) 조건: 검증자와 콜레이터(collator)는 부정 행위(예: 이중 서명, 다운타임)에 대해 불이익을 받을 수 있습니다.  
* 트랜잭션 수수료와 가중치 기반 실행: 스팸 및 DoS 공격을 방지합니다.  
* 본딩(Bonding) 및 스테이킹(Staking) 요건: 검증자가 네트워크에 재정적 이해관계를 갖도록 보장합니다.

## 추가 정보

Xode 스테이킹: [XODE 스테이킹](/ko/network/xode-staking)   
Polkadot 보안 프로토콜: [https://wiki.polkadot.network/docs/learn-parachains-protocol](https://wiki.polkadot.network/docs/learn-parachains-protocol) 
