import { useLocation, useNavigate } from "react-router-dom";

import { useAppointment } from "../../hooks/useAppointments";
import ServiceList from "../List/ServiceList";
import BranchList from "../List/BranchList";
import DateList from "../List/DateList";
import SlotList from "../List/SlotList";
import AppointmentCard from "../cards/AppointmentCard";

import "./AppointmentQ.css";

interface LocationState {
  phone: string;
  manageEditApptId: number;
  manageEditMode: boolean;
}

export default function Appointment() {
  const navigate = useNavigate();
  const { phone, manageEditApptId, manageEditMode } = useLocation()
    .state as LocationState;

  const { state, actions } = useAppointment({
    phone,
    manageEditApptId,
    manageEditMode,
    navigate,
  });

  const {
    existingAppt,
    serviceList,
    branchList,
    dateList,
    slotList,
    selectedServiceId,
    selectedBranch,
    selectedDate,
    selectedSlot,
    pendingAppt,
    successAppt,
    currentTab,
    loading,
    error,
    editMode,
  } = state;

  const {
    handleServiceClick,
    handleBranchClick,
    handleDateClick,
    handleSlotClick,
    handleConfirm,
    handleBackList,
    handleEdit,
  } = actions;

  return (
    <div className="d-flex flex-column align-items-center vh-100 text-center p-3">
      <h2 className="mt-4">Appointment</h2>
      {loading && <h3>Loading...</h3>}
      {error && <div className="text-danger mt-2">{error}</div>}

      {!loading && existingAppt.length > 0 && !editMode && (
        <>
          <h5>You have existing appointments</h5>
          {existingAppt.map((appt, i) => (
            <AppointmentCard
              key={i}
              data={appt}
              onBack={() => navigate("/Landing")}
              onEdit={handleEdit}
            />
          ))}
        </>
      )}

      {!loading && (existingAppt.length === 0 || editMode) && (
        <>
          {currentTab === "serviceTab" && (
            <ServiceList
              serviceList={serviceList}
              selectedServiceId={selectedServiceId}
              onServiceClick={handleServiceClick}
              onBack={handleBackList}
            />
          )}
          {currentTab === "branchTab" && (
            <BranchList
              branchList={branchList}
              selectedBranch={selectedBranch}
              onBranchClick={handleBranchClick}
              onBack={handleBackList}
            />
          )}
          {currentTab === "dateTab" && (
            <DateList
              dateList={dateList}
              selectedDate={selectedDate}
              onDateClick={handleDateClick}
              onBack={handleBackList}
            />
          )}
          {currentTab === "slotTab" && (
            <SlotList
              slotList={slotList}
              selectedSlot={selectedSlot}
              onSlotClick={handleSlotClick}
              onBack={handleBackList}
            />
          )}
          {currentTab === "pendingTab" && pendingAppt && (
            <div
              className="card mb-3"
              style={{ width: "400px", textAlign: "left" }}
            >
              <div className="card-body">
                <p>
                  <strong>Appointment ID:</strong> {pendingAppt.ApptId}
                </p>
                <p>
                  <strong>Branch Name:</strong> {pendingAppt.BranchName}
                </p>
                <p>
                  <strong>Service Name:</strong> {pendingAppt.ServiceName}
                </p>
                <p>
                  <strong>Status:</strong> Pending
                </p>
                <p>
                  <strong>Message:</strong> {pendingAppt.Message}
                </p>
                <div className="row">
                  <div className="col-md-6">
                    <button
                      className="btn btn-danger w-100 mb-2"
                      onClick={handleConfirm}
                    >
                      Confirm
                    </button>
                  </div>
                  <div className="col-md-6">
                    <button
                      className="btn btn-danger w-100 mb-2"
                      onClick={handleBackList}
                    >
                      Back
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {currentTab === "successTab" && successAppt && (
            <div
              className="card mb-3"
              style={{ width: "400px", textAlign: "left" }}
            >
              <div className="card-body">
                <p>
                  <strong>Appointment ID:</strong> {successAppt.ApptID}
                </p>
                <p>
                  <strong>Branch Name:</strong> {successAppt.BranchName}
                </p>
                <p>
                  <strong>Service Name:</strong> {successAppt.ServiceName}
                </p>
                <p>
                  <strong>Status:</strong> Confirmed
                </p>
                <p>
                  <strong>Message:</strong> {pendingAppt?.Message}
                </p>
                <div className="row">
                  <div className="col-md-12">
                    <button
                      className="btn btn-danger w-100 mb-2"
                      onClick={handleBackList}
                    >
                      Back To Landing
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
