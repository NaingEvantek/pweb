import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as appointmentservice from "../../api/appointmentservice";
import AppointmentCard from "../cards/AppointmentCard";
import type {
  CheckForExistingResult,
  ExistingAppointmentInfo,
} from "../../models/appointmentModels";

interface LocationState {
  phone: string;
}

export default function ManageAppointment() {
  const navigate = useNavigate();
  const { phone } = useLocation().state as LocationState;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [existingAppt, setExistingAppt] = useState<ExistingAppointmentInfo[]>(
    []
  );

  const handleBack = useCallback(() => {
    navigate("/landing");
  }, [navigate]);

  const handleEdit = useCallback(
    (apptId: number) => {
      navigate("/appointment", {
        state: { phone, manageEditApptId: apptId, manageEditMode: true },
      });
    },
    [navigate, phone]
  );

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result: CheckForExistingResult =
        await appointmentservice.checkForExistingAppointment(phone);

      if (result.ResultCode === 0) {
        setExistingAppt(result.ExistingAppt ?? []);
      } else {
        setError(result.ResultDescription);
      }
    } catch (err) {
      setError(
        appointmentservice.getApiErrorMessage(
          err,
          "Error checking existing appointments"
        )
      );
    } finally {
      setLoading(false);
    }
  }, [phone]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const renderContent = () => {
    if (loading) return <h3>Loading...</h3>;

    if (error)
      return (
        <div className="text-center">
          <div className="text-danger mt-2">{error}</div>
          <button className="btn btn-link mt-2" onClick={loadAppointments}>
            Retry
          </button>
        </div>
      );

    if (existingAppt.length === 0)
      return <h5>There are no existing appointments</h5>;

    return (
      <>
        <h5>You have existing appointments</h5>
        {existingAppt.map((appt) => (
          <AppointmentCard
            key={appt.ApptID}
            data={appt}
            onBack={handleBack}
            onEdit={handleEdit}
          />
        ))}
      </>
    );
  };

  return (
    <div className="d-flex flex-column align-items-center vh-100 text-center p-3">
      <h2 className="mt-4">Manage Appointment</h2>
      {renderContent()}
    </div>
  );
}
