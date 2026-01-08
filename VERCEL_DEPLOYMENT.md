# Vercel Deployment Guide for Polaris with Kortex API

## Prerequisites

Before deploying to Vercel, ensure you have:

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account** - Connected to your Vercel account
3. **Repository Access** - Access to TechTitan27/polaris repository
4. **Environment Variables** - All required API keys and credentials

## Environment Variables

Add the following environment variables in your Vercel project settings:

### Required Variables

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZGFybGluZy1yaGluby03LmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_Mc3osXFU4aQgFwneWNhYp4GPddFb09L7MhhLTBKD1l

# Convex Database
NEXT_PUBLIC_CONVEX_URL=https://ceaseless-vulture-872.convex.site
CONVEX_DEPLOYMENT=prod:ceaseless-vulture-872|eyJ2MiI6Ijk4Y2I5MDg1YzQ3MTQzYTc4YmY3MmE2ZGNkNjU5MGFkIn0=

# Internal Key for Convex Operations
POLARIS_CONVEX_INTERNAL_KEY=kortex_internal_secret_key_12345
```

### Optional Variables (if you want to re-add these features)

```env
# Firecrawl (for documentation scraping in quick-edit)
FIRECRAWL_API_KEY=your_firecrawl_key

# Sentry (for error tracking)
SENTRY_DSN=your_sentry_dsn
```

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Import Project**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Continue with GitHub"
   - Select `TechTitan27/polaris` repository
   - Select the `feature/kortex-api-integration` branch

2. **Configure Project**
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

3. **Add Environment Variables**
   - In the project settings, go to Environment Variables
   - Add all the required variables listed above
   - Make sure to mark them as Production, Preview, and Development as needed

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (usually 2-5 minutes)
   - Your site will be live at `your-project-name.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd polaris
   vercel
   ```

4. **Follow the prompts**
   - Link to existing project or create new
   - Add environment variables when prompted
   - Confirm deployment

5. **Deploy to production**
   ```bash
   vercel --prod
   ```

## Post-Deployment Checklist

- [ ] Verify the site loads correctly
- [ ] Test authentication flow
- [ ] Test code suggestions
- [ ] Test quick edit (Cmd+K)
- [ ] Test conversation messages
- [ ] Check for any build errors
- [ ] Monitor console for runtime errors
- [ ] Verify environment variables are set correctly

## Troubleshooting

### Build Errors

**Issue: Module not found errors**
- Solution: Ensure all dependencies are installed. Run `npm install` locally first.

**Issue: TypeScript errors**
- Solution: Check that TypeScript is configured correctly in `tsconfig.json`

**Issue: Environment variable errors**
- Solution: Verify all required environment variables are set in Vercel dashboard

### Runtime Errors

**Issue: Authentication failures**
- Solution: Verify Clerk keys are correct and properly set in environment variables

**Issue: Convex connection errors**
- Solution: Check Convex URL and deployment keys are correct

**Issue: Kortex API errors**
- Solution: Verify the API endpoint is accessible and the API key is correct

**Issue: Missing internal key**
- Solution: Ensure `POLARIS_CONVEX_INTERNAL_KEY` is set in environment variables

### Performance Issues

**Issue: Slow API responses**
- Solution: The Kortex API may have rate limits. Consider implementing caching.

**Issue: Large bundle size**
- Solution: Check `next.config.ts` for optimization options. Consider code splitting.

## Custom Domain (Optional)

To add a custom domain:

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Click "Add Domain"
4. Enter your domain name
5. Follow the DNS configuration instructions

## Monitoring and Analytics

Vercel provides built-in analytics:

- **Analytics Dashboard**: View page views, visitors, and more
- **Speed Insights**: Monitor Core Web Vitals
- **Logs**: View deployment and runtime logs

To enable advanced monitoring:

1. **Sentry Integration** (optional)
   - Add `SENTRY_DSN` to environment variables
   - Follow Sentry integration instructions in `sentry.*.config.ts`

2. **Custom Analytics**
   - Add your analytics tracking code to `src/app/layout.tsx`

## Scaling Considerations

For production deployment with high traffic:

1. **Database Scaling**
   - Monitor Convex usage and upgrade plan if needed
   - Consider implementing caching strategies

2. **API Rate Limiting**
   - Monitor Kortex API usage
   - Implement request queuing if needed

3. **CDN and Caching**
   - Vercel provides automatic CDN
   - Configure cache headers in `next.config.ts` for static assets

4. **Performance Optimization**
   - Enable image optimization
   - Implement lazy loading
   - Use Vercel Edge Functions for faster API responses

## Backup and Recovery

- **Code**: Your code is stored in GitHub
- **Database**: Convex provides automatic backups
- **Environment Variables**: Store them securely and document them
- **Deployments**: Vercel maintains deployment history

## Updates and Maintenance

To update the application:

1. Make changes locally
2. Test thoroughly
3. Commit and push to GitHub
4. Merge changes to main branch
5. Vercel will automatically deploy updates

## Support and Resources

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **Clerk Documentation**: [clerk.com/docs](https://clerk.com/docs)
- **Convex Documentation**: [convex.dev/docs](https://convex.dev/docs)
- **Kortex Integration**: See `KORTEX_INTEGRATION.md`

## Deployment Summary

✅ Repository: TechTitan27/polaris
✅ Branch: feature/kortex-api-integration
✅ Pull Request: https://github.com/TechTitan27/polaris/pull/1
✅ Framework: Next.js 16
✅ AI Provider: Kortex API
✅ Status: Ready for Vercel deployment

---

**Next Steps:**
1. Deploy to Vercel using the steps above
2. Test all AI-powered features
3. Monitor performance and errors
4. Set up custom domain (optional)
5. Configure analytics (optional)

Good luck with your deployment! 🚀