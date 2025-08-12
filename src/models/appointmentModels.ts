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

  export interface AppointmentServiceInfoListResult{
    ResultCode:number,
    ResultDescription:string,
    AppointmentServiceInfo:AppointmentServiceInfo[]
  }

  export interface AppointmentServiceInfo{
    ServiceId:number,
    ServiceName:string
  }


  export interface AppointmentDateListResult{
    ResultCode:number,
    ResultDescription:string,
    DateList:AppointmentDateList[]
  }

  export interface AppointmentDateList{
    ApptDateID:number,
    ApptDate:string
  }

  export interface ActiveBranchRegionWithServiceInfoListResult{
    ResultCode:number,
    ResultDescription:string,
    ActiveBranchRegionInfo:ActiveBranchRegionWithServiceInfo[]
  }

  export interface ActiveBranchRegionWithServiceInfo{
    branchId:number,
    branchName:string,
    regionId?:number,
    regionName:string,
    serviceId:number,
    serviceName:string
  }

  export interface DefaultNearBySlotListResult{
    ResultCode:number,
    ResultDescription:string,
    DefaultNearByBranchList:DefaultNearBySlots[]
  }

  export interface DefaultNearBySlots{
    BranchID:number,
    BranchName:string,
    ServiceID:number,
    BranchAddress:string,
    RegionID:number,
    RegionName:string,
    SelectedBranch:number
    DefaultNearBySlotList:DefaultNearBySlotList[]
  }

  export interface DefaultNearBySlotList{
    ApptSlotID:number,
    AppDateTime:string
  }

  export interface GetDefaultNearBySlotListPayLoad{
    ServiceId:number,
    AppDate:string,
    branchId:number,
    isContainSelected:boolean
  }

  export interface MakeApptPayLoad{
    ServiceId:number,
    ApptDate:string,
    BranchId:number,
    ApptDateTime:string,
    HandPhoneOrEmail:string,
    IsSlotIn:boolean,
    Channel:string,
    CreatedBy:number,
    IsTeller:boolean,
    IsEdit:boolean,
    CounterID:number
  }

  export interface MakeApptResult{
    ResultCode:number,
    ResultDescription:string,
    ApptId:number,
    BranchId:number,
    BranchName:string,
    ServiceId:number,
    ServiceName:number,
    Message:string,
    Reminder:string
  }

  export interface ConfirmApptResult{
    ResultCode:number,
    ResultDescription:string,
    ApptID:number,
    ApptDateTime:string,
    BranchID:number,
    BranchName:string,
    Region:string,
    BranchAddress:string,
    ServiceID:number,
    ServiceName:string,
    ReminderMinute:string,
    Message:string
  }

  export interface EditAppointment{
    ApptID:number,
    ApptDate:string,
    ApptTime:string,
    Branch:string,
    Service:string,
    HandPhoneOrEmail:string,
    branchId:number,
    serviceId:number,
    IsSlotIn:boolean,
    Queue_Status_ID:number,
    Channel:string,
    IsTeller:boolean,
    EditedBy:number,
    CounterId:number
  }