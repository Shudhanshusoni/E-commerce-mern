import React, { useState, useEffect } from "react";
import "./UpdatePassword.css";
import Loader from "../layout/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, updatePassword } from "../../actions/UserAction";
import { useAlert } from "react-alert";
import { UPDATE_PASSWORD_RESET } from "../../constants/UserConstants";
import MetaData from "../layout/Metadata";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockIcon from "@material-ui/icons/Lock";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { useNavigate } from "react-router-dom";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate=useNavigate();

  const { error, isUpdated, loading } = useSelector((state) => state.profile);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visible,setVisible]=useState(true);

  const toggle=()=>{
    setVisible(!visible);
  }

  const updatePasswordSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("oldPassword", oldPassword);
    myForm.set("newPassword", newPassword);
    myForm.set("confirmPassword", confirmPassword);

    dispatch(updatePassword(myForm));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("Profile Updated Successfully");

      navigate("/account");

      dispatch({
        type: UPDATE_PASSWORD_RESET,
      });
    }
  }, [dispatch, error, alert, navigate, isUpdated]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Change Password" />
          <div className="updatePasswordContainer">
            <div className="updatePasswordBox">
              <h2 className="updatePasswordHeading">Update Password</h2>

              <form
                className="updatePasswordForm"
                onSubmit={updatePasswordSubmit}
              >
                <div className="loginPassword">
                  <VpnKeyIcon />
                  <input
                    type={visible ? 'password' : 'text'}
                    placeholder="Old Password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                  <VisibilityOffIcon id="toggle" onClick={toggle}/>
                </div>

                <div className="loginPassword">
                  <LockOpenIcon />
                  <input
                    type={visible ? 'password' : 'text'}
                    placeholder="New Password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                    <VisibilityOffIcon id="toggle" onClick={toggle}/>
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
                    <VisibilityOffIcon id="toggle" onClick={toggle}/>
                </div>
                <input
                  type="submit"
                  value="Change"
                  className="updatePasswordBtn"
                />
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UpdatePassword;