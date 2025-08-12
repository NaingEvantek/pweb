import type { AppointmentDateList } from "../../models/appointmentModels";

interface DateCardProps {
  data: AppointmentDateList;
  onClick: (dateInfo: AppointmentDateList) => void;
  isSelected: boolean;
}

export default function DateCard({ data, onClick, isSelected }: DateCardProps) {
  return (
    <div
      className={`card mb-2 shadow-sm service-card ${
        isSelected ? "border-primary" : ""
      }`}
      onClick={() => onClick(data)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === "Enter" && onClick(data)}
      style={{ cursor: "pointer", borderWidth: isSelected ? "2px" : undefined }}
    >
      <div className="card-body py-2">
        <p className="mb-0">{data.ApptDate}</p>
      </div>
    </div>
  );
}
