import React, { ReactNode, FC } from "react";
import { Empty, Loader } from "@components";
import { Row } from "react-bootstrap";
import { PaginationProps, TableProp } from "src/types";
import { SVGIcon } from "@components/shared";

export const Table = ({
  data,
  onExport,
  headers,
  rowFormat,
  emptyMessage,
  totalPages,
  onChangePageLimit,
  onPrev,
  onNext,
  currentPage,
  loading,
  loadingText,
  paginated,
  limit,
  totalItems,
  onSearch,
  searchTerm,
}: TableProp) => {
  return (
    <>
      <Row className="justify-content-between">
        {/*<div className="col-sm-12 col-md-8">&nbsp;</div>*/}
        {onSearch ? (
          <div className="col-sm-12 col-md-4">
            <div className="form-group">
              <div className="input-group">
                <input
                  onChange={onSearch}
                  type="text"
                  className="form-control"
                  placeholder="Search"
                  value={searchTerm}
                />
                <div className="input-group-append">
                  <button className="btn btn-sm btn-facebook" type="button">
                    <i className="mdi mdi-magnify" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Row>
      {loading ? (
        <Loader text={loadingText} />
      ) : (
        <>
          {data?.length ? (
            <>
              <table className="table sortable-table table-bordered">
                <thead>
                  <tr>
                    {headers?.length
                      ? headers.map((h: any) => {
                          return <th key={h}>{h}</th>;
                        })
                      : null}
                  </tr>
                </thead>
                <tbody>
                  {data.map((d: any, i: any) => {
                    return rowFormat(d, i);
                  })}
                </tbody>
              </table>
            </>
          ) : null}

          {!data?.length ? <Empty message={emptyMessage || ""} /> : null}
          {paginated ? (
            <Pagination
              limit={limit}
              onChangePageLimit={onChangePageLimit}
              totalPages={totalPages}
              totalItems={totalItems}
              onPrev={onPrev}
              onNext={onNext}
              currentPage={currentPage}
            />
          ) : null}

          {onExport && data?.length ? (
            <div className="download-csv-container">
              <div></div>
              <div onClick={onExport} className="download-btn ">
                Download
                <SVGIcon name="download" className="ml-2" />
              </div>
            </div>
          ) : null}
        </>
      )}
    </>
  );
};

export const Pagination: FC<PaginationProps> = ({
  limit,
  currentPage,
  onPrev,
  totalPages,
  totalItems,
  onNext,
  onChangePageLimit,
  ...props
}) => {
  return (
    <>
      <div className="pagination ">
        <div className="pagination-left">
          {onChangePageLimit ? (
            <li>
              <select
                name="limit"
                onChange={onChangePageLimit}
                className="page-limit"
                value={limit}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
                <option value="50">50</option>
                <option value="60">60</option>
                <option value="70">70</option>
                <option value="80">80</option>
                <option value="90">90</option>
                <option value="100">100</option>
              </select>
            </li>
          ) : null}
        </div>
        <div className="pagination-right">
          <ul className="pagination rounded-separated pagination-danger">
            {currentPage && limit && totalPages && totalItems && (
              <li className="page-item text-primary">
                {currentPage * limit - limit + 1} -{" "}
                {currentPage !== totalPages ? limit * currentPage : totalItems}
              </li>
            )}
            <li className="page-item text-primary pe-3">
              &nbsp;of&nbsp;{totalItems}&nbsp;
            </li>
            <li className="px-3">
              {currentPage && (
                <span
                  className={`${
                    currentPage > 1 ? "" : "disabled "
                  }cursor-pointer text-info `}
                  onClick={() => {
                    if (currentPage > 1) onPrev && onPrev();
                  }}
                >
                  <SVGIcon name="arrow-left" />
                </span>
              )}
            </li>
            <li>
              {currentPage && (
                <>
                  <span
                    className={`${
                      currentPage !== totalPages ? "" : "disabled "
                    } cursor-pointer text-info`}
                    onClick={() => {
                      if (currentPage !== totalPages) onNext && onNext();
                    }}
                  >
                    <SVGIcon name="arrow-right" />
                  </span>
                </>
              )}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};
