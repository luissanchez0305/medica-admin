/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import data from "layouts/tables/data/authorsTableData";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import UserForm from "layouts/tables/userForm";
import { Button } from "@mui/material";
import db from "../../firebase";

// UserForm

function Tables() {
  const [users, setUsers] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState(0);

  const togglePopup = () => {
    setUserId(0);
    setIsOpen(!isOpen);
  };

  const openEditPopup = (id) => {
    setUserId(id);
    setIsOpen(true);
  };

  const fetchPost = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    return newData;
  };

  const getData = async () => {
    const dataObj = await fetchPost();
    const { columns: _columns, rows } = data(dataObj, openEditPopup);

    setColumns(_columns);
    setUsers(rows);
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Users
                </MDTypography>
                <div align="end">
                  <Button variant="outlined" color="success" onClick={togglePopup}>
                    New
                  </Button>
                </div>
              </MDBox>
              <MDBox pt={3}>
                {users.length === 0 && (
                  <MDTypography variant="h6" color="white">
                    Loading...
                  </MDTypography>
                )}
                {users.length > 0 && (
                  <DataTable
                    table={{ columns, rows: users }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      {isOpen && <UserForm handleClose={togglePopup} getUsers={getData} userId={userId} />}
      <Footer company={{ name: "EsferaSoluciones", href: "https://esferasoluciones.com" }} />
    </DashboardLayout>
  );
}

export default Tables;
