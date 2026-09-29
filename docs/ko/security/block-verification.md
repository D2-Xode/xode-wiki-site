# 블록 검증

## 소개

Xode Parachain은 Polkadot Parachain 3417로 운영되며(이전에는 Kusama Parachain 3344로 운영됨) Substrate Parachain Template을 사용하여 구축되었습니다. 이 문서는 트랜잭션 무결성, 합의 안전성, 체인 최종성(finality)을 보장하기 위한 보안 메커니즘과 블록 검증(block verification) 프로세스를 설명합니다.

## 블록 검증

### 트랜잭션 검증

모든 트랜잭션은 블록에 포함되기 전에 여러 단계의 검증을 거칩니다.

* 서명 검증(Signature Verification): 트랜잭션이 Schnorrkel (Sr25519) 또는 Ed25519 암호화 방식을 사용하여 유효한 계정에 의해 서명되었는지 확인합니다.  
* 논스 확인(Nonce Checking): 트랜잭션 논스가 순차적인지 확인하여 재전송 공격(replay attack)을 방지합니다.  
* 잔액 검증(Balance Validation): 송신자가 수수료를 포함하여 실행에 필요한 충분한 잔액을 보유하고 있는지 확인합니다.  
* 가중치 계산(Weight Calculation): 블록 한도를 초과하지 않도록 트랜잭션에 가중치(weight)를 할당합니다.

### 블록 생성

* 블록은 AURA (Authority Round) 메커니즘을 사용하여 생성됩니다.  
* 검증자 주도 블록 생성: 검증자(validator)가 라운드 로빈(round-robin) 방식으로 번갈아 가며 블록을 생성합니다.  
* 슬롯 기반 리더 선출: 검증자에게 블록을 생성할 슬롯이 할당되며, 리더는 AURA 프로토콜에 따라 선출됩니다.  
* 포크 선택 규칙(Fork Choice Rule): GHOST 기반 규칙을 사용하여 가장 긴 유효 체인이 선택됩니다.

### 콜레이터 노드 검증

* 콜레이터(Collator): 트랜잭션을 수집하고 익스트린식(extrinsic)을 실행하여 블록을 준비합니다.  
* 상태 전이 검증(State Transition Validation): 런타임 로직을 실행하여 블록의 결과 상태가 유효한지 확인합니다.  
* 실행 증명 생성(Proof-of-Execution Generation): 콜레이터는 검증자가 검증할 수 있도록 상태 증명(state proof)을 제출합니다.

### 파라체인과 릴레이 체인 간 통신

* 콜레이터가 검증자에게 블록 제출: 블록은 교차 검증을 위해 릴레이 체인 검증자에게 전송됩니다.  
* 후보 검증(Candidate Validation): Polkadot 릴레이 체인 검증자는 PVF (Parachain Validation Function)를 사용하여 파라체인 블록을 검증합니다.  
* 합의 도출: 블록은 GRANDPA를 통해 합의가 이루어지면 최종 확정됩니다.

## 추가 정보

[https://wiki.polkadot.network/docs/learn-parachains-protocol](https://wiki.polkadot.network/docs/learn-parachains-protocol) 
