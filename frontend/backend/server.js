const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

let appointmentsCollection;

// =========================
// CONNECT TO MONGODB
// =========================

async function connectToDatabase() {
  try {
    await client.connect();

    const database = client.db("medicare");
    appointmentsCollection = database.collection("appointments");

    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
}

// =========================
// TEST BACKEND
// =========================

app.get("/", (req, res) => {
  res.json({
    message: "MediCare backend is working!"
  });
});

// =========================
// ADMIN LOGIN
// =========================

app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      {
        username: username,
        role: "admin"
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h"
      }
    );

    return res.json({
      message: "Login successful",
      token: token
    });
  }

  return res.status(401).json({
    message: "Invalid username or password"
  });
});

// =========================
// DOCTOR LOGIN
// =========================
// =========================
// DOCTOR LOGIN
// =========================

app.post("/doctor/login", (req, res) => {
  console.log("LOGIN REQUEST:", req.body);

  const { username, password } = req.body;

  const doctors = [
    {
      username: "doctor1",
      password: "doctor123",
      doctorName: "Dr. John Smith",
    },
    {
      username: "doctor2",
      password: "doctor123",
      doctorName: "Dr. Sarah Johnson",
    },
  ];

  const doctor = doctors.find(
    (d) =>
      d.username === username &&
      d.password === password
  );

  if (!doctor) {
    return res.status(401).json({
      message: "Invalid doctor username or password",
    });
  }

  const token = jwt.sign(
    {
      username: doctor.username,
      doctorName: doctor.doctorName,
      role: "doctor",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "2h",
    }
  );

  res.json({
    message: "Doctor login successful",
    token,
    doctorName: doctor.doctorName,
  });
});
// =========================
// ADMIN AUTHENTICATION
// =========================
function authenticateDoctor(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.role !== "doctor") {
      return res.status(403).json({
        message: "Doctor access required",
      });
    }

    req.doctor = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}
function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Authentication required"
    });
  }
// =========================
// DOCTOR AUTHENTICATION
// =========================

function authenticateDoctor(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.role !== "doctor") {
      return res.status(403).json({
        message: "Doctor access required",
      });
    }

    req.doctor = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Authentication required"
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required"
      });
    }

    req.admin = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
}

// =========================
// GET ALL APPOINTMENTS
// PROTECTED
// =========================

app.get(
  "/appointments",
  authenticateAdmin,
  async (req, res) => {
    try {
      const appointments = await appointmentsCollection
        .find({})
        .sort({ _id: -1 })
        .toArray();

      res.json(appointments);
    } catch (error) {
      console.error(
        "Error fetching appointments:",
        error
      );

      res.status(500).json({
        message: "Failed to fetch appointments"
      });
    }
  }
);
// =========================
// DOCTOR APPOINTMENTS
// =========================
// =========================
// PATIENT APPOINTMENTS
// =========================

app.get("/patient/appointments/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const appointments = await appointmentsCollection
      .find({ email })
      .sort({ _id: -1 })
      .toArray();

    res.json(appointments);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch appointments",
    });
  }
});
app.get(
  "/doctor/appointments",
  authenticateDoctor,
  async (req, res) => {
    try {
      const appointments =
        await appointmentsCollection
          .find({
            doctor: req.doctor.doctorName,
          })
          .sort({ _id: -1 })
          .toArray();

      res.json(appointments);
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch appointments",
      });
    }
  }
);
// =========================
// CREATE NEW APPOINTMENT
// PUBLIC
// =========================

app.post("/appointments", async (req, res) => {
  try {
    console.log("New appointment received:");
    console.log(req.body);

    const appointment = {
      ...req.body,
      status: "Pending",
      createdAt: new Date()
    };

    const result =
      await appointmentsCollection.insertOne(appointment);

    res.json({
      message: "Appointment received successfully!",
      appointmentId: result.insertedId
    });
  } catch (error) {
    console.error(
      "Error saving appointment:",
      error
    );

    res.status(500).json({
      message: "Failed to save appointment"
    });
  }
});

// =========================
// UPDATE APPOINTMENT STATUS
// PROTECTED
// =========================

app.put(
  "/appointments/:id/status",
  authenticateAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const allowedStatuses = [
        "Pending",
        "Approved",
        "Rejected"
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid appointment status"
        });
      }

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({
          message: "Invalid appointment ID"
        });
      }

      const result =
        await appointmentsCollection.updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              status: status,
              updatedAt: new Date()
            }
          }
        );

      if (result.matchedCount === 0) {
        return res.status(404).json({
          message: "Appointment not found"
        });
      }

      res.json({
        message: `Appointment ${status.toLowerCase()} successfully`
      });
    } catch (error) {
      console.error(
        "Error updating appointment:",
        error
      );

      res.status(500).json({
        message: "Failed to update appointment"
      });
    }
  }
);

// =========================
// DELETE APPOINTMENT
// PROTECTED
// =========================

app.delete(
  "/appointments/:id",
  authenticateAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({
          message: "Invalid appointment ID"
        });
      }

      const result =
        await appointmentsCollection.deleteOne({
          _id: new ObjectId(id)
        });

      if (result.deletedCount === 0) {
        return res.status(404).json({
          message: "Appointment not found"
        });
      }

      res.json({
        message: "Appointment deleted successfully"
      });
    } catch (error) {
      console.error(
        "Error deleting appointment:",
        error
      );

      res.status(500).json({
        message: "Failed to delete appointment"
      });
    }
  }
);

// =========================
// START SERVER
// =========================

const PORT = process.env.PORT || 5000;

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "Could not start server:",
      error
    );
  });