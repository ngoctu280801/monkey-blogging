import Heading from "../components/layout/Heading";
import Layout from "../components/layout/Layout";
import PostCategory from "../module/post/PostCategory";
import PostImage from "../module/post/PostImage";
import PostItem from "../module/post/PostItem";
import PostMeta from "../module/post/PostMeta";
import React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import { useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { useState } from "react";
import parse from "html-react-parser";
import AuthorBox from "../module/user/AuthorBox";
import PostRelated from "../module/post/PostRelated";
const PostDetailsPageStyles = styled.div`
  padding-bottom: 100px;
  .post {
    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 40px;
      margin: 40px 0;
    }
    &-feature {
      width: 100%;
      max-width: 640px;
      height: 466px;
      border-radius: 20px;
    }
    &-heading {
      font-weight: bold;
      font-size: 36px;
      margin-bottom: 16px;
    }
    &-info {
      flex: 1;
    }
    &-content {
      max-width: 700px;
      margin: 80px auto;
    }
  }
  .author {
    /* margin-top: 40px;
    margin-bottom: 80px; */
    display: flex;
    border-radius: 20px;
    background-color: ${(props) => props.theme.grayF3};
    &-image {
      width: 200px;
      height: 200px;
      flex-shrink: 0;
      border-radius: inherit;
    }
    &-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
    }
    &-content {
      flex: 1;
      padding: 20px;
    }
    &-name {
      font-weight: bold;
      margin-bottom: 10px;
      font-size: 20px;
    }
    &-desc {
      font-size: 14px;
      line-height: 2;
    }
  }
  @media screen and (max-width: 1023.98px) {
    padding-bottom: 40px;
    .post {
      &-header {
        flex-direction: column;
      }
      &-feature {
        height: auto;
      }
      &-heading {
        font-size: 26px;
      }
      &-content {
        margin: 40px 0;
      }
    }
    .author {
      flex-direction: column;
      &-image {
        width: 100%;
        height: auto;
      }
    }
  }
`;

const PostDetailsPage = () => {
  const [post, setPost] = useState({});

  const { slug } = useParams();
  useEffect(() => {
    async function fetchData() {
      if (!slug) return;
      const q = query(collection(db, "posts"), where("slug", "==", slug));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setPost({ id: doc.id, ...doc.data() });
      });
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);
  useEffect(() => {
    document.body.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [slug]);

  if (!slug) return <NotFoundPage></NotFoundPage>;
  if (!post.title) return;
  const { user } = post;

  const date = post?.createAt?.seconds
    ? new Date(post?.createAt?.seconds * 1000)
    : new Date();
  const formatDate = new Date(date).toLocaleDateString("vi-VI");

  return (
    <PostDetailsPageStyles>
      <Layout>
        <div className="container">
          <div className="post-header">
            <PostImage url={post.image} className="post-feature"></PostImage>
            <div className="post-info">
              <PostCategory
                to={`/category/${post.category?.slug}`}
                className="mb-6"
              >
                {post.category?.name}
              </PostCategory>
              <h1 className="post-heading">{post.title}</h1>
              <PostMeta
                date={formatDate}
                author={post.user?.fullname}
                to={`/author/${post.user?.username}`}
              ></PostMeta>
            </div>
          </div>
          <div className="post-content">
            <div className="entry-content">{parse(post.content || "")}</div>
            <AuthorBox user={user}></AuthorBox>
          </div>
          <PostRelated categoryId={post.category?.id}></PostRelated>
        </div>
      </Layout>
    </PostDetailsPageStyles>
  );
};

export default PostDetailsPage;
