import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth0();

  return (
    <Route
      render={() => {
        return isAuthenticated ? children : <Redirect to="/login"></Redirect>;
      }}
    ></Route>
  );
};
export default PrivateRoute;
