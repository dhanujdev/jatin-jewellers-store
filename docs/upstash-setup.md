# Setting Up Upstash Redis with Vercel

This document provides step-by-step instructions for setting up Upstash Redis with your Vercel deployment.

## Why Upstash Redis?

Upstash provides a serverless Redis database that is:
- **Fully managed**: No infrastructure to maintain
- **Serverless**: Pay only for what you use
- **Globally distributed**: Low latency access from anywhere
- **Durable**: Data is persisted to disk
- **Compatible**: Redis API compatible

## Setup Instructions

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