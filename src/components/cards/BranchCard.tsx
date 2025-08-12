import type { ActiveBranchRegionWithServiceInfo } from "../../models/appointmentModels";

interface BranchCardProps {
  data: ActiveBranchRegionWithServiceInfo;
  onClick: (branchInfo: ActiveBranchRegionWithServiceInfo) => void;
  isSelected: boolean;
}

export default function BranchCard({
  data,
  onClick,
  isSelected,
}: BranchCardProps) {
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
        <p className="mb-0">{data.branchName}</p>
      </div>
    </div>
  );
}
