export default function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem('name');
    window.location.href = '/';
  };
  return (
    <header className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <h2 className="text-lg font-semibold">Welcome</h2>
      <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600" onClick={handleLogout}>Logout</button>
    </header>
  );
}
