import { Container } from "@/components/Container";
import { LoginForm } from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-16">
      <Container className="mx-auto flex max-w-sm flex-col gap-6">
        <div className="text-center">
          <h1 className="font-display text-2xl font-semibold text-heading">Admin sign in</h1>
          <p className="mt-1 text-sm text-muted">For Jordyn only.</p>
        </div>
        <LoginForm />
      </Container>
    </div>
  );
}
