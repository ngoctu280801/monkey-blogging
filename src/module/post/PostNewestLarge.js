import React from "react";
import slugify from "slugify";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostImage from "./PostImage";
import PostMeta from "./PostMeta";
import PostTitle from "./PostTitle";
const PostNewestLargeStyles = styled.div`
  .post {
    &-image {
      display: block;
      margin-bottom: 16px;
      height: 433px;
      border-radius: 16px;
    }
    &-category {
      margin-bottom: 10px;
    }
    &-info {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
      font-weight: 600;
      margin-left: auto;
    }
    &-dot {
      display: inline-block;
      width: 4px;
      height: 4px;
      background-color: currentColor;
      border-radius: 100rem;
    }
    &-title {
      margin-bottom: 12px;
    }
    &-meta {
      color: ${(props) => props.theme.gray6B};
    }
  }
`;

const PostNewestLarge = ({ data }) => {
  if (!data) return;
  const { category, user } = data;
  const date = data?.createAt?.seconds
    ? new Date(data?.createAt?.seconds * 1000)
    : new Date();
  const formatDate = new Date(date).toLocaleDateString("vi-VI");
  return (
    <PostNewestLargeStyles>
      <PostImage url={data.image} alt=""></PostImage>
      <PostCategory
        to={`/category/${category?.slug}`}
        className="post-category"
      >
        {data.category?.name}
      </PostCategory>
      <PostTitle className="post-title" to={data.slug}>
        {data.title}
      </PostTitle>
      <PostMeta
        to={`/profile/${user?.username}` || ""}
        className="post-meta"
        author={user?.fullname}
        date={formatDate}
      ></PostMeta>
    </PostNewestLargeStyles>
  );
};

export default PostNewestLarge;
