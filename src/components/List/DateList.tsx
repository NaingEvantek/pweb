import DateCard from "../cards/DateCard";
import type { AppointmentDateList } from "../../models/appointmentModels";

interface DateListProps {
  dateList: AppointmentDateList[];
  selectedDate: AppointmentDateList | null;
  onDateClick: (dateInfo: AppointmentDateList) => void;
  onBack: () => void;
}

export default function DateList({
  dateList,
  selectedDate,
  onDateClick,
  onBack,
}: DateListProps) {
  return (
    <>
      <div
        className="d-flex align-items-center w-100 mb-2"
        style={{ maxWidth: 420, position: "relative" }}
      >
        <h5 style={{ flexGrow: 1, textAlign: "center", margin: 0 }}>
          Available Dates
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
        {dateList.map((dDate, idx) => (
          <DateCard
            key={idx}
            data={dDate}
            onClick={onDateClick}
            isSelected={selectedDate?.ApptDate === dDate.ApptDate}
          />
        ))}
      </div>
    </>
  );
}
