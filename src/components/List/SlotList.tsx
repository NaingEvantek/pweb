import SlotCard from "../cards/SlotCard";
import type { DefaultNearBySlotList } from "../../models/appointmentModels";

interface SlotListProps {
  slotList: DefaultNearBySlotList[];
  selectedSlot: DefaultNearBySlotList | null;
  onSlotClick: (slotInfo: DefaultNearBySlotList) => void;
  onBack: () => void;
}

export default function DateList({
  slotList,
  selectedSlot,
  onSlotClick,
  onBack,
}: SlotListProps) {
  return (
    <>
      <div
        className="d-flex align-items-center w-100 mb-2"
        style={{ maxWidth: 420, position: "relative" }}
      >
        <h5 style={{ flexGrow: 1, textAlign: "center", margin: 0 }}>
          Available Slots
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
        {slotList.map((slot, idx) => (
          <SlotCard
            key={idx}
            data={slot}
            onClick={onSlotClick}
            isSelected={selectedSlot?.AppDateTime === slot.AppDateTime}
          />
        ))}
      </div>
    </>
  );
}
