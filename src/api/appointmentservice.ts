import api,{getApiErrorMessage } from './api'

export { getApiErrorMessage  };

export interface CheckForExistingResult{
    ResultCode:number,
    ResultDescription:string,
    ExistingAppt:ExistingAppointmentInfo[]
  }

  export interface ExistingAppointmentInfo{
    HasExisting:boolean,
    ApptID: number,
    ApptDateTime:string,
    BranchID:number,
    BranchName:string,
    Region:string,
    Address:string,
    ServiceID:number,
    ServiceName:string,
    QueueStatus:string
  }

  export const checkForExistingAppointment= async (phoneNumber: string):Promise<CheckForExistingResult>=>{
    const token = localStorage.getItem('Authorization');
    const eqms_key = localStorage.getItem('eqms_key');
    const response = await api.get<CheckForExistingResult>(`/CheckForExistingAppointment?HandPhoneOrEmail=${phoneNumber}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'eqms_key':`${eqms_key}`
      }
    }
  );
    return response.data;
  }

