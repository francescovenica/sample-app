import React from "react";
import Layout from "../Layout";
import Form, { Field } from "../../components/Form";
import { useAuthContext } from "../../context/auth";
import { signIn, signUp } from "../../lib/auth";
import styles from "./styles.module.scss";

const signInFields: Field[] = [
  {
    name: "email",
    label: "Email",
    validation: { required: true },
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    validation: { required: true },
  },
];

const signUpFields: Field[] = [
  {
    name: "email",
    label: "Email",
    validation: { required: true },
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    validation: { required: true },
  },
  {
    name: "firstName",
    label: "First Name",
  },
  {
    name: "lastName",
    label: "Last Name",
  },
];

const HomeContainer = () => {
  const { signIn, signUp } = useAuthContext();

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.signin}>
          <Form
            formName="signin"
            onSubmit={signIn}
            fields={signInFields}
            defaultValues={{
              email: "kikko088@gmail.com",
              password: "Password1@",
            }}
          />
        </div>
        <div className={styles.signup}>
          <Form
            formName="signup"
            onSubmit={signUp}
            fields={signUpFields}
            defaultValues={{
              email: "kikko088@gmail.com",
              password: "Password1@",
              firstName: "Fra",
              lastName: "Veni",
            }}
          />
        </div>
      </div>
    </Layout>
  );
};

export default HomeContainer;
