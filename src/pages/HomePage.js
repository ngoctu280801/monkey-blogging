import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase-config";
import { useEffect } from "react";
import styled from "styled-components";
import Header from "../components/layout/Header";
import HomeBanner from "../module/home/HomeBanner";
import Layout from "../components/layout/Layout";
import HomeFeature from "../module/home/HomeFeature";
import HomeNewest from "../module/home/HomeNewest";
const HomePage = () => {
  const HomePageStyles = styled.div``;
  return (
    <HomePageStyles>
      <Layout>
        <HomeBanner></HomeBanner>
        <HomeFeature></HomeFeature>
        <HomeNewest></HomeNewest>
      </Layout>
    </HomePageStyles>
  );
};

export default HomePage;
