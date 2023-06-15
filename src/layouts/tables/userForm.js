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
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Checkbox } from "@mui/material";
import db from "../../firebase";

function UserForm({ handleClose, userId }) {
  const isEdit = userId > 0;
  const [userUID, setUserUID] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("");
  const [insurances, setInsurances] = useState([]);
  const [insurancesUsers, setInsurancesUsers] = useState([]);

  const handleSubmit = async () => {
    setStatus("Saving...");
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
    const userRef = doc(db, "users", id);
    const userSnap = await getDoc(userRef);
    // const doc = await db.collection("entries").doc(id).get();
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
              <MDBox mb={4}>{email}</MDBox>
              <MDBox mb={4}>{name}</MDBox>
              <MDBox mb={4}>{lastname}</MDBox>
              <MDBox mb={4}>{address}</MDBox>
              {insurances.map((insurance) => (
                <MDBox key={insurance.id} mb={4}>
                  <MDBox component="label" htmlFor={insurance.id} mb={1}>
                    <Checkbox
                      checked={insurance.checked}
                      onChange={handleCheckChanged}
                      id={insurance.id}
                    />

                    {insurance.name}
                  </MDBox>
                </MDBox>
              ))}
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
