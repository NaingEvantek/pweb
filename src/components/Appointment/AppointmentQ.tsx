import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  checkForExistingAppointment,
  getApiErrorMessage,
  type CheckForExistingResult,
  type ExistingAppointmentInfo,
} from "../../api/appointmentservice";

interface LocationState {
  phone: string;
}

export default function AppointmentQ() {
  const navigate = useNavigate();
  const { phone } = useLocation().state as LocationState;

  const [existingAppt, setExistingAppt] = useState<ExistingAppointmentInfo[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBack = () => navigate("/Landing");

  useEffect(() => {
    if (!localStorage.getItem("eqms_key")) {
      handleBack();
    } else if (!localStorage.getItem("Authorization")) {
      navigate("/");
    }
  }, [phone, navigate]);
  // Fetch appointments
  const loadAppointments = async () => {
    setLoading(true);
    try {
      const result: CheckForExistingResult = await checkForExistingAppointment(
        phone
      );

      if (result.ResultCode === 0) {
        setExistingAppt(result.ExistingAppt);
      } else {
        setError(result.ResultDescription);
      }
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          "An error occurred while requesting check for existing appointment"
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [phone]);

  const AppointmentCard = ({ data }: { data: ExistingAppointmentInfo }) => (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "12px",
        borderRadius: "8px",
        marginBottom: "10px",
        width: "300px",
        textAlign: "left",
      }}
    >
      <p>
        <strong>Appointment ID:</strong> {data.ApptID}
      </p>
      <p>
        <strong>Date & Time:</strong> {data.ApptDateTime}
      </p>
      <p>
        <strong>Branch:</strong> {data.BranchName}
      </p>
      <p>
        <strong>Service:</strong> {data.ServiceName}
      </p>
      <p>
        <strong>Status:</strong> {data.QueueStatus}
      </p>
      <div className="row">
        {["Back", "Edit"].map((label) => (
          <div className="col-md-6" key={label}>
            <button className="btn btn-danger w-100 mb-3" onClick={handleBack}>
              {label}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-center">
      <h2 className="mt-4">Appointment</h2>

      {loading && <h3>Checking Existing .....</h3>}

      {!loading && existingAppt.length > 0 && (
        <>
          <h5>You have existing appointments</h5>
          {existingAppt.map((appt, i) => (
            <AppointmentCard key={i} data={appt} />
          ))}
        </>
      )}

      {!loading && !error && existingAppt.length === 0 && (
        <h3>No existing appointments found.</h3>
      )}

      {error && <div className="text-danger mt-2">{error}</div>}
    </div>
  );
}
