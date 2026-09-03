import { useEffect, useState } from "react";

function Patient() {
  const [email, setEmail] = useState(
    localStorage.getItem("patientEmail") || ""
  );

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("patientEmail")
  );

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email) {
      alert("Enter your email");
      return;
    }

    localStorage.setItem(
      "patientEmail",
      email
    );

    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem(
      "patientEmail"
    );

    setAppointments([]);
    setIsLoggedIn(false);
    setEmail("");
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    fetchAppointments();
  }, [isLoggedIn]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const patientEmail =
        localStorage.getItem(
          "patientEmail"
        );

      const response = await fetch(
        `http://localhost:5000/patient/appointments/${patientEmail}`
      );

      const data = await response.json();

      setAppointments(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ padding: "40px" }}>
        <h1>Patient Login</h1>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <br />
          <br />

          <button type="submit">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Patient Dashboard</h1>

      <button onClick={handleLogout}>
        Logout
      </button>

      <br />
      <br />

      <h2>
        My Appointments:{" "}
        {appointments.length}
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{
            borderCollapse: "collapse",
            width: "100%",
          }}
        >
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Message</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
             {appointments.length === 0 ? (
    <tr>
      <td colSpan="5">
        No appointments found.
      </td>
    </tr>
  ) : (
    appointments.map((appointment) => (
      <tr key={appointment._id}>
        <td>{appointment.doctor}</td>
        <td>{appointment.date}</td>
        <td>{appointment.time}</td>
        <td>{appointment.message}</td>
        <td>{appointment.status}</td>
      </tr>
    ))
  )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Patient;