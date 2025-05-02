# Deploying to Vercel

To deploy this project to Vercel, follow these steps:

1. **Create a Vercel Account:**

   Visit [Vercel](https://vercel.com/signup) and sign up for a free account if you haven't already.

1. **Add the Project:**
   - After registering and logging into the Vercel dashboard, click on "Add New" and select "Project".
   - Connect your Github account/organisation if not already setup.
   - Select the repository from the list of GitHub repositories.
   - Add the two required environment variables and their respective values.
     - `NEXT_PUBLIC_WORDPRESS_BASE_URL`
     - `NEXT_PUBLIC_SITE_URL`
   - Click "Build" and wait for the site to build for the first time.

1. **Setup Custom Domain for Project:**
   - Go to the [Vercel dashboard](https://vercel.com) and select your project
   - Click "Settings" -> "Domains"
   - Enter your custom domain
   - Click "Add" and choose if the `www.` subdomain should be redirected to the root level domain (non-`www.`) — Check existing site to see which redirect option to use.
   - Login to your DNS provider.
   - Ensure any existing DNS records are both backed up for safety and removed.
   - Add **both** A and CNAME records shown in Vercel to your DNS provider.
   - Go back to the domain settings page for your project in Vercel and check the status of the verification of the records from Vercel.
   - This process usually takes about 5 minutes and will automatically generate the SSL certificate for the site.
   - Once the DNS verification is confirmed in Vercel, Check your site domain from a private browsing window.

### Notes
If any issues, check the different records in an online tool like [www.whatsmydns.net](https://www.whatsmydns.net/) to confirm DNS is pointing to correct locations



***

## Learn More

To learn more about Next.js, check out the [Next.js documentation](https://nextjs.org/docs).

To learn more about deploying Next.js applications to Vercel, visit the [Vercel documentation](https://vercel.com/docs).