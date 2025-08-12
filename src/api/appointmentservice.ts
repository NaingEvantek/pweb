import type * as appointmentModels from '../models/appointmentModels';
import api,{getApiErrorMessage } from './api'

  export { getApiErrorMessage  };

  export const checkForExistingAppointment= async (phoneNumber: string):Promise<appointmentModels.CheckForExistingResult>=>{
    const token = localStorage.getItem('Authorization');
    const eqms_key = localStorage.getItem('eqms_key');
    const response = await api.get<appointmentModels.CheckForExistingResult>(`/CheckForExistingAppointment?HandPhoneOrEmail=${phoneNumber}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'eqms_key':`${eqms_key}`
      }
    }
  );
    return response.data;
  }

  export const GetAppointmentServiceList= async ():Promise<appointmentModels.AppointmentServiceInfoListResult>=>{
    const token = localStorage.getItem('Authorization');
    const eqms_key = localStorage.getItem('eqms_key');
    const response = await api.get<appointmentModels.AppointmentServiceInfoListResult>(`/GetAppointmentServiceList`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'eqms_key':`${eqms_key}`
      }
    }
  );
    return response.data;
  }

  export const GetActiveBranchRegionList= async (serviceId:number):Promise<appointmentModels.ActiveBranchRegionWithServiceInfoListResult>=>{
    const token = localStorage.getItem('Authorization');
    const eqms_key = localStorage.getItem('eqms_key');
    const response = await api.get<appointmentModels.ActiveBranchRegionWithServiceInfoListResult>(`/GetActiveBranchRegionList?serviceId=${serviceId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'eqms_key':`${eqms_key}`
      }
    }
  );
    return response.data;
  }

  export const GetAppointmentDateList= async (serviceId:number):Promise<appointmentModels.AppointmentDateListResult>=>{
    const token = localStorage.getItem('Authorization');
    const eqms_key = localStorage.getItem('eqms_key');
    const response = await api.get<appointmentModels.AppointmentDateListResult>(`/GetAppointmentDateList?serviceId=${serviceId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'eqms_key':`${eqms_key}`
      }
    }
  );
    return response.data;
  }

  export const GetDefaultNearBySlotList= async (payload:appointmentModels.GetDefaultNearBySlotListPayLoad):Promise<appointmentModels.DefaultNearBySlotListResult>=>{
    const token = localStorage.getItem('Authorization');
    const eqms_key = localStorage.getItem('eqms_key');
    const response = await api.post<appointmentModels.DefaultNearBySlotListResult>(`/GetDefaultNearBySlotList`,{
      "ServiceId":payload.ServiceId,
      "AppDateId":1,
      "AppDate":payload.AppDate,
      "branchId":payload.branchId,
      "isContainSelected":payload.isContainSelected
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'eqms_key':`${eqms_key}`
      }
    }
  );
    return response.data;
  }

  export const MakeAppointment= async (payload:appointmentModels.MakeApptPayLoad):Promise<appointmentModels.MakeApptResult>=>{
    const token = localStorage.getItem('Authorization');
    const eqms_key = localStorage.getItem('eqms_key');
    const response = await api.post<appointmentModels.MakeApptResult>(`/MakeAppointment`,{
      "ServiceId":payload.ServiceId,
      "ApptDate":payload.ApptDate,
      "BranchId":payload.BranchId,
      "ApptDateTime":payload.ApptDateTime,
      "HandPhoneOrEmail":payload.HandPhoneOrEmail,
      "IsSlotIn":false,
      "Channel":"PWeb",
      "CreatedBy":0,
      "IsTeller":false,
      "IsEdit":false,
      "CounterID":0
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'eqms_key':`${eqms_key}`
      }
    }
  );
    return response.data;
  }

  export const ConfirmAppointment= async (apptId:number):Promise<appointmentModels.ConfirmApptResult>=>{
    const token = localStorage.getItem('Authorization');
    const eqms_key = localStorage.getItem('eqms_key');
    const response = await api.get<appointmentModels.ConfirmApptResult>(`/ConfirmAppointment?apptId=${apptId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'eqms_key':`${eqms_key}`
      }
    }
  );
    return response.data;
  }


  export const EditAppointment= async (payload:appointmentModels.EditAppointment):Promise<appointmentModels.MakeApptResult>=>{
    const token = localStorage.getItem('Authorization');
    const eqms_key = localStorage.getItem('eqms_key');
    const response = await api.post<appointmentModels.MakeApptResult>(`/EditAppointment`,{
    "ApptID":payload.ApptID,
    "ApptDate":payload.ApptDate,
    "ApptTime":payload.ApptTime,
    "Branch":payload.Branch,
    "Service":payload.Service,
    "HandPhoneOrEmail":payload.HandPhoneOrEmail,
    "branchId":payload.branchId,
    "serviceId":payload.serviceId,
    "IsSlotIn":payload.IsSlotIn,
    "Queue_Status_ID":payload.Queue_Status_ID,
    "Channel":payload.Channel,
    "IsTeller":payload.IsTeller,
    "EditedBy":payload.EditedBy,
    "CounterId":payload.CounterId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'eqms_key':`${eqms_key}`
      }
    }
  );
    return response.data;
  }

  export const ConfirmEditAppointment= async (apptId:number):Promise<appointmentModels.ConfirmApptResult>=>{
    const token = localStorage.getItem('Authorization');
    const eqms_key = localStorage.getItem('eqms_key');
    const response = await api.get<appointmentModels.ConfirmApptResult>(`/ConfirmEditAppointment?apptId=${apptId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'eqms_key':`${eqms_key}`
      }
    }
  );
    return response.data;
  }