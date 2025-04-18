"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { CopyButton } from "@/components/copy-button"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github, Globe } from "lucide-react"
import { DeployButton } from "@/components/deploy-button"
import { useState, useEffect } from "react"

// 定义语言类型和翻译
type Language = "zh" | "en"

interface Translations {
  title: string
  description: string
  howToUse: string
  replaceGravatarUrl: string
  parameters: string
  parameterHash: string
  parameterSize: string
  parameterDefault: string
  parameterRating: string
  wordpressIntegration: string
  addToFunctions: string
  cacheEnabled: string
  cacheDisabled: string
  cacheEnabledDesc: string
  cacheDisabledDesc: string
  detectedDomain: string
  currentDomain: string
  autoDomainDesc: string
  deployTitle: string
  deployDesc: string
  deployText: string
  viewSourceCode: string
  afterDeployText: string
  afterDeployKV: string
  createdBy: string
  and: string
  switchLanguage: string
}

const translations: Record<Language, Translations> = {
  zh: {
    title: "Gravatar 代理",
    description: "一个简单的Gravatar头像代理，可用于WordPress",
    howToUse: "如何使用",
    replaceGravatarUrl: "将WordPress中的默认Gravatar URL替换为您的域名加上API端点：",
    parameters: "参数",
    parameterHash: "电子邮件地址的MD5哈希值",
    parameterSize: "头像大小（默认：80）",
    parameterDefault: "当电子邮件哈希不存在时使用的默认图像（默认：mp）",
    parameterRating: "头像评级（默认：g）",
    wordpressIntegration: "WordPress集成",
    addToFunctions: "将以下代码添加到您的主题的functions.php文件中：",
    cacheEnabled: "✓ 服务器端缓存已启用",
    cacheDisabled: "⚠️ 服务器端缓存未配置",
    cacheEnabledDesc: "此代理使用服务器端缓存来减少对Gravatar的请求并提高性能。",
    cacheDisabledDesc: "添加Vercel KV集成以启用服务器端缓存，提高性能。",
    detectedDomain: "自动检测到的域名",
    currentDomain: "当前使用的域名:",
    autoDomainDesc: "系统会自动使用您访问时的域名，无需手动配置。",
    deployTitle: "部署您自己的Gravatar代理",
    deployDesc: "一键部署到Vercel或查看源代码",
    deployText: "想要部署您自己的Gravatar代理？只需点击下面的按钮，即可将此项目部署到您的Vercel账户：",
    viewSourceCode: "查看源代码",
    afterDeployText: "部署后，您可能需要添加以下集成以获得最佳性能：",
    afterDeployKV: "Vercel KV - 用于服务器端缓存",
    createdBy: "由",
    and: "和",
    switchLanguage: "切换到English",
  },
  en: {
    title: "Gravatar Proxy",
    description: "A simple Gravatar avatar proxy for WordPress",
    howToUse: "How to Use",
    replaceGravatarUrl: "Replace the default Gravatar URL in WordPress with your domain plus the API endpoint:",
    parameters: "Parameters",
    parameterHash: "MD5 hash of the email address",
    parameterSize: "Avatar size (default: 80)",
    parameterDefault: "Default image to use when email hash doesn't exist (default: mp)",
    parameterRating: "Avatar rating (default: g)",
    wordpressIntegration: "WordPress Integration",
    addToFunctions: "Add the following code to your theme's functions.php file:",
    cacheEnabled: "✓ Server-side caching enabled",
    cacheDisabled: "⚠️ Server-side caching not configured",
    cacheEnabledDesc: "This proxy uses server-side caching to reduce requests to Gravatar and improve performance.",
    cacheDisabledDesc: "Add Vercel KV integration to enable server-side caching for better performance.",
    detectedDomain: "Automatically Detected Domain",
    currentDomain: "Currently using domain:",
    autoDomainDesc: "The system automatically uses the domain you're accessing from, no manual configuration needed.",
    deployTitle: "Deploy Your Own Gravatar Proxy",
    deployDesc: "One-click deployment to Vercel or view source code",
    deployText:
      "Want to deploy your own Gravatar proxy? Just click the button below to deploy this project to your Vercel account:",
    viewSourceCode: "View Source Code",
    afterDeployText: "After deployment, you may want to add the following integrations for best performance:",
    afterDeployKV: "Vercel KV - for server-side caching",
    createdBy: "Created by",
    and: "and",
    switchLanguage: "切换到中文",
  },
}

export function ClientHomePage({
  formattedDomain,
  isKVConfigured,
  wordpressCode,
  apiUrlExample,
  githubRepo,
}: {
  formattedDomain: string
  isKVConfigured: boolean
  wordpressCode: string
  apiUrlExample: string
  githubRepo: string
}) {
  // 语言状态
  const [language, setLanguage] = useState<Language>("zh")

  // 在客户端加载时检测语言
  useEffect(() => {
    // 尝试从localStorage获取语言设置
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "zh" || savedLanguage === "en")) {
      setLanguage(savedLanguage)
      return
    }

    // 如果没有保存的语言设置，则尝试从浏览器语言设置中获取
    const browserLanguage = navigator.language.toLowerCase()
    if (browserLanguage.startsWith("zh")) {
      setLanguage("zh")
    } else {
      setLanguage("en")
    }
  }, [])

  // 保存语言设置到localStorage
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  // 切换语言
  const toggleLanguage = () => {
    setLanguage(language === "zh" ? "en" : "zh")
  }

  // 翻译函数
  const t = (key: keyof Translations): string => {
    return translations[language][key]
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-background">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={toggleLanguage}
          title={t("switchLanguage")}
        >
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t("switchLanguage")}</span>
        </Button>
        <ThemeToggle />
      </div>

      <div className="w-full max-w-4xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <h2 className="text-lg font-semibold">{t("howToUse")}</h2>
            <p>{t("replaceGravatarUrl")}</p>
            <div className="p-4 bg-muted rounded-md overflow-x-auto relative group">
              <code className="text-foreground">{apiUrlExample}</code>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <CopyButton text={apiUrlExample} />
              </div>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md mt-4">
              <h4 className="font-medium text-green-800 dark:text-green-300">
                {isKVConfigured ? t("cacheEnabled") : t("cacheDisabled")}
              </h4>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                {isKVConfigured ? t("cacheEnabledDesc") : t("cacheDisabledDesc")}
              </p>
            </div>

            <h3 className="text-md font-semibold mt-4">{t("parameters")}</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>hash</strong>: {t("parameterHash")}
              </li>
              <li>
                <strong>s</strong>: {t("parameterSize")}
              </li>
              <li>
                <strong>d</strong>: {t("parameterDefault")}
              </li>
              <li>
                <strong>r</strong>: {t("parameterRating")}
              </li>
            </ul>

            <h3 className="text-md font-semibold mt-4">{t("wordpressIntegration")}</h3>
            <p>{t("addToFunctions")}</p>
            <div className="relative">
              <pre className="p-4 bg-muted rounded-md overflow-x-auto">
                <code className="text-foreground">{wordpressCode}</code>
              </pre>
              <div className="absolute top-2 right-2">
                <CopyButton text={wordpressCode} />
              </div>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md mt-4">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-300">{t("detectedDomain")}</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                {t("currentDomain")} <strong>{formattedDomain}</strong>
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">{t("autoDomainDesc")}</p>
            </div>
          </CardContent>
        </Card>

        {/* 部署和开源信息 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t("deployTitle")}</CardTitle>
            <CardDescription>{t("deployDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{t("deployText")}</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <DeployButton repositoryUrl={githubRepo} />

              <Link href={githubRepo} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full sm:w-auto">
                  <Github className="mr-2 h-4 w-4" />
                  {t("viewSourceCode")}
                </Button>
              </Link>
            </div>

            <div className="text-sm text-muted-foreground mt-4">
              <p>{t("afterDeployText")}</p>
              <ul className="list-disc pl-5 mt-2">
                <li>{t("afterDeployKV")}</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* 页脚 */}
        <footer className="text-center text-sm text-muted-foreground pb-8">
          <p>
            {t("createdBy")}{" "}
            <a
              href="https://hunya.net"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary"
            >
              昏鸦
            </a>{" "}
            {t("and")}{" "}
            <a href="https://v0.dev" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
              v0.dev
            </a>
          </p>
        </footer>
      </div>
    </main>
  )
}
