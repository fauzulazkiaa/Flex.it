npx vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production --value "pk_test_ZGVhci1kaW5nby05Ny5jbGVyay5hY2NvdW50cy5kZXYk" --yes
npx vercel env add CLERK_SECRET_KEY production --value "sk_test_lvlnsSnan6yNMpm7Hk9djTtP36IfCHSimo1QGWbxLi" --yes
npx vercel env add NEXT_PUBLIC_CLERK_SIGN_IN_URL production --value "/sign-in" --yes
npx vercel env add NEXT_PUBLIC_CLERK_SIGN_UP_URL production --value "/sign-up" --yes
npx vercel env add NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL production --value "/" --yes
npx vercel env add NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL production --value "/" --yes
