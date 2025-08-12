import BranchCard from "../cards/BranchCard";
import type { ActiveBranchRegionWithServiceInfo } from "../../models/appointmentModels";

interface BranchListProps {
  branchList: ActiveBranchRegionWithServiceInfo[];
  selectedBranch: ActiveBranchRegionWithServiceInfo | null;
  onBranchClick: (branchInfo: ActiveBranchRegionWithServiceInfo) => void;
  onBack: () => void;
}

export default function BranchList({
  branchList,
  selectedBranch,
  onBranchClick,
  onBack,
}: BranchListProps) {
  return (
    <>
      <div
        className="d-flex align-items-center w-100 mb-2"
        style={{ maxWidth: 420, position: "relative" }}
      >
        <h5 style={{ flexGrow: 1, textAlign: "center", margin: 0 }}>
          Available Branches
        </h5>
        <button
          className="btn btn-sm btn-danger"
          style={{ position: "absolute", right: 0 }}
          onClick={onBack}
        >
          ←
        </button>
      </div>

      <div
        className="border rounded p-2 bg-white"
        style={{
          maxHeight: "400px",
          overflowY: "auto",
          width: "420px",
        }}
      >
        {branchList.map((branch, idx) => (
          <BranchCard
            key={idx}
            data={branch}
            onClick={onBranchClick}
            isSelected={selectedBranch?.branchName === branch.branchName}
          />
        ))}
      </div>
    </>
  );
}
