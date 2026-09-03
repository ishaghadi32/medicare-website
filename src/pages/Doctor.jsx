import { useEffect, useState } from "react";

function Doctor() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("doctorToken")
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/doctor/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem(
        "doctorToken",
        data.token
      );

      setIsLoggedIn(true);
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("doctorToken");
    setIsLoggedIn(false);
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    fetchAppointments();
  }, [isLoggedIn]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/doctor/appointments",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "doctorToken"
            )}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

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
        <h1>Doctor Login</h1>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />

          <br />
          <br />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
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
     <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  }}
>
  <div>
    <h1>👨‍⚕️ Doctor Dashboard</h1>
    <p>
      View appointments assigned to you.
    </p>
  </div>

  <div>
    <button
      onClick={() => {
        window.location.href = "/";
      }}
      style={{
        marginRight: "10px",
        padding: "10px 15px",
      }}
    >
      🏠 Home
    </button>

    <button
      onClick={handleLogout}
      style={{
        padding: "10px 15px",
      }}
    >
      🚪 Logout
    </button>
  </div>
</div>

      <button onClick={handleLogout}>
        Logout
      </button>

      <br />
      <br />

     <div
  style={{
    background: "#f5f7ff",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    maxWidth: "300px",
  }}
>
  <h3>Total Appointments</h3>

  <h1>{appointments.length}</h1>
</div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table
         style={{
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <thead
           style={{
    background: "#2563eb",
    color: "white",
  }}>
            <tr>
              <th>Patient</th>
              <th>Email</th>
              <th>Phone</th>
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
                <td colSpan="8">
                  No appointments found.
                </td>
              </tr>
            ) : (
              appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{appointment.name}</td>
                  <td>{appointment.email}</td>
                  <td>{appointment.phone}</td>
                  <td>{appointment.doctor}</td>
                  <td>{appointment.date}</td>
                  <td>{appointment.time}</td>
                  <td>{appointment.message}</td>
                  <td>
                    {appointment.status ||
                      "Pending"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Doctor;