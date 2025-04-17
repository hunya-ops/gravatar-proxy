import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { CopyButton } from "@/components/copy-button"
import { headers } from "next/headers"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import { DeployButton } from "@/components/deploy-button"

export default async function Home() {
  // Get the host from request headers - this will be the actual domain being used
  const headersList = headers()
  const host = headersList.get("host") || ""

  // Use the host from headers, or fall back to environment variables if needed
  const domain = host || process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL || "gp.hunya.net"

  // Format the domain properly (add https:// if needed)
  const formattedDomain = domain.includes("://") ? domain : `https://${domain}`

  // Check if KV is configured
  const isKVConfigured = !!process.env.KV_URL || !!process.env.KV_REST_API_URL || !!process.env.KV_REST_API_TOKEN

  // Generate the WordPress code with the correct domain
  const wordpressCode = `add_filter('get_avatar_url', 'custom_gravatar_url', 10, 3);

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
   
   return '${formattedDomain}/api/gravatar?hash=' . $email_hash . '&s=' . $size . '&d=' . $default . '&r=' . $rating;
}`

  // Generate the API URL example
  const apiUrlExample = `${formattedDomain}/api/gravatar?hash=%HASH%&s=%SIZE%&d=%DEFAULT%&r=%RATING%`

  // GitHub repository URL - replace with your actual repository
  const githubRepo = "https://github.com/hunya-ops/gravatar-proxy"

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-background">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-4xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Gravatar Proxy</CardTitle>
            <CardDescription>一个简单的Gravatar头像代理，可用于WordPress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <h2 className="text-lg font-semibold">如何使用</h2>
            <p>将WordPress中的默认Gravatar URL替换为您的域名加上API端点：</p>
            <div className="p-4 bg-muted rounded-md overflow-x-auto relative group">
              <code className="text-foreground">{apiUrlExample}</code>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <CopyButton text={apiUrlExample} />
              </div>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md mt-4">
              <h4 className="font-medium text-green-800 dark:text-green-300">
                {isKVConfigured ? "✓ 服务器端缓存已启用" : "⚠️ 服务器端缓存未配置"}
              </h4>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                {isKVConfigured
                  ? "此代理使用服务器端缓存来减少对Gravatar的请求并提高性能。"
                  : "添加Vercel KV集成以启用服务器端缓存，提高性能。"}
              </p>
            </div>

            <h3 className="text-md font-semibold mt-4">参数</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>hash</strong>: 电子邮件地址的MD5哈希值
              </li>
              <li>
                <strong>s</strong>: 头像大小（默认：80）
              </li>
              <li>
                <strong>d</strong>: 当电子邮件哈希不存在时使用的默认图像（默认：mp）
              </li>
              <li>
                <strong>r</strong>: 头像评级（默认：g）
              </li>
            </ul>

            <h3 className="text-md font-semibold mt-4">WordPress集成</h3>
            <p>将以下代码添加到您的主题的functions.php文件中：</p>
            <div className="relative">
              <pre className="p-4 bg-muted rounded-md overflow-x-auto">
                <code className="text-foreground">{wordpressCode}</code>
              </pre>
              <div className="absolute top-2 right-2">
                <CopyButton text={wordpressCode} />
              </div>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md mt-4">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-300">自动检测到的域名</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                当前使用的域名: <strong>{formattedDomain}</strong>
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                系统会自动使用您访问时的域名，无需手动配置。
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 部署和开源信息 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>部署您自己的Gravatar代理</CardTitle>
            <CardDescription>一键部署到Vercel或查看源代码</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>想要部署您自己的Gravatar代理？只需点击下面的按钮，即可将此项目部署到您的Vercel账户：</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <DeployButton repositoryUrl={githubRepo} />

              <Link href={githubRepo} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full sm:w-auto">
                  <Github className="mr-2 h-4 w-4" />
                  查看源代码
                </Button>
              </Link>
            </div>

            <div className="text-sm text-muted-foreground mt-4">
              <p>部署后，您可能需要添加以下集成以获得最佳性能：</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Vercel KV - 用于服务器端缓存</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* 页脚 */}
        <footer className="text-center text-sm text-muted-foreground pb-8">
          <p>Gravatar Proxy &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </main>
  )
}
