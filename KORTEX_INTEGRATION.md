# Kortex API Integration

## Overview

This document describes the integration of the Kortex API into the Polaris application, replacing the previous AI provider (Anthropic Claude).

## Changes Made

### 1. Environment Variables

The following environment variables have been configured in `.env`:

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

### 2. API Endpoints Updated

#### Suggestion API (`/api/suggestion`)
- **Previous**: Used Anthropic's `generateText` function with Claude Sonnet 4
- **Now**: Uses Kortex API for code suggestions
- **Endpoint**: `https://uj1o2lxj--chat.functions.blink.new`
- **Authentication**: Uses API key `aries_img123rd_789ftyu`

#### Quick Edit API (`/api/quick-edit`)
- **Previous**: Used Anthropic's `generateText` function with Claude Sonnet 4
- **Now**: Uses Kortex API for code editing
- **Endpoint**: `https://uj1o2lxj--chat.functions.blink.new`
- **Authentication**: Uses API key `aries_img123rd_789ftyu`
- **Note**: Firecrawl integration for documentation scraping has been removed (can be re-added if needed)

#### Conversation Processing (`process-message`)
- **Previous**: Mock response with TODO placeholder
- **Now**: Uses Kortex API for conversation responses
- **Endpoint**: `https://uj1o2lxj--chat.functions.blink.new`
- **Authentication**: Uses API key `aries_img123rd_789ftyu`

### 3. Code Structure Changes

All API routes now follow a consistent pattern:

```typescript
const response = await fetch("https://uj1o2lxj--chat.functions.blink.new", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "aries_img123rd_789ftyu"
  },
  body: JSON.stringify({
    message: "Your prompt here"
  })
});

const result = await response.json();
if (result.success) {
  // Process result.response
} else {
  // Handle error
}
```

### 4. Dependencies Removed

The following dependencies are no longer required but can remain in package.json:
- `@ai-sdk/anthropic` (no longer used)
- `ai` (Vercel AI SDK - no longer used for these features)

## Features Affected

1. **Code Suggestions**: Real-time code completion in the editor
2. **Quick Edit (Cmd+K)**: AI-assisted code editing
3. **Conversations**: AI chat assistant in the sidebar

## Testing

To test the integration:

1. Ensure all environment variables are set correctly
2. Start the development server: `npm run dev`
3. Start Convex dev server: `npx convex dev`
4. Start Inngest dev server: `npx inngest-cli@latest dev`
5. Navigate to `http://localhost:3000`
6. Test code suggestions by typing in the editor
7. Test quick edit by selecting code and pressing Cmd+K
8. Test conversations by sending messages in the AI sidebar

## Notes

- The Kortex API returns responses in the format: `{ success: boolean, response: string, error?: string }`
- Error handling has been implemented across all API routes
- Fallback messages are provided if the API fails
- The internal Convex key is required for database operations

## Future Enhancements

Potential improvements:
1. Add support for Firecrawl documentation scraping in quick edit
2. Implement message cancellation functionality
3. Add conversation history management
4. Optimize prompt engineering for better Kortex responses
5. Add streaming responses for real-time feedback

## Troubleshooting

### API Errors
If you encounter API errors:
1. Check that the Kortex API endpoint is accessible
2. Verify the API key is correct
3. Check network connectivity

### Authentication Issues
If authentication fails:
1. Verify Clerk keys are correct
2. Check that Clerk is properly configured
3. Ensure user is authenticated before making API calls

### Convex Issues
If Convex operations fail:
1. Verify `POLARIS_CONVEX_INTERNAL_KEY` is set
2. Check Convex deployment URL is correct
3. Ensure Convex dev server is running