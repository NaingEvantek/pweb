import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  requestOtp,
  type RequestOtpResponse,
  getApiErrorMessage,
} from "../../api/otpservice";

interface LocationState {
  nextPage: "appointment" | "manage-appointment" | "getqueue" | "manage-queue";
}

export default function RequestOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { nextPage } = location.state as LocationState;

  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePhone = (value: string) => /^([89]\d{7})$/.test(value);

  const handleSubmit = async () => {
    if (!validatePhone(phone)) {
      setError("Phone number must start with 8 or 9 and be exactly 8 digits.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data: RequestOtpResponse = await requestOtp(phone);

      console.log(data);
      if (data.ResultCode > 0) {
        setError(data.ResultDescription || "Failed to request OTP.");
      } else {
        navigate("/submit-otp", { state: { nextPage, phone } });
      }
    } catch (err) {
      setError(
        getApiErrorMessage(err, "An error occurred while requesting OTP.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPhone(value);
    }
  };

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center">
      <div style={{ width: "450px" }}>
        <h1 className="text-center mb-4">PWeb Online</h1>

        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Enter phone number"
            maxLength={8}
            value={phone}
            onChange={handlePhoneChange}
            disabled={loading}
          />
          <button
            className="btn btn-danger btn-lg"
            type="button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Sending..." : "Request OTP"}
          </button>
        </div>

        {error && <div className="text-danger text-center">{error}</div>}
      </div>
    </div>
  );
}
