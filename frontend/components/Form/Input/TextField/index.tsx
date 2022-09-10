import React from "react";
import styles from "./styles.module.scss";

type Props = {
  formName: string;
  name: string;
  label: string;
  errors: any;
  register: any;
  validation?: any;
};

const TextInput = ({
  formName,
  name,
  label,
  errors,
  register,
  validation,
}: Props) => (
  <div key={`${formName}-${name}`} className={styles.textField}>
    <label>{label}</label>
    <input {...register(name, validation)} />
    {errors?.[name] && <span>This field is required</span>}
  </div>
);

export default TextInput;
