import AdminSidebar from "../_components/sections/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex pt-16">
      <AdminSidebar />
      <main className="flex-1 w-full p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
