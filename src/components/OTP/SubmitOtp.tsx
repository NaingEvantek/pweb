import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  submitOtp,
  type SubmitOTPResult,
  getApiErrorMessage,
} from "../../api/otpservice";

interface LocationState {
  nextPage: "appointment" | "manage-appointment" | "getqueue" | "manage-queue";
  phone: string; // assuming phone is passed from previous page
}

export default function SubmitOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { nextPage, phone } = location.state as LocationState;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!phone) {
      navigate("/landing", { replace: true });
    }
  }, [phone, navigate]);

  const handleSubmit = async () => {
    if (!otp.trim()) {
      setError("Please enter OTP.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result: SubmitOTPResult = await submitOtp(phone, otp);

      if (result.ResultCode === 0 && result.token) {
        localStorage.setItem("eqms_key", result.token);
        navigate(`/${nextPage}`, { state: { phone } });
      } else {
        setError(result.ResultDescription || "Invalid OTP.");
      }
    } catch (err: any) {
      setError(
        getApiErrorMessage(err, "An error occurred while submitting OTP.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-center px-3">
      <h1 className="mb-5">PWeb Online</h1>
      <div
        className="d-flex w-100 justify-content-center gap-2"
        style={{ maxWidth: "600px" }}
      >
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            disabled={loading}
          />
          <button
            className="btn btn-danger btn-lg"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Submit"}
          </button>
        </div>
      </div>
      {error && <div className="text-danger mt-2">{error}</div>}
    </div>
  );
}
