import {
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Heading from "../../components/layout/Heading";
import { db } from "../../firebase/firebase-config";
import PostItem from "./PostItem";

const PostRelated = ({ categoryId = "" }) => {
  const [post, setPost] = useState([]);

  useEffect(() => {
    const docRef = query(
      collection(db, "posts"),
      where("category.id", "==", categoryId),
      limit(4)
    );

    onSnapshot(docRef, (snapshot) => {
      const result = [];

      snapshot.forEach((doc) => {
        result.push({ id: doc.id, ...doc.data() });
      });

      setPost(result);
    });
  }, [categoryId]);
  if (!categoryId || post.length <= 0) return;

  return (
    <div className="post-related">
      <Heading>Bài viết liên quan</Heading>
      <div className="grid-layout grid-layout--primary">
        {post.map((item) => (
          <PostItem key={item.id} data={item}></PostItem>
        ))}
      </div>
    </div>
  );
};

export default PostRelated;
