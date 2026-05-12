export function FormStatus({ status }: { status?: { type: "success" | "error"; message: string } }) {
  if (!status) {
    return null;
  }

  return (
    <p className={`form-status ${status.type}`} role="status">
      {status.message}
    </p>
  );
}
