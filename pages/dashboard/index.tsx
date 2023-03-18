import { Row } from "react-bootstrap";
import React, { useEffect, useState, useCallback } from "react";
import moment from "moment";
import { Modal, Page, Table, Card, Map } from "@components";



const Dashboard: React.FC = () => {


  const [tableData, setTableData] = useState(null);
  const [tableLoad, setTableLoad] = useState(true);



  //load disbursement data


  return (
    <Page name={"Dashboard"}>
      <>
        <Row>
          hello
        </Row>
      </>


    </Page>
  );
};

export default Dashboard;
