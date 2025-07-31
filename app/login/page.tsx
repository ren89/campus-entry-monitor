import { Suspense } from "react";
import { LoginForm } from "@/components/features/auth";
import { login } from "./action";

export default function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm onSubmit={login} />
    </Suspense>
  );
}
