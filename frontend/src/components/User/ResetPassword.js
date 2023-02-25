import React, { useState, useEffect } from "react";
import "./ResetPassword.css";
import Loader from "../layout/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, resetPassword } from "../../actions/UserAction";
import { useAlert } from "react-alert";
import MetaData from "../layout/Metadata";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockIcon from "@material-ui/icons/Lock";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const ResetPassword = ({ match }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const id=useParams();

  const { error, success, loading } = useSelector(
    (state) => state.forgotPassword
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visible,setVisible]=useState(true);

  const toggle=()=>{
    setVisible(!visible);
  }

  const resetPasswordSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("password", password);
    myForm.set("confirmPassword", confirmPassword);

    dispatch(resetPassword(id.token, myForm));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Password Updated Successfully");

      navigate("/login");
    }
  }, [dispatch, error, alert, navigate, success]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Change Password" />
          <div className="resetPasswordContainer">
            <div className="resetPasswordBox">
              <h2 className="resetPasswordHeading">Reset Password</h2>

              <form
                className="resetPasswordForm"
                onSubmit={resetPasswordSubmit}
              >
                <div>
                  <LockOpenIcon />
                  <input
                    type={visible ? 'password' : 'text'}
                    placeholder="New Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <VisibilityOffIcon id="toggles" onClick={toggle}/>
                </div>
                <div className="loginPassword">
                  <LockIcon />
                  <input
                    type={visible ? 'password' : 'text'}
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <VisibilityOffIcon id="toggles" onClick={toggle}/>
                </div>
                <input
                  type="submit"
                  value="Update"
                  className="resetPasswordBtn"
                />
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ResetPassword;