import { Row } from "react-bootstrap";
import React, { useEffect, useState, useCallback } from "react";
import moment from "moment";
import { Modal, Page, Table, Card, Loader } from "@components";
import { Dropdown, Button } from "react-bootstrap";
import { accessService } from "@src/services";
import user from "../../src/data/user.json";

const Dashboard: React.FC = () => {
  // const [tableData, setTableData] = useState(null);
  const [tableLoad, setTableLoad] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [approvalModal, setApprovalModal] = useState(false);
  const [declineModal, setDeclineModal] = useState(false);

  const onPrevPage = () => {
    setCurrentPage((prevState) => prevState - 1);
  };

  const onNextPage = () => {
    setCurrentPage((prevState) => prevState + 1);
  };
  // const onChangePageLimit = (e: any) => {
  //   setLimit(e.target.value);
  // };

  const tableHeader = [
    "Name",
    "Email",
    "Phone Number",
    "Status",
    "Account",
    "Action",
  ];

  const tableRow = (data: any) => {
    return (
      <tr>
        <td>{data.name}</td>
        <td>{data.Email}</td>
        <td>{data.PhoneNumber}</td>
        <td>
          <span
            className={`border rounded px-2 py-1 d-flex w-100 text-center align-items-center justify-content-center ${
              data.status === "Approved"
                ? "blue-dot"
                : data.status === "Pending"
                ? "yellow-dot"
                : "red-dot"
            }`}
          >
            {data.status}
          </span>
        </td>
        <td>{data.account}</td>
        <td>
          <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              more
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item>
                <span
                  onClick={() => setDeclineModal(true)}
                  className="dropdown-item"
                >
                  Decline
                </span>
              </Dropdown.Item>
              <Dropdown.Item>
                <span
                  onClick={() => setApprovalModal(true)}
                  className="dropdown-item"
                >
                  Approve
                </span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    );
  };

  //load disbursement data

  return (
    <Page name={"Dashboard"}>
      <>
        <Row className="dashboard-main pr-4">
          <h6 className="mb-4 all-users-text">All Users</h6>
          <div className="col-md-4 col-6 d-flex align-items-stretch">
            <Card name={"50"} icon={"path20.png"}>
              <p className="ml-5">No. of request</p>
            </Card>
          </div>
          <div className=" col-md-4 col-6 d-flex align-items-stretch">
            <Card name={"35"} icon={"path20.png"}>
              <p className="ml-5">No. of approved users</p>
            </Card>
          </div>
          <div className="col-md-4 col-6 d-flex align-items-stretch">
            <Card name={"15"} icon={"path19.png"}>
              <p className="ml-5">No. of declined users</p>
            </Card>
          </div>
        </Row>
        <Row className="dashboard-main pr-4">
          <div className="col-12 grid-margin stretch-card">
            <Card>
              <Table
                emptyMessage="No User"
                totalPages={2}
                totalItems={50}
                currentPage={currentPage}
                loadingText={"Loading projects..."}
                rowFormat={tableRow}
                paginated={user.length > 0}
                onPrev={onPrevPage}
                onNext={onNextPage}
                data={user}
                limit={limit}
                loading={tableLoad}
                headers={tableHeader}
                // onChangePageLimit={onChangePageLimit}
              />
            </Card>
          </div>
        </Row>

        <Modal
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={approvalModal}
          size="md"
          onHide={() => {
            setApprovalModal(false);
          }}
          title={""}
        >
          <div className="d-flex align-items-center flex-column mt-n3">
            <img src={`/static/images/success.png`} alt="Success" />
            <p>Early Access successfully approved</p>
            <button className="pr-5 pl-5  button button--success">Ok</button>
          </div>
        </Modal>
        <Modal
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={declineModal}
          size="md"
          onHide={() => {
            setDeclineModal(false);
          }}
          title={""}
        >
          <div className="d-flex flex-column align-items-center mt-n3">
            <p>Are you sure you want to decline this user?</p>

            <div className="d-flex align-items-center mt-3">
              <button
                onClick={() => {
                  setDeclineModal(false);
                }}
                className="button button--cancel mr-3"
              >
                Cancel
              </button>
              <button className="button button--yes">Yes</button>
            </div>
          </div>
        </Modal>
      </>
    </Page>
  );
};

export default Dashboard;
