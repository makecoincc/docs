# dapp开发

## [技术选型](/dev/tech-stack)

- 前端框架：Next.js 15 + TypeScript
- 样式框架：Tailwind CSS + shadcn/ui
- 钱包连接：Phantom
- 后端服务：Supabase

## 网站功能

- 创建代币
- 代币列表

- 登录/注册
- 用户中心
    - 我的代币
    - 用户信息
    - 更新邮件
    - 更新密码
- 登出

## 登录/注册等

使用web3方式登录时，会自动创建用户

- 注册：用户邮箱注册
```
let { data, error } = await supabase.auth.signUp({
  email: 'example@email.com',
  password: 'example-password'
})
```
- 登录：邮箱加密码登录、邮箱OTP登录、Sign in with web3 (solana)
```
let { data, error } = await supabase.auth.signInWithPassword({
  email: 'example@email.com',
  password: 'example-password'
})

const { data, error } = await supabase.auth.signInWithOtp({
  email: 'example@email.com,
  options: {
    // set this to false if you do not want the user to be automatically signed up
    shouldCreateUser: false,
  },
})

const { data, error } = await supabase.auth.signInWithWeb3({
  chain: 'solana',
  statement: 'I accept the Terms of Service at https://example.com/tos',
  wallet: window.braveSolana,
})

const { data, error } = await supabase.auth.signInWithWeb3({
  chain: 'solana',
  statement: 'I accept the Terms of Service at https://example.com/tos',
  wallet: window.phantom,
})
```

- 忘记密码：通过邮箱重置密码

```
let { data, error } = await supabase.auth.resetPasswordForEmail(email)

```

点击邮箱中的链接，回到网站，根据链接中的参数，调用`setSession`方法，设置`access_token`和`refresh_token`
```
const { data, error } = await supabase.auth.setSession({
    access_token: access_token,
    refresh_token: refresh_token
});
```
再调用`updateUser`方法，更新用户密码或其他信息
```
const { data, error } = await supabase.auth.updateUser({
  email: "new@email.com",
  password: "new-password",
  data: { hello: 'world' }
})
```

- 登出：调用`signOut`方法
```
let { error } = await supabase.auth.signOut()
```

## 代币创建

## 代币列表




