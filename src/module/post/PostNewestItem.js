import React from "react";
import slugify from "slugify";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostImage from "./PostImage";
import PostMeta from "./PostMeta";
import PostTitle from "./PostTitle";
const PostNewestItemStyles = styled.h3`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 28px;
  padding-bottom: 28px;
  border-bottom: 1px solid #ccc;
  &:last-child {
    padding-bottom: 0;
    margin-bottom: 0;
    border-bottom: 0;
  }
  .post {
    &-image {
      display: block;
      flex-shrink: 0;
      width: 180px;
      height: 130px;
      border-radius: 12px;
    }
    &-category {
      margin-bottom: 8px;
    }
    &-title {
      margin-bottom: 8px;
    }
    &-content {
      color: ${(props) => props.theme.gray6B};
    }
  }
`;
const PostNewestItem = ({ data }) => {
  if (!data) return;
  const { category, user } = data;
  const date = data?.createAt?.seconds
    ? new Date(data?.createAt?.seconds * 1000)
    : new Date();
  const formatDate = new Date(date).toLocaleDateString("vi-VI");
  return (
    <PostNewestItemStyles>
      <PostImage to="/" url={data.image} alt=""></PostImage>
      <div className="post-content">
        <PostCategory
          type="secondary"
          to={`/category/${category?.slug}`}
          className="post-category"
        >
          {category?.name}
        </PostCategory>
        <PostTitle className="post-title" type="normal" to={data.slug}>
          {data.title}
        </PostTitle>

        <PostMeta
          to={`/profile/${user?.username}` || ""}
          className="post-meta"
          author={user?.fullname}
          date={formatDate}
        ></PostMeta>
      </div>
    </PostNewestItemStyles>
  );
};

export default PostNewestItem;
