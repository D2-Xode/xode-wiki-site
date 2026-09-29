# Xterium 钱包

Xterium 是 XODE 区块链的官方钱包。当前版本为 **Xterium: XODE Wallet**，这是一款适用于 Android 和 iOS 的应用，图标为粉色。

## 安装应用

* Android：[Google Play 上的 Xterium: XODE Wallet](https://play.google.com/store/apps/details?id=net.xode.xtr)
* iOS：[App Store 上的 Xterium: XODE Wallet](https://apps.apple.com/app/id6809356501)

::: warning 应用商店中有两款 Xterium 应用
旧版 Xterium 应用仍在 Google Play 和 App Store 上架。请务必安装 **Xterium: XODE Wallet**，即带有粉色图标的那一款。

| | 请安装这款 | 旧版本 |
| --- | --- | --- |
| 图标 | <img class="app-icon" src="../../wallets/images/xterium-icon.png" alt="带深色星形的粉色菱形" width="64" height="64"> | <img class="app-icon" src="../../wallets/images/xterium-icon-old.png" alt="带银色星形的青绿色菱形" width="64" height="64"> |
| 商店中的名称 | Xterium: XODE Wallet | Xterium |
:::

## 可以用它做什么

* **将密钥保存在您的手机上**。Xterium 是非托管钱包：密钥在您的设备上加密存储，并通过 PIN 码或生物识别解锁。Xterium 永远看不到您的助记词。
* 在一个资产组合中**持有 XODE 和 Polkadot Hub 上的 XON、USDT 等资产**。
* **发送和接收资产**，可使用二维码和地址簿。
* 向收集人**质押 XON**，赚取一部分区块奖励。详见 [XODE 质押](/zh/network/xode-staking)。
* **关注治理动态**。查看链上国库提案；理事会成员可以在应用内投票。详见 [XODE 治理](/zh/introduction/xode-governance)。
* 借助 XODE omni **用手机运行节点**，并赚取奖励。详见[当手机成为节点](/zh/engineering/phones-as-nodes)。
* 通过独立的 EVM 账户和 WalletConnect **使用以太坊兼容应用**。详见 [EVM 智能合约](/zh/smart-contract/evm-smart-contract)。
* 通过 XCM **在 Polkadot Hub 和 XODE 之间转移 USDT**。该功能仍在逐步推出中。
* **支持英语、韩语、日语和中文**。应用会跟随您设备的语言设置。

::: danger 备份您的助记词
Xterium 是自托管钱包。请将助记词抄写下来并妥善保管：一旦丢失，Xterium 将无法帮您恢复钱包。
:::

## 旧版本

以下各节介绍 Xterium 的早期版本，以及更早的 Xode 钱包。

### Xterium 应用和浏览器扩展（青绿色图标）

旧版 Xterium 应用仍可在 [Google Play](https://play.google.com/store/apps/details?id=com.xterium.wallet) 和 [App Store](https://apps.apple.com/app/id6745164228) 下载。其浏览器扩展可从 [Chrome 应用商店](https://chromewebstore.google.com/detail/xterium/klfhdmiebenifpdmdmkjicdohjilabdg)安装。

### 浏览器扩展 Beta 版：手动安装（Chrome）

Xterium 钱包浏览器扩展是一款基于浏览器的数字钱包，旨在让您直接在浏览器中与 Xode Blockchain 交互。该扩展可安全存储用户的私钥，并提供对区块链网络的无缝访问，支持发送和接收加密货币、管理代币以及与智能合约交互等操作。

在此下载安装包（Zip 文件）：

* [Xterium v0.2.2 (Beta)](https://drive.google.com/uc?export=download&id=1bVMGSJQNj-BJ7Dza2yNMxoFZRfqxVBkq)  
* [Xterium v0.2.0 (Beta)](https://drive.google.com/uc?export=download&id=1Z7Yb8YeyUhjZbUWf8-c2ukle1QLbYCq3)  
* [Xterium v0.1.3 (Beta)](https://drive.google.com/uc?export=download&id=1wjBgg4viy1pxAF9VnKDkIj68hivCJsAm)  
* [Xterium v0.1.2 (Beta)](https://drive.google.com/uc?export=download&id=1rAS169wz4rk0IT3OVT9XLd-fyJef7us7)  
* [Xterium v0.1.1 (Beta)](https://drive.google.com/uc?export=download&id=1139wf3T4doSZR0zrv7CO-j40YyC7dTCq)

#### 将 Zip 文件解压到一个目录（chrome-mv3-prod）

![](../../wallets/images/xterium-wallet-beta-1.png)

#### 打开 Chrome（chrome://extensions/）并加载目录（dist）

* 在地址栏中打开：chrome://extensions/  
* 打开开发者模式开关：  
  ![](../../wallets/images/xterium-wallet-beta-2.png)  
* 使用"加载已解压的扩展程序"加载该目录：  
  ![](../../wallets/images/xterium-wallet-beta-3.png)  
* 此时您应该能在 Chrome 中看到该扩展程序  
  ![](../../wallets/images/xterium-wallet-beta-4.png)

现在您可以通过扩展程序按钮开始使用 Xterium 钱包了。

* 打开 Chrome 扩展程序图标并选择 Xterium Wallet，如有需要可以将其固定。  
  ![](../../wallets/images/xterium-wallet-beta-5.png)

### 使用浏览器扩展 Beta 版

#### 首次打开钱包

* 设置您的密码（请务必牢记，如果您忘记密码，我们将无法帮您找回。没有密码，您将无法访问所有钱包信息。  
  ![](../../wallets/images/xterium-wallet-beta-6.png)  
* 由于 Xterium 将支持 Polkadot 生态系统中的多个网络，您首先应该选择 Xode 网络。  
  ![](../../wallets/images/xterium-wallet-beta-7.png)  
  ![](../../wallets/images/xterium-wallet-beta-8.png)  
* 接下来添加钱包地址。进入侧边栏菜单并点击 Wallets。您可以添加新钱包，也可以使用助记词（私钥）导入现有钱包。  
  ![](../../wallets/images/xterium-wallet-beta-9.png)  
* 创建钱包时，您必须提供钱包名称和助记词（可自动生成）。种子和公钥地址将自动创建。  
  ![](../../wallets/images/xterium-wallet-beta-10.png)  
  非常重要：请务必备份您的助记词，切勿与任何人分享！  
* 保存后，您将被引导至余额标签页，在此可以查看您的余额。    
  ![](../../wallets/images/xterium-wallet-beta-11.png)

#### 转账

* 在余额标签页中点击转账按钮。您只能转账具有当前余额的资产。此外，您必须先转账原生资产（例如 XON），然后才能转账其他资产，如 IXON 或 XGM。转账时，只需提供数量和收款地址即可。  
  ![](../../wallets/images/xterium-wallet-beta-12.png)  
* 确认转账。钱包将显示以 XON 计的预估手续费。确认后，您将被重定向回余额标签页。  
  ![](../../wallets/images/xterium-wallet-beta-13.png)  
  非常重要：这是 Beta 版本，最终性回调存在延迟，余额可能不会立即更新，请稍等几秒钟后刷新余额标签页。另外，如果地址中没有 XON，请勿转出非原生资产（例如 IXON）。

#### 添加或移除资产

* 进入 Assets 标签页。要移除资产，只需点击删除（垃圾桶）图标  
  ![](../../wallets/images/xterium-wallet-beta-14.png)  
* 要添加资产，您需要指定资产类型，例如 Native（原生）、Asset（pallet-assets）、Contract（XON20/pallet-contracts）。请确保网络 ID 正确；对于资产，请核对链（Xode）上的资产 ID；对于合约，请使用合约地址。  
  ![](../../wallets/images/xterium-wallet-beta-15.png)

### Xode 钱包（Xterium 之前）

#### Android

注意：您必须在 Android 移动设备上手动安装 Xode Wallet 的 APK。该应用未在 Google Play 上架。

* [Xode Android 钱包 APK（v0.1.1 Beta）\- 最新版](https://drive.google.com/uc?export=download&id=1LqFzSqMPG79bU5_qefmrXnHSLfJf60p5)  
* [Xode Android 钱包 APK（v0.1.0 Beta）](https://drive.google.com/uc?export=download&id=19BCpsgucQV4jxlc6CbwT87cYwLkXvaY5)

#### iOS App Store

* [https://apps.apple.com/ee/app/xode-wallet/id6479734235](https://apps.apple.com/ee/app/xode-wallet/id6479734235) 
