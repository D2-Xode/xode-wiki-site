# セキュリティメカニズム

## はじめに

Xode Parachain は、暗号学的検証、コンセンサスプロトコル（AURA と GRANDPA）、リレーチェーンによる検証を通じて、堅牢なブロック検証とトランザクションのセキュリティメカニズムを実装しています。これらのメカニズムにより、トランザクションの完全性が確保され、不正が防止され、Polkadot エコシステム内での経済的セキュリティが提供されます。

## セキュリティメカニズム

### コンセンサスメカニズム：Xode Parachain はハイブリッドなコンセンサス方式を採用しています

* ブロック生成のための AURA：定められた順序でブロックを生成するよう選ばれたバリデーターによるラウンドロビン方式のブロック生成により、ライブネスを確保します。  
* ファイナリティのための GRANDPA（GHOST-based Recursive ANcestor Deriving Prefix Agreement）：ブロックのチェーンについてコンセンサスに達することで、ファイナリティを確保します。

### 状態証明と不正防止

* Merkle 証明：効率的かつ安全なストレージの検証に使用されます。  
* オンチェーンガバナンスとランタイムアップグレード：民主的な意思決定により、不正な変更を防止します。

### クロスチェーンセキュリティ（XCMP と HRMP）

* XCMP（Cross-Chain Message Passing）：パラチェーン間の安全な通信を確保します。  
* HRMP（Horizontal Relay-routed Message Passing）：メッセージの完全性を確保する暫定的なメッセージパッシングプロトコルです。

### 経済的セキュリティ

* スラッシングの条件：バリデーターとコレーターは、不正行為（二重署名、ダウンタイムなど）に対してペナルティを科される場合があります。  
* トランザクション手数料とウェイトベースの実行：スパムや DoS 攻撃を防止します。  
* ボンディングとステーキングの要件：バリデーターがネットワークに対して経済的な利害関係を持つことを保証します。

## 詳細情報

Xode ステーキング：[XODE ステーキング](/ja/network/xode-staking)   
Polkadot セキュリティプロトコル：[https://wiki.polkadot.network/docs/learn-parachains-protocol](https://wiki.polkadot.network/docs/learn-parachains-protocol) 
