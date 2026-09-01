export type NotifySignupItem = {
  email: string;
  created_at: string;
};

export function NotifySignupsList({ signups }: { signups: NotifySignupItem[] }) {
  if (signups.length === 0) {
    return <p className="text-sm text-muted">No one has signed up to be notified yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-4">
      {signups.map((signup) => (
        <li
          key={signup.email}
          className="flex items-center justify-between text-sm text-heading"
        >
          <span>{signup.email}</span>
          <span className="text-muted">{new Date(signup.created_at).toLocaleDateString()}</span>
        </li>
      ))}
    </ul>
  );
}
