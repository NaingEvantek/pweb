import type { DefaultNearBySlotList } from "../../models/appointmentModels";

interface SlotCardProps {
  data: DefaultNearBySlotList;
  onClick: (slotInfo: DefaultNearBySlotList) => void;
  isSelected: boolean;
}

export default function SlotCard({ data, onClick, isSelected }: SlotCardProps) {
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
        <p className="mb-0">{data.AppDateTime}</p>
      </div>
    </div>
  );
}
