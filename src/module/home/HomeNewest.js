import Heading from "../../components/layout/Heading";
import PostItem from "../../module/post/PostItem";
import PostNewestItem from "../../module/post/PostNewestItem";
import PostNewestLarge from "../../module/post/PostNewestLarge";
import React from "react";
import styled from "styled-components";
import { useState } from "react";
import { useEffect } from "react";
import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase/firebase-config";

const HomeNewestStyles = styled.div`
  .layout {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-gap: 40px;
    margin-bottom: 64px;
    align-items: start;
  }
  .sidebar {
    padding: 28px 20px;
    background-color: #f3edff;
    border-radius: 16px;
  }
`;

const HomeNewest = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const colRef = collection(db, "posts");
    const queries = query(colRef, orderBy("createAt", "desc"));

    onSnapshot(queries, (snapshot) => {
      const result = [];
      snapshot.forEach((doc) => {
        result.push({ id: doc.id, ...doc.data() });
      });
      console.log(result);
      setPosts(result);
    });
  }, []);
  if (!posts) return;
  const [first, ...rest] = posts;
  console.log(rest);
  return (
    <HomeNewestStyles className="home-block">
      <div className="container">
        <Heading>Mới nhất</Heading>
        <div className="layout">
          <PostNewestLarge data={first}></PostNewestLarge>
          <div className="sidebar">
            {rest.length > 0 &&
              rest
                .slice(1, 4)
                .map((item) => (
                  <PostNewestItem key={item.id} data={item}></PostNewestItem>
                ))}
          </div>
        </div>
        <div className="grid-layout grid-layout--primary">
          {rest.slice(0, 4).length > 0 &&
            rest.slice(2, 6).length < 0 &&
            rest
              .slice(0, 4)
              .map((item) => <PostItem key={item.id} data={item}></PostItem>)}
          {rest.slice(2, 6).length > 0 &&
            rest.slice(7, 11).length < 0 &&
            rest
              .slice(2, 6)
              .map((item) => <PostItem key={item.id} data={item}></PostItem>)}
          {rest.slice(7, 11).length > 0 &&
            rest
              .slice(7, 11)
              .map((item) => <PostItem key={item.id} data={item}></PostItem>)}
        </div>
      </div>
    </HomeNewestStyles>
  );
};

export default HomeNewest;
