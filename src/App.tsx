import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/Home/Landing";
import RequestOtp from "./components/OTP/RequestOtp";
import SubmitOtp from "./components/OTP/SubmitOtp";
import ManageAppointment from "./components/Appointment/ManageAppointment";
import GetQNumber from "./components/WalkIn/GetQNumber";
import ManageQNumber from "./components/WalkIn/ManageQNumber";
import ProtectedRoute from "./components/ProtectingRoute/ProtectedRoute";
import Login from "./components/Auth/Login";
import ProtectedRestAPIRoute from "./components/ProtectingRoute/ProtectedRestAPIRoute";
import Appointment from "./components/Appointment/Appointment";

function App() {
  return (
    <Router basename="/pweb">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/landing"
          element={
            <ProtectedRoute>
              <Landing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/request-otp"
          element={
            <ProtectedRoute>
              <RequestOtp />
            </ProtectedRoute>
          }
        />
        <Route path="/submit-otp" element={<SubmitOtp />} />
        <Route
          path="/appointment"
          element={
            <ProtectedRoute>
              <ProtectedRestAPIRoute>
                <Appointment />
              </ProtectedRestAPIRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-appointment"
          element={
            <ProtectedRoute>
              <ManageAppointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/getqueue"
          element={
            <ProtectedRoute>
              <ProtectedRestAPIRoute>
                <GetQNumber />
              </ProtectedRestAPIRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-queue"
          element={
            <ProtectedRoute>
              <ProtectedRestAPIRoute>
                <ManageQNumber />
              </ProtectedRestAPIRoute>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
