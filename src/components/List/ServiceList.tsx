import ServiceCard from "../cards/ServiceCard";
import type { AppointmentServiceInfo } from "../../models/appointmentModels";

interface ServiceListProps {
  serviceList: AppointmentServiceInfo[];
  selectedServiceId: number | null;
  onServiceClick: (serviceId: number) => void;
  onBack: () => void;
}

export default function ServiceList({
  serviceList,
  selectedServiceId,
  onServiceClick,
  onBack,
}: ServiceListProps) {
  return (
    <>
      <div
        className="d-flex align-items-center w-100 mb-2"
        style={{ maxWidth: 420, position: "relative" }}
      >
        <h5 style={{ flexGrow: 1, textAlign: "center", margin: 0 }}>
          Appointment Service Lists
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
        {serviceList.map((svc) => (
          <ServiceCard
            key={svc.ServiceId}
            data={svc}
            onClick={onServiceClick}
            isSelected={svc.ServiceId === selectedServiceId}
          />
        ))}
      </div>
    </>
  );
}
