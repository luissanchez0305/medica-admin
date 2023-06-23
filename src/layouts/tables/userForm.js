// import { useEffect, useState } from "react";
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import classes from "inputs/Popup/Popup.module.css";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Checkbox } from "@mui/material";
import MDInput from "components/MDInput";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import db from "../../firebase";

function UserForm({ handleClose, userId }) {
  const isEdit = userId > 0;
  const [userUID, setUserUID] = useState("");
  const [userDoc, setUserDoc] = useState();
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("");
  const [insurances, setInsurances] = useState([]);
  const [insurancesUsers, setInsurancesUsers] = useState([]);

  const handleEmailChange = (event) => {
    const { ...target } = event.target;
    setEmail(target.value);
  };

  const handleNameChange = (event) => {
    const { ...target } = event.target;
    setName(target.value);
  };

  const handleLastNameChange = (event) => {
    const { ...target } = event.target;
    setLastname(target.value);
  };

  const handleAddressChange = (event) => {
    const { ...target } = event.target;
    setAddress(target.value);
  };

  const handleSubmit = async () => {
    setStatus("Saving...");

    if (!isEdit) {
      const auth = getAuth(db.firebaseApp);
      try {
        const result = await createUserWithEmailAndPassword(auth, email, "123456");

        console.log("result", result);
        /* if (error) {
          console.log(`error: ${error}`);
          setStatus(`Error: ${error.message}`);
          return;
        } */

        setUserUID(result.user.uid);

        const userData = {
          uid: result.user.uid,
          email,
          name,
          lastname,
          address,
        };

        await addDoc(collection(db, "users"), {
          ...userData,
        });
      } catch (error) {
        console.log(`error: ${error}`);
        setStatus(`Error: ${error.message}`);
        return;
      }
    } else {
      await updateDoc(userDoc, {
        name,
        lastname,
        email,
        address,
      });
    }

    insurances
      .filter((i) => !i.checked)
      .forEach(async (insurance) => {
        const insuranceFound = insurancesUsers.find((iu) => iu.insurance === insurance.id);
        if (insuranceFound) {
          const deleteId = insuranceFound.id;
          const insurancesUsersRef = doc(db, "insurancesUsers", deleteId);
          await deleteDoc(insurancesUsersRef);
        }
      });

    insurances
      .filter((i) => i.checked)
      .forEach(async (insurance) => {
        const insurancesUsersRef = collection(db, "insurancesUsers");
        const qIU = query(
          insurancesUsersRef,
          where("insurance", "==", insurance.id),
          where("user", "==", userUID)
        );
        const insurancesUsersSnap = await getDocs(qIU);
        if (!insurancesUsersSnap.docs.length) {
          await addDoc(collection(db, "insurancesUsers"), {
            insurance: insurance.id,
            user: userUID,
            insuranceName: insurance.name,
          });
        }
      });
    setStatus("Saved");
  };

  const getData = async (id) => {
    if (!isEdit) {
      const insurancesSnap = await getDocs(collection(db, "insurances"));
      setInsurances(
        insurancesSnap.docs.map((document) => ({
          ...document.data(),
          id: document.id,
        }))
      );
      return;
    }
    const userRef = doc(db, "users", id);
    setUserDoc(userRef);
    const userSnap = await getDoc(userRef);
    const user = userSnap.data();
    setEmail(user.email);
    setName(user.name);
    setLastname(user.lastname);
    setAddress(user.address);
    setUserUID(user.uid);

    const insurancesUsersRef = collection(db, "insurancesUsers");
    const qIU = query(insurancesUsersRef, where("user", "==", user.uid));

    const insurancesUsersSnap = await getDocs(qIU);
    const insurancesUsersArray = insurancesUsersSnap.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }));
    setInsurancesUsers(insurancesUsersArray);
    const insurancesSnap = await getDocs(collection(db, "insurances"));
    setInsurances(
      insurancesSnap.docs.map((document) => ({
        ...document.data(),
        id: document.id,
        insurancesUsers: insurancesUsersArray,
        checked: insurancesUsersArray.some((iu) => iu.insurance === document.id),
      }))
    );
  };

  const handleCheckChanged = (event) => {
    const { checked, id } = event.target;
    console.log("checked", checked, id);
    setInsurances(
      insurances.map((insurance) => {
        if (insurance.id === id) {
          return {
            ...insurance,
            checked,
          };
        }
        return insurance;
      })
    );
  };

  useEffect(() => {
    getData(userId);
  }, []);

  return (
    <div className={`${classes.popupBox}`}>
      <div className={`${classes.box}`}>
        <span
          className={`${classes.closeIcon}`}
          onClick={handleClose}
          onKeyDown={handleClose}
          role="button"
          tabIndex={0}
        >
          x
        </span>
        <Card>
          <MDBox
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="success"
            mx={2}
            mt={-3}
            py={2}
            mb={1}
            textAlign="center"
          >
            <MDTypography variant="h3" fontWeight="medium" color="white" mt={1}>
              {isEdit ? "Edit" : "Create new"} user
            </MDTypography>
            <MDTypography display="block" variant="button" color="white" my={1}>
              {isEdit ? "Use the form to edit the user" : "Fill the form to create a new user"}
            </MDTypography>
          </MDBox>
          <MDBox pt={4} pb={3} px={3}>
            <MDBox component="form" role="form">
              <MDBox mb={4}>
                {isEdit ? (
                  { email }
                ) : (
                  <MDInput
                    InputLabelProps={{ shrink: isEdit || (!isEdit && name) }}
                    type="email"
                    label="Email"
                    name="email"
                    variant="standard"
                    value={email}
                    fullWidth
                    onChange={handleEmailChange}
                  />
                )}
              </MDBox>
              <MDBox mb={4}>
                <MDInput
                  InputLabelProps={{ shrink: isEdit || (!isEdit && name) }}
                  type="text"
                  label="Name"
                  name="name"
                  variant="standard"
                  value={name}
                  fullWidth
                  onChange={handleNameChange}
                />
              </MDBox>
              <MDBox mb={4}>
                <MDInput
                  InputLabelProps={{ shrink: isEdit || (!isEdit && lastname) }}
                  type="text"
                  label="Lastname"
                  name="lastname"
                  variant="standard"
                  value={lastname}
                  fullWidth
                  onChange={handleLastNameChange}
                />
              </MDBox>
              <MDBox mb={4}>
                <MDInput
                  InputLabelProps={{ shrink: isEdit || (!isEdit && address) }}
                  type="text"
                  label="Address"
                  name="address"
                  variant="standard"
                  value={address}
                  fullWidth
                  onChange={handleAddressChange}
                />
              </MDBox>
              <MDBox
                mb={4}
                style={{
                  fontSize: "0.8rem",
                }}
              >
                {insurances.map((insurance) => (
                  <MDBox component="label" htmlFor={insurance.id} mb={1}>
                    <Checkbox
                      checked={insurance.checked}
                      onChange={handleCheckChanged}
                      id={insurance.id}
                    />

                    {insurance.name}
                  </MDBox>
                ))}
              </MDBox>
              <MDBox mt={6} mb={1}>
                <MDButton variant="gradient" color="info" fullWidth onClick={handleSubmit}>
                  Submit
                </MDButton>
                <MDTypography display="block" variant="button" my={1}>
                  {status}
                </MDTypography>
              </MDBox>
            </MDBox>
          </MDBox>
        </Card>
      </div>
    </div>
  );
}
UserForm.defaultProps = {
  handleClose: () => {},
  userId: 0,
};

UserForm.propTypes = {
  handleClose: PropTypes.func,
  userId: PropTypes.number,
};

export default UserForm;
