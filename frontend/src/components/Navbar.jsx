const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Kristegration</h1>
        <div>
          <a href="/" className="text-gray-600 hover:text-gray-900">Dashboard</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
