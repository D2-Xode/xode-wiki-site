# XODE のトランザクション手数料

## ウェイト

Substrate と同様に、pallet-contracts は実行手数料の徴収に weightV2 を使用します。これは refTime と proofSize で構成されています：

* refTime：実行に使用できる計算時間の量（ピコ秒単位）。  
* proofSize：リレーチェーンがトランザクションによる状態変更を検証するために、有効性証明に含める必要があるデータのサイズ（バイト単位）。そのため、ストレージへのアクセスはガス代を増加させるものと想定されます。

### 情報

Gas \= Weight \= (refTime, proofSize) [Substrate ドキュメントのトランザクションウェイト](https://docs.substrate.io/reference/how-to-guides/weights/)

## ストレージレント

ストレージレントは、自動デポジット徴収（Automatic Deposit Collection）とも呼ばれ、オンチェーンストレージのスパムを防ぐことでチェーンのセキュリティを確保する仕組みです。悪意のある攻撃者が低価値のトランザクションでネットワークにスパムを送ることを防ぎ、オンチェーンにデータを保存する呼び出し元が金銭的な負担を負うようにします。

ユーザーはオンチェーンに保存するバイトごとに課金され、呼び出しによってこの手数料がユーザーのフリー残高からコントラクトのリザーブ残高に移されます。コントラクト自身はこのリザーブ残高を使うことはできない点に注意してください（ただし、オンチェーンストレージを削除する関数を公開することはでき、その場合は呼び出し元が資金を受け取ります）。また、レント手数料が戻ってくることで、ユーザーがチェーンから不要なデータを削除するインセンティブにもなります。オンチェーンのデータを削除すれば、どのユーザーでもレント手数料を取り戻すことができます（最初に課金されたユーザーに限りません）。ストレージデポジットを取り戻せるかどうか、またその方法を理解するのは、コントラクト開発者とユーザーの責任です。

### ストレージレントの計算

この手数料は、ストレージアイテムごとに設定された価格 DepositPerItem と、ストレージのバイトごとに設定された価格 DepositPerByte に基づいて計算されます。 

ストレージ 1 バイトあたり：0.000001 XON  
ストレージアイテム 1 つあたり：0.00004 XON

### 計算方法

ユーザーが Mapping フィールドに新しいキー/値を保存すると、DepositPerItem が 1 つ分課金されます。値のバイト長も手数料に加算されます（つまり、バイト長 x DepositPerByte）。

たとえば、ユーザーが Mapping\<u32, AccountId\>（AccountId は 32 バイト）に新しいエントリを保存する場合、DepositPerItem \+ 32 x DepositPerByte が課金されます。

## ユーザー向け

dApp（1 つまたは複数のスマートコントラクト）への最初の呼び出しは、通常それ以降の呼び出しよりも高くなります。これは、最初の呼び出しでユーザーのための新しいエントリが多数作成されるためです（ほとんどの場合、Balances の Mapping など、ユーザーの AccountId に関連するデータです）。2 回目以降の呼び出しでは、それらのアイテムを更新するだけなので、はるかに安く（または無料に）なるはずです。

後続の呼び出しが既存のデータベースエントリを変更するだけであれば、呼び出し元はエントリに追加した分のバイトに対してのみ課金されます。DB エントリのサイズを縮小した場合は、ストレージレントが返還されます。つまり実際には、スマートコントラクトとやり取りした後にユーザーのフリー残高が増えることもあるのです\!

ユーザーがそれを取り戻したい場合は、オンチェーンのデータを削除する必要があります。これは、スマートコントラクトがチェーンからデータを削除する関数（以下の例の remove\_mapping\_entry など）を公開している場合にのみ可能です。

## スマートコントラクト開発者向け

ユーザーがリザーブ残高を取り戻す唯一の方法はオンチェーンのデータを削除することであるため、スマートコントラクトがそれを可能にする関数を公開していることを確認することが重要です。

コントラクトがそのような関数を公開していない場合、コントラクトが使用するオンチェーンデータを削除する方法はなく、ユーザーはリザーブ残高を取り戻すことができません（コントラクトアカウント上のリザーブ残高となるためです）。

## StorageDepositLimit

コントラクトを呼び出す際の引数の 1 つが StorageDepositLimit です。この値は、1 回の呼び出しで課金できるストレージレントの最大額です。

### 重要

StorageDepositLimit が None に設定されている場合、コントラクトは呼び出し元のアカウントから任意の額の資金を引き出すよう課金できてしまいます。

そのため、悪意のあるコントラクトによってユーザーのアカウントから資金が引き出されるのを防ぐために、上限を設定する必要があります（まず呼び出しをドライランしてストレージデポジット額を取得してください）。これは特に、コントラクトの呼び出しをトリガーするフロントエンドアプリケーションや、コントラクト UI（contracts-UI や polkadot-js UI など）から送信される呼び出しに当てはまります。

ガスリミットとストレージデポジットリミットを確認する責任はユーザーにあります。これは EVM スマートコントラクトの場合と同じですが、返金されないガスだけでなく、StorageDepositLimit にも注意する必要があります。

## XODE でのコントラクトの例

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

手数料（リザーブされる残高、つまりユーザーのフリー残高からコントラクトのリザーブ残高に移される残高）は次のとおりです：

* ストレージにアイテムを 1 つ挿入します。fee \= 1 \* PricePerItem (0.0004XON)  
* Mapping の値は u32 で 4 バイトです。fee \= 4 \* PricePerByte (0.00002XON) \= 0.00008XON  
* 手数料の合計 \= 0.00408XON

### remove\_mapping\_entry

返還される残高（コントラクトアカウントのリザーブからユーザーアカウントに移される残高）は次のとおりです：

* ストレージからアイテムを 1 つ削除します。fee \= 1 \* PricePerItem (0.0004XON)  
* u32 の Mapping の値（4 バイト）を削除します。fee \= 4 \* PricePerByte (0.00002XON) \= 0.00008XON  
* 呼び出し元に返還されるリザーブの合計 \= 0.00408XON

### remove\_entry\_account\_id

残高が返還されるのは呼び出し元です（最初に課金されたユーザーではありません。これは、アカウントのリザーブ残高から呼び出し元のフリー残高に移されるためです）。呼び出し元は 0.00408XON を受け取ります。

### flip\_bool & update\_32

オンチェーンに新しいデータを保存しない（値を更新するだけ）ため、レント手数料は発生しません。
