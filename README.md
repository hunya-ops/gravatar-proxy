# Gravatar Proxy

一个简单的Gravatar头像代理服务，专为WordPress和其他网站设计。

<a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fhunya-ops%2Fgravatar-proxy&project-name=gravatar-proxy&repository-name=gravatar-proxy&integration-ids=oac_V3R1GIpkoJorr6fqyiwdhl17">
  <img src="https://vercel.com/button-dark" alt="Deploy with Vercel" />
</a>

## 功能

- 🚀 快速的Gravatar头像代理
- 💾 服务器端缓存，减少对Gravatar的请求
- 🌓 深色/浅色主题支持
- 🔄 自动域名检测
- 🔌 简单的WordPress集成

## 部署

1. 点击上方的"Deploy with Vercel"按钮
2. 按照Vercel的指示完成部署
3. 部署后，建议添加Vercel KV集成以启用缓存功能

## 环境变量配置

本项目使用环境变量进行配置。以下是所需的环境变量及其设置方法：

### 必要的环境变量

| 环境变量 | 描述 | 默认值 | 必需 |
|---------|------|-------|------|
| `NEXT_PUBLIC_VERCEL_URL` | 应用程序的公共URL，用于生成正确的Gravatar代理链接 | Vercel自动设置 | 否 |

### 缓存相关环境变量（推荐）

以下环境变量在添加Vercel KV集成后会自动设置：

| 环境变量 | 描述 | 如何获取 |
|---------|------|---------|
| `KV_URL` | Vercel KV的连接URL | 自动设置 |
| `KV_REST_API_URL` | Vercel KV REST API的URL | 自动设置 |
| `KV_REST_API_TOKEN` | Vercel KV REST API的访问令牌 | 自动设置 |
| `KV_REST_API_READ_ONLY_TOKEN` | Vercel KV REST API的只读访问令牌 | 自动设置 |

### 如何添加环境变量

#### 方法1：通过Vercel仪表板

1. 登录您的[Vercel仪表板](https://vercel.com/dashboard)
2. 选择您的Gravatar Proxy项目
3. 点击"Settings"选项卡
4. 在左侧菜单中选择"Environment Variables"
5. 添加所需的环境变量及其值
6. 点击"Save"保存更改
7. 重新部署您的项目以应用新的环境变量

![Vercel环境变量设置](https://vercel.com/docs/images/concepts/environment-variables/environment-variables-dashboard.png)

#### 方法2：通过Vercel CLI

如果您使用Vercel CLI，可以使用以下命令添加环境变量：

\`\`\`bash
vercel env add VARIABLE_NAME
\`\`\`

然后按照提示输入变量值和环境（production、preview或development）。

#### 方法3：使用.env文件（仅限本地开发）

在本地开发时，您可以在项目根目录创建`.env.local`文件：

\`\`\`
NEXT_PUBLIC_VERCEL_URL=localhost:3000
\`\`\`

注意：`.env.local`文件不应提交到Git仓库。

### 添加Vercel KV集成

为了启用缓存功能，强烈建议添加Vercel KV集成：

1. 登录您的[Vercel仪表板](https://vercel.com/dashboard)
2. 选择您的Gravatar Proxy项目
3. 点击"Storage"选项卡
4. 找到"KV Database"部分并点击"Connect"
5. 按照指示创建新的KV数据库或连接现有数据库
6. 完成后，Vercel会自动添加所需的环境变量
7. 重新部署您的项目以应用更改

## 使用方法

### API端点

\`\`\`
https://your-domain.com/api/gravatar?hash=HASH&s=SIZE&d=DEFAULT&r=RATING
\`\`\`

参数:
- `hash`: 电子邮件地址的MD5哈希值
- `s`: 头像大小（默认：80）
- `d`: 当电子邮件哈希不存在时使用的默认图像（默认：mp）
- `r`: 头像评级（默认：g）

### WordPress集成

将以下代码添加到您的主题的functions.php文件中：

\`\`\`php
add_filter('get_avatar_url', 'custom_gravatar_url', 10, 3);

function custom_gravatar_url($url, $id_or_email, $args) {
   $email_hash = '';
   
   // Get email hash
   if (is_numeric($id_or_email)) {
       $user = get_userdata($id_or_email);
       if ($user) {
           $email_hash = md5(strtolower(trim($user->user_email)));
       }
   } elseif (is_object($id_or_email)) {
       if (!empty($id_or_email->user_id)) {
           $user = get_userdata($id_or_email->user_id);
           if ($user) {
               $email_hash = md5(strtolower(trim($user->user_email)));
           }
       } elseif (!empty($id_or_email->comment_author_email)) {
           $email_hash = md5(strtolower(trim($id_or_email->comment_author_email)));
       }
   } else {
       $email_hash = md5(strtolower(trim($id_or_email)));
   }
   
   // Build custom Gravatar URL
   $size = isset($args['size']) ? $args['size'] : 80;
   $default = isset($args['default']) ? $args['default'] : 'mp';
   $rating = isset($args['rating']) ? $args['rating'] : 'g';
   
   return 'https://your-domain.com/api/gravatar?hash=' . $email_hash . '&s=' . $size . '&d=' . $default . '&r=' . $rating;
}
\`\`\`

> **重要提示**：您无需手动替换上述代码中的域名！当您访问Gravatar Proxy网站时，页面会自动检测您使用的域名，并在显示的WordPress集成代码中使用正确的域名。只需从网站上复制代码，无需任何修改即可使用。

## 自动域名检测功能

Gravatar Proxy具有智能域名检测功能：

1. **自动检测**：应用程序会自动检测用户访问时使用的域名
2. **动态代码生成**：页面上显示的WordPress集成代码会自动包含正确的域名
3. **无需手动修改**：用户可以直接复制页面上的代码，无需替换任何占位符

这意味着，如果您通过自定义域名（如`gravatar.example.com`）访问应用程序，页面上显示的代码将自动使用该域名，而不是通用的`your-domain.com`占位符。

## 故障排除

### 域名问题

如果您在WordPress集成中看到错误的域名：

1. 确保您通过希望在WordPress中使用的相同域名访问Gravatar Proxy
2. 如果您在本地开发环境中测试，可能需要设置`NEXT_PUBLIC_VERCEL_URL`环境变量

### 缓存问题

如果缓存不起作用：

1. 确认Vercel KV集成已正确设置
2. 检查环境变量`KV_URL`、`KV_REST_API_URL`和`KV_REST_API_TOKEN`是否存在
3. 查看Vercel部署日志中是否有与KV相关的错误

## 许可证

MIT
