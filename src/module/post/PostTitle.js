import React from "react";
import { NavLink } from "react-router-dom";
import styled, { css } from "styled-components";

const PostTitleStyles = styled.div`
  font-weight: bold;
  line-height: 1.5;
  a {
    display: block;
  }
  ${(props) =>
    props.type === "big" &&
    css`
      font-size: 22px;
    `};
  ${(props) =>
    props.type === "normal" &&
    css`
      font-size: 18px;
    `};
`;

const PostTitle = ({ children, type = "big", className = "", to = "/" }) => {
  return (
    <PostTitleStyles type={type} className={`post-title ${className}`}>
      <NavLink to={to}>{children}</NavLink>
    </PostTitleStyles>
  );
};

export default PostTitle;
