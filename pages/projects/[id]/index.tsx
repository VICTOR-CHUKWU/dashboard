import { Page, Modal, Card, Loader } from "@components";
import { SVGIcon } from "@components/shared";
import { useRouter } from "next/router";
import {
  useState,
  useEffect,
  useRef,
  RefObject,
  useContext,
  useCallback,
} from "react";
import { Col, Row } from "react-bootstrap";
import S from "./index.module.scss";
import { projectService } from "@services";
import { getUrlParam } from "@src/utils";
import moment from "moment";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import { errorToast, successToast } from "@src/utils/toaster";
import { AuthContext } from "pages/_app";

const ProjectDetails: React.FC = () => {
  const router = useRouter();
  const [showReportScreen, setShowReportScreen] = useState(false);
  const [showSingleImageModal, setShowSingleImageModal] = useState(false);
  const [showImagesModal, setShowImagesModal] = useState(false);
  const [modalLoad, setModalLoad] = useState(false);
  const [showApproveProjectModal, setShowApproveProjectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [uid, setUid] = useState(getUrlParam());
  const [data, setData] = useState<any>(null);
  const [pageLoad, setPageLoad] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [projectWorkplanReportList, setProjectWorkplanReportList] =
    useState<any>([]);
  const [workplans, setWorkplans] = useState<any>(null);
  const [report, setReport] = useState<any>([]);
  const [reportList, setReportList] = useState<any>([]);
  const [currentImage, setCurrentImage] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState<any>(null);
  const [canApprove, setCanApprove] = useState(false);
  const { dispatch, state: authState } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (authState.user?.role == "superadmin" || authState.user?.role == "admin")
      setIsAdmin(true);
  }, [authState]);

  //load page
  useEffect(() => {
    loadPage();
  }, [uid]);

  const loadProjectDetails = () => {
    projectService
      .getProject(uid)
      .then((r: any) => {
        setData(r.data[0]);
        setPageLoad(false);
      })
      .catch((e) => {
        console.log(e);
        setPageLoad(false);
      });
  };

  const loadPage = () => {
    setCanApprove(false);
    setPageLoad(true);

    projectService
      .getProjectWorkplanList(uid)
      .then((r: any) => {
        setWorkplans(r.data);
        checkApproval(r.data);
        computeStatus(r.data);
      })
      .catch((e) => {
        console.log(e);
      });

    projectService
      .getProjectReports(uid)
      .then((r: any) => {
        if (r.data.length > 0) {
          setData(r.data[0]);
          setProjectWorkplanReportList(r.data);
          setPageLoad(false);
        } else {
          loadProjectDetails();
        }
      })
      .catch((e) => {
        console.log(e);
        setPageLoad(false);
      });
  };

  //actions
  const checkApproval = (data: any) => {
    let pendingApproval = data.filter(
      (record: any) => record?.status != "accepted"
    );
    console.log(pendingApproval);
    if (pendingApproval.length == 0) setCanApprove(true);
  };
  const computeDuration = (startDate: any, endDate: any) => {
    endDate = new Date(endDate);
    startDate = new Date(startDate);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7) {
      return diffDays + "day(s)";
    } else if (diffDays >= 7 && diffDays < 30)
      return Math.ceil(diffDays / 7) + "week(s)";
    else {
      let diffMonth = Math.floor(diffDays / 30);

      return diffMonth + " month(s)";
    }
  };

  const computeCost = (cost: any) => {
    var formatter = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    });
    return formatter.format(cost);
  };

  const computeStatus = (input: any) => {
    let pendingApproval = input.filter(
      (record: any) => record?.status != "accepted"
    );
    let totalWorkItems = input.length;
    let theStatus: any =
      ((totalWorkItems - pendingApproval.length) / totalWorkItems) * 100;
    theStatus = theStatus.toString();
    theStatus = theStatus.length > 6 ? theStatus.substring(0, 5) : theStatus;
    setStatus(theStatus);
  };

  const handleRenderReportList = (reportRecord: any, i: any) => {
    console.log(reportRecord);
    return (
      <>
        <li key={i}>{reportRecord}</li>
      </>
    );
  };

  // actions
  const showReport = (selectedReport: any) => {
    setShowReportScreen(false);
    setReport(null);
    let cReport = projectWorkplanReportList
      .filter((item: any) => item.workplanId == selectedReport?._id)
      .sort(
        (a: any, b: any) => Date.parse(a.createdAt) - Date.parse(b.createdAt)
      );
    setReportList(cReport);
    setReport(cReport[0]);
    setShowReportScreen(true);
  };

  const showImage = (image: any, displayType: string) => {
    if (displayType == "single") {
      setCurrentImage(image);
      setShowSingleImageModal(true);
      //set current image id to show
    } else {
      setShowImagesModal(true);
    }
  };

  const onApproveWorkplan = () => {
    let approvePayload = {
      workplanId: report?.workplan?._id,
      status: "accepted",
      statusReason: "valid",
    };
    setModalLoad(true);
    projectService
      .approveWorkplan(approvePayload)
      .then(() => {
        setModalLoad(false);
        loadPage();
        setShowApproveModal(false);

        successToast("workplan approved successfully!");
      })
      .catch((e) => {
        console.log(e);
        setModalLoad(false);
        errorToast(e.data.errors[0].message || e.statusText);
      });
  };

  const onRejectWorkplan = () => {
    //validation
    if (!rejectReason) {
      let message = "Kindly fill all required fields!";
      setErrorMessage(message);
      errorToast(message);
      return;
    }

    let rejectPayload = {
      workplanId: report?.workplan?._id,
      status: "rejected",
      statusReason: rejectReason,
    };
    setModalLoad(true);
    projectService
      .approveWorkplan(rejectPayload)
      .then(() => {
        setModalLoad(false);
        loadPage();
        setShowRejectModal(false);

        successToast("workplan rejected successfully!");
      })
      .catch((e) => {
        console.log(e);
        setModalLoad(false);
        errorToast(e.data.errors[0].message || e.statusText);
      });
  };

  const onApproveProject = () => {
    let approvePayload = {
      projectId: data?.project?._id,
      status: "completed",
    };
    setModalLoad(true);
    projectService
      .approveProject(approvePayload)
      .then(() => {
        setModalLoad(false);
        loadPage();
        setShowApproveProjectModal(false);
        successToast("project approved successfully!");
      })
      .catch((e) => {
        console.log(e);
        setModalLoad(false);
        errorToast(e.data.errors[0].message || e.statusText);
      });
  };

  // screens
  const SingleImageScreen = () => {
    const printRef = useRef<HTMLElement>(null);

    const handlePrint = useReactToPrint({
      content: () => printRef.current,
    });
    let cLat = "";
    let geolocation = report?.geoLocation.split(",");
    let latitide = geolocation[geolocation.length - 2];
    let longitude = geolocation[geolocation.length - 1];

    return (
      <div className="p-2">
        {currentImage && (
          <section ref={printRef} className={`${S.singleImageContainer}`}>
            <div className={`${S.imageContainer}`}>
              <img src={currentImage?.imageLink} />
            </div>
            <div className={`${S.imageMetadata} mt-2`}>
              <p>
                <SVGIcon name="location" className="mr-1" />
                <br /> {geolocation[0]}
              </p>
              <p>
                (LAT)
                <br />
                {latitide}
              </p>
              <p>
                (LONG)
                <br />
                {longitude}
              </p>
              <p>
                Project Location: <br />
                {report?.project?.location}
              </p>
              <p>
                <SVGIcon name="calender" className="mr-1" />
                <br />
                {moment(data?.createdAt).format(" MMM Do, YYYY")}
              </p>
              <p>
                <SVGIcon name="time" className="mr-1" />
                <br />
                {moment(data?.createdAt).format(" h:mm:ss a")}
              </p>
            </div>

            <div>
              <h4>Description</h4>
              <p>{currentImage?.imageDescription}</p>
            </div>
          </section>
        )}
        <button className="btn btn-primary" onClick={handlePrint}>
          download as pdf
        </button>
      </div>
    );
  };

  const AllImagesScreen = () => {
    return (
      <div className={`${S.allImagesContainer}`}>
        {report?.images &&
          report?.images.map((image: any) => (
            <div className={`${S.imageContainer}`}>
              <img
                onClick={() => {
                  showImage(image, "single");
                }}
                src={image?.imageLink}
                alt="report-image"
              />
            </div>
          ))}
      </div>
    );
  };
  const ApproveProjectPrompt = () => {
    return (
      <div className="row px-3 my-3 text-center justify-content-center">
        <p>
          You are about to approve the project: <br />
          <b>{report?.project?.name}</b>
        </p>
        <p>Are you sure you want to take this action?</p>
        <div className="d-flex justify-content-between col-md-8">
          <button
            type="button"
            onClick={() => setShowApproveProjectModal(false)}
            className="btn btn-outline-danger action-btn"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onApproveProject()}
            className="btn btn-success mr-1 action-btn"
          >
            {modalLoad ? "Loading..." : "Approve"}
          </button>
        </div>
      </div>
    );
  };

  const ApprovalPrompt = () => {
    return (
      <div className="row px-3 my-3 text-center justify-content-center">
        <p>
          You are about to approve the activity: <br />
          <b>{report?.workplan?.name}</b>
        </p>
        <p>Are you sure you want to take this action?</p>
        <div className="d-flex justify-content-between col-md-8">
          <button
            type="button"
            onClick={() => setShowApproveModal(false)}
            className="btn btn-outline-danger action-btn"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onApproveWorkplan()}
            className="btn btn-success mr-1 action-btn"
          >
            {modalLoad ? "Loading..." : "Approve"}
          </button>
        </div>
      </div>
    );
  };

  const ReportScreen = () => {
    return (
      <div className={`${S.reportContainer}`}>
        {report && (
          <>
            <div className={`${S.reportHeader}`}>
              <div>
                {isAdmin && (
                  <>
                    <a
                      onClick={() => {
                        setErrorMessage(null);
                        setShowApproveModal(true);
                      }}
                      className={`success-btn`}
                    >
                      Approve activity
                    </a>
                    <SVGIcon name="line" className="mx-2" />
                    <a
                      onClick={() => {
                        setErrorMessage(null);
                        setShowRejectModal(true);
                      }}
                      className="failure-btn"
                    >
                      Reject activity
                    </a>
                  </>
                )}
              </div>
              <div
                className=""
                onClick={() => {
                  setReport(null);
                  setShowReportScreen(false);
                }}
              >
                <SVGIcon name="close-btn" className="close-btn" size="tiny" />
              </div>
            </div>

            {reportList &&
              reportList.map((currentReport: any, i: any) => {
                return (
                  <>
                    <h3>Report {i + 1}</h3>
                    <div className={`${S.reportBody}`}>
                      <h5>Image(s) Upload</h5>
                      <hr />
                      <div className={`${S.reportImgGrid}`}>
                        {currentReport?.images &&
                          currentReport?.images
                            .slice(0, 4)
                            .map((image: any) => (
                              <div className={`${S.imageContainer}`}>
                                <img
                                  onClick={() => {
                                    showImage(image, "single");
                                  }}
                                  src={image?.imageLink}
                                  alt="report-image"
                                />
                              </div>
                            ))}
                      </div>
                      {currentReport?.images &&
                        currentReport?.images.length > 1 && (
                          <a
                            className="btn btn-outline-primary my-3 action-btn"
                            onClick={() => {
                              showImage(1, "multiple");
                            }}
                          >
                            View all
                          </a>
                        )}

                      <h5>Video Upload</h5>
                      <hr />
                      <div className={`${S.reportVideo}`}>
                        {currentReport?.videoLink && (
                          <div className={`${S.imageContainer}`}>
                            <video width="100%" height="240" controls>
                              <source
                                src={currentReport?.videoLink}
                                type="video/mp4"
                              />
                            </video>
                          </div>
                        )}
                      </div>

                      <div>
                        <h4>Comment</h4>
                        <div className={`${S.commentContainer}`}>
                          <p>{currentReport?.comment}</p>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
          </>
        )}
      </div>
    );
  };
  return (
    <Page name={"Project Details"}>
      <div
        onClick={() => router.back()}
        className="d-grid gap-2 align-items-start"
      >
        <div className={`back-btn theme-secondary p-1 `}>
          <SVGIcon name="back-arrow" className="ml-3 mr-2" />
          Back
        </div>
      </div>
      {pageLoad ? (
        <Card name={""}>
          <div className={"col-lg-12"}>
            <Loader text={"Loading Report"} />
          </div>
        </Card>
      ) : (
        <Row className={`${S.contentContainer}`}>
          {data && (
            <Col md={7} sm={12} className={`${S.mainContentContainer}`}>
              <div className=" p-3">
                <div>
                  <h2>{data?.project?.name || data?.name}</h2>
                  <div className="d-flex ml-3 font-weight-bold">
                    <p className="secondary-content mr-4">
                      <SVGIcon name="location" className="mr-2" />
                      {data?.project?.location || data?.location}
                    </p>
                    {status ? (
                      <p>
                        Progress:
                        <span className="ml-2 mr-1 font-bolder">
                          {status}% Completed
                        </span>
                      </p>
                    ) : (
                      <div>Status: Report(s) pending</div>
                    )}
                  </div>
                </div>

                <div className={`${S.metadataContainer}`}>
                  <div className={`${S.metadata}`}>
                    <p>
                      <SVGIcon name="calender" className="mr-2" />
                      Created Date
                    </p>
                    <strong>
                      {moment(
                        data?.project?.createdAt || data?.createdAt
                      ).format(" MMM Do, YYYY")}
                    </strong>
                  </div>
                  <div className={`${S.metadata}`}>
                    <p>
                      <SVGIcon name="calender" className="mr-2" />
                      Start Date
                    </p>
                    <strong>
                      {moment(
                        data?.project?.startDate || data?.startDate
                      ).format(" MMM Do, YYYY")}
                    </strong>
                  </div>
                  <div className={`${S.metadata}`}>
                    <p>
                      <SVGIcon name="calender" className="mr-2" />
                      Duration
                    </p>
                    <strong>
                      {computeDuration(
                        data?.project?.startDate || data?.startDate,
                        data?.project?.endDate || data?.endDate
                      )}
                    </strong>
                  </div>
                  <div className={`${S.metadata}`}>
                    <p>
                      <SVGIcon name="calender" className="mr-2" />
                      End Date
                    </p>
                    <strong>
                      {moment(data?.project?.endDate || data?.endDate).format(
                        " MMM Do, YYYY"
                      )}
                    </strong>
                  </div>
                </div>
                <div className={`${S.metadataContainer}`}>
                  <div className={`${S.metadata}`}>
                    <p>Contractor</p>
                    <strong>{data?.contractor?.name}</strong>
                  </div>
                  <div className={`${S.metadata}`}>
                    <p>Contract Sum</p>
                    <strong>
                      {computeCost(data?.project?.cost || data?.cost)}
                    </strong>
                  </div>
                  <div className={`${S.metadata}`}>
                    <p> Disbursed</p>
                    <strong>
                      {computeCost(data?.project?.disbursed || data?.disbursed)}
                    </strong>
                  </div>
                  <div className={`${S.metadata}`}>
                    <p>Balance</p>
                    <strong>
                      {computeCost(
                        (data?.project?.cost || data?.cost) -
                          (data?.project?.disbursed || data?.disbursed)
                      )}
                    </strong>
                  </div>
                </div>
              </div>

              {/* workplan section */}
              <div className="d-flex justify-content-between px-3">
                <div>
                  <b className="h4 mr-2">Activities</b>
                  <span>Project Status: </span>
                  {data?.project?.status == "awaiting report" && (
                    <label className="badge badge-secondary">
                      Awaiting Report
                    </label>
                  )}
                  {data?.project?.status == "pending" && (
                    <label className="badge badge-warning">Pending</label>
                  )}
                  {data?.project?.status == "completed" && (
                    <label className="badge badge-success">Approved</label>
                  )}
                  {data?.project?.status == "overdue" && (
                    <label className="badge badge-danger">Delaying</label>
                  )}
                </div>

                {isAdmin && (
                  <a
                    className={` ${S.approveBtn} ${
                      canApprove
                        ? "btn-success"
                        : `disabled btn-secondary action-btn  `
                    } btn action-btn `}
                    onClick={() => {
                      if (canApprove) setShowApproveProjectModal(true);
                    }}
                  >
                    Approve Project
                  </a>
                )}
              </div>
              {workplans && workplans.length <= 0 ? (
                <Card name={""}>
                  <div className={"col-lg-12"}>no workplans reported</div>
                </Card>
              ) : (
                workplans &&
                workplans
                  .sort(
                    (a: any, b: any) =>
                      Date.parse(a.createdAt) - Date.parse(b.createdAt)
                  )
                  .map((workplan: any) => {
                    return (
                      <div
                        key={workplan?._id}
                        className={`${S.workplanContainer}`}
                      >
                        <div className={`${S.workplan} `}>
                          {/* project status */}
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <div className="d-flex">
                              <div className="mr-3 text-bolder d-flex">
                                {workplan?.name}
                              </div>
                              <span className="">
                                {workplan?.status == "delayed" && (
                                  <>
                                    <label className="badge badge-danger">
                                      delayed
                                    </label>
                                  </>
                                )}
                                {workplan?.status == "awaiting report" && (
                                  <label className="badge badge-secondary">
                                    Awaiting Report
                                  </label>
                                )}
                                {workplan?.status == "pending" && (
                                  <label className="badge badge-warning">
                                    Pending
                                  </label>
                                )}
                                {workplan?.status == "accepted" && (
                                  <span>
                                    <SVGIcon
                                      name="approved"
                                      className="ml-2 mr-2"
                                    />
                                    Approved
                                  </span>
                                )}
                                {workplan?.status == "rejected" &&
                                  !workplan?.isCompleted(
                                    <span>
                                      <SVGIcon
                                        name="rejected"
                                        className="ml-2  mr-2"
                                      />
                                      Rejected
                                    </span>
                                  )}
                              </span>
                            </div>
                            <div>
                              <span>
                                {workplan?.isCompleted && (
                                  <div className="d-flex  badge badge-success text-arrow justify-content-end flex-end">
                                    Completed
                                  </div>
                                )}
                              </span>
                            </div>
                          </div>

                          {/* project workplans reports*/}
                          <div className={`${S.workplanItems}`}>
                            <ul>
                              {projectWorkplanReportList &&
                                projectWorkplanReportList.map(
                                  (reportRecords: any) => {
                                    if (
                                      workplan?._id == reportRecords.workplanId
                                    ) {
                                      if (reportRecords.details.includes(",")) {
                                        return reportRecords?.details
                                          .replaceAll(`"`, "")
                                          .replaceAll("[", "")
                                          .replaceAll("]", "")
                                          .split(",")
                                          .map((item: any, index: number) => {
                                            console.log(item);
                                            return <li>{item}</li>;
                                          });
                                      } else {
                                        return (
                                          <li>
                                            {reportRecords?.details
                                              .replaceAll(`"`, "")
                                              .replaceAll("\\n", "")
                                              .replaceAll("[", "")
                                              .replaceAll("]", "")}
                                          </li>
                                        );
                                      }
                                    }
                                  }
                                )}
                            </ul>
                          </div>

                          <div className="d-flex  justify-content-between mt-2">
                            <div className="h6">
                              <div>
                                {moment(workplan?.startDate).format(
                                  " MMM Do, YYYY"
                                )}
                                -
                                {moment(workplan?.endDate).format(
                                  " MMM Do, YYYY"
                                )}
                              </div>
                            </div>
                            <a
                              onClick={() => {
                                showReport(workplan);
                              }}
                              className={`success-btn`}
                            >
                              View Report
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })

                // projectWorkplanReportList
                //   .sort(
                //     (a: any, b: any) =>
                //       Date.parse(a.createdAt) - Date.parse(b.createdAt)
                //   )
                //   .map((reportData: any) => (
                //     <div className={`${S.workplanContainer}`}>
                //       <div key={reportData?._id} className={`${S.workplan}`}>
                //         <div>
                //           <span className="mr-3">
                //             {reportData?.workplan?.name}
                //           </span>
                //           <span>
                //             {reportData?.workplan?.status == "pending" && (
                //               <label className="badge badge-warning">
                //                 Pending
                //               </label>
                //             )}
                //             {reportData?.workplan?.status == "accepted" && (
                //               <span>
                //                 <SVGIcon
                //                   name="approved"
                //                   className="ml-2 mr-2"
                //                 />
                //                 Approved
                //               </span>
                //             )}
                //             {reportData?.workplan?.status == "rejected" && (
                //               <span>
                //                 <SVGIcon
                //                   name="rejected"
                //                   className="ml-2  mr-2"
                //                 />
                //                 Rejected
                //               </span>
                //             )}
                //           </span>
                //         </div>

                //         <div className={`${S.workplanItems}`}>
                //           <ul>
                //             {reportData?.details &&
                //               reportData.details
                //                 .replaceAll(`"`, "")
                //                 .replaceAll("[", "")
                //                 .replaceAll("]", "")
                //                 .split(",")

                //                 .map((detail: any) => <li>{detail}</li>)}
                //           </ul>
                //         </div>

                //         <div className="d-flex align-items-end align-self-end justify-content-end mt-2">
                //           <a
                //             onClick={() => {
                //               showReport(reportData);
                //             }}
                //             className={`success-btn`}
                //           >
                //             View Report
                //           </a>
                //         </div>
                //       </div>
                //     </div>
                //   ))
              )}
            </Col>
          )}
          <Col md={5} sm={12}>
            {showReportScreen && <ReportScreen />}
          </Col>
        </Row>
      )}

      {/* this is the single image modal */}
      <Modal
        show={showSingleImageModal}
        size="lg"
        onHide={() => {
          setShowSingleImageModal(false);
        }}
        title={""}
      >
        <SingleImageScreen />
      </Modal>

      {/* this is the multiple image modal */}
      <Modal
        show={showImagesModal}
        size="lg"
        onHide={() => {
          setShowImagesModal(false);
        }}
        title={""}
      >
        <AllImagesScreen />
      </Modal>

      {/* this is the project approval modal */}
      <Modal
        show={showApproveProjectModal}
        size="md"
        onHide={() => {
          setShowApproveProjectModal(false);
        }}
        title={"Approve Project"}
      >
        <ApproveProjectPrompt />
      </Modal>

      {/* this is the workplan approval modal */}
      <Modal
        show={showApproveModal}
        size="md"
        onHide={() => {
          setShowApproveModal(false);
        }}
        title={"Approve Workplan"}
      >
        <ApprovalPrompt />
      </Modal>

      {/* this is the workplan reject modal */}
      <Modal
        show={showRejectModal}
        size="md"
        onHide={() => {
          setShowRejectModal(false);
        }}
        title={"Reject Workplan"}
      >
        <div className="row px-3 my-3  justify-content-center">
          <p className="text-center">
            You are about to reject the activity: <br />
            <b>{report?.workplan?.name}</b>{" "}
          </p>
          <h5>Description</h5>
          <textarea
            className={`${S.descriptionBox} form-control mb-3 mx-3`}
            placeholder="why the workplan is rejected"
            onChange={(e) => {
              setRejectReason(e.currentTarget.value);
            }}
            required
          ></textarea>
          {/* display error message */}
          {errorMessage && (
            <span className=" text-black text-danger">{errorMessage}</span>
          )}
          <div className="d-flex justify-content-between col-md-8">
            <button
              type="button"
              onClick={() => setShowRejectModal(false)}
              className="btn btn-outline-danger action-btn"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onRejectWorkplan()}
              className="btn btn-danger mr-1 action-btn"
            >
              {modalLoad ? "Loading..." : "Reject"}
            </button>
          </div>
        </div>
      </Modal>
    </Page>
  );
};

export default ProjectDetails;
