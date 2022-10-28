import React from "react";
import styled from "styled-components";
import Button from "../../components/button/Button";

const HomeBannerStyles = styled.div`
  margin-bottom: 60px;
  background-image: linear-gradient(
    to right bottom,
    ${(props) => props.theme.primary},
    ${(props) => props.theme.secondary}
  );
  .banner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 520px;
  }
  .banner > div {
    width: 50%;
  }
  .banner-content {
    color: white;
  }
  .heading {
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 28px;
  }
  .script {
    margin-bottom: 48px;
    line-height: 28px;
  }
  .banner-btn {
    padding: 16px 43px;
    border-radius: 8px;
  }
`;
const HomeBanner = () => {
  return (
    <HomeBannerStyles>
      <div className="container">
        <div className="banner">
          <div className="banner-content">
            <h1 className="heading">Monkey Blogging</h1>
            <p className="script">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi.
            </p>
            <Button to={"/sign-up"} kind="secondary">
              Get started
            </Button>
          </div>
          <div className="banner-image">
            <img className="img" srcSet="./banner.png" alt="money-blogging" />
          </div>
        </div>
      </div>
    </HomeBannerStyles>
  );
};

export default HomeBanner;
