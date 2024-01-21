import React, { useState } from "react";

import {
  Button,
  ContentSwitcher,
  Form,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Switch,
  TextArea,
  Grid,
  Checkbox,
  TextInput,
  IconButton,
} from "@carbon/react";
import { useTranslation } from "react-i18next";
import styles from "./reject-order-dialog.scss";
import { Result } from "../work-list/work-list.resource";
import { RejectOrder } from "./reject-order-dialog.resource";
import { showNotification, showSnackbar } from "@openmrs/esm-framework";

interface RejectOrderDialogProps {
  order: Result;
  closeModal: () => void;
}

const RejectOrderDialog: React.FC<RejectOrderDialogProps> = ({
  order,
  closeModal,
}) => {
  const { t } = useTranslation();

  const [notes, setNotes] = useState("");

  const rejectOrder = async (event) => {
    event.preventDefault();

    const payload = {
      fulfillerStatus: "EXCEPTION", // Todo changed to Declined when UgEMR module is upgraded to 2.6.1
      fulfillerComment: notes,
    };
    RejectOrder(order.uuid, payload).then(
      (resp) => {
        showSnackbar({
          isLowContrast: true,
          title: t("rejectOrder", "Rejected Order"),
          kind: "success",
          subtitle: t(
            "successfullyrejected",
            `You have successfully rejected an Order with OrderNumber ${order.orderNumber} `
          ),
        });
        closeModal();
      },
      (err) => {
        showNotification({
          title: t(`errorRejecting order', 'Error Rejecting a order`),
          kind: "error",
          critical: true,
          description: err?.message,
        });
      }
    );
  };

  return (
    <div>
      <Form onSubmit={rejectOrder}>
        <ModalHeader
          closeModal={closeModal}
          title={t("rejectOrder", "Reject Order")}
        />
        <ModalBody>
          <div className={styles.modalBody}>
            <section className={styles.section}>
              <h5 className={styles.section}>
                {order?.accessionNumber} &nbsp; · &nbsp;{order?.fulfillerStatus}{" "}
                &nbsp; · &nbsp;
                {order?.orderNumber}
                &nbsp;
              </h5>
            </section>
            <br />
            <section className={styles.section}>
              <TextArea
                labelText={t("notes", "Enter Comments ")}
                id="nextNotes"
                name="nextNotes"
                invalidText="Required"
                helperText="Please enter comment"
                maxCount={500}
                enableCounter
                onChange={(e) => setNotes(e.target.value)}
              />
            </section>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button kind="secondary" onClick={closeModal}>
            {t("cancel", "Cancel")}
          </Button>
          <Button kind="danger" type="submit">
            {t("rejectOrder", "Reject Order")}
          </Button>
        </ModalFooter>
      </Form>
    </div>
  );
};

export default RejectOrderDialog;
