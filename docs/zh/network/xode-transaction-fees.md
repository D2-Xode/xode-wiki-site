# XODE 交易费用

## 权重

与 Substrate 相同，pallet-contracts 使用 weightV2 来收取执行费用。它由 refTime 和 proofSize 组成：

* refTime：可用于执行的计算时间，单位为皮秒。  
* proofSize：为使中继链能够验证交易的状态变更而需要包含在有效性证明中的数据大小，单位为字节。因此，访问存储会增加 gas 费用。

### 信息

Gas \= Weight \= (refTime, proofSize) [Substrate 文档中的交易权重](https://docs.substrate.io/reference/how-to-guides/weights/)

## 存储租金

存储租金，也称为自动押金收取 (Automatic Deposit Collection)，是一种通过防止链上存储滥用来保障链安全的机制。它可以防止恶意行为者用低价值交易对网络进行垃圾攻击，并确保调用者在链上存储数据时承担相应的经济成本。

用户在链上存储的每一个字节都会被收费，调用会将这笔费用从用户的可用余额转入合约的预留余额。请注意，合约本身无法花费这笔预留余额（但合约可以提供一个删除链上存储的函数，调用者将因此获得这笔资金）。这也通过返还租金来激励用户从链上删除无用数据。任何用户只要删除链上数据，都可以取回租金（不一定是最初被收费的那个用户）。合约开发者和用户需要自行了解能否以及如何取回存储押金。

### 存储租金计算

该费用根据为每个存储项设定的价格 DepositPerItem，以及每个存储字节的价格 DepositPerByte 进行计算。 

每个存储字节：0.000001 XON  
每个存储项：0.00004 XON

### 计算方式

当用户在 Mapping 字段中存储一个新的键/值时，将收取一次 DepositPerItem。值的字节长度也会计入费用（即字节长度 x DepositPerByte）。

例如，如果用户在 Mapping\<u32, AccountId\>（AccountId 为 32 字节）中存储一个新条目，将被收取 DepositPerItem \+ 32 x DepositPerByte。

## 面向用户

对某个 dApp（一个或多个智能合约）的首次调用通常会比后续调用更昂贵。这是因为首次调用会为用户创建许多新条目（大多数情况下是与用户 AccountId 相关的数据，例如余额的 Mapping）。从第二次调用开始，费用会低得多（甚至免费），因为只需更新这些条目。

如果后续调用仅修改现有的数据库条目，调用者只需为其新增到条目中的额外字节付费。如果他们减小了数据库条目的大小，将会获得存储租金返还。这在实践中意味着，用户在与智能合约交互后，其可用余额可能会增加\!

如果用户想要取回租金，就需要删除链上数据。只有当智能合约提供了从链上删除数据的函数（例如下方示例中的 remove\_mapping\_entry）时才能做到这一点。

## 面向智能合约开发者

由于用户取回其预留余额的唯一方式是删除链上数据，因此务必确保智能合约提供允许用户执行此操作的函数。

如果合约没有提供此类函数，将无法删除合约所使用的链上数据，用户也将无法取回其预留余额（因为这些余额将作为预留余额保留在合约账户中）。

## StorageDepositLimit

在进行合约调用时，其中一个参数是 StorageDepositLimit。该值表示单次调用可收取的存储租金上限。

### 重要

如果 StorageDepositLimit 设置为 None，合约将可以从调用者的账户中划走任意数额的资金。

因此，有必要设置一个上限（先对调用进行试运行 (dry-run) 以获取存储押金金额），以防止恶意合约从用户账户中划走资金。这一点尤其适用于触发合约调用的前端应用，以及通过合约 UI（如 contracts-UI 或 polkadot-js UI）发送的调用。

用户有责任确保设置 gas 上限和存储押金上限。这与 EVM 智能合约相同，但除了不可退还的 gas 之外，你还需要注意 StorageDepositLimit。

## XODE 上的合约示例

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

费用（被预留的余额，即从用户可用余额转入合约预留余额的部分）为：

* 向存储中插入一个条目。费用 \= 1 \* PricePerItem (0.0004XON)  
* Mapping 的值为 u32，4 字节。费用 \= 4 \* PricePerByte (0.00002XON) \= 0.00008XON  
* 总费用 \= 0.00408XON

### remove\_mapping\_entry

返还的余额（从合约账户的预留余额转回用户账户的部分）为：

* 从存储中删除一个条目。费用 \= 1 \* PricePerItem (0.0004XON)  
* 删除 Mapping 中 u32 类型的值，4 字节。费用 \= 4 \* PricePerByte (0.00002XON) \= 0.00008XON  
* 调用者获得的预留返还总额 \= 0.00408XON

### remove\_entry\_account\_id

余额将返还给调用者（而不是最初被收费的用户，因为资金是从合约账户的预留余额转入调用者的可用余额）。调用者将获得 0.00408XON。

### flip\_bool & update\_32

这些调用不会产生租金费用，因为它们不会在链上存储新数据（仅更新值）。
