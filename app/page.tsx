import LibraryExplorePage from "./_components/sections/LibraryExplorePage";
import UserNavbar from "./_components/sections/navbar";

export default function Home() {
  return (
    <div className="min-h-screen">
      <UserNavbar />
      <LibraryExplorePage />
    </div>
  );
}
