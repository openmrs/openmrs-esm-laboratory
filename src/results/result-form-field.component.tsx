import React from "react";
import styles from "./result-form.scss";
import { TextInput, Select, SelectItem } from "@carbon/react";
import { useTranslation } from "react-i18next";
import { ConceptReference } from "./result-form.resource";
import { Controller } from "react-hook-form";

interface ResultFormFieldProps {
  concept: ConceptReference;
  control: any;
  register: any;
}
const ResultFormField: React.FC<ResultFormFieldProps> = ({
  concept,
  control,
  register,
}) => {
  const { t } = useTranslation();
  const isTextOrNumeric = (concept) =>
    concept.datatype?.display === "Text" ||
    concept.datatype?.display === "Numeric";
  const isCoded = (concept) => concept.datatype?.display === "Coded";
  const isPanel = (concept) => concept.setMembers?.length > 0;

  return (
    <>
      {isTextOrNumeric(concept) && (
        <Controller
          control={control}
          name={concept.uuid}
          render={({ field }) => (
            <TextInput
              key={concept.uuid}
              className={styles.textInput}
              {...field}
              type={concept.datatype.display === "Numeric" ? "number" : "text"}
              labelText={concept?.display}
              autoFocus
            />
          )}
        />
      )}
      {isCoded(concept) && (
        <Controller
          name={concept.uuid}
          control={control}
          render={({ field }) => (
            <Select
              key={concept.uuid}
              className={styles.textInput}
              {...field}
              type="text"
              labelText={concept?.display}
            >
              <SelectItem text={t("option", "Choose an Option")} value="" />

              {concept?.answers?.map((answer) => (
                <SelectItem
                  key={answer.uuid}
                  text={answer.display}
                  value={answer.uuid}
                >
                  {answer.display}
                </SelectItem>
              ))}
            </Select>
          )}
        />
      )}

      {isPanel(concept) &&
        concept.setMembers.map((member, index) => {
          if (isTextOrNumeric(member)) {
            return (
              <Controller
                control={control}
                name={member.uuid}
                render={({ field }) => (
                  <TextInput
                    key={member.uuid}
                    className={styles.textInput}
                    {...field}
                    type={
                      member.datatype.display === "Numeric" ? "number" : "text"
                    }
                    labelText={member?.display}
                    autoFocus={index === 0}
                  />
                )}
              />
            );
          }

          if (isCoded(member)) {
            return (
              <Controller
                name={member.uuid}
                control={control}
                render={({ field }) => (
                  <Select
                    key={member.uuid}
                    className={styles.textInput}
                    {...field}
                    type="text"
                    labelText={member?.display}
                    autoFocus={index === 0}
                  >
                    <SelectItem
                      text={t("option", "Choose an Option")}
                      value=""
                    />

                    {member?.answers?.map((answer) => (
                      <SelectItem
                        key={answer.uuid}
                        text={answer.display}
                        value={answer.uuid}
                      >
                        {answer.display}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />
            );
          }
        })}
    </>
  );
};

export default ResultFormField;
