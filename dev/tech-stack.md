# 技术选型

做出海产品的一个好处是很多IT基础设施都有免费额度，在产品起步阶段，除了域名费用，其他费用等于0。比如cloudflare的page、workers，前者是静态网页托管，后者是云函数，当然它还有key-value数据库，对象存储，turnstile（人机校验）、大模型等等。另外网站应用流行的开发框架next.js，可以很方便的托管到vercel网站。还有supabase，功能也很强大，auth认证，pg数据库，对象存储，云函数、大模型等

## 前端

- **next.js**
出海产品首选的前端框架就是next.js，非常简单好用，配合vercel，布署也非常简单，但它还必需配一套UI，好看的UI其实是设计师设计出来的，程序员一般很难自己做出好看的页面，术业有专攻。这里选用了cruip的[Free React / Next.js landing page template](https://github.com/cruip/open-react-template/tree/master)。

- **HeroUI**
一套组件库也可以提升开发效率，在shadcn和HeroUI之间，我选了后者，shadcn定制化更多一些，HeroUI更省事些。
这两套组件库都基于tailwind，样式调起来很方便。

## 后端及数据库

- **supabase**
supabase用来做后端非常方便，而且它提供了非常全面的功能，包括数据库、Auth认证（还支持web3登录）、对象存储、云函数。虽然免费额度没那么多，但对初始项目来说，完全够了。

## web3
