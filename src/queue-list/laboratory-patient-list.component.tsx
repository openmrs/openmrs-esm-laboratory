import React, { useEffect, useMemo, useState } from "react";
import {
  DataTable,
  DataTableHeader,
  DataTableSkeleton,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableExpandHeader,
  TableExpandRow,
  TableHead,
  TableHeader,
  TableRow,
  TabPanel,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Layer,
  Tag,
  TableExpandedRow,
} from "@carbon/react";
import { useTranslation } from "react-i18next";
import {
  age,
  formatDate,
  formatDatetime,
  parseDate,
  usePagination,
  useSession,
} from "@openmrs/esm-framework";
import styles from "./laboratory-queue.scss";
import { usePatientQueuesList } from "./laboratory-patient-list.resource";
import {
  formatWaitTime,
  getTagColor,
  trimVisitNumber,
} from "../utils/functions";
import LabTests from "./lab-tests/lab-tests.component";
import AddToWorklist from "./lab-dialogs/add-to-worklist-dialog.component";
import PickLabRequestActionMenu from "./pick-lab-request-menu.component";

// type FilterProps = {
//   rowIds: Array<string>;
//   headers: Array<DataTableHeader>;
//   cellsById: any;
//   inputValue: string;
//   getCellId: (row, key) => string;
// };

interface LaboratoryPatientListProps {}

const LaboratoryPatientList: React.FC<LaboratoryPatientListProps> = () => {
  const { t } = useTranslation();
  const session = useSession();

  const { patientQueueEntries, isLoading } = usePatientQueuesList(
    session?.sessionLocation?.uuid,
    status
  );

  const pageSizes = [10, 20, 30, 40, 50];
  const [page, setPage] = useState(1);
  const [currentPageSize, setPageSize] = useState(10);
  const [nextOffSet, setNextOffSet] = useState(0);

  const {
    goTo,
    results: paginatedQueueEntries,
    currentPage,
  } = usePagination(patientQueueEntries, currentPageSize);

  let columns = [
    { id: 0, header: t("visitId", "Visit ID"), key: "visitId" },
    { id: 1, header: t("names", "Names"), key: "names" },
    { id: 2, header: t("age", "Age"), key: "age" },
    { id: 3, header: t("orderedFrom", "Ordered from"), key: "orderedFrom" },
    { id: 4, header: t("waitingTime", "Waiting time"), key: "waitingTime" },
    { id: 5, header: t("actions", "Actions"), key: "actions" },
  ];

  const tableRows = useMemo(() => {
    return paginatedQueueEntries?.map((entry) => ({
      ...entry,
      visitId: {
        content: <span>{trimVisitNumber(entry.visitNumber)}</span>,
      },
      names: {
        content: <span>{entry.name}</span>,
      },
      age: {
        content: <span>{age(entry.patientDob)}</span>,
      },
      orderedFrom: {
        content: <span>{entry.locationFromName}</span>,
      },
      waitingTime: {
        content: (
          <Tag>
            <span
              className={styles.statusContainer}
              style={{ color: `${getTagColor(entry.waitTime)}` }}
            >
              {formatWaitTime(entry.waitTime, t)}
            </span>
          </Tag>
        ),
      },
      actions: {
        content: (
          <PickLabRequestActionMenu
            queueEntry={entry}
            closeModal={() => true}
          />
        ),
      },
    }));
  }, [paginatedQueueEntries, t]);

  // const handleFilter = ({
  //   rowIds,
  //   headers,
  //   cellsById,
  //   inputValue,
  //   getCellId,
  // }: FilterProps): Array<string> => {
  //   return rowIds.filter((rowId) =>
  //     headers.some(({ key }) => {
  //       const cellId = getCellId(rowId, key);
  //       const filterableValue = cellsById[cellId].value;
  //       const filterTerm = inputValue.toLowerCase();

  //       if (typeof filterableValue === "boolean") {
  //         return false;
  //       }
  //       if (filterableValue.hasOwnProperty("content")) {
  //         if (Array.isArray(filterableValue.content.props.children)) {
  //           return (
  //             "" + filterableValue.content.props.children[1].props.children
  //           )
  //             .toLowerCase()
  //             .includes(filterTerm);
  //         }
  //         if (typeof filterableValue.content.props.children === "object") {
  //           return ("" + filterableValue.content.props.children.props.children)
  //             .toLowerCase()
  //             .includes(filterTerm);
  //         }
  //         return ("" + filterableValue.content.props.children)
  //           .toLowerCase()
  //           .includes(filterTerm);
  //       }
  //       return ("" + filterableValue).toLowerCase().includes(filterTerm);
  //     })
  //   );
  // };
  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }
  if (patientQueueEntries?.length) {
    return (
      <div>
        <div className={styles.headerBtnContainer}></div>
        <DataTable rows={tableRows} headers={columns} isSortable useZebraStyles>
          {({
            rows,
            headers,
            getHeaderProps,
            getTableProps,
            getRowProps,
            onInputChange,
          }) => (
            <TableContainer className={styles.tableContainer}>
              <TableToolbar
                style={{
                  position: "static",
                  height: "3rem",
                  overflow: "visible",
                  backgroundColor: "color",
                }}
              >
                <TableToolbarContent>
                  <Layer>
                    <TableToolbarSearch
                      onChange={onInputChange}
                      placeholder={t("searchThisList", "Search this list")}
                      size="sm"
                    />
                  </Layer>
                </TableToolbarContent>
              </TableToolbar>
              <Table
                {...getTableProps()}
                className={styles.activePatientsTable}
              >
                <TableHead>
                  <TableRow>
                    <TableExpandHeader />
                    {headers.map((header) => (
                      <TableHeader {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => {
                    return (
                      <React.Fragment key={row.id}>
                        <TableExpandRow {...getRowProps({ row })} key={row.id}>
                          {row.cells.map((cell) => (
                            <TableCell key={cell.id}>
                              {cell.value?.content ?? cell.value}
                            </TableCell>
                          ))}
                        </TableExpandRow>
                        {row.isExpanded ? (
                          <TableExpandedRow
                            className={styles.expandedLabQueueVisitRow}
                            colSpan={headers.length + 2}
                          >
                            <>
                              <LabTests />
                            </>
                          </TableExpandedRow>
                        ) : (
                          <TableExpandedRow
                            className={styles.hiddenRow}
                            colSpan={headers.length + 2}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
              <Pagination
                forwardText="Next page"
                backwardText="Previous page"
                page={currentPage}
                pageSize={currentPageSize}
                pageSizes={pageSizes}
                totalItems={patientQueueEntries?.length}
                className={styles.pagination}
                onChange={({ pageSize, page }) => {
                  if (pageSize !== currentPageSize) {
                    setPageSize(pageSize);
                  }
                  if (page !== currentPage) {
                    goTo(page);
                  }
                }}
              />
            </TableContainer>
          )}
        </DataTable>
      </div>
    );
  }
};

export default LaboratoryPatientList;
