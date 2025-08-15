import { useState, useEffect, useCallback } from "react";
import * as appointmentservice from "../api/appointmentservice";
import type {
  ActiveBranchRegionWithServiceInfo,
  AppointmentServiceInfo,
  ExistingAppointmentInfo,
  AppointmentDateList,
  DefaultNearBySlotList,
  MakeApptResult,
  ConfirmApptResult,
  MakeApptPayLoad,
  EditAppointment,
} from "../models/appointmentModels";

interface UseAppointmentProps {
  phone: string;
  manageEditApptId?: number;
  manageEditMode?: boolean;
  navigate: (path: string) => void;
}

export const useAppointment = ({ phone, manageEditApptId, manageEditMode, navigate }: UseAppointmentProps) => {
  const [existingAppt, setExistingAppt] = useState<ExistingAppointmentInfo[]>([]);
  const [serviceList, setServiceList] = useState<AppointmentServiceInfo[]>([]);
  const [branchList, setBranchList] = useState<ActiveBranchRegionWithServiceInfo[]>([]);
  const [dateList, setDateList] = useState<AppointmentDateList[]>([]);
  const [slotList, setSlotList] = useState<DefaultNearBySlotList[]>([]);

  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<ActiveBranchRegionWithServiceInfo | null>(null);
  const [selectedDate, setSelectedDate] = useState<AppointmentDateList | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<DefaultNearBySlotList | null>(null);

  const [pendingAppt, setPendingAppt] = useState<MakeApptResult | null>(null);
  const [successAppt, setSuccessAppt] = useState<ConfirmApptResult | null>(null);

  const [editMode, setEditMode] = useState(false);
  const [editApptId, setEditApptId] = useState(0);

  const [currentTab, setCurrentTab] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /** Navigation Helpers */
  const handleEdit = (apptId: number) => {
    setEditMode(true);
    setEditApptId(apptId);
  };

  const resetError = () => setError("");

  /** Load existing appointments */
  const loadExistingAppointments = useCallback(async () => {
    if (!phone) return;
    setLoading(true);
    try {
      const result = await appointmentservice.checkForExistingAppointment(phone);
      if (result.ResultCode === 0) setExistingAppt(result.ExistingAppt ?? []);
      else setError(result.ResultDescription);
    } catch (err) {
      setError(appointmentservice.getApiErrorMessage(err, "Error checking existing appointments"));
    } finally {
      setLoading(false);
    }
  }, [phone]);

  /** Load service list */
  const loadServiceList = useCallback(async () => {
    setLoading(true);
    try {
      const result = await appointmentservice.GetAppointmentServiceList();
      if (result.ResultCode === 0) {
        setServiceList(result.AppointmentServiceInfo ?? []);
        if ((result.AppointmentServiceInfo?.length ?? 0) > 0) setCurrentTab("serviceTab");
      } else setError(result.ResultDescription);
    } catch (err) {
      setError(appointmentservice.getApiErrorMessage(err, "Error fetching service list"));
    } finally {
      setLoading(false);
    }
  }, []);

  /** Load branches */
  const handleServiceClick = async (serviceId: number) => {
    resetError();
    setSelectedServiceId(serviceId);
    setSelectedBranch(null);
    setSelectedDate(null);
    setBranchList([]);
    setDateList([]);
    setLoading(true);

    try {
      const result = await appointmentservice.GetActiveBranchRegionList(serviceId);
      if (result.ResultCode === 0) {
        setBranchList(result.ActiveBranchRegionInfo ?? []);
        if ((result.ActiveBranchRegionInfo?.length ?? 0) > 0) setCurrentTab("branchTab");
      } else setError(result.ResultDescription);
    } catch (err) {
      setError(appointmentservice.getApiErrorMessage(err, "Error fetching branch list"));
    } finally {
      setLoading(false);
    }
  };

  /** Load dates */
  const handleBranchClick = async (branch: ActiveBranchRegionWithServiceInfo) => {
    resetError();
    setSelectedBranch(branch);
    setSelectedDate(null);
    setDateList([]);
    setLoading(true);

    try {
      const result = await appointmentservice.GetAppointmentDateList(branch.serviceId);
      if (result.ResultCode === 0) {
        setDateList(result.DateList ?? []);
        if ((result.DateList?.length ?? 0) > 0) setCurrentTab("dateTab");
      } else setError(result.ResultDescription);
    } catch (err) {
      setError(appointmentservice.getApiErrorMessage(err, "Error fetching date list"));
    } finally {
      setLoading(false);
    }
  };

  /** Load slots */
  const handleDateClick = async (dateInfo: AppointmentDateList) => {
    resetError();
    setSelectedDate(dateInfo);
    setSelectedSlot(null);
    setSlotList([]);
    if (!selectedBranch) {
      setError("Selected branch or service is missing.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        branchId: selectedBranch.branchId,
        AppDate: dateInfo.ApptDate,
        isContainSelected: true,
        ServiceId: selectedBranch.serviceId,
      };
      const result = await appointmentservice.GetDefaultNearBySlotList(payload);
      if (result.ResultCode === 0) {
        const filtered = result.DefaultNearByBranchList.find(s => s.BranchID === selectedBranch.branchId);
        setSlotList(filtered?.DefaultNearBySlotList ?? []);
        if ((filtered?.DefaultNearBySlotList?.length ?? 0) > 0) setCurrentTab("slotTab");
        if (!filtered) setError("No slots found for the selected branch.");
      } else setError(result.ResultDescription);
    } catch (err) {
      setError(appointmentservice.getApiErrorMessage(err, "Error fetching slot list"));
    } finally {
      setLoading(false);
    }
  };

  /** Make or edit appointment */
  const handleSlotClick = async (slotInfo: DefaultNearBySlotList) => {
    resetError();
    setSelectedSlot(slotInfo);
    if (!selectedServiceId || !selectedBranch || !selectedDate?.ApptDate || !phone) {
      setError("Missing required information for appointment.");
      return;
    }

    setLoading(true);
    try {
      if (!editMode) {
        const payload: MakeApptPayLoad = {
          ServiceId: selectedServiceId,
          ApptDate: selectedDate.ApptDate,
          BranchId: selectedBranch.branchId,
          ApptDateTime: slotInfo.AppDateTime,
          HandPhoneOrEmail: phone,
          IsSlotIn: false,
          Channel: "PWeb",
          CreatedBy: 0,
          IsTeller: false,
          IsEdit: false,
          CounterID: 0,
        };
        const result = await appointmentservice.MakeAppointment(payload);
        if (result.ResultCode === 0) {
          setPendingAppt(result);
          setCurrentTab("pendingTab");
        } else setError(result.ResultDescription || "Failed to make appointment.");
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
          IsSlotIn: false,
          Queue_Status_ID: 0,
          Channel: "Pweb",
          IsTeller: false,
          EditedBy: 0,
          CounterId: 0,
        };
        const result = await appointmentservice.EditAppointment(payload);
        if (result.ResultCode === 0) {
          setPendingAppt(result);
          setCurrentTab("pendingTab");
        } else setError(result.ResultDescription || "Failed to edit appointment.");
      }
    } catch (err) {
      setError(appointmentservice.getApiErrorMessage(err, "Error processing appointment"));
    } finally {
      setLoading(false);
    }
  };

  /** Confirm appointment */
  const handleConfirm = async () => {
    resetError();
    if (!pendingAppt?.ApptId) {
      setError("Missing appointment ID for confirmation.");
      return;
    }

    setLoading(true);
    try {
      const confirmFn = editMode
        ? appointmentservice.ConfirmEditAppointment
        : appointmentservice.ConfirmAppointment;

      const result = await confirmFn(pendingAppt.ApptId);
      if (result.ResultCode === 0) {
        setSuccessAppt(result);
        setCurrentTab("successTab");
      } else setError(result.ResultDescription || "Failed to confirm appointment.");
    } catch (err) {
      setError(appointmentservice.getApiErrorMessage(err, "Error confirming appointment"));
    } finally {
      setLoading(false);
    }
  };

  /** Back navigation */
  const handleBackList = () => {
    resetError();
    switch (currentTab) {
      case "pendingTab":
        setPendingAppt(null);
        setCurrentTab("slotTab");
        break;
      case "slotTab":
        setSelectedSlot(null);
        setCurrentTab("dateTab");
        break;
      case "dateTab":
        setSlotList([]);
        setSelectedDate(null);
        setCurrentTab("branchTab");
        break;
      case "branchTab":
        setDateList([]);
        setSelectedBranch(null);
        setCurrentTab("serviceTab");
        break;
      case "serviceTab":
      case "successTab":
      default:
        navigate("/Landing");
        break;
    }
  };

  /** Initial load */
  useEffect(() => {
    if (!localStorage.getItem("eqms_key")) navigate("/Landing");
    else if (!localStorage.getItem("Authorization")) navigate("/");
    if (manageEditMode && manageEditApptId) handleEdit(manageEditApptId);
    loadExistingAppointments();
    loadServiceList();
  }, []);

  return {
    state: {
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
      editMode,
      currentTab,
      loading,
      error,
    },
    actions: {
      handleServiceClick,
      handleBranchClick,
      handleDateClick,
      handleSlotClick,
      handleConfirm,
      handleBackList,
      handleEdit,
    },
  };
};
