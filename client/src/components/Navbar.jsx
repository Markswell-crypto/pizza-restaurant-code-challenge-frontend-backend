import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <header>
      <div className="logo text-center bg-dark py-4">
        <h1 className="text-uppercase text-primary">The Pizza Society</h1>
      </div>
      <nav className="text-center bg-light">
        <Link to="/" className="text-primary text-decoration-none">Home</Link>
      </nav>
    </header>
  );
}

export default Navbar;
