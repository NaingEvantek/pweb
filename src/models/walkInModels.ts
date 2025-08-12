export interface GetUniqueWalkinServiceList{
    ResultCode:number,
    ResultDescription:string,
    ServiceInfo:WalkInServiceInfo[]
}

export interface WalkInServiceInfo{
    ID:number,
    BranchTypeID:number,
    BranchTypeName:string,
    TkDspService_Sequence_ID?:number,
    BIPFeedID?:number,
    ServiceName:string,
    KioskServiceNameEN:string,
    KioskServiceNameCH:string,
    TicketServiceName:string,
    SMSServiceName:string,
    QueueStartRange:string,
    QueueEndRange:string,
    StandardWaitingTime:number,
    EffectiveStartDate:Date,
    EffectiveEndDate:Date,
    IsPriorityService:boolean,
    IsTreasuresService:boolean,
    IsRMService:boolean,
    IsAutoEndService:boolean,
    SkipPrintingTicket?:boolean,
    IsNonSMSService:boolean,
    IsMakerID:boolean,
    SectionHeaderEN:string,
    SectionHeaderCH:string,
    AverageServingTimeMinimum?:number,
    AverageServingTimeMaximum?:number,
    NumWaiting:number
}