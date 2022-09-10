import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import TextField from "./Input/TextField";
import TextArea from "./Input/TextArea";
import styles from "./styles.module.scss";

export type Field = {
  name: string;
  label: string;
  type?: string;
  validation?: any;
};

type Props = {
  onSubmit: (data: any) => void;
  formName: string;
  fields: Field[];
  defaultValues?: any;
};

const getEmptyObject = (fields) =>
  fields.reduce((result, current) => {
    return {
      ...result,
      [current.name]: "",
    };
  }, {});

const Form = ({ onSubmit, fields, formName, defaultValues }: Props) => {
  const empty = getEmptyObject(fields);

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    } else {
      reset(empty);
    }
  }, [defaultValues]);

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.formBody}>
        {fields.map(({ type = "text", ...field }) => {
          switch (type) {
            case "checkbox":
              return <div>Implement a checkbox component</div>;
            case "password":
            case "text":
              return (
                <TextField
                  key={`${formName}-${field.name}`}
                  formName={formName}
                  register={register}
                  errors={errors}
                  {...{ type, ...field }}
                />
              );
            case "textarea":
              return (
                <TextArea
                  key={`${formName}-${field.name}`}
                  formName={formName}
                  register={register}
                  errors={errors}
                  {...{ type, ...field }}
                />
              );
            default:
              break;
          }
        })}
      </div>

      <div className={styles.formFooter}>
        <input type="submit" />
      </div>
    </form>
  );
};

export default Form;
