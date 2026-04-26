# Deployment Guide

This guide covers deployment best practices and troubleshooting for DeepPDF Analyzer.

## Pre-Deployment Checklist

### 1. Environment Variables
- [ ] Copy `.env.example` to `.env.local`
- [ ] Add `GROQ_API_KEY` from [Groq Console](https://console.groq.com/)
- [ ] Verify API key is valid and has sufficient credits

### 2. Dependencies
- [ ] Run `npm install` to install all dependencies
- [ ] Run `npm run lint` to check for code issues
- [ ] Run pre-build check: `node scripts/check-deps.js`

### 3. Build Verification
- [ ] Run `npm run build` locally
- [ ] Test the production build: `npm start`
- [ ] Verify all pages load correctly
- [ ] Test PDF upload and analysis

## Deployment Platforms

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   - In Vercel project settings → Environment Variables
   - Add: `GROQ_API_KEY` (your Groq API key)
   - Add: `NODE_ENV` = `production`

4. **Deploy**
   - Vercel will automatically deploy on push
   - Monitor the deployment logs

5. **Post-Deployment**
   - Test the live application
   - Check `/api/health` endpoint
   - Monitor Vercel analytics

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t deeppdf-analyzer .
docker run -p 3000:3000 -e GROQ_API_KEY=your_key deeppdf-analyzer
```

## Troubleshooting

### Build Failures

**Error: Missing dependencies**
```bash
npm install
node scripts/check-deps.js
```

**Error: Environment variable not set**
- Ensure `.env.local` exists with required variables
- For Vercel: Check Environment Variables in project settings

**Error: TypeScript errors**
```bash
npm run lint
# Fix reported issues
```

### Runtime Issues

**API returns 429 (Rate Limit)**
- Rate limit is 10 requests per 15 minutes per IP
- Wait and try again later
- Consider implementing Redis-based rate limiting for multi-instance deployments

**API returns 500 (Server Error)**
- Check Vercel logs for detailed error
- Verify Groq API key is valid
- Check Groq API status page

**PDF upload fails**
- Ensure file is under 10MB
- Verify file is a valid PDF
- Check browser console for errors

**Analysis timeout**
- Default timeout is 60 seconds
- Large PDFs may take longer
- Consider implementing progress indicators

### Performance Issues

**Slow response times**
- Check Vercel Edge Function logs
- Monitor Groq API response times
- Consider caching frequent analyses

**High memory usage**
- Monitor Vercel function memory
- Rate limiting helps prevent overload
- Consider implementing request queuing

## Monitoring

### Health Check
```bash
curl https://your-domain.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 12345,
  "environment": "production"
}
```

### Logs
- **Vercel**: View in project dashboard → Logs
- **Docker**: `docker logs <container-id>`

### Metrics to Monitor
- API response times
- Error rates (4xx, 5xx)
- Rate limit hits
- Memory usage
- Groq API quota

## Security Considerations

1. **API Keys**
   - Never commit `.env.local` to git
   - Rotate API keys regularly
   - Use different keys for dev/prod

2. **Rate Limiting**
   - Current: 10 requests/15min per IP
   - Adjust based on your needs in `lib/rate-limit.ts`

3. **File Uploads**
   - Max file size: 10MB
   - PDF only
   - Files are not stored, processed in memory

4. **CORS**
   - Configure allowed origins in `middleware.ts`
   - Add your production domain

## Scaling

### Vertical Scaling
- Increase Vercel function memory in `vercel.json`
- Adjust `maxDuration` for longer processing

### Horizontal Scaling
- Vercel automatically scales
- For rate limiting across instances, implement Redis
- Consider load balancer for custom deployments

## Backup and Recovery

### Environment Variables
- Keep a secure backup of all API keys
- Document configuration changes

### Code
- Use Git for version control
- Tag releases: `git tag v1.0.0`

### Data
- Application is stateless
- No persistent data storage
- PDFs are processed and discarded

## Updates

### Updating Dependencies
```bash
npm update
npm audit fix
npm run build
```

### Updating Next.js
```bash
npm install next@latest
npm run build
```

### Rolling Back
```bash
git checkout <previous-commit>
git push
# Vercel will auto-deploy the previous version
```

## Support

For issues:
1. Check this guide
2. Review Vercel logs
3. Check Groq API status
4. Open an issue on GitHub
