const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-[#4caf50] z-30 px-4 py-3 max-h-13 min-h-13">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-800">AUBH Mosque</h1>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-4">
          {/* Search Button */}
          <button
            className=" hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* User Button */}
          <button
            className="hover:bg-gray-100 rounded-full transition-colors"
            aria-label="User menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
