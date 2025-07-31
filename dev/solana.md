# Solana 上发币

solana作为比较新的区块链项目，在上面发币，比我想象的要更简单。特别是不需要写合约（solana上叫Program），这一点真的大大降低发币的门槛，要知道solana的Program要用rust写。
> 本篇所涉及钱包、代币地址等，都是笔者在本地开发网络时生成，如果你跟着本篇执行，请换成实际的地址。

## 安装本地工具

[官网](https://solana.com/docs/intro/installation)提供一键安装脚本，执行后输入大概是这样：

```shell
Installed Versions:
Rust: rustc 1.86.0 (05f9846f8 2025-03-31)
Solana CLI: solana-cli 2.2.12 (src:0315eb6a; feat:1522022101, client:Agave)
Anchor CLI: anchor-cli 0.31.1
Node.js: v23.11.0
Yarn: 1.22.1
```

有一点要注意的是安装完成后，solana-cli和anchor如果提示命令不存在，可能是执行文件所在目录不在path。

## 传统方式

- 上述安装完成后，会自带一个spl-token的程序，SPL (Solana Program Library)，用它就可以发币

```shell
spl-token create-token

Creating token 9XcmK3bzTisfGnq5kt1iMKeeg7hb7voYt9hoAdqbuqU3 under program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA

Address:  9XcmK3bzTisfGnq5kt1iMKeeg7hb7voYt9hoAdqbuqU3
Decimals:  9
```

**发币完成**。简单吧，但是在此之前，你还需要在本地创建一个钱包，切换到开发网络或测试网络，获取测试币等等

- 切换到测试网络(dev)
```shell
solana config set -ud
```

- 生成钱包
```shell
solana-keygen new
```

- 查看钱包地址
```shell
solana address
```

- 显示余额
```shell
solana balance
```

- 获得测试币，发币要付一点费用，来点测试币吧
```shell
solana airdrop 2
```

## 基本概念

上面的发币过程，非常简单，不用写任何代码，就创建了代币，现在我来详情说明一下一些基本概念

📦 Token Program（代币程序）

 是一个智能合约，用于定义和管理代币的所有交互逻辑。
 包括代币的创建（铸造）、转账、销毁以及账户间的余额管理。
 支持 Fungible（可替代）代币，比如 SOL 或 USDC，也支持 NFT（非同质化代币）。

🪙 Mint Account（铸造账户）

一个可以铸造这个代币的帐户

👤 Token Account（代币账户）

 每个用户都需要一个 Token Account 来持有某种代币。
 每个 Token Account 只能对应一个 Mint（即一种代币）。

🧩 Associated Token Account（关联代币账户）

 是一种标准化的 Token Account。
 它的地址由 用户地址（owner） 和 代币类型地址（mint） 两者一起通过预定义算法衍生出来，因此它是“可预测”的。

这些概念一开始理解起来有很难懂，下面我们实际使用它们，你会理解起来好点

## 增加代币及转帐

上面我们创建了一个代币，但是它的supply现在是0

- 查看供应
```shell
spl-token supply 9XcmK3bzTisfGnq5kt1iMKeeg7hb7voYt9hoAdqbuqU3
0
```

- 创建token account
```shell
spl-token create-account 9XcmK3bzTisfGnq5kt1iMKeeg7hb7voYt9hoAdqbuqU3
Creating account DRk4VW2qchrY2WbJdpdGpmgSbvy6N9bKo4Ji2zZSTNV7
```

- 创建mint account
创建mint account [官网](https://solana.com/docs/tokens)给的是一个ts代码，主要代码：
```ts
import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  MINT_SIZE,
  TOKEN_2022_PROGRAM_ID,
  createInitializeMint2Instruction,
  getMinimumBalanceForRentExemptMint,
} from "@solana/spl-token";

const wallet = pg.wallet;
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Generate keypair to use as address of mint account
const mint = new Keypair();

// Calculate minimum lamports for space required by mint account
const rentLamports = await getMinimumBalanceForRentExemptMint(connection);

// Instruction to create new account with space for new mint account
const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: wallet.publicKey,
  newAccountPubkey: mint.publicKey,
  space: MINT_SIZE,
  lamports: rentLamports,
  programId: TOKEN_2022_PROGRAM_ID,
});

// Instruction to initialize mint account
const initializeMintInstruction = createInitializeMint2Instruction(
  mint.publicKey,
  2, // decimals
  wallet.publicKey, // mint authority
  wallet.publicKey, // freeze authority
  TOKEN_2022_PROGRAM_ID
);

// Build transaction with instructions to create new account and initialize mint account
const transaction = new Transaction().add(
  createAccountInstruction,
  initializeMintInstruction
);

const transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [
    wallet, // payer
    mint, // mint address keypair
  ]
);
```

这里将代币铸造（mint authority）给到了wallet，这里我用的是我本地的钱包，方法是在playground上导入。

- 供应token并再次查询余额
```shell
spl-token mint 9XcmK3bzTisfGnq5kt1iMKeeg7hb7voYt9hoAdqbuqU3 100000

spl-token supply 9XcmK3bzTisfGnq5kt1iMKeeg7hb7voYt9hoAdqbuqU3
100000
```

- 给phantom钱包创建token account ,本地钱包支付费用
```shell
spl-token create-account 9XcmK3bzTisfGnq5kt1iMKeeg7hb7voYt9hoAdqbuqU3 --owner BKtZpGzuxRH4YdTEYEkw1JvMB1UthzVxWLi7WEx6ymqH --fee-payer /path/id.json
Creating account H5S4RLz85TSn9VtGqm7G9k68awQ7EedUfsmLCsE6uiBn
```

- 直接给phantom钱包铸币是不行的，因为mint account不是它
```shell
spl-token mint H5S4RLz85TSn9VtGqm7G9k68awQ7EedUfsmLCsE6uiBn 9999999
Error: "Could not find mint account H5S4RLz85TSn9VtGqm7G9k68awQ7EedUfsmLCsE6uiBn"
```

- 可以转帐
```shell
spl-token transfer 9XcmK3bzTisfGnq5kt1iMKeeg7hb7voYt9hoAdqbuqU3 5555 H5S4RLz85TSn9VtGqm7G9k68awQ7EedUfsmLCsE6uiBn
Transfer 5555 tokens
  Sender: DRk4VW2qchrY2WbJdpdGpmgSbvy6N9bKo4Ji2zZSTNV7
  Recipient: H5S4RLz85TSn9VtGqm7G9k68awQ7EedUfsmLCsE6uiBn
```

转帐后，在phantom钱包中看到了代币，但是它没有logo和名字，显示为unknown token。

为了给这个代币加上名字和logo，我研究了一下，了解到的信息是主网加这个信息官网要审核，网上找到的[token-list](https://github.com/solana-labs/token-list)已不再更新。metaplex对应的网页page not found。我想这事怎么这么难，直到我发现token-2022可以直接给代币加name和logo。

上面的Associated Token Account创建官网也是提供了ts代码，暂时我还没用到这个，所以还没有去执行。

## token-2022

token-2022看名字就知道它是2022年诞生的，相对于之前的发币方式，它是更为先进（更傻瓜式）的。

在创建代币前，我们要想好代币的名字name和符号symbol，还要把logo上传到网上并提供一个能访问它的url就行，选择其实是多样的，如果你有服务器就放服务器，使用的是云存储就用云存储，我这里使用了[pinata](https://pinata.cloud)，主要是因为它是基于ipfs，既然都是搞区块链，那存储就试试ipfs，当然如果你有服务器，完全可以自己运行一个ipfs的节点，pinata的免费额度可以说很少，当然目前而言，makecoin.cc还是够用的。

准备好这样的一个json文件，并把它也上传到网络
```json
{
  "name": "Your Token Name",
  "symbol": "TOKEN",
  "description": "这是一个示例代币。",
  "image": "https://yourdomain.com/logo.png"
}
```

- 使用token-2022创建代币，program-id就是token-2022程序的id
```shell
spl-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb create-token --enable-metadata
Creating token BNAm6ksUpvYNnrpCB3DV2FuGQrVrXf3Tgarjx9KAgLFG under program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
To initialize metadata inside the mint, please run `spl-token initialize-metadata BNAm6ksUpvYNnrpCB3DV2FuGQrVrXf3Tgarjx9KAgLFG <YOUR_TOKEN_NAME> <YOUR_TOKEN_SYMBOL> <YOUR_TOKEN_URI>`, and sign with the mint authority.

Address:  BNAm6ksUpvYNnrpCB3DV2FuGQrVrXf3Tgarjx9KAgLFG
Decimals:  9
```

- 设置代币信息
```shell
spl-token initialize-metadata BNAm6ksUpvYNnrpCB3DV2FuGQrVrXf3Tgarjx9KAgLFG "Make Coin" "MCOIN" https://ivory-impressive-squid-584.mypinata.cloud/ipfs/bafkreibqjk366npns4kpcdqnpkyzlbdpbs3eqetmk7sp5pgl2gizkcedge --owner ~/.config/solana/id.json

Signature: edPFEY2yBn3qKKFQ3AM3i7RMH1qZ4oSuidA5tWfjuvaF89yfjj1iYqFxobPDUfnL24h7HD4mrSVSxLKNnm6C3Bx
```

一开始我没有加--owner，提示Error: AccountInvalidOwner，这样就完成了代币信息的设置，在[solscan](https://solscan.io/token/BNAm6ksUpvYNnrpCB3DV2FuGQrVrXf3Tgarjx9KAgLFG?cluster=devnet#metadata)上看到了代币名称，不过logo没有显示，代币的状态也是Reputation Unclassified，应该还是需要向官网提交信息，它提供了一个[信息提交表单](https://solscan.io/token-update)，因为我们只是测试，这里先不去提交了。

## 程序发币

上面的发币的过程其实是比较简单的，因为不用写任何代码，只是执行命令，但makecoin.cc的目标是让用户可以傻瓜式发币，所以后面就是写程序，让用户在页面提交信息，程序完成发币。


