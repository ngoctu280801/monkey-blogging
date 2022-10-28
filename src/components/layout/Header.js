import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../contexts/auth-context";
import Button from "../button/Button";

const menuLinks = [
  { url: "/", title: "Home" },
  { url: "/blog", title: "Blog" },
  { url: "/contact", title: "Contact" },
];

const HeaderStyles = styled.header`
  padding: 40px 0;
  .header-main {
    display: flex;
    align-items: center;
  }
  .header-main .menu {
    display: flex;
    align-items: center;
    gap: 20px;
    list-style: none;
    margin-left: 40px;
    font-weight: 500;
  }
  .header-main a {
    color: #000;
  }
  .logo {
    display: block;
    max-width: 50px;
  }
  .header-right {
    margin-left: auto;
  }
  .search {
    margin-left: auto;
    padding: 15px 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    width: 100%;
    max-width: 320px;
    display: flex;
    align-items: center;
    position: relative;
    margin-right: 20px;
  }
  .search-input {
    flex: 1;
    padding-right: 30px;
  }
  .search-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 20px;
  }
  .header-button {
    margin-left: 20px;
  }
`;
const getLastName = (name) => {
  if (!name) return "User";
  const length = name.split(" ").length;
  return name.split(" ")[length - 1];
};
const Header = () => {
  const { userInfo } = useAuth();
  console.log("userInfo", userInfo);
  return (
    <HeaderStyles>
      <div className="container">
        <div className="header-main">
          <NavLink to={"/"}>
            <img srcSet="/logo.png 2x" alt="mokey-blogging" className="logo" />
          </NavLink>
          <ul className="menu">
            {menuLinks.map((item, index) => (
              <li key={index}>
                <NavLink to={item.url}>{item.title}</NavLink>
              </li>
            ))}
          </ul>
          <div className="search">
            <input
              type="text"
              className="search-input"
              placeholder="Search posts..."
            />
            <span className="search-icon">
              <svg
                width="16"
                height="14"
                viewBox="0 0 16 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <ellipse
                  cx="7.66669"
                  cy="7.05161"
                  rx="6.66669"
                  ry="6.05161"
                  stroke="#999999"
                  strokeWidth="1.5"
                />
              </svg>
            </span>
          </div>

          {!userInfo ? (
            <Button
              type="button"
              height="56px"
              to="/sign-up"
              className="header-button"
            >
              Sign Up
            </Button>
          ) : (
            <div className="header-auth">
              <span>Welcome back, </span>
              <strong className="text-primary">
                {getLastName(userInfo?.displayName)}
              </strong>
            </div>
          )}
        </div>
      </div>
    </HeaderStyles>
  );
};

export default Header;
