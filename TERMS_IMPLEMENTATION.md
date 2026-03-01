# Terms & Privacy Acceptance Implementation

This implementation adds automatic Terms of Service and Privacy Policy acceptance logic to your Next.js application.

## How It Works

1. **On Login**: When a user logs in via Appwrite, their session is checked.
2. **Database Lookup**: The system queries the `users` collection to check if the user has accepted terms.
3. **Redirect to Accept Terms**: If acceptance records don't exist or policy version is outdated, user is redirected to `/accept-terms`.
4. **Route Protection**: Protected routes use `useTermsProtection()` hook to enforce acceptance.
5. **Database Update**: On acceptance, the following fields are updated:
   - `terms_accepted: true`
   - `privacy_accepted: true`
   - `policy_version: "v1.0"`
   - `accepted_at: <ISO timestamp>`

## Required Environment Variables

Add these to your `.env.local`:

```env
NEXT_PUBLIC_APPWRITE_DATABASE_ID=main
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=users
```

## Database Schema

The `users` collection should have these fields:

```
- user_id (string, unique) - Appwrite user ID
- email (string)
- name (string)
- terms_accepted (boolean) - Default: false
- privacy_accepted (boolean) - Default: false
- policy_version (string) - Default: ""
- accepted_at (datetime) - When terms were accepted
```

## Files Created/Modified

### New Files:
- `middleware.ts` - Route protection middleware
- `lib/termsService.ts` - Terms acceptance logic
- `hooks/useTermsProtection.ts` - Route protection hook
- `app/accept-terms/page.tsx` - Acceptance UI page

### Modified Files:
- `app/admin/page.tsx` - Added terms protection check

### Usage in Protected Routes:

```tsx
'use client';

import { useTermsProtection } from '@/hooks/useTermsProtection';

export default function ProtectedPage() {
  const { isLoading, isAllowed, termsStatus } = useTermsProtection();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // The hook automatically redirects if terms not accepted
  // This code only runs if user has accepted terms

  return <YourPageContent />;
}
```

## Current Protected Routes:
- `/admin` - Admin dashboard (already has protection)
- `/accept-terms` - Acceptance page (public, redirects unauthenticated users)

## Adding Protection to More Routes:

To protect any route, simply add the `useTermsProtection()` hook at the top of the component:

```tsx
export default function MyPage() {
  const { isAllowed, isLoading } = useTermsProtection();

  if (isLoading) return <Skeleton />;
  
  // Page content (only shown if terms accepted)
  return <Content />;
}
```

## Policy Version Management

The current policy version is set in `lib/termsService.ts`:

```typescript
const CURRENT_POLICY_VERSION = 'v1.0';
```

To force users to re-accept policies after updates:
1. Change this version to `v1.1`, etc.
2. Update policy content in `/accept-terms` page
3. Users will be automatically redirected to accept new terms

## Testing

1. Create a test user account
2. Don't accept terms - should redirect to `/accept-terms`
3. Accept terms - should grant access to protected routes
4. Update `CURRENT_POLICY_VERSION` - users should be redirected again
