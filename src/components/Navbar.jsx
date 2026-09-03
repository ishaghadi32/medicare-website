function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        Medi<span>Care</span>
      </div>

      <div className="nav-links">
        <a href="#home">Home</a>
        <a href="#services">Services</a>
        <a href="#doctors">Doctors</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </div>

      <a href="#appointment" className="nav-btn">
  Book Appointment
</a>
    </nav>
  );
}

export default Navbar;