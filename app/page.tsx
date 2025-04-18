import { headers } from "next/headers"
import { ClientHomePage } from "@/components/client-home-page"

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

  // GitHub repository URL
  const githubRepo = "https://github.com/hunya-ops/gravatar-proxy"

  return (
    <ClientHomePage
      formattedDomain={formattedDomain}
      isKVConfigured={isKVConfigured}
      wordpressCode={wordpressCode}
      apiUrlExample={apiUrlExample}
      githubRepo={githubRepo}
    />
  )
}
