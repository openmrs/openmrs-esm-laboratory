import React from "react";
import { useTranslation } from "react-i18next";
import SummaryTile from "../summary-tiles/summary-tile.component";
import { useLabTestsStats } from "../summary-tiles/laboratory-summary.resource";

const ReferredTileComponent = () => {
  const { t } = useTranslation();

  const { data } = useLabTestsStats("");

  const filteredData = data?.filter(
    (item) =>
      item?.action === "NEW" &&
      item?.dateStopped === null &&
      item?.fulfillerStatus === null
  );

  return (
    <SummaryTile
      label={t("orders", "Orders")}
      value={filteredData?.length}
      headerLabel={t("testsOrdered", "Tests ordered")}
    />
  );
};

export default ReferredTileComponent;
