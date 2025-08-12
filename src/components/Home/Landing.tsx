import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("eqms_key");
  }, []);

  const handleClick = (
    nextPage: "appointment" | "manage-appointment" | "getqueue" | "manage-queue"
  ) => {
    navigate("/request-otp", { state: { nextPage } });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center">
      <div className="text-center" style={{ width: "400px" }}>
        <h1 className="mb-4">PWeb Online</h1>

        <button
          className="btn btn-danger w-100 mb-3"
          onClick={() => handleClick("appointment")}
        >
          Book Appointment
        </button>
        <button
          className="btn btn-danger w-100 mb-3"
          onClick={() => handleClick("manage-appointment")}
        >
          Manage Appointment
        </button>
        <button
          className="btn btn-danger w-100 mb-3"
          onClick={() => handleClick("getqueue")}
        >
          Get Q Number
        </button>
        <button
          className="btn btn-danger w-100 mb-3"
          onClick={() => handleClick("manage-queue")}
        >
          Manage Q Number
        </button>
        <button className="btn btn-danger w-100" onClick={() => handleLogout()}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Landing;
