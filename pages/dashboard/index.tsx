import { Form, Row } from "react-bootstrap";
import React, { useEffect, useState, useCallback } from "react";
import moment from "moment";
import { Modal, Page, Table, Card, Loader } from "@components";
import { Dropdown, Button } from "react-bootstrap";
import { accessService } from "@src/services";

const Dashboard: React.FC = () => {
  const [tableData, setTableData] = useState([]);
  const [tableLoad, setTableLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [approvalModal, setApprovalModal] = useState(false);
  const [declineModal, setDeclineModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [paginationData, setPaginationData] = useState<any>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [approveCount, setApproveCount] = useState('0')
  const [declineCount, setDeclineCount] = useState('0')

  const onPrevPage = () => {
    setCurrentPage((prevState) => prevState - 1);
  };

  const onNextPage = () => {
    setCurrentPage((prevState) => prevState + 1);
  };

  const loadTableData = (tableData: any) => {
    setTableData(tableData.data);
    setPaginationData(tableData.pagination);
    // setCurrentPage(tableData.pagination.currentPage);
    // setTotalPages(tableData?.pagination?.totalPages);
    // setResultCount(tableData.pagination?.totalDocumentCount);
    setTableLoad(false);
  };

  const getEarlyAccess = () => {
    accessService
      .getAll()
      .then((r: any) => {
        loadTableData(r);
        const approved = r.data.filter((el: any) => el.isApprovedUse)
        const declined = r.data.filter((el: any) => !el.isApprovedUse)
        setDeclineCount(declined.length.toString())
        setApproveCount(approved.length.toString())
      })
      .catch((e) => {
        console.log(e);
        setTableLoad(false);
      });
  }

  const searchData = () => {
    console.log(search, "Put a string to know what we are logging");
  };
  // const onChangePageLimit = (e: any) => {
  //   setLimit(e.target.value);
  // };
  useEffect(() => {
    const getData = setTimeout(() => {
      console.log("what you", search);
    }, 2000);

    return () => clearTimeout(getData);
  }, [search]);

  useEffect(() => {
    console.log("what you are doing", filterValue);
  }, [filterValue]);

  useEffect(() => {
    getEarlyAccess()
  }, [])

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
        <td>{data?.name || 'No name'}</td>
        <td>{data.email}</td>
        <td>{data?.PhoneNumber || 'No phone'}</td>
        <td>
          <span
            className={`border rounded px-2 py-1 bg-white d-flex w-100 text-center align-items-center justify-content-center ${data.isApprovedUse
              ? "blue-dot"
              : "red-dot"
              }`}
          >
            {data.isApprovedUse ? 'Approved' : 'Pending'}
          </span>
        </td>
        <td>{data?.account || 'Sender'}</td>
        <td>
          <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              more
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {
                data.isApprovedUse ? (

                  <Dropdown.Item>
                    <span
                      onClick={() => setDeclineModal(true)}
                      className="dropdown-item"
                    >
                      Decline
                    </span>
                  </Dropdown.Item>
                )
                  : (

                    <Dropdown.Item>
                      <span
                        onClick={() => setApprovalModal(true)}
                        className="dropdown-item"
                      >
                        Approve
                      </span>
                    </Dropdown.Item>
                  )
              }
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
          <h6 className="mb-4 mt-4 all-users-text">All Users</h6>
          <div className="col-md-4 col-6 d-flex align-items-stretch">
            <Card name={tableData.length.toString()} icon={"path20.png"}>
              <p className="ml-5">No. of request</p>
            </Card>
          </div>
          <div className=" col-md-4 col-6 d-flex align-items-stretch">
            <Card name={approveCount} icon={"path20.png"}>
              <p className="ml-5">No. of approved users</p>
            </Card>
          </div>
          <div className="col-md-4 col-6 d-flex align-items-stretch">
            <Card name={declineCount} icon={"path19.png"}>
              <p className="ml-5">No. of declined users</p>
            </Card>
          </div>
        </Row>
        <Row className="dashboard-main pr-4">
          <div className="col-12">
            <Card>
              <div className="d-flex align-items-center my-3">
                {/* <div className="form-group mb-0 position-relative"> */}
                <Form.Select
                  aria-label="Default select example"
                  className="dropdown-filter border"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                >
                  <option value={''}>select an account type</option>
                  <option value="sender">Sender</option>
                  <option value="reciever">Reciever</option>
                </Form.Select>

                <div className="position-relative ml-3 d-flex align-items-center border rounded search-props ">
                  <span className="btn btn-sm input-group-append">
                    <i className="mdi mdi-magnify icon-search" />
                  </span>
                  <input
                    onChange={(e) => setSearch(e.target.value)}
                    type="text"
                    className="no-border form-input-field input-width pl-0 search-props"
                    placeholder="Search for user, email address"
                    value={search}
                  />
                </div>
                {/* </div> */}
              </div>
            </Card>
          </div>

          <div className="col-12 grid-margin stretch-card">
            <Card>
              <Table
                emptyMessage="No User"
                totalPages={totalPages}
                totalItems={tableData.length}
                currentPage={currentPage}
                loadingText={"Loading Users..."}
                rowFormat={tableRow}
                paginated={tableData.length > 0}
                onPrev={onPrevPage}
                onNext={onNextPage}
                data={tableData}
                limit={tableData.length}
                loading={tableLoad}
                headers={tableHeader}
              // onChangePageLimit={onChangePageLimit}
              />
            </Card>
          </div>
        </Row>

        <Modal
          aria-labelledby="contained-modal-title-vcenter"
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
