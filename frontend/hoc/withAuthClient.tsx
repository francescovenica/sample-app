import React, { useEffect, ComponentType } from "react";

import { useAuthContext } from "../context/auth";

const onDefaultRedirect = () => <div>Redirecting you to the login...</div>;

type Options = {
  onRedirecting?: () => React.ReactNode;
  returnTo?: string;
};

const defaultOptions = {
  onRedirecting: () => <div>Redirecting you to the login...</div>,
  onError: (error: Error) => <div>Redirecting you to the login...</div>,
  returnTo: "/",
};

const WithAuth = (
  Component: ComponentType,
  options: Options = defaultOptions
) => {
  // eslint-disable-next-line react/display-name
  return function WithPageAuthRequired(props) {
    const { onRedirecting = onDefaultRedirect, returnTo } = options;
    const { session } = useAuthContext();


    useEffect(() => {
      if (session) {
        return;
      }

      window.location.assign(`/`);
    }, [session, returnTo]);

    if (session) return <Component {...props} />;

    return onRedirecting();
  };
};

export default WithAuth;
