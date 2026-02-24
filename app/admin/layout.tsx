import AdminLayoutWrapper from "./AdminLayoutWrapper";

// Ensure Next.js does not statically cache any admin page, guaranteeing fresh data on Vercel
export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}
