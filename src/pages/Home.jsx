import Appointment from "./Appointment";
import Contact from "./Contact";
import Footer from "../components/Footer";
function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-text">
          <p className="small-title">WELCOME TO MEDICARE</p>

          <h1>
            Your Health,
            <br />
            Our Priority.
          </h1>

          <p className="hero-description">
            Quality healthcare made simple, accessible, and convenient
            for everyone.
          </p>

          <a href="#appointment" className="hero-btn">
  Book an Appointment
</a>
        </div>

        <div className="hero-card">
          <div className="heart-icon">♥</div>
          <h2>Trusted Healthcare</h2>
          <p>
            Professional medical care from experienced healthcare
            professionals.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="services" id="services">
        <p className="small-title">WHAT WE OFFER</p>

        <h2>Our Healthcare Services</h2>

        <p className="section-description">
          We provide quality healthcare services designed around
          your needs.
        </p>

        <div className="service-container">
          <div className="service-card">
            <div className="service-icon">🩺</div>
            <h3>General Checkup</h3>
            <p>
              Regular health checkups to keep you healthy and
              active.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon">🚑</div>
            <h3>Emergency Care</h3>
            <p>
              Fast and reliable medical care when you need it
              most.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon">👨‍⚕️</div>
            <h3>Expert Doctors</h3>
            <p>
              Get professional care from experienced doctors and
              specialists.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon">💊</div>
            <h3>Pharmacy</h3>
            <p>
              Access medicines and healthcare products with ease.
            </p>
          </div>
        </div>
      </section>
      {/* Portal Section */}
<section className="portals">

  <p className="small-title">PORTALS</p>

  <h2>Access Your Portal</h2>

  <div className="portal-container">

    <div className="portal-card">
      <h3>Admin Portal</h3>
      <p>
        Manage appointments, approve, reject and
        monitor all patient requests.
      </p>

      <a href="/admin" className="hero-btn">
        Open Admin Portal
      </a>
    </div>

    <div className="portal-card">
      <h3>Doctor Portal</h3>
      <p>
        View appointments assigned to you and
        manage your schedule.
      </p>

      <a href="/doctor" className="hero-btn">
        Open Doctor Portal
      </a>
    </div>

    <div className="portal-card">
      <h3>Patient Portal</h3>
      <p>
        Track your appointments and check their
        status anytime.
      </p>

      <a href="/patient" className="hero-btn">
        Open Patient Portal
      </a>
    </div>

  </div>
</section>
            {/* Doctors Section */}
      <section className="doctors" id="doctors">
        <p className="small-title">MEET OUR TEAM</p>

        <h2>Our Expert Doctors</h2>

        <p className="section-description">
          Meet our experienced healthcare professionals who are
          dedicated to providing you with excellent care.
        </p>

        <div className="doctor-container">
          <div className="doctor-card">
            <div className="doctor-photo">👩‍⚕️</div>
            <h3>Dr. Mira Sharma</h3>
            <p>Cardiologist</p>
           <a href="#appointment" className="doctor-btn">
  Book Appointment
</a>
          </div>

          <div className="doctor-card">
            <div className="doctor-photo">👨‍⚕️</div>
            <h3>Dr. Sachin Sharma</h3>
            <p>General Physician</p>
            <a href="#appointment" className="doctor-btn">
  Book Appointment
</a>
          </div>

          <div className="doctor-card">
            <div className="doctor-photo">👩‍⚕️</div>
            <h3>Dr. Priya Patel</h3>
            <p>Neurologist</p>
            <button className="doctor-btn">
              Book Appointment
            </button>
          </div>

          <div className="doctor-card">
            <div className="doctor-photo">👨‍⚕️</div>
            <h3>Dr. Rajesh Parmar</h3>
            <p>Pediatrician</p>
            <button className="doctor-btn">
              Book Appointment
            </button>
          </div>
        </div>
      </section>
      <section className="about" id="about">
  <p className="small-title">ABOUT US</p>
  <h2>About MediCare</h2>
  <p className="section-description">
     MediCare is a modern healthcare management platform designed
    to connect patients with experienced doctors quickly and
    efficiently. Our mission is to provide accessible,
    reliable, and high-quality healthcare services while making
    appointment management simple for patients, doctors, and
    administrators.
  </p>
</section>
            <Appointment />
            <Contact />
            <Footer />
    </main>
  );
}

export default Home;