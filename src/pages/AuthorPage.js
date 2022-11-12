import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../components/button";
import Heading from "../components/layout/Heading";
import Layout from "../components/layout/Layout";
import { getIndexOfLastItem, inPost } from "../config";
import { db } from "../firebase/firebase-config";
import usePostList from "../hooks/usePostList";
import PostItem from "../module/post/PostItem";
import AuthorBox from "../module/user/AuthorBox";
import { ITEMS_PER_PAGE } from "../utils/constants";
import BlogList from "./BlogList";

const AuthorPage = () => {
  const [user, setUser] = useState({});

  const { username } = useParams();

  useEffect(() => {
    async function fetchData() {
      const docRef = query(
        collection(db, "users"),
        where("username", "==", username)
      );
      onSnapshot(docRef, (snapshot) => {
        const results = [];
        snapshot.forEach((doc) => {
          results.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setUser(...results);
      });
    }
    fetchData();
  }, [username, setUser]);

  const { posts, total, handleLoadmorePost, handleSetFilter } =
    usePostList(username);

  if (!username) return;
  return (
    <Layout>
      <div className="container !mb-10">
        <div className="pt-10"></div>
        <AuthorBox user={user} className="w-2/3 mb-10"></AuthorBox>
        <BlogList
          title={`Bài viết của ${user?.fullname}`}
          handleSetFilter={handleSetFilter}
          handleLoadmorePost={handleLoadmorePost}
          total={total}
          posts={posts}
        ></BlogList>
      </div>
    </Layout>
  );
};

export default AuthorPage;
