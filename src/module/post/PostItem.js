import React from "react";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostTitle from "./PostTitle";
import PostMeta from "./PostMeta";
import PostImage from "./PostImage";
import slugify from "slugify";
const PostItemStyles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .post {
    &-image {
      height: 202px;
      margin-bottom: 20px;
      display: block;
      width: 100%;
      border-radius: 16px;
    }
    &-category {
      margin-bottom: 16px;
    }
    &-title {
      margin-bottom: 8px;
    }
  }
`;

const PostItem = ({ data }) => {
  if (!data) return;
  const date = data?.createAt?.seconds
    ? new Date(data?.createAt?.seconds * 1000)
    : new Date();
  const formatDate = new Date(date).toLocaleDateString("vi-VI");

  return (
    <PostItemStyles>
      <PostImage to={`/${data.slug}`} url={data.image} alt="photo"></PostImage>

      <PostCategory to={`/category/${data.category?.slug}`}>
        {data.category?.name}
      </PostCategory>
      <PostTitle to={`/${data.slug}`} className="post-title" type="normal">
        {data.title}
      </PostTitle>
      <PostMeta
        to={`/author/${data.user?.username}`}
        date={formatDate}
        author={data.user?.fullname}
      ></PostMeta>
    </PostItemStyles>
  );
};

export default PostItem;
