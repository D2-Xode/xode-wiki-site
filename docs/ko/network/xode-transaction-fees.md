# XODE 트랜잭션 수수료

## 가중치

Substrate와 마찬가지로 pallet-contracts는 weightV2를 사용하여 실행 수수료를 부과합니다. 가중치(weight)는 refTime과 proofSize로 구성됩니다:

* refTime: 실행에 사용할 수 있는 연산 시간의 양으로, 단위는 피코초(picosecond)입니다.  
* proofSize: 릴레이 체인이 트랜잭션의 상태 변경을 검증하기 위해 유효성 증명(proof of validity)에 포함되어야 하는 데이터의 크기로, 단위는 바이트입니다. 따라서 스토리지에 접근하면 가스(gas) 수수료가 증가하게 됩니다.

### 정보

Gas \= Weight \= (refTime, proofSize) [Substrate 문서의 트랜잭션 가중치](https://docs.substrate.io/reference/how-to-guides/weights/)

## 스토리지 임대료

스토리지 임대료(storage rent)는 자동 예치금 징수(Automatic Deposit Collection)라고도 하며, 온체인 스토리지 스팸을 방지하여 체인의 보안을 보장하는 메커니즘입니다. 악의적인 행위자가 가치가 낮은 트랜잭션으로 네트워크에 스팸을 보내는 것을 방지하고, 호출자가 온체인에 데이터를 저장할 때 금전적 이해관계를 갖도록 보장합니다.

사용자는 온체인에 저장되는 모든 바이트에 대해 요금이 부과되며, 호출 시 이 수수료가 사용자의 가용 잔액(free balance)에서 컨트랙트의 예약 잔액(reserved balance)으로 이전됩니다. 컨트랙트 자체는 이 예약 잔액을 사용할 수 없다는 점에 유의하세요(단, 온체인 스토리지를 제거하는 함수를 노출할 수 있으며 이 경우 호출자가 자금을 받게 됩니다). 또한 사용자가 체인에서 사용하지 않는 데이터를 제거하면 임대료를 돌려받을 수 있으므로 데이터 제거를 장려합니다. 온체인 데이터를 제거하면 누구든지 임대료를 돌려받을 수 있습니다(처음 요금이 부과된 사용자로 한정되지 않음). 스토리지 예치금을 돌려받을 수 있는지, 어떻게 돌려받을 수 있는지를 이해하는 것은 컨트랙트 개발자와 사용자의 몫입니다.

### 스토리지 임대료 계산

이 수수료는 각 스토리지 항목에 대해 설정된 가격 DepositPerItem과 스토리지의 각 바이트에 대해 설정된 가격 DepositPerByte로 계산됩니다. 

스토리지 바이트당: 0.000001 XON  
스토리지 항목당: 0.00004 XON

### 계산

사용자가 Mapping 필드에 새 키/값을 저장하면 DepositPerItem 1회분이 부과됩니다. 값의 바이트 길이도 수수료에 추가됩니다(즉, 바이트 길이 x DepositPerByte).

예를 들어 사용자가 Mapping\<u32, AccountId\>(AccountId는 32바이트)에 새 항목을 저장하면 DepositPerItem \+ 32 x DepositPerByte가 부과됩니다.

## 사용자를 위한 안내

dApp(하나 또는 여러 개의 스마트 컨트랙트)에 대한 첫 번째 호출은 일반적으로 이후 호출보다 비용이 더 많이 듭니다. 이는 첫 번째 호출에서 사용자에 대한 새 항목이 많이 생성되기 때문입니다(대부분 잔액의 Mapping과 같이 사용자 AccountId와 관련된 데이터입니다). 두 번째 호출부터는 해당 항목을 업데이트하기만 하므로 훨씬 저렴하거나 무료가 됩니다.

이후 호출이 기존 데이터베이스 항목만 수정하는 경우, 호출자는 항목에 추가하는 추가 바이트에 대해서만 요금이 부과됩니다. DB 항목의 크기를 줄이는 경우에는 스토리지 임대료를 돌려받습니다. 실제로 이는 사용자가 스마트 컨트랙트와 상호작용한 후 가용 잔액이 늘어날 수도 있다는 것을 의미합니다\!

사용자가 이를 돌려받으려면 온체인 데이터를 제거해야 합니다. 이는 스마트 컨트랙트가 체인에서 데이터를 제거하는 함수(아래 예시의 remove\_mapping\_entry 등)를 노출하는 경우에만 가능합니다.

## 스마트 컨트랙트 개발자를 위한 안내

사용자가 예약 잔액을 돌려받을 수 있는 유일한 방법은 온체인 데이터를 제거하는 것이므로, 스마트 컨트랙트가 사용자가 이를 수행할 수 있는 함수를 노출하도록 하는 것이 중요합니다.

컨트랙트가 이러한 함수를 노출하지 않으면 컨트랙트가 사용하는 온체인 데이터를 제거할 방법이 없으며, 사용자는 예약 잔액을 돌려받을 수 없습니다(해당 잔액은 컨트랙트 계정의 예약 잔액으로 남기 때문입니다).

## StorageDepositLimit

컨트랙트 호출 시 인수 중 하나는 StorageDepositLimit입니다. 이 값은 단일 호출에 부과될 수 있는 스토리지 임대료의 최대 금액입니다.

### 중요

StorageDepositLimit을 None으로 설정하면 컨트랙트가 호출자의 계정에서 임의의 금액을 인출하도록 부과할 수 있게 됩니다.

따라서 악의적인 컨트랙트가 사용자 계정에서 자금을 빼가는 것을 방지하려면 한도를 설정해야 합니다(먼저 호출을 드라이런(dry-run)하여 스토리지 예치금 금액을 확인하세요). 이는 특히 컨트랙트 호출을 트리거하는 프런트엔드 애플리케이션이나 컨트랙트 UI(contracts-UI 또는 polkadot-js UI 등)에서 전송되는 호출에 적용됩니다.

사용자는 가스 한도와 스토리지 예치금 한도를 직접 관리할 책임이 있습니다. 이는 EVM 스마트 컨트랙트와 동일하지만, 환불되지 않는 가스만 있는 것이 아니라 StorageDepositLimit도 고려해야 한다는 점이 다릅니다.

## XODE 컨트랙트 예시

```rust
#[ink::contract]
mod rent {
    use ink::storage::Mapping;
    #[ink(storage)]
    pub struct Rent {
        map: Mapping<AccountId, u32>,
        int: u32,
        bool: bool,
    }
    impl Rent {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self { map: Default::default(), int: 0, bool: false }
        }
        #[ink(message)]
        pub fn update_32(&mut self, i: u32) {
            self.int = i
        }
        #[ink(message)]
        pub fn flip_bool(&mut self) {
            self.bool = !self.bool
        }
        #[ink(message)]
        pub fn add_mapping_entry(&mut self) {
            let caller = self.env().caller();
            // Insert one item to storage. fee = 1 * PricePerItem (0.0004XON) =
            // Value of the mapping is a u32, 4 bytes. fee = 4 * PricePerByte (0.00002XON) = 0.00008XON
            // Total fee = 0.00408XON
            self.map.insert(caller, &1u32);
        }
        #[ink(message)]
        pub fn remove_mapping_entry(&mut self)  {
            let caller = self.env().caller();
            // Clears the value at key from storage.
            // Remove one item from storage. fee = 1 * PricePerItem (0.0004XON) =
            // Remove the value of the mapping u32, 4 bytes. fee = 4 * PricePerByte (0.00002XON) = 0.00008XON
            // Total reserve repatriated by caller = 0.00408XON
            self.map.remove(caller);
        }
        #[ink(message)]
        pub fn remove_entry_account_id(&mut self, who: AccountId)  {
            // Clears the value at key from storage.
            // Remove one item from storage. fee = 1 * PricePerItem (0.0004XON) =
            // Remove the value of the mapping u32, 4 bytes. fee = 4 * PricePerByte (0.00002XON) = 0.00008XON
            // Total reserve repatriated by caller = 0.00408XON
            self.map.remove(who);
        }
    }
}
```

### add\_mapping\_entry

수수료(예약되는 잔액, 즉 사용자의 가용 잔액에서 컨트랙트의 예약 잔액으로 이동하는 잔액)는 다음과 같습니다:

* 스토리지에 항목 하나 삽입. 수수료 \= 1 \* PricePerItem (0.0004XON)  
* Mapping의 값은 u32, 4바이트. 수수료 \= 4 \* PricePerByte (0.00002XON) \= 0.00008XON  
* 총 수수료 \= 0.00408XON

### remove\_mapping\_entry

반환되는 잔액(컨트랙트 계정의 예약 잔액에서 사용자 계정으로 이동하는 잔액)은 다음과 같습니다:

* 스토리지에서 항목 하나 제거. 수수료 \= 1 \* PricePerItem (0.0004XON)  
* Mapping의 u32 값(4바이트) 제거. 수수료 \= 4 \* PricePerByte (0.00002XON) \= 0.00008XON  
* 호출자에게 반환되는 총 예약금 \= 0.00408XON

### remove\_entry\_account\_id

잔액은 호출자에게 반환됩니다(계정의 예약 잔액에서 호출자의 가용 잔액으로 이전되므로, 처음 요금이 부과된 사용자가 아닌 호출자가 받습니다). 호출자는 0.00408XON을 받게 됩니다.

### flip\_bool & update\_32

온체인에 새 데이터를 저장하지 않으므로(값만 업데이트) 임대료가 부과되지 않습니다.
