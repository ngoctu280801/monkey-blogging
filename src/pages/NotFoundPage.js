import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const NotFoundStyles = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .logo {
    display: inline-block;
    margin-bottom: 40px;
  }
  .heading {
    margin-bottom: 40px;
    font-weight: bold;
  }
  .back {
    display: inline-block;
    padding: 15px 30px;
    color: white;
    background-image: linear-gradient(
      to right bottom,
      ${(props) => props.theme.primary},
      ${(props) => props.theme.secondary}
    );
    font-weight: 500;
    border-radius: 8px;
  }
`;
const NotFoundPage = () => {
  return (
    <NotFoundStyles>
      <NavLink to="/" className={"logo"}>
        <img srcSet="/logo.png 2x" alt="mokey-blogging" />
      </NavLink>
      <h1 className="heading">Oops! Page Not Found</h1>
      <NavLink to="/" className={"back"}>
        Back to Home
      </NavLink>
    </NotFoundStyles>
  );
};

export default NotFoundPage;
