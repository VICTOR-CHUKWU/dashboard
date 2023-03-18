import { Page, Card, Table, Loader, Modal } from "@components";
import React, { useState, useEffect, useContext } from "react";
import { Row, Tab, Tabs } from "react-bootstrap";
import { Dropdown } from "react-bootstrap";
import { SVGIcon } from "@components/shared";
import { useRouter } from "next/router";
import { projectService, discoService, userService } from "@services";
import { errorToast, successToast } from "@src/utils/toaster";
import moment from "moment";
import S from "./index.module.scss";
import { downloadJsonAsCsv } from "@src/utils";
import { AuthContext } from "pages/_app";

const initialState = {
  name: "",
};

const initialWorkplanState = {
  name: "",
  startDate: "",
  endDate: "",
};

const projectInitialState = {
  name: "",
  location: "",
  landmark: "",
  categoryId: "",
  discoId: "",
  startDate: "",
  endDate: "",
  cost: "",
  contractorId: null,
  expectedImpact: "",
  status: "pending",
};
const Projects: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tableLoad, setTableLoad] = useState(true);
  const [data, setData] = useState<any>(null);
  const [records, setRecords] = useState<any>(null);
  const [modalLoad, setModalLoad] = React.useState(false);
  const [paginationData, setPaginationData] = useState<any>(null);
  const [resultCount, setResultCount] = useState(null);
  const [errorMessage, setErrorMessage] = useState<any>(null);

  const [initialLoad, setInitialLoad] = useState(true);
  const [header, setHeader] = useState("All Projects");

  const [categoryList, setCategoryList] = useState<any>([]);
  const [discoList, setDiscoList] = useState<any>([]);
  const [contractorList, setContractorList] = useState<any>([]);
  const [projectWorkplanList, setProjectWorkplanList] = useState<any>([]);

  const [currentStatusTab, setCurrentStatusTab] = useState("all");
  const [currentCategory, setCurrentCategory] = useState<any>(null);
  const [currentDisco, setCurrentDisco] = useState<any>(null);

  const [createProjectModal, setCreateProjectModal] = useState(false);
  const [createCategoryModal, setCreateCategoryModal] = useState(false);
  const [updateCategoryModal, setUpdateCategoryModal] = useState(false);
  const [showaddWorkplanModal, setShowAddWorkplanModal] = useState(false);
  const [showUpdateWorkplanModal, setShowUpdateWorkplanModal] = useState(false);

  const [projectUpdateData, setProjectUpdateData] = useState<any>(null);
  const [updateCategoryData, setUpdateCategoryData] = useState<any>(null);
  const [projectData, setProjectData] = useState<any>(null);
  const [workplanData, setWorkplanData] = useState<any>(null);
  const [updateCategoryForm, setUpdateCategoryForm] = useState(initialState);
  const [updateWorkplanForm, setUpdateWorkplanForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });

  const [createCategoryForm, setCreateCategoryForm] = useState(initialState);
  const [createProjectForm, setCreateProjectForm] =
    useState(projectInitialState);
  const [createWorkplanForm, setCreateWorkplanForm] =
    useState(initialWorkplanState);

  const [updateWorkplanErrorMsg, setUpdateWorkplanErrorMsg] = useState(null);
  const [updateCategoryErrorMsg, setUpdateCategoryErrorMsg] = useState(null);
  const { dispatch, state: authState } = useContext(AuthContext);

  useEffect(() => {
    if (authState.user?.role == "superadmin" || authState.user?.role == "admin")
      setIsAdmin(true);
  }, [authState]);

  //load page
  useEffect(() => {
    loadPage(currentPage, currentStatusTab);
  }, [currentPage]);

  useEffect(() => {
    loadPage(1, currentStatusTab);
  }, [limit]);

  //initial loads
  const loadCategoryList = () => {
    projectService
      .getCategoryList()
      .then((r: any) => {
        setCategoryList(r.data);
        setTableLoad(false);
      })
      .catch((e) => {
        console.log(e);
        setTableLoad(false);
      });
  };

  const loadDiscoList = () => {
    discoService
      .getDicoList()
      .then((r: any) => {
        setDiscoList(r.data);
        setTableLoad(false);
      })
      .catch((e) => {
        console.log(e);
        setTableLoad(false);
      });
  };

  const loadContractorList = () => {
    userService
      .getContractors()
      .then((r: any) => {
        setContractorList(r.data);
        setTableLoad(false);
      })
      .catch((e) => {
        console.log(e);
        setTableLoad(false);
      });
  };

  const loadProjectWorkplanList = (projectId: any) => {
    projectService
      .getProjectWorkplanList(projectId)
      .then((r: any) => {
        setProjectWorkplanList(r.data);
        setTableLoad(false);
      })
      .catch((e) => {
        console.log(e);
        setTableLoad(false);
      });
  };

  const loadPage = (page: any, statusTab?: any) => {
    setTableLoad(true);
    if (categoryList.length < 1) loadCategoryList();
    if (discoList.length < 1) loadDiscoList();
    if (contractorList.length < 1) loadContractorList();

    projectService
      .getAll()
      .then((r: any) => {
        setRecords(r.data);
      })
      .catch((e) => {
        console.log(e);
      });

    if (initialLoad || statusTab == "all") {
      projectService
        .getAll(limit, parseInt(page))
        .then((r: any) => {
          loadTableData(r);
          setInitialLoad(false);
        })
        .catch((e) => {
          console.log(e);
          setTableLoad(false);
        });
    } else {
      //reference status tab for paginated api call
      if (currentStatusTab != undefined) {
        setCurrentStatusTab(statusTab);

        projectService
          .getByStatus(statusTab, limit, page)
          .then((r: any) => {
            loadTableData(r);
          })
          .catch((e) => {
            console.log(e);
            setTableLoad(false);
            setData(null);
            setPaginationData(null);
          });
      }
    }
  };

  //pagination
  const onPrevPage = () => {
    setCurrentPage((prevState) => prevState - 1);
  };

  const onNextPage = () => {
    setCurrentPage((prevState) => prevState + 1);
  };
  const onChangePageLimit = (e: any) => {
    setLimit(e.target.value);
  };

  //form actions

  //create workplan
  const onCreateWorkplanFormChange = (e: any) => {
    const { name, value } = e.target;
    setCreateWorkplanForm((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onCreateWorkplan = (e: any) => {
    setErrorMessage(null);
    e.preventDefault();

    const { name, startDate, endDate } = createWorkplanForm;

    //validations
    if (!name || !startDate || !endDate) {
      let message = "Kindly fill all required fields!";
      setErrorMessage(message);
      errorToast(message);
      return;
    }

    setModalLoad(true);
    projectService
      .createWorkplan({
        projectId: projectData?._id,
        ...createWorkplanForm,
      })
      .then(() => {
        setModalLoad(false);
        successToast("workplan added successfully!");
        loadProjectWorkplanList(projectData._id);
        loadPage(1, "all");
      })
      .catch((e) => {
        console.log(e);
        setModalLoad(false);
        setErrorMessage(e.data.errors[0].message || e.statusText);
        errorToast(e.data.errors[0].message || e.statusText);
      });
  };

  //create category
  const onCreateCategoryFormChange = (e: any) => {
    const { name, value } = e.target;
    setCreateCategoryForm((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onCreateCategory = (e: any) => {
    setErrorMessage(null);
    e.preventDefault();
    const { name } = createCategoryForm;

    //validations
    if (!name) {
      let message = "Kindly fill all required fields!";
      setErrorMessage(message);
      errorToast(message);
      return;
    }

    setModalLoad(true);
    projectService
      .createCategory({
        ...createCategoryForm,
      })
      .then(() => {
        setModalLoad(false);
        successToast("category created successfully!");
        loadCategoryList();
        loadPage(1, "all");
      })
      .catch((e) => {
        console.log(e);
        setModalLoad(false);
        setErrorMessage(e.data.errors[0].message || e.statusText);
        errorToast(e.data.errors[0].message || e.statusText);
      });
  };

  //create project

  //input validation
  const checkNumeric = (e: any) => {
    console.log(e.keyCode);
    let isValid =
      (e.keyCode >= 48 && e.keyCode <= 57) ||
      e.keyCode == 46 || //allow fullstop
      e.keyCode == 8 || //alllow backspace
      e.keyCode == 37 || //back arrow
      e.keyCode == 39 || //front arrow
      e.keyCode == 17 || //v
      e.keyCode == 86 || //ctrl
      e.keyCode == 190;
    if (!isValid) e.preventDefault();
    return (e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode == 46;
  };

  const formatCurrency = (e: any) => {
    if (
      e.keyCode == 37 ||
      e.keyCode == 38 ||
      e.keyCode == 39 ||
      e.keyCode == 40
    ) {
      return;
    }

    var val = e.target.value;

    val = val.replace(/,/g, "");
    e.target.value = "";
    val += "";
    let x = val.split(".");
    let x1 = x[0];
    let x2 = x.length > 1 ? "." + x[1] : "";

    var rgx = /(\d+)(\d{3})/;

    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, "$1" + "," + "$2");
    }

    e.target.value = x1 + x2;
  };

  const onCreateProjectFormChange = (e: any) => {
    const { name, value } = e.target;
    setCreateProjectForm((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onCreateProject = (e: any) => {
    setErrorMessage(null);
    e.preventDefault();

    const {
      name,
      location,
      landmark,
      categoryId,
      discoId,
      startDate,
      endDate,
      cost,
      expectedImpact,
      status,
    } = createProjectForm;

    //validations
    if (
      !name ||
      !location ||
      !landmark ||
      !categoryId ||
      !discoId ||
      !startDate ||
      !endDate ||
      !cost ||
      !expectedImpact ||
      !status
    ) {
      let message = "Kindly fill all required fields!";
      setErrorMessage(message);
      errorToast(message);
      return;
    }

    let strippedCost = createProjectForm.cost.replaceAll(",", "");
    createProjectForm.cost = strippedCost;

    if (projectUpdateData == null) {
      projectService
        .createProject({
          ...createProjectForm,
        })
        .then(() => {
          setModalLoad(false);
          successToast("project created successfully!");
          setCreateProjectModal(false);
          setCreateProjectForm(projectInitialState);
          loadPage(1, "all");
        })
        .catch((e) => {
          console.log(e);
          setModalLoad(false);
          setErrorMessage(e.data.errors[0].message || e.statusText);
          errorToast(e.data.errors[0].message || e.statusText);
        });
    } else {
      projectService
        .upDateProject({
          projectId: projectUpdateData._id,
          ...createProjectForm,
        })
        .then(() => {
          setModalLoad(false);
          successToast("project updated successfully!");
          setCreateProjectModal(false);
          loadPage(1, "all");
        })
        .catch((e) => {
          console.log(e);
          setModalLoad(false);
          setErrorMessage(e.data.errors[0].message || e.statusText);
          errorToast(e.data.errors[0].message || e.statusText);
        });
    }
  };

  //update category
  const onUpdateCategoryFormChange = (e: any) => {
    const { name, value } = e.target;
    setUpdateCategoryForm((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onUpdateCategory = (e: any) => {
    setErrorMessage(null);
    e.preventDefault();

    const { name } = updateCategoryForm;

    //validations
    if (!name) {
      let message = "Kindly fill all required fields!";
      setErrorMessage(message);
      errorToast(message);
      return;
    }

    setModalLoad(true);
    projectService
      .upDateCategory({
        categoryId: updateCategoryData?._id,
        ...updateCategoryForm,
      })
      .then(() => {
        setModalLoad(false);
        successToast("category created successfully!");
        setUpdateCategoryModal(false);
        loadCategoryList();
        loadPage(1, "all");
      })
      .catch((e) => {
        console.log(e);
        setModalLoad(false);
        setUpdateCategoryErrorMsg(e.data.errors[0].message || e.statusText);
        errorToast(e.data.errors[0].message || e.statusText);
      });
  };

  //update workplan
  const onUpdateWorkplanFormChange = (e: any) => {
    const { name, value } = e.target;
    setUpdateWorkplanForm((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onUpdateWorkplan = (e: any) => {
    setErrorMessage(null);
    setUpdateWorkplanErrorMsg(null);
    e.preventDefault();

    const { name, startDate, endDate } = updateWorkplanForm;

    //validations
    if (!name || !startDate || !endDate) {
      let message = "Kindly fill all required fields!";
      setErrorMessage(message);
      errorToast(message);
      return;
    }
    setModalLoad(true);
    projectService
      .upDateWorkplan({
        workplanId: workplanData?._id,
        ...updateWorkplanForm,
      })
      .then(() => {
        setModalLoad(false);
        successToast("category updated successfully!");
        setShowUpdateWorkplanModal(false);
        loadProjectWorkplanList(projectData._id);
        loadPage(1, "all");
      })
      .catch((e) => {
        console.log(e);
        setModalLoad(false);
        setUpdateWorkplanErrorMsg(e.data.errors[0].message || e.statusText);
        errorToast(e.data.errors[0].message || e.statusText);
      });
  };

  //modals

  //misc actions
  const computeDuration = (startDate: any, endDate: any) => {
    endDate = new Date(endDate);
    startDate = new Date(startDate);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7) {
      return diffDays + " day(s)";
    } else if (diffDays >= 7 && diffDays < 30)
      return Math.ceil(diffDays / 7) + " week(s)";
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

  //table filters
  const onFilterCategory = (e: any) => {
    let selectedCategory = e.target.value;
    setCurrentCategory(selectedCategory);
    const selectedDisco = currentDisco == "all" ? null : currentDisco;
    if (selectedCategory == "all") selectedCategory = null;
    setTableLoad(true);
    if (currentStatusTab == "all") {
      projectService
        .getAll(limit, currentPage, selectedDisco, selectedCategory)
        .then((r: any) => {
          loadTableData(r);
        })
        .catch((e) => {
          console.log(e);
          setTableLoad(false);
        });
    } else {
      projectService
        .getByStatus(
          currentStatusTab,
          limit,
          currentPage,
          selectedDisco,
          selectedCategory
        )
        .then((r: any) => {
          loadTableData(r);
        })
        .catch((e) => {
          console.log(e);
          setTableLoad(false);
        });
    }
  };

  const onFilterDisco = (e: any) => {
    let selectedDisco = e.target.value;
    const selectedCategory = currentCategory == "all" ? null : currentCategory;
    setCurrentDisco(selectedDisco);
    if (selectedDisco == "all") selectedDisco = null;

    setTableLoad(true);

    if (currentStatusTab == "all") {
      projectService
        .getAll(limit, currentPage, selectedDisco, selectedCategory)
        .then((r: any) => {
          loadTableData(r);
        })
        .catch((e) => {
          console.log(e);
          setTableLoad(false);
        });
    } else {
      projectService
        .getByStatus(
          currentStatusTab,
          limit,
          currentPage,
          selectedDisco,
          selectedCategory
        )
        .then((r: any) => {
          loadTableData(r);
        })
        .catch((e) => {
          console.log(e);
          setTableLoad(false);
        });
    }
  };

  //modular components
  const FilterContent = () => {
    return (
      <div className="table-result align-items-center">
        {resultCount && (
          <div className="ml-2">{resultCount} &nbsp; Results</div>
        )}
        <div className="d-flex">
          <div className={` filter-container `}>
            category:
            <div className={` filter-content`}>
              <select
                name="category"
                onChange={onFilterCategory}
                className="form-control"
                defaultValue={currentCategory}
                form-control="all"
              >
                <option value="all"> all </option>
                {categoryList &&
                  categoryList.map(({ name, _id }: any, i: any) => {
                    return (
                      <option key={i} value={_id}>
                        {name}
                      </option>
                    );
                  })}
              </select>
            </div>
          </div>
          <div className={` filter-container `}>
            Disco:
            <div className={` filter-content`}>
              <select
                name="disco"
                onChange={onFilterDisco}
                className="form-control"
                form-control="all"
                defaultValue={currentDisco}
              >
                <option value="all"> all </option>

                {discoList &&
                  discoList.map(({ shortname, _id }: any, i: any) => {
                    return (
                      <option key={i} value={_id}>
                        {shortname}
                      </option>
                    );
                  })}
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TableBanner = () => {
    return (
      <div className="page-header">
        <h3 className="page-title text-capitalize">
          {paginationData && (
            <span className="page-title-icon  mr-2">
              {paginationData?.totalDocumentCount}
            </span>
          )}
          <span className="text-capitalize"> {header}</span>
        </h3>
      </div>
    );
  };

  //triggers

  const showUpdateProject = (selectedProject: any) => {
    setCreateProjectForm((prevState) => ({ ...(prevState = selectedProject) }));
    setProjectUpdateData(selectedProject);
    setCreateProjectModal(true);
  };

  //table
  const onDownload = () => {
    const fileHeaders = {
      emptyFieldValue: "",
      keys: [
        { field: "name", title: "Full Name" },
        { field: "location", title: "Location" },
        // { field: "longitude", title: "longitude" },
        // { field: "latitude", title: "latitude" },
        { field: "category.name", title: "Project Category" },
        { field: "duration", title: "Duration" },
        { field: "disco.name", title: "Disco" },
        { field: "contractor", title: "Contractor" },
        { field: "startDate", title: "Start Date" },
        { field: "endDate", title: "End Date" },
        { field: "disbursed", title: "Amount Disbursed" },
        { field: "outstanding", title: "Amount Outstanding " },
        { field: "status", title: "Status" },
        { field: "cost", title: "Project Cost" },
        { field: "date", title: "Date" },
      ],
    };

    const projects = records?.map((project: any) => {
      let cLat = "NA";
      let p_duration = computeDuration(project?.startDate, project?.endDate);

      let contractorName =
        project?.contractorName != null
          ? project?.contractorName
          : "not assigned";
      let amountOutstanding: any =
        Number(project?.cost) - Number(project?.disbursed);
      let date = new Date(project.createdAt);
      let theStartDate = project.startDate.slice(0, 10);
      let theEndDate = project.endDate.slice(0, 10);

      let res = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      ).toJSON();
      return Object.assign({}, project, {
        duration: p_duration,
        startDate: theStartDate,
        endDate: theEndDate,
        date: res.slice(0, 10),
        outstanding: amountOutstanding,
        contractor: contractorName,
      });
    });
    // @ts-ignore
    downloadJsonAsCsv(projects, "Projects", fileHeaders);
  };

  const loadTableData = (tableData: any) => {
    setData(tableData.data);
    setPaginationData(tableData.pagination);
    setCurrentPage(tableData.pagination.currentPage);
    setTotalPages(tableData?.pagination?.totalPages);
    setResultCount(tableData.pagination?.totalDocumentCount);
    setTableLoad(false);
  };

  const tableHeader = [
    "NAME",
    "LOCATION",
    // "LONG ",
    // "LAT ",
    "CATEGORY",
    "CONTRACTOR",
    "DURATION",
    "STATUS",
    "CONTRACT SUM",
    "ACTION",
  ];

  const tableRow = (data: any) => {
    let cLat: any = "NA";
    let p_name = `${data?.name}`;
    let location = `${data?.location}`;
    let long = `${data?.longitude || "NA"}`;
    let category = data?.category?.name || "NA";
    let lat = `${data?.latitude || "NA"}`;

    let contractor =
      data?.contractorName != null ? data?.contractorName : "not assigned";
    p_name = p_name.length > 25 ? p_name.substring(0, 20) + "..." : p_name;
    location =
      location.length > 25 ? location.substring(0, 20) + "..." : location;
    contractor =
      contractor.length > 20 ? contractor.substring(0, 20) + "..." : contractor;
    long = long.length > 7 ? long.substring(0, 7) + "..." : long;
    lat = lat.length > 7 ? lat.substring(0, 7) + "..." : lat;
    category =
      category.length > 25 ? category.substring(0, 20) + "..." : category;
    return (
      <tr key={data?._id}>
        <td>{p_name}</td>
        <td>{location}</td>
        {/* <td>{long}</td>
        <td>{lat}</td> */}
        <td>{category}</td>
        <td>{contractor}</td>

        <td>{computeDuration(data?.startDate, data?.endDate)} </td>
        <td>
          {data?.status == "pending" && (
            <label className="badge badge-warning">Pending</label>
          )}
          {data?.status == "completed" && (
            <label className="badge badge-success">Completed</label>
          )}
          {data?.status == "delayed" && (
            <label className="badge badge-danger">Delayed</label>
          )}
        </td>
        <td>{computeCost(data?.cost)}</td>
        <td>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              more
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item>
                <span
                  onClick={() => router.push(`projects/${data?._id}`)}
                  className="dropdown-item"
                >
                  View
                </span>
              </Dropdown.Item>
              {isAdmin && (
                <Dropdown.Item>
                  <span
                    onClick={() => showUpdateProject(data)}
                    className="dropdown-item"
                  >
                    Modify
                  </span>
                </Dropdown.Item>
              )}

              {isAdmin && (
                <Dropdown.Item>
                  <span
                    onClick={() => {
                      loadProjectWorkplanList(data?._id);
                      setProjectData(data);
                      setShowAddWorkplanModal(true);
                      setErrorMessage(null);
                    }}
                    className="dropdown-item"
                  >
                    Add Activity
                  </span>
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    );
  };

  //tabs
  const updateTabFilter = (currentFilter: any) => {
    let headerContent = "";
    if (currentFilter == "all") headerContent = "all";
    if (currentFilter == "pending") headerContent = "ongoing";
    if (currentFilter == "delayed") headerContent = "delayed";
    if (currentFilter == "completed") headerContent = "completed";
    setHeader(headerContent + " Projects");
    setCurrentStatusTab(currentFilter);
    //reset filter
    setCurrentDisco(null);
    setCurrentCategory(null);
    loadPage(1, currentFilter);
  };

  return (
    <Page name={"Projects"}>
      <div className="page-header p-4">
        <h3 className="page-title">Projects</h3>
        {isAdmin && (
          <nav aria-label="breadcrumb">
            <div
              onClick={() => {
                setErrorMessage(null);
                setCreateCategoryModal(!createCategoryModal);
              }}
              className={"btn text-bold text-green"}
            >
              <SVGIcon name="plus-rounded" className="mr-1" /> Create Category
            </div>
            <div
              onClick={() => {
                setErrorMessage(null);
                setCreateProjectModal(!createProjectModal);
              }}
              className={"btn text-bold text-green"}
            >
              <SVGIcon name="plus-rounded" className="mr-1" /> Create Project
            </div>
          </nav>
        )}
      </div>
      <Row>
        <div className="col-12 ">
          <div className="col-lg-12 p-none">
            <div>
              <Tabs
                defaultActiveKey="all"
                id="projects-tab"
                className={"mt-3 modal-tabs"}
                onSelect={updateTabFilter}
              >
                <Tab eventKey="all" title="All Projects">
                  <>
                    {tableLoad ? (
                      <Card name={""}>
                        <div className={"col-lg-12"}>
                          <Loader text={"Loading Projects"} />
                        </div>
                      </Card>
                    ) : (
                      <>
                        <TableBanner />
                        {data && (
                          <Row>
                            <div className="col-12 grid-margin stretch-card">
                              <Card>
                                {categoryList && discoList && <FilterContent />}
                                <Table
                                  emptyMessage="No Projects"
                                  totalPages={totalPages}
                                  totalItems={
                                    paginationData?.totalDocumentCount
                                  }
                                  currentPage={currentPage}
                                  loadingText={"Loading projects..."}
                                  rowFormat={tableRow}
                                  paginated={data.length > 0}
                                  onPrev={onPrevPage}
                                  onNext={onNextPage}
                                  data={data}
                                  limit={limit}
                                  loading={tableLoad}
                                  headers={tableHeader}
                                  onExport={onDownload}
                                  onChangePageLimit={onChangePageLimit}
                                />
                              </Card>
                            </div>
                          </Row>
                        )}
                      </>
                    )}
                  </>
                </Tab>

                <Tab eventKey="completed" title="Completed">
                  <>
                    {tableLoad ? (
                      <Card name={""}>
                        <div className={"col-lg-12"}>
                          <Loader text={"Loading Projects"} />
                        </div>
                      </Card>
                    ) : (
                      <>
                        <TableBanner />
                        {data && (
                          <Row>
                            <div className="col-12 grid-margin stretch-card">
                              <Card>
                                {categoryList && discoList && <FilterContent />}
                                <Table
                                  emptyMessage="No Projects"
                                  totalPages={totalPages}
                                  totalItems={
                                    paginationData?.totalDocumentCount
                                  }
                                  currentPage={currentPage}
                                  loadingText={"Loading projects..."}
                                  rowFormat={tableRow}
                                  paginated={data.length > 0}
                                  onPrev={onPrevPage}
                                  onNext={onNextPage}
                                  data={data}
                                  limit={limit}
                                  loading={tableLoad}
                                  headers={tableHeader}
                                  onExport={onDownload}
                                  onChangePageLimit={onChangePageLimit}
                                />
                              </Card>
                            </div>
                          </Row>
                        )}
                      </>
                    )}
                  </>
                </Tab>

                <Tab eventKey="pending" title="Ongoing">
                  <>
                    {tableLoad ? (
                      <Card name={""}>
                        <div className={"col-lg-12"}>
                          <Loader text={"Loading Projects"} />
                        </div>
                      </Card>
                    ) : (
                      <>
                        <TableBanner />
                        {data && (
                          <Row>
                            <div className="col-12 grid-margin stretch-card">
                              <Card>
                                {categoryList && discoList && <FilterContent />}
                                <Table
                                  emptyMessage="No Projects"
                                  totalPages={totalPages}
                                  totalItems={
                                    paginationData?.totalDocumentCount
                                  }
                                  currentPage={currentPage}
                                  loadingText={"Loading projects..."}
                                  rowFormat={tableRow}
                                  paginated={data.length > 0}
                                  onPrev={onPrevPage}
                                  onNext={onNextPage}
                                  data={data}
                                  limit={limit}
                                  loading={tableLoad}
                                  headers={tableHeader}
                                  onExport={onDownload}
                                  onChangePageLimit={onChangePageLimit}
                                />
                              </Card>
                            </div>
                          </Row>
                        )}
                      </>
                    )}
                  </>
                </Tab>

                <Tab eventKey="delayed" title="Delayed">
                  <>
                    {tableLoad ? (
                      <Card name={""}>
                        <div className={"col-lg-12"}>
                          <Loader text={"Loading Projects"} />
                        </div>
                      </Card>
                    ) : (
                      <>
                        <TableBanner />
                        {data && (
                          <Row>
                            <div className="col-12 grid-margin stretch-card">
                              <Card>
                                {categoryList && discoList && <FilterContent />}
                                <Table
                                  emptyMessage="No Projects"
                                  totalPages={totalPages}
                                  totalItems={
                                    paginationData?.totalDocumentCount
                                  }
                                  currentPage={currentPage}
                                  loadingText={"Loading projects..."}
                                  rowFormat={tableRow}
                                  paginated={data.length > 0}
                                  onPrev={onPrevPage}
                                  onNext={onNextPage}
                                  data={data}
                                  limit={limit}
                                  loading={tableLoad}
                                  headers={tableHeader}
                                  onExport={onDownload}
                                  onChangePageLimit={onChangePageLimit}
                                />
                              </Card>
                            </div>
                          </Row>
                        )}
                      </>
                    )}
                  </>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </Row>

      {/* this is the create/update project modal */}

      <Modal
        show={createProjectModal}
        size="md"
        onHide={() => {
          setCreateProjectModal(false);
          setProjectUpdateData(null);
        }}
        title={projectUpdateData == null ? "Create Project" : "Update Project"}
      >
        <>
          <div>
            <form onSubmit={onCreateProject}>
              <div className="form-group">
                <label htmlFor="name">Project Name</label>
                <div className="d-flex justify-content-between">
                  <input
                    onChange={onCreateProjectFormChange}
                    type="text"
                    defaultValue={projectUpdateData?.name}
                    name="name"
                    className="form-control"
                    placeholder=""
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="location">Project Location</label>
                <div className="d-flex justify-content-between">
                  <input
                    onChange={onCreateProjectFormChange}
                    type="text"
                    defaultValue={projectUpdateData?.location}
                    name="location"
                    className="form-control"
                    placeholder=""
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="landmark">Landmark</label>
                <div className="d-flex justify-content-between">
                  <input
                    onChange={onCreateProjectFormChange}
                    type="text"
                    defaultValue={projectUpdateData?.landmark}
                    name="landmark"
                    className="form-control"
                    placeholder=""
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="discoId">Select Disco</label>
                <select
                  onChange={onCreateProjectFormChange}
                  defaultValue={projectUpdateData?.discoId}
                  name="discoId"
                  className="form-control"
                  required
                >
                  <option value=""> Select a disco</option>

                  {discoList &&
                    discoList.map(({ name, _id }: any, i: any) => {
                      return (
                        <option key={i} value={_id}>
                          {name}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="categoryId">Select Category</label>
                <select
                  onChange={onCreateProjectFormChange}
                  defaultValue={projectUpdateData?.categoryId}
                  name="categoryId"
                  className="form-control"
                  required
                >
                  <option value="">Select a category </option>
                  {discoList &&
                    categoryList.map(({ name, _id }: any, i: any) => {
                      return (
                        <option key={i} value={_id}>
                          {name}
                        </option>
                      );
                    })}
                </select>
              </div>
              {projectUpdateData == null && (
                <div className="form-group">
                  <label htmlFor="contractor">Contractor</label>
                  <select
                    onChange={onCreateProjectFormChange}
                    defaultValue={projectUpdateData?.contractorId}
                    name="contractorId"
                    className="form-control"
                    required
                  >
                    <option value="">Select a contractor </option>
                    {discoList &&
                      contractorList.map(({ name, _id }: any, i: any) => {
                        return (
                          <option key={i} value={_id}>
                            {name}
                          </option>
                        );
                      })}
                  </select>
                </div>
              )}
              <div className="row">
                <div className="form-group col-md-6 col-12">
                  <label htmlFor="startDate">Start Date</label>
                  <div className="d-flex justify-content-between">
                    <input
                      onChange={onCreateProjectFormChange}
                      type="date"
                      defaultValue={projectUpdateData?.startDate.slice(0, 10)}
                      name="startDate"
                      className="form-control"
                      placeholder=""
                      required
                    />
                  </div>
                </div>

                <div className="form-group col-md-6 col-12">
                  <label htmlFor="endDate">End Date</label>
                  <div className="d-flex justify-content-between">
                    <input
                      onChange={onCreateProjectFormChange}
                      type="date"
                      defaultValue={projectUpdateData?.endDate.slice(0, 10)}
                      name="endDate"
                      className="form-control"
                      placeholder=""
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="cost">Project Cost</label>
                <div className="d-flex justify-content-between">
                  <input
                    onChange={onCreateProjectFormChange}
                    type="text"
                    defaultValue={projectUpdateData?.cost}
                    name="cost"
                    onKeyUp={formatCurrency}
                    onKeyDown={checkNumeric}
                    min={0}
                    className="form-control"
                    placeholder=""
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="expectedImpact">Expected Impact</label>
                <div className="d-flex justify-content-between">
                  <input
                    onChange={onCreateProjectFormChange}
                    type="text"
                    defaultValue={projectUpdateData?.expectedImpact}
                    name="expectedImpact"
                    className="form-control"
                    placeholder=""
                    required
                  />
                </div>
              </div>
              {/* display error message */}
              {errorMessage && (
                <span className=" text-black text-danger">{errorMessage}</span>
              )}
              <div className="d-flex my-3 justify-content-center">
                <button
                  type="button"
                  onClick={(e) => onCreateProject(e)}
                  className="btn btn-block btn-success btn-lg  form-btn"
                >
                  {modalLoad ? "Loading..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </>
      </Modal>

      {/* this is the create category modal */}
      <Modal
        show={createCategoryModal}
        size="md"
        onHide={() => {
          setCreateCategoryModal(false);
        }}
        title={"Add Category"}
      >
        <div>
          <label htmlFor="name">Categories:</label>
          <div className="list-container">
            {categoryList &&
              categoryList.map((data: any, i: any) => (
                <div
                  onClick={() => {
                    setCreateCategoryForm(initialState);
                    setUpdateCategoryModal(true);
                    setUpdateCategoryData(data);
                  }}
                  key={i}
                  className="list-content"
                >
                  <div> {data?.name}</div>
                  <SVGIcon name="edit" className="ml-2" />
                </div>
              ))}
          </div>
          <h6 className="my-3">Add Category </h6>
          <hr />
          <form onSubmit={onCreateCategory}>
            <div className="form-group">
              <label htmlFor="name">Category Name</label>
              <div className="d-flex justify-content-between">
                <input
                  onChange={onCreateCategoryFormChange}
                  type="text"
                  defaultValue=""
                  name="name"
                  className="form-control w-80"
                  placeholder="category name"
                />
                <div onClick={(e) => onCreateCategory(e)} className="btn py-0">
                  <SVGIcon name="plus" className="ml-2" />
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center"></div>
            {/* display error message */}
            {errorMessage && (
              <span className=" text-black text-danger">{errorMessage}</span>
            )}
          </form>
        </div>
      </Modal>

      {/* this is the update category modal */}
      <Modal
        show={updateCategoryModal}
        size="md"
        onHide={() => {
          setUpdateCategoryModal(false);
        }}
        title={"Edit Category"}
      >
        <div>
          <form onSubmit={onUpdateCategory}>
            <div className="form-group">
              <label htmlFor="name">Category Name</label>
              <div className="d-flex justify-content-between">
                <input
                  onChange={onUpdateCategoryFormChange}
                  type="text"
                  defaultValue={updateCategoryData?.name}
                  name="name"
                  className="form-control"
                  placeholder="category name"
                />
              </div>
            </div>
            {/* display error message */}
            {errorMessage && (
              <span className=" text-black text-danger">{errorMessage}</span>
            )}
            <div className="d-flex my-3 justify-content-center">
              <button
                type="button"
                onClick={(e) => onUpdateCategory(e)}
                className="btn btn-block btn-success btn-lg  form-btn"
              >
                {modalLoad ? "Loading..." : "update"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* this is the add workplan modal */}
      <Modal
        show={showaddWorkplanModal}
        size="md"
        onHide={() => {
          setShowAddWorkplanModal(false);
        }}
        title={"Add Activity"}
      >
        <div>
          <div className={`${S.projectMetadataContainer}`}>
            <div className={`${S.projectMetaData}`}>
              Project: <b className="text-Capitalise">{projectData?.name}</b>
            </div>
            <div className={`${S.projectMetaData}`}>
              Start Date :{" "}
              <b>{moment(projectData?.startDate).format(" MMM Do, YYYY")}</b>
            </div>
            <div className={`${S.projectMetaData}`}>
              End Date :
              <b> {moment(projectData?.endDate).format(" MMM Do, YYYY")}</b>
            </div>
          </div>
          <h6>Activities:</h6>
          <div className="list-container">
            {projectWorkplanList &&
              projectWorkplanList.map((data: any, i: any) => (
                <div
                  onClick={() => {
                    // update workplan here
                    setCreateWorkplanForm(initialWorkplanState);
                    setShowUpdateWorkplanModal(true);
                    setWorkplanData(data);
                    setUpdateWorkplanForm((prevState) => ({
                      ...(prevState = data),
                    }));
                  }}
                  key={i}
                  className="list-content"
                >
                  <div> {data?.name}</div>
                  <SVGIcon name="edit" className="ml-2" />
                </div>
              ))}
          </div>
          <h6 className="my-3">Add Activity </h6>
          <hr />

          <form onSubmit={onCreateWorkplan}>
            <div className="form-group">
              <label htmlFor="name">Activity Name</label>
              <div className="d-flex justify-content-between">
                <input
                  onChange={onCreateWorkplanFormChange}
                  type="text"
                  defaultValue=""
                  name="name"
                  className="form-control"
                  placeholder=""
                />
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-6 col-12">
                <label htmlFor="startDate">Start Date</label>
                <div className="d-flex justify-content-between">
                  <input
                    onChange={onCreateWorkplanFormChange}
                    type="date"
                    defaultValue=""
                    name="startDate"
                    className="form-control"
                    placeholder=""
                    min={projectData?.startDate.substring(0, 10)}
                    max={projectData?.endDate.substring(0, 10)}
                    required
                  />
                </div>
              </div>

              <div className="form-group col-md-6 col-12">
                <label htmlFor="endDate">End Date</label>
                <div className="d-flex justify-content-between">
                  <input
                    onChange={onCreateWorkplanFormChange}
                    type="date"
                    defaultValue=""
                    name="endDate"
                    className="form-control"
                    placeholder=""
                    min={projectData?.startDate.substring(0, 10)}
                    max={projectData?.endDate.substring(0, 10)}
                    required
                  />
                </div>
              </div>
            </div>
            {/* display error message */}
            {updateCategoryErrorMsg && (
              <span className=" text-black text-danger">
                {updateCategoryErrorMsg}
              </span>
            )}
            <div className="d-flex my-3 justify-content-center">
              <button
                type="button"
                onClick={(e) => onCreateWorkplan(e)}
                className="btn btn-block btn-success btn-lg  form-btn"
              >
                {modalLoad ? "Loading..." : "Add"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* this is the update workplan modal */}
      <Modal
        show={showUpdateWorkplanModal}
        size="md"
        onHide={() => {
          setShowUpdateWorkplanModal(false);
        }}
        title={"Update Workplan"}
      >
        <div>
          <div className={`${S.projectMetadataContainer}`}>
            <div className={`${S.projectMetaData}`}>
              Project: <b className="text-Capitalise">{projectData?.name}</b>
            </div>
            <div className={`${S.projectMetaData}`}>
              Start Date :{" "}
              <b> {moment(projectData?.startDate).format("YYYY/MM/DD")}</b>
            </div>
            <div className={`${S.projectMetaData}`}>
              End Date :
              <b> {moment(projectData?.endDate).format("YYYY/MM/DD")}</b>
            </div>
          </div>

          <form onSubmit={onUpdateWorkplan}>
            <div className="form-group">
              <label htmlFor="name">Workplan Name</label>
              <div className="d-flex justify-content-between">
                <input
                  onChange={onUpdateWorkplanFormChange}
                  type="text"
                  defaultValue={workplanData?.name}
                  name="name"
                  className="form-control"
                  placeholder=""
                />
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-6 col-12">
                <label htmlFor="startDate">Start Date</label>
                <div className="d-flex justify-content-between">
                  <input
                    onChange={onUpdateCategoryFormChange}
                    type="date"
                    defaultValue={workplanData?.startDate.slice(0, 10)}
                    name="startDate"
                    className="form-control"
                    placeholder=""
                    required
                  />
                </div>
              </div>

              <div className="form-group col-md-6 col-12">
                <label htmlFor="endDate">End Date</label>
                <div className="d-flex justify-content-between">
                  <input
                    onChange={onUpdateWorkplanFormChange}
                    type="date"
                    defaultValue={workplanData?.endDate.slice(0, 10)}
                    name="endDate"
                    className="form-control"
                    placeholder=""
                    required
                  />
                </div>
              </div>
            </div>
            {/* display error message */}
            {updateWorkplanErrorMsg && (
              <span className=" text-black text-danger">
                {updateWorkplanErrorMsg}
              </span>
            )}
            <div className="d-flex my-3 justify-content-center">
              <button
                type="button"
                onClick={(e) => onUpdateWorkplan(e)}
                className="btn btn-block btn-success btn-lg  form-btn"
              >
                {modalLoad ? "Loading..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </Page>
  );
};

export default Projects;
