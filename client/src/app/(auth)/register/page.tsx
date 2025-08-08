// src/app/(auth)/register/page.tsx
import Auth from "../../../components/Auth";

export default function RegisterPage() {
  // We will tell the Auth component to start in "Sign Up" mode
  return <Auth initialMode="signup" />;
}
