/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
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

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import { Button } from "@mui/material";

export default function data(_rows, openEdit) {
  const User = ({ name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const rows = _rows.map((row) => ({
    user: <User name={`${row.name} ${row.lastname}`} email={`${row.email}`} />,
    address: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {row.address}
      </MDTypography>
    ),
    created: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {row.created}
      </MDTypography>
    ),
    action: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        <Button onClick={() => openEdit(row.id)}>Edit</Button>
      </MDTypography>
    ),
  }));

  return {
    columns: [
      { Header: "user", accessor: "user", width: "30%", align: "left" },
      { Header: "address", accessor: "address", width: "30%", align: "left" },
      { Header: "created", accessor: "created", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],
    rows,
  };
}
