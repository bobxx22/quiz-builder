export function ErrorMessage({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="alert"
      className="rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger"
    >
      {children}
    </p>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1 text-sm text-danger">
      {message}
    </p>
  );
}

export function LoadingMessage({ children = 'Loading...' }: { children?: React.ReactNode }) {
  return (
    <p role="status" className="py-10 text-center text-muted">
      {children}
    </p>
  );
}
