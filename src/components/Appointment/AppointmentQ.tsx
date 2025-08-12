import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import * as appointmentservice from "../../api/appointmentservice";

import type {
  ActiveBranchRegionWithServiceInfoListResult,
  ActiveBranchRegionWithServiceInfo,
  AppointmentServiceInfo,
  AppointmentServiceInfoListResult,
  CheckForExistingResult,
  ExistingAppointmentInfo,
  AppointmentDateListResult,
  AppointmentDateList,
  DefaultNearBySlotList,
  DefaultNearBySlotListResult,
  MakeApptResult,
  MakeApptPayLoad,
  ConfirmApptResult,
  EditAppointment,
} from "../../models/appointmentModels";

import AppointmentCard from "../cards/AppointmentCard";
import ServiceList from "../List/ServiceList";
import BranchList from "../List/BranchList";
import DateList from "../List/DateList";

import "./AppointmentQ.css";
import SlotList from "../List/SlotList";

interface LocationState {
  phone: string;
  manageEditApptId: number;
  manageEditMode: boolean;
}

export default function AppointmentQ() {
  const navigate = useNavigate();
  const { phone, manageEditApptId, manageEditMode } = useLocation()
    .state as LocationState;

  const [existingAppt, setExistingAppt] = useState<ExistingAppointmentInfo[]>(
    []
  );
  const [serviceList, setServiceList] = useState<AppointmentServiceInfo[]>([]);
  const [branchList, setBranchList] = useState<
    ActiveBranchRegionWithServiceInfo[]
  >([]);
  const [dateList, setDateList] = useState<AppointmentDateList[]>([]);

  const [slotList, setSlotList] = useState<DefaultNearBySlotList[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );
  const [selectedBranch, setSelectedBranch] =
    useState<ActiveBranchRegionWithServiceInfo | null>(null);
  const [selectedDate, setSelectedDate] = useState<AppointmentDateList | null>(
    null
  );
  const [selectedSlot, setSelectedSlot] =
    useState<DefaultNearBySlotList | null>(null);

  const [pendingAppt, setpendingAppt] = useState<MakeApptResult | null>(null);

  const [successAppt, setSuccessAppt] = useState<ConfirmApptResult | null>(
    null
  );

  const [editMode, setEditMode] = useState(false);

  const [editApptId, setEditApptId] = useState(0);

  const [currentTab, setCurrentTab] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBack = () => navigate("/Landing");

  const handleEdit = (apptId: number) => {
    setEditMode(true);
    setEditApptId(apptId);
  };

  useEffect(() => {
    if (manageEditMode) {
      if (!manageEditApptId) {
        navigate("/Landing");
      } else {
        handleEdit(manageEditApptId);
      }
    }
  }, [manageEditMode, manageEditApptId, navigate]);

  useEffect(() => {
    if (!localStorage.getItem("eqms_key")) {
      handleBack();
    } else if (!localStorage.getItem("Authorization")) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const loadAppointments = async () => {
      setLoading(true);
      try {
        const result: CheckForExistingResult =
          await appointmentservice.checkForExistingAppointment(phone);
        if (result.ResultCode === 0) {
          setExistingAppt(result.ExistingAppt ?? []);
        } else {
          setError(result.ResultDescription);
        }
      } catch (err) {
        setError(
          appointmentservice.getApiErrorMessage(
            err,
            "Error checking existing appointments"
          )
        );
      } finally {
        setLoading(false);
      }
    };
    loadAppointments();
  }, [phone]);

  useEffect(() => {
    const loadServiceList = async () => {
      setLoading(true);
      try {
        const result: AppointmentServiceInfoListResult =
          await appointmentservice.GetAppointmentServiceList();
        if (result.ResultCode === 0) {
          setServiceList(result.AppointmentServiceInfo ?? []);
          if (result.AppointmentServiceInfo.length > 0)
            setCurrentTab("serviceTab");
        } else {
          setError(result.ResultDescription);
        }
      } catch (err) {
        setError(
          appointmentservice.getApiErrorMessage(
            err,
            "Error fetching service list"
          )
        );
      } finally {
        setLoading(false);
      }
    };
    loadServiceList();
  }, []);

  const handleServiceClick = (serviceId: number) => {
    setError("");
    setSelectedServiceId(serviceId);
    setSelectedBranch(null);
    setSelectedDate(null);
    setBranchList([]);
    setDateList([]);
    setLoading(true);

    appointmentservice
      .GetActiveBranchRegionList(serviceId)
      .then((result: ActiveBranchRegionWithServiceInfoListResult) => {
        if (result.ResultCode === 0) {
          setBranchList(result.ActiveBranchRegionInfo ?? []);
          if ((result.ActiveBranchRegionInfo?.length ?? 0) > 0)
            setCurrentTab("branchTab");
        } else {
          setError(result.ResultDescription);
        }
      })
      .catch((err) =>
        setError(
          appointmentservice.getApiErrorMessage(
            err,
            "Error fetching branch list"
          )
        )
      )
      .finally(() => setLoading(false));
  };

  const handleBranchClick = (branchInfo: ActiveBranchRegionWithServiceInfo) => {
    setError("");
    setSelectedBranch(branchInfo);
    setSelectedDate(null);
    setLoading(true);
    setDateList([]);

    appointmentservice
      .GetAppointmentDateList(branchInfo.serviceId)
      .then((result: AppointmentDateListResult) => {
        if (result.ResultCode === 0) {
          setDateList(result.DateList ?? []);
          if ((result.DateList?.length ?? 0) > 0) setCurrentTab("dateTab");
        } else {
          setError(result.ResultDescription);
        }
      })
      .catch((err) =>
        setError(
          appointmentservice.getApiErrorMessage(err, "Error fetching date list")
        )
      )
      .finally(() => setLoading(false));
  };

  const handleDateClick = async (dateInfo: AppointmentDateList) => {
    setError("");
    setSelectedDate(dateInfo);
    setSelectedSlot(null);
    setLoading(true);
    setSlotList([]);

    if (!selectedBranch?.branchId || !selectedBranch?.serviceId) {
      setError("Selected branch or service is missing.");
      setLoading(false);
      return;
    }
    try {
      const payload = {
        branchId: selectedBranch.branchId,
        AppDate: dateInfo.ApptDate,
        isContainSelected: true,
        ServiceId: selectedBranch.serviceId,
      };

      const result: DefaultNearBySlotListResult =
        await appointmentservice.GetDefaultNearBySlotList(payload);

      if (result.ResultCode === 0) {
        const filteredSlots = result.DefaultNearByBranchList.find(
          (slot) => slot.BranchID === selectedBranch.branchId
        );
        if (filteredSlots) {
          setSlotList(filteredSlots.DefaultNearBySlotList ?? []);
          if ((filteredSlots.DefaultNearBySlotList?.length ?? 0) > 0)
            setCurrentTab("slotTab");
        } else {
          setSlotList([]);
          setError("No slots found for the selected branch.");
        }
      } else {
        setError(result.ResultDescription);
      }
    } catch (err) {
      setError(
        appointmentservice.getApiErrorMessage(err, "Error fetching date list")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSlotClick = async (slotInfo: DefaultNearBySlotList) => {
    setSelectedSlot(slotInfo);
    setError("");
    setLoading(true);
    if (
      !selectedServiceId ||
      !selectedDate?.ApptDate ||
      !selectedBranch?.branchId ||
      !phone
    ) {
      setError("Missing required information for appointment.");
      setLoading(false);
      return;
    }

    if (!editMode) {
      const payload: MakeApptPayLoad = {
        ServiceId: selectedServiceId,
        ApptDate: selectedDate.ApptDate,
        BranchId: selectedBranch.branchId, // exact casing
        ApptDateTime: slotInfo.AppDateTime,
        HandPhoneOrEmail: phone,

        // Set default values explicitly for others:
        IsSlotIn: false,
        Channel: "PWeb",
        CreatedBy: 0,
        IsTeller: false,
        IsEdit: false,
        CounterID: 0,
      };

      try {
        const result: MakeApptResult = await appointmentservice.MakeAppointment(
          payload
        );
        if (result.ResultCode === 0) {
          console.log("Appointment successful", result);
          setpendingAppt(result);
          setCurrentTab("pendingTab");
        } else {
          setError(result.ResultDescription || "Failed to make appointment.");
        }
      } catch (err) {
        setError(
          appointmentservice.getApiErrorMessage(err, "Error making appointment")
        );
      } finally {
        setLoading(false);
      }
    } else {
      const payload: EditAppointment = {
        ApptID: editApptId,
        ApptDate: selectedDate.ApptDate,
        ApptTime: slotInfo.AppDateTime,
        Branch: selectedBranch.branchName,
        Service: selectedBranch.serviceName,
        HandPhoneOrEmail: phone,
        branchId: selectedBranch.branchId,
        serviceId: selectedBranch.serviceId,

        // Set default values explicitly for others:
        IsSlotIn: false,
        Queue_Status_ID: 0,
        Channel: "Pweb",
        IsTeller: false,
        EditedBy: 0,
        CounterId: 0,
      };

      try {
        const result: MakeApptResult = await appointmentservice.EditAppointment(
          payload
        );
        if (result.ResultCode === 0) {
          console.log("Edit appointment successful", result);
          setpendingAppt(result);
          setCurrentTab("pendingTab");
        } else {
          setError(result.ResultDescription || "Failed to edit appointment.");
        }
      } catch (err) {
        setError(
          appointmentservice.getApiErrorMessage(
            err,
            "Error editing appointment"
          )
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleConfirm = async () => {
    setError("");
    setLoading(true);
    if (!pendingAppt?.ApptId) {
      setError("Missing required information for confirm appointment.");
      setLoading(false);
      return;
    }
    try {
      const confirmFn = editMode
        ? appointmentservice.ConfirmEditAppointment
        : appointmentservice.ConfirmAppointment;

      const result: ConfirmApptResult = await confirmFn(pendingAppt?.ApptId);

      if (result.ResultCode === 0) {
        console.log("Appointment Confirm successful", result);
        setSuccessAppt(result);
        setCurrentTab("successTab");
      } else {
        setError(result.ResultDescription || "Failed to Confirm appointment.");
      }
    } catch (err) {
      setError(
        appointmentservice.getApiErrorMessage(err, "Error Confirm appointment")
      );
    } finally {
      setLoading(false);
    }
  };
  const handleBackList = () => {
    setError("");
    switch (currentTab) {
      case "pendingTab":
        setCurrentTab("slotTab");
        setpendingAppt(null);
        break;
      case "slotTab":
        setCurrentTab("dateTab");
        setSelectedSlot(null);
        break;
      case "dateTab":
        setCurrentTab("branchTab");
        setSelectedDate(null);
        setSlotList([]);
        break;
      case "branchTab":
        setCurrentTab("serviceTab");
        setSelectedBranch(null);
        setDateList([]);
        break;
      case "serviceTab" || "successTab":
        navigate("/landing");
        break;
      default:
        navigate("/landing");
        break;
    }
  };

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
              onBack={handleBack}
              onEdit={handleEdit}
            />
          ))}
        </>
      )}

      {!loading &&
        !error &&
        (existingAppt.length === 0 || editMode) &&
        currentTab === "serviceTab" && (
          <ServiceList
            serviceList={serviceList}
            selectedServiceId={selectedServiceId}
            onServiceClick={handleServiceClick}
            onBack={handleBackList}
          />
        )}

      {!loading &&
        !error &&
        (existingAppt.length === 0 || editMode) &&
        currentTab === "branchTab" && (
          <BranchList
            branchList={branchList}
            selectedBranch={selectedBranch}
            onBranchClick={handleBranchClick}
            onBack={handleBackList}
          />
        )}

      {!loading &&
        !error &&
        (existingAppt.length === 0 || editMode) &&
        currentTab === "dateTab" && (
          <DateList
            dateList={dateList}
            selectedDate={selectedDate}
            onDateClick={handleDateClick}
            onBack={handleBackList}
          />
        )}

      {!loading &&
        !error &&
        (existingAppt.length === 0 || editMode) &&
        currentTab === "slotTab" && (
          <SlotList
            slotList={slotList}
            selectedSlot={selectedSlot}
            onSlotClick={handleSlotClick}
            onBack={handleBackList}
          />
        )}

      {!loading &&
        !error &&
        (existingAppt.length === 0 || editMode) &&
        currentTab === "pendingTab" && (
          <div
            className="card mb-3"
            style={{ width: "400px", textAlign: "left" }}
          >
            <div className="card-body">
              <p>
                <strong>Appointment ID:</strong> {pendingAppt?.ApptId}
              </p>
              <p>
                <strong>Branch Name:</strong> {pendingAppt?.BranchName}
              </p>
              <p>
                <strong>Service Name :</strong> {pendingAppt?.ServiceName}
              </p>
              <p>
                <strong>Status :</strong> Pending
              </p>
              <p>
                <strong>Message:</strong> {pendingAppt?.Message}
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

      {!loading &&
        !error &&
        (existingAppt.length === 0 || editMode) &&
        currentTab === "successTab" && (
          <div
            className="card mb-3"
            style={{ width: "400px", textAlign: "left" }}
          >
            <div className="card-body">
              <p>
                <strong>Appointment ID:</strong> {successAppt?.ApptID}
              </p>
              <p>
                <strong>Branch Name:</strong> {successAppt?.BranchName}
              </p>
              <p>
                <strong>Service Name :</strong> {successAppt?.ServiceName}
              </p>
              <p>
                <strong>Status :</strong> Confirmed
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
    </div>
  );
}
