import { useState } from "react";

function Appointment() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSubmitted(false);

    const formData = new FormData(e.target);

    const appointmentData = Object.fromEntries(
      formData.entries()
    );

    try {
      const response = await fetch(
        https://medicare-website-vzf1.onrender.com/appointments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(appointmentData),
        }
      );

      if (response.ok) {
        setSubmitted(true);
        e.target.reset();
      } else {
        alert("Something went wrong. Please try again.");
        
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="appointment" id="appointment">
      <div className="appointment-content">

        <p className="small-title">BOOK YOUR VISIT</p>

        <h2>Book an Appointment</h2>

        <p>
          Schedule an appointment with one of our experienced
          doctors.
        </p>

        <form
          className="appointment-form"
          onSubmit={handleSubmit}
        >

          <div className="form-row">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
            />
          </div>

          <div className="form-row">
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              required
               pattern="[0-9]{10}"
  maxLength="10"
  onInput={(e) => {
    e.target.value = e.target.value.replace(/\D/g, "");
  }}
            />

            <select
              name="doctor"
              required
              defaultValue=""
            >
              <option value="" disabled>
                Select Doctor
              </option>

              <option>Dr. Mira Sharma</option>
              <option>Dr. Sachin Sharma</option>
              <option>Dr. Priya Patel</option>
              <option>Dr. Rajesh Parmar</option>
            </select>
          </div>

          <div className="form-row">
           <input
  type="date"
  name="date"
  min={new Date().toISOString().split("T")[0]}
  required
/>

            <select
              name="time"
              required
              defaultValue=""
            >
              <option value="" disabled>
                Select Time
              </option>

              <option>09:00 AM</option>
              <option>11:00 AM</option>
              <option>02:00 PM</option>
              <option>04:00 PM</option>
            </select>
          </div>

          <textarea
            name="message"
            placeholder="Tell us anything we should know..."
            rows="5"
          ></textarea>

          <button
            type="submit"
            className="appointment-btn"
            disabled={loading}
          >
            {loading ? "Booking..." : "Book Appointment"}
          </button>

          {submitted && (
            <p className="success-message">
              ✅ Appointment request submitted successfully!
            </p>
          )}

        </form>
      </div>
    </section>
  );
}

export default Appointment;