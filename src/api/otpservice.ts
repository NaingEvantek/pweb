import api, { getApiErrorMessage } from "./api";

export { getApiErrorMessage };
export interface RequestOtpResponse {
    HandphoneOrEmail: string;
    ResultCode: number;
    ResultDescription: string;
  }

  export interface SubmitOTPResult {
    HandphoneOrEmail: string;
    ResultCode: number;
    ResultDescription: string;
    token:string;
  }

  export const requestOtp = async (phoneNumber: string): Promise<RequestOtpResponse>  => {
    const token = localStorage.getItem('Authorization');
    const response = await api.post<RequestOtpResponse>(
      `/GetOTP`,{ 
        "Mobile": phoneNumber 
      },{
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        }
      }
    );
   
    return response.data;
  };

  export const submitOtp = async (phoneNumber: string, otp: string):Promise<SubmitOTPResult> => {
    const token = localStorage.getItem('Authorization');
    const response = await api.post<SubmitOTPResult>(`/SubmitOTP`, {
      "Mobile":phoneNumber,
      "otpSubmitted":otp,
    },{
      headers: {
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json'
      }
    }
  );
    return response.data;
  };

  export const DecryptOTP = async (mobile: string,email:string): Promise<string>  => {
    const token = localStorage.getItem('Authorization');
    const response = await api.post<string>(
      `/DecryptOTP`,{ 
        "Mobile": mobile,
        "Email":email 
      },{
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        }
      }
    );
   
    return response.data;
  };
