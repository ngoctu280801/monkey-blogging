import { doc, getDoc } from "firebase/firestore";
import { identity } from "lodash";
import React, { useEffect, useState } from "react";
import slugify from "slugify";
import styled from "styled-components";
import { db } from "../../firebase/firebase-config";
import PostCategory from "./PostCategory";
import PostImage from "./PostImage";
import PostMeta from "./PostMeta";
import PostTitle from "./PostTitle";
const PostFeatureItemStyles = styled.div`
  width: 100%;
  border-radius: 16px;
  position: relative;
  height: 169px;
  .post {
    &-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 16px;
    }
    &-overlay {
      position: absolute;
      inset: 0;
      border-radius: 16px;
      background: linear-gradient(
        179.77deg,
        #6b6b6b 36.45%,
        rgba(163, 163, 163, 0.622265) 63.98%,
        rgba(255, 255, 255, 0) 99.8%
      );
      mix-blend-mode: multiply;
      opacity: 0.6;
    }
    &-content {
      position: absolute;
      inset: 0;
      z-index: 10;
      padding: 20px;
      color: white;
    }
    &-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    &-category {
    }

    &-title {
      color: white;
    }
    &-meta {
      color: white;
    }
  }
  @media screen and (min-width: 1024px) {
    height: 272px;
  }
`;
const PostFeatureItem = ({ data }) => {
  if (!data || !data.id) return null;
  const { category, user } = data;

  const date = data?.createAt?.seconds
    ? new Date(data?.createAt?.seconds * 1000)
    : new Date();
  const formatDate = new Date(date).toLocaleDateString("vi-VI");
  return (
    <PostFeatureItemStyles>
      <PostImage url={data?.image} alt="unsplash"></PostImage>
      <div className="post-overlay"></div>
      <div className="post-content">
        <div className="post-top">
          {category?.name && (
            <PostCategory to={`/category/${data.category?.slug}`}>
              {category.name}
            </PostCategory>
          )}
          <PostMeta
            to={`/profile/${user?.username}`}
            className="post-meta"
            author={user?.fullname}
            date={formatDate}
            isFeature={true}
          ></PostMeta>
        </div>
        <PostTitle to={data.slug} className="post-title">
          {data.title}
        </PostTitle>
      </div>
    </PostFeatureItemStyles>
  );
};

export default PostFeatureItem;
