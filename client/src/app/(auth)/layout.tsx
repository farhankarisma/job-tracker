export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-100">
      {children}
    </main>
  );
}
