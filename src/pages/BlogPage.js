import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Heading from "../components/layout/Heading";
import Layout from "../components/layout/Layout";
import usePostList from "../hooks/usePostList";
import HomeBanner from "../module/home/HomeBanner";
import BlogList from "./BlogList";

const BlogPage = () => {
  const { posts, total, handleLoadmorePost, handleSetFilter } = usePostList();
  return (
    <Layout>
      <div className="container !mb-10">
        <div className="pt-10"></div>
        <BlogList
          title="Blog"
          handleSetFilter={handleSetFilter}
          handleLoadmorePost={handleLoadmorePost}
          total={total}
          posts={posts}
        ></BlogList>
      </div>
    </Layout>
  );
};

export default BlogPage;
