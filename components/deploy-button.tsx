"use client"

import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { VercelLogoIcon } from "@radix-ui/react-icons"

interface DeployButtonProps {
  repositoryUrl: string
  projectName?: string
  repositoryName?: string
  className?: string
}

export function DeployButton({
  repositoryUrl,
  projectName = "gravatar-proxy",
  repositoryName = "gravatar-proxy",
  className = "",
}: DeployButtonProps) {
  const { theme } = useTheme()

  // URL encode the repository URL
  const encodedRepoUrl = encodeURIComponent(repositoryUrl)

  // Create the deploy URL
  const deployUrl = `https://vercel.com/new/clone?repository-url=${encodedRepoUrl}&project-name=${projectName}&repository-name=${repositoryName}&integration-ids=oac_V3R1GIpkoJorr6fqyiwdhl17`

  return (
    <Button
      asChild
      className={`bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 ${className}`}
    >
      <a href={deployUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
        <VercelLogoIcon className="h-4 w-4" />
        <span>Deploy to Vercel</span>
      </a>
    </Button>
  )
}
