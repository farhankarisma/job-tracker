// src/app/(auth)/login/page.tsx
import Auth from '@/components/Auth';

export default function LoginPage() {
  // This page just renders the reusable Auth component.
  // By default, the Auth component starts in 'signin' mode.
  return <Auth />;
}