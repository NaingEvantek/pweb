import type { ExistingAppointmentInfo } from "../../models/appointmentModels";

interface AppointmentCardProps {
  data: ExistingAppointmentInfo;
  onBack: () => void;
  onEdit: (apptId: number) => void;
}

export default function AppointmentCard({
  data,
  onBack,
  onEdit,
}: AppointmentCardProps) {
  return (
    <div className="card mb-3" style={{ width: "400px", textAlign: "left" }}>
      <div className="card-body">
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
          <div className="col-md-6">
            <button
              className="btn btn-danger w-100 mb-2"
              onClick={() => onEdit(data.ApptID)}
            >
              Edit
            </button>
          </div>
          <div className="col-md-6">
            <button className="btn btn-danger w-100 mb-2" onClick={onBack}>
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
