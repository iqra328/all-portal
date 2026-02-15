import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./components/Dashboard/Dashboard";
import Volunteer from "./components/Apps/VolunteerApp/VolunteerApp";
import Billing from "./components/Apps/BillingApp/BillingApp";
import LostFound from "./components/Apps/InventoryApp/InventoryApp";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
<Route path="/login" element={<Login />} />
<Route path="/signup" element={<Signup />} />
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/volunteer"
          element={
            <ProtectedRoute>
              <Volunteer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <Billing />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lostfound"
          element={
            <ProtectedRoute>
              <LostFound />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;