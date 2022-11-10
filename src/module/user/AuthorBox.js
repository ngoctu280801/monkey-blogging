import React from "react";
import styled from "styled-components";

const AuthorBox = ({ user }) => {
  return (
    <div className="author">
      <div className="author-image">
        <img src={user?.avatar} alt="" />
      </div>
      <div className="author-content">
        <h3 className="author-name">{user?.fullname}</h3>
        <p className="author-desc">{user?.description}</p>
      </div>
    </div>
  );
};

export default AuthorBox;
