import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Doctor from "./pages/Doctor";
import Patient from "./pages/Patient";

function App() {
  return (
    
      <Routes>

        {/* =========================
            MAIN MEDICARE WEBSITE
        ========================= */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />

        {/* =========================
            ADMIN DASHBOARD
        ========================= */}
        <Route
          path="/admin"
          element={<Admin />}
        />

        {/* =========================
            DOCTOR PORTAL
        ========================= */}
        <Route
          path="/doctor"
          element={<Doctor />}
        />

        {/* =========================
            PATIENT PORTAL
        ========================= */}
        <Route
          path="/patient"
          element={<Patient />}
        />

      </Routes>
    
  );
}

export default App;