import { useEffect, useState } from "react";

function Admin() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // =========================
// FETCH APPOINTMENTS
// =========================

const fetchAppointments = async () => {
  console.log("FETCH APPOINTMENTS CALLED");

  try {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("adminToken");

    if (!token) {
      setLoading(false);
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
      window.location.href = "/admin";
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

      // Remove appointment from screen
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
    localStorage.removeItem("adminToken");
    window.location.href = "/admin";
  };

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
  console.log("ADMIN PAGE LOADED");
  fetchAppointments();
}, []);
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

  return (
    <section className="admin-page">
      <div className="admin-container">

        {/* =========================
            HEADER
        ========================= */}

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

        {/* =========================
            STATISTICS
        ========================= */}

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

        {/* =========================
            LOADING
        ========================= */}

        {loading && (
          <p className="admin-message">
            Loading appointments...
          </p>
        )}

        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <p className="admin-error">
            ❌ {error}
          </p>
        )}

        {/* =========================
            NO APPOINTMENTS
        ========================= */}

        {!loading &&
          !error &&
          appointments.length === 0 && (
            <p className="admin-message">
              No appointments found.
            </p>
          )}

        {/* =========================
            APPOINTMENTS TABLE
        ========================= */}

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

                        {/* PATIENT */}

                        <td>
                          <strong>
                            {appointment.name}
                          </strong>
                        </td>

                        {/* CONTACT */}

                        <td>
                          <div>
                            {appointment.email}
                          </div>

                          <small>
                            {appointment.phone}
                          </small>
                        </td>

                        {/* DOCTOR */}

                        <td>
                          {appointment.doctor}
                        </td>

                        {/* DATE */}

                        <td>
                          {appointment.date}
                        </td>

                        {/* TIME */}

                        <td>
                          {appointment.time}
                        </td>

                        {/* MESSAGE */}

                        <td>
                          {appointment.message || "—"}
                        </td>

                        {/* STATUS */}

                        <td>
                          <span
                            className={`appointment-status ${getStatusClass(
                              status
                            )}`}
                          >
                            {status}
                          </span>
                        </td>

                        {/* ACTIONS */}

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
