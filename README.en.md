# Gravatar Proxy

A simple Gravatar avatar proxy service designed for WordPress and other websites.

<a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fhunya-ops%2Fgravatar-proxy&project-name=gravatar-proxy&repository-name=gravatar-proxy&integration-ids=oac_V3R1GIpkoJorr6fqyiwdhl17">
  <img src="https://vercel.com/button-dark" alt="Deploy with Vercel" />
</a>

## Features

- 🚀 Fast Gravatar avatar proxy
- 💾 Server-side caching to reduce requests to Gravatar
- 🌓 Dark/light theme support
- 🔄 Automatic domain detection
- 🔌 Simple WordPress integration

## Deployment

1. Click the "Deploy with Vercel" button above
2. Follow Vercel's instructions to complete the deployment
3. After deployment, it's recommended to add Vercel KV integration to enable caching functionality

## Environment Variables Configuration

This project uses environment variables for configuration. Here are the required environment variables and how to set them:

### Required Environment Variables

| Environment Variable | Description | Default Value | Required |
|---------|------|-------|------|
| `NEXT_PUBLIC_VERCEL_URL` | The public URL of the application, used to generate correct Gravatar proxy links | Automatically set by Vercel | No |

### Cache-related Environment Variables (Recommended)

The following environment variables are automatically set after adding Vercel KV integration:

| Environment Variable | Description | How to Get |
|---------|------|---------|
| `KV_URL` | Vercel KV connection URL | Automatically set |
| `KV_REST_API_URL` | Vercel KV REST API URL | Automatically set |
| `KV_REST_API_TOKEN` | Vercel KV REST API access token | Automatically set |
| `KV_REST_API_READ_ONLY_TOKEN` | Vercel KV REST API read-only access token | Automatically set |

### How to Add Environment Variables

#### Method 1: Through Vercel Dashboard

1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your Gravatar Proxy project
3. Click the "Settings" tab
4. Select "Environment Variables" from the left menu
5. Add the required environment variables and their values
6. Click "Save" to save the changes
7. Redeploy your project to apply the new environment variables

![Vercel Environment Variables Settings](https://vercel.com/docs/images/concepts/environment-variables/environment-variables-dashboard.png)

#### Method 2: Using Vercel CLI

If you use Vercel CLI, you can add environment variables with the following command:

\`\`\`bash
vercel env add VARIABLE_NAME
\`\`\`

Then follow the prompts to enter the variable value and environment (production, preview, or development).

#### Method 3: Using .env File (Local Development Only)

For local development, you can create a `.env.local` file in the project root directory:

\`\`\`
NEXT_PUBLIC_VERCEL_URL=localhost:3000
\`\`\`

Note: The `.env.local` file should not be committed to the Git repository.

### Adding Vercel KV Integration

To enable caching functionality, it's strongly recommended to add Vercel KV integration:

1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your Gravatar Proxy project
3. Click the "Storage" tab
4. Find the "KV Database" section and click "Connect"
5. Follow the instructions to create a new KV database or connect an existing one
6. Once completed, Vercel will automatically add the required environment variables
7. Redeploy your project to apply the changes

## Usage

### API Endpoint

\`\`\`
https://your-domain.com/api/gravatar?hash=HASH&s=SIZE&d=DEFAULT&r=RATING
\`\`\`

Parameters:
- `hash`: MD5 hash of the email address
- `s`: Avatar size (default: 80)
- `d`: Default image to use when the email hash doesn't exist (default: mp)
- `r`: Avatar rating (default: g)

### WordPress Integration

Add the following code to your theme's functions.php file:

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

> **Important Note**: You don't need to manually replace the domain in the code above! When you visit the Gravatar Proxy website, the page will automatically detect the domain you're using and display the WordPress integration code with the correct domain. Simply copy the code from the website without any modifications.

## Automatic Domain Detection Feature

Gravatar Proxy has an intelligent domain detection feature:

1. **Automatic Detection**: The application automatically detects the domain used when accessing it
2. **Dynamic Code Generation**: The WordPress integration code displayed on the page automatically includes the correct domain
3. **No Manual Modification Required**: Users can directly copy the code from the page without replacing any placeholders

This means that if you access the application through a custom domain (e.g., `gravatar.example.com`), the code displayed on the page will automatically use that domain instead of the generic `your-domain.com` placeholder.

## Troubleshooting

### Domain Issues

If you see an incorrect domain in the WordPress integration:

1. Make sure you're accessing Gravatar Proxy through the same domain you want to use in WordPress
2. If you're testing in a local development environment, you may need to set the `NEXT_PUBLIC_VERCEL_URL` environment variable

### Caching Issues

If caching isn't working:

1. Confirm that Vercel KV integration is properly set up
2. Check if the environment variables `KV_URL`, `KV_REST_API_URL`, and `KV_REST_API_TOKEN` exist
3. Look for KV-related errors in the Vercel deployment logs

## License

MIT
\`\`\`

最后，让我确保我们的客户端主页组件正确实现了所有功能：
