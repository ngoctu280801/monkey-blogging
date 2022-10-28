import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const AuthenticationStyles = styled.div`
  min-height: 100vh;
  padding: 40px;
  .logo {
    margin: 0 auto 20px;
  }
  .heading {
    text-align: center;
    color: ${(props) => props.theme.primary};
    font-size: 40px;
    font-weight: 600;
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }
  .form {
    max-width: 600px;
    margin: 0 auto;
  }
  .have-account {
    margin-bottom: 20px;
    a {
      display: inline-block;
      color: ${(props) => props.theme.primary};
      font-weight: 500;
    }
  }
`;

const AuthenticationPage = ({ children }) => {
  return (
    <AuthenticationStyles>
      <div className="container">
        <NavLink to={"/"}>
          <img srcSet="/logo.png 2x" alt="monkey-blogging" className="logo" />
          <h1 className="heading">Money Blogging</h1>
        </NavLink>
        {children}
      </div>
    </AuthenticationStyles>
  );
};

export default AuthenticationPage;
