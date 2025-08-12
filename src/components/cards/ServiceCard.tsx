import type { AppointmentServiceInfo } from "../../models/appointmentModels";

interface ServiceCardProps {
  data: AppointmentServiceInfo;
  onClick: (serviceId: number) => void;
  isSelected: boolean;
}

export default function ServiceCard({
  data,
  onClick,
  isSelected,
}: ServiceCardProps) {
  return (
    <div
      className={`card mb-2 shadow-sm service-card ${
        isSelected ? "border-primary" : ""
      }`}
      onClick={() => onClick(data.ServiceId)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === "Enter" && onClick(data.ServiceId)}
      style={{ cursor: "pointer", borderWidth: isSelected ? "2px" : undefined }}
    >
      <div className="card-body py-2">
        <p className="mb-0">{data.ServiceName}</p>
      </div>
    </div>
  );
}
