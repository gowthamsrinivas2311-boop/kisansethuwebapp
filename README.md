# KisanSetu

Mobile-first PWA market linkage and price discovery demo for Indian farmers.

## Run locally

```bash
npm install
npm run dev
```

The app uses demo price and listing data until Supabase variables are configured.

## Configure live services

1. Create a Supabase project and run `supabase/schema.sql`, then `supabase/seed.sql` in its SQL editor.
2. Copy `.env.example` to `.env.local` and add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Add `GROQ_API_KEY` to enable Llama-3 advisory responses; without it the app gives language-aware demo advice.
4. In Twilio, set the incoming-message webhook to `https://your-vercel-domain/api/sms-webhook` using `POST`.

## Deploy to Vercel

Import this repository into Vercel, set the three environment variables above, and deploy. The included manifest and service worker provide installability and offline caching for the app shell and latest price response.
