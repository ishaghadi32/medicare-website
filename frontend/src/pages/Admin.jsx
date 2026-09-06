import { useEffect, useState } from "react";

function Admin() {
  // =========================
  // LOGIN STATES
  // =========================
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("adminToken")
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // =========================
  // APPOINTMENT STATES
  // =========================
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // ADMIN LOGIN
  // =========================
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoginLoading(true);
      setLoginError("");

      const response = await fetch(
        "https://medicare-website-vzf1.onrender.com/admin/login",
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
        throw new Error(
          data.message || "Invalid username or password"
        );
      }

      localStorage.setItem("adminToken", data.token);

      setIsLoggedIn(true);

      setUsername("");
      setPassword("");
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(
        error.message || "Login failed. Please try again."
      );
    } finally {
      setLoginLoading(false);
    }
  };

  // =========================
  // FETCH APPOINTMENTS
  // =========================
  const fetchAppointments = async () => {
    console.log("REFRESH BUTTON / FETCH APPOINTMENTS CALLED");

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        setLoading(false);
        setIsLoggedIn(false);
        return;
      }

      const response = await fetch(
        "https://medicare-website-vzf1.onrender.com/appointments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("STATUS:", response.status);

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await response.json();

      console.log("DATA:", data);

      setAppointments(data);
    } catch (error) {
      console.error("Error:", error);
      setError("Could not load appointments.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UPDATE STATUS
  // =========================
  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `https://medicare-website-vzf1.onrender.com/appointments/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update appointment"
        );
      }

      setAppointments((currentAppointments) =>
        currentAppointments.map((appointment) =>
          appointment._id === id
            ? { ...appointment, status }
            : appointment
        )
      );
    } catch (error) {
      console.error("Status update error:", error);
      alert("Could not update appointment.");
    }
  };

  // =========================
  // APPROVE
  // =========================
  const approveAppointment = (id) => {
    updateStatus(id, "Approved");
  };

  // =========================
  // REJECT
  // =========================
  const rejectAppointment = (id) => {
    updateStatus(id, "Rejected");
  };

  // =========================
  // DELETE
  // =========================
  const deleteAppointment = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this appointment?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `https://medicare-website-vzf1.onrender.com/appointments/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete appointment"
        );
      }

      setAppointments((currentAppointments) =>
        currentAppointments.filter(
          (appointment) => appointment._id !== id
        )
      );
    } catch (error) {
      console.error("Delete error:", error);
      alert("Could not delete appointment.");
    }
  };

  // =========================
  // LOGOUT
  // =========================
const logout = () => {
  console.log("LOGOUT BUTTON CLICKED");

  localStorage.removeItem("adminToken");

  setIsLoggedIn(false);

  console.log("LOGGED OUT SUCCESSFULLY");
};
  // =========================
  // LOAD APPOINTMENTS
  // =========================
  useEffect(() => {
    if (isLoggedIn) {
      console.log("ADMIN PAGE LOADED");
      fetchAppointments();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  // =========================
  // COUNTS
  // =========================
  const totalAppointments = appointments.length;

  const pendingAppointments = appointments.filter(
    (appointment) =>
      !appointment.status ||
      appointment.status === "Pending"
  ).length;

  const approvedAppointments = appointments.filter(
    (appointment) => appointment.status === "Approved"
  ).length;

  const rejectedAppointments = appointments.filter(
    (appointment) => appointment.status === "Rejected"
  ).length;

  // =========================
  // STATUS CLASS
  // =========================
  const getStatusClass = (status) => {
    if (status === "Approved") {
      return "status-approved";
    }

    if (status === "Rejected") {
      return "status-rejected";
    }

    return "status-pending";
  };

  // =========================
  // ADMIN LOGIN PAGE
  // =========================
  if (!isLoggedIn) {
    return (
      <section className="admin-login-page">
        <div className="admin-login-card">

          <div className="admin-login-icon">
            🔐
          </div>

          <h1>Admin Login</h1>

          <p className="admin-login-subtitle">
            Sign in to access the MediCare appointment dashboard.
          </p>

          {loginError && (
            <div className="admin-login-error">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin}>

            <div className="admin-input-group">
              <label>Username</label>

              <input
                type="text"
                placeholder="Enter admin username"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                required
              />
            </div>

            <div className="admin-input-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />
            </div>

            <button
              type="submit"
              className="admin-login-btn"
              disabled={loginLoading}
            >
              {loginLoading
                ? "Logging in..."
                : "Login to Dashboard"}
            </button>

          </form>

          <p className="admin-login-note">
            MediCare Administration Portal
          </p>

        </div>
      </section>
    );
  }

  // =========================
  // ADMIN DASHBOARD
  // =========================
  return (
    <section className="admin-page">
      <div className="admin-container">

        {/* HEADER */}
        <div className="admin-header">
          <div>
            <p className="small-title">MEDICARE ADMIN</p>

            <h1>Appointment Dashboard</h1>

            <p>
              Manage all appointment requests from your patients.
            </p>
          </div>

          <div className="admin-header-buttons">

            <button
              className="admin-refresh-btn"
              onClick={fetchAppointments}
            >
              🔄 Refresh
            </button>

            <button
              className="admin-logout-btn"
              onClick={logout}
            >
              🚪 Logout
            </button>

          </div>
        </div>

        {/* STATISTICS */}
        <div className="admin-stats">

          <div className="admin-stat-card">
            <div className="stat-icon total-icon">
              📋
            </div>

            <div>
              <p>Total Appointments</p>
              <h2>{totalAppointments}</h2>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon pending-icon">
              🕐
            </div>

            <div>
              <p>Pending</p>
              <h2>{pendingAppointments}</h2>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon approved-icon">
              ✅
            </div>

            <div>
              <p>Approved</p>
              <h2>{approvedAppointments}</h2>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon rejected-icon">
              ❌
            </div>

            <div>
              <p>Rejected</p>
              <h2>{rejectedAppointments}</h2>
            </div>
          </div>

        </div>

        {/* LOADING */}
        {loading && (
          <p className="admin-message">
            Loading appointments...
          </p>
        )}

        {/* ERROR */}
        {error && (
          <p className="admin-error">
            ❌ {error}
          </p>
        )}

        {/* NO APPOINTMENTS */}
        {!loading &&
          !error &&
          appointments.length === 0 && (
            <p className="admin-message">
              No appointments found.
            </p>
          )}

        {/* APPOINTMENTS TABLE */}
        {!loading &&
          !error &&
          appointments.length > 0 && (
            <div className="appointments-table-wrapper">

              <table className="appointments-table">

                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Contact</th>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.map((appointment) => {
                    const status =
                      appointment.status || "Pending";

                    return (
                      <tr key={appointment._id}>

                        <td>
                          <strong>
                            {appointment.name}
                          </strong>
                        </td>

                        <td>
                          <div>
                            {appointment.email}
                          </div>

                          <small>
                            {appointment.phone}
                          </small>
                        </td>

                        <td>
                          {appointment.doctor}
                        </td>

                        <td>
                          {appointment.date}
                        </td>

                        <td>
                          {appointment.time}
                        </td>

                        <td>
                          {appointment.message || "—"}
                        </td>

                        <td>
                          <span
                            className={`appointment-status ${getStatusClass(
                              status
                            )}`}
                          >
                            {status}
                          </span>
                        </td>

                        <td>
                          <div className="appointment-actions">

                            <button
                              className="approve-btn"
                              onClick={() =>
                                approveAppointment(
                                  appointment._id
                                )
                              }
                              disabled={
                                status === "Approved"
                              }
                            >
                              ✅ Approve
                            </button>

                            <button
                              className="reject-btn"
                              onClick={() =>
                                rejectAppointment(
                                  appointment._id
                                )
                              }
                              disabled={
                                status === "Rejected"
                              }
                            >
                              ❌ Reject
                            </button>

                            <button
                              className="delete-btn"
                              onClick={() =>
                                deleteAppointment(
                                  appointment._id
                                )
                              }
                            >
                              🗑️ Delete
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>

              </table>

            </div>
          )}

      </div>
    </section>
  );
}

export default Admin;