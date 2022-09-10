import React from "react";
import styles from "./styles.module.scss";
import { useAuthContext } from "../../context/auth";

const Header = () => {
  const { account, signOut } = useAuthContext();

  const onSignOut = () => signOut();

  return (
    <header className={styles.header}>
      {account && account?.email}
      {account && <button onClick={onSignOut}>Log Out</button>}
    </header>
  );
};

export default Header;
