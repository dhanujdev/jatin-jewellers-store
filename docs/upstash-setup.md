# Setting Up Redis with Vercel

This document provides step-by-step instructions for setting up Redis with your Vercel deployment. You have two options:

1. **Vercel KV** (Recommended): Vercel's managed Redis service powered by Upstash
2. **Upstash Redis**: Direct integration with Upstash Redis

## Option 1: Vercel KV (Recommended)

Vercel KV is Vercel's managed Redis service, which is powered by Upstash but integrated directly into the Vercel platform.

### Why Vercel KV?

- **Native integration** with Vercel
- **Simplified setup** through the Vercel dashboard
- **Automatic environment variable** configuration
- **Consistent pricing** with other Vercel services

### Setup Instructions for Vercel KV

1. Go to the [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Navigate to the "Storage" tab
4. Click "Create" and select "KV Database"
5. Follow the prompts to create a new KV database
6. Once created, Vercel will automatically add the following environment variables to your project:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`
   - `KV_URL`

### Local Development with Vercel KV

For local development, you'll need to add the Vercel KV credentials to your `.env.local` file:

1. In your Vercel project, go to the "Storage" tab
2. Select your KV database
3. Click on ".env.local" to view the environment variables
4. Copy these variables to your local `.env.local` file

## Option 2: Upstash Redis Direct Integration

If you prefer to use Upstash Redis directly, you can use the Upstash integration in the Vercel Marketplace.

### Why Upstash Redis?

- **More control** over your Redis configuration
- **Direct access** to the Upstash dashboard
- **Additional features** available through Upstash

### Setup Instructions for Upstash Redis

### 1. Deploy Your Project to Vercel

If you haven't already, deploy your project to Vercel:

```bash
vercel
```

### 2. Add the Upstash Integration

1. Go to the [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Navigate to the "Integrations" tab
4. Search for "Upstash" and click on it
5. Click "Add Integration"
6. Follow the prompts to connect your Vercel project to Upstash

### 3. Configure Upstash Redis

1. After adding the integration, you'll be redirected to Upstash
2. Select your Vercel project from the dropdown
3. Choose to create a new Redis database or select an existing one
4. Select your preferred region (choose one close to your users)
5. Click "Create" to set up the integration

### 4. Verify Environment Variables

The integration will automatically add the following environment variables to your Vercel project settings under the "Environment Variables" tab.

- `UPSTASH_REDIS_REST_URL`: The URL for your Upstash Redis database
- `UPSTASH_REDIS_REST_TOKEN`: The authentication token for your database

### 5. Redeploy Your Application

After setting up the integration, redeploy your application to ensure it uses the new environment variables:

```bash
vercel --prod
```

## Local Development

For local development, you'll need to add the Upstash Redis credentials to your `.env.local` file:

1. Go to the [Upstash Console](https://console.upstash.com/)
2. Select your Redis database
3. Go to the "REST API" section
4. Copy the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` values
5. Add them to your `.env.local` file:

```
UPSTASH_REDIS_REST_URL=https://your-upstash-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token
```

## Troubleshooting

If you encounter any issues with the Upstash Redis integration:

1. **Connection Issues**: Verify that your environment variables are correctly set
2. **Performance Issues**: Check if you've selected the appropriate region for your database
3. **Rate Limiting**: If you're hitting rate limits, consider upgrading your Upstash plan

For more help, refer to the [Upstash Documentation](https://docs.upstash.com/) or contact [Upstash Support](https://upstash.com/support).

## Additional Resources

- [Upstash Redis Documentation](https://docs.upstash.com/redis)
- [Vercel Integration Guide](https://vercel.com/integrations/upstash)
- [Next.js with Upstash Redis Example](https://github.com/upstash/redis-examples/tree/master/nextjs-with-upstash-redis)

## Choosing Between Vercel KV and Upstash Redis

Both options use Upstash's Redis service under the hood, but they differ in how they're integrated with Vercel:

| Feature | Vercel KV | Upstash Redis |
|---------|-----------|---------------|
| Setup | Through Vercel Storage tab | Through Vercel Integrations |
| Environment Variables | `KV_REST_API_*` | `UPSTASH_REDIS_*` |
| Management | Vercel dashboard | Upstash dashboard |
| Pricing | Vercel pricing | Upstash pricing |

Our application is configured to work with both options, with Vercel KV taking precedence if both are configured. 