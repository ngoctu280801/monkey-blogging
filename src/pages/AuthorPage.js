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
import { db } from "../firebase/firebase-config";
import PostItem from "../module/post/PostItem";
import AuthorBox from "../module/user/AuthorBox";
import { ITEMS_PER_PAGE } from "../utils/constants";

const AuthorPage = () => {
  const [posts, setPosts] = useState([]);
  const { username } = useParams();
  const [user, setUser] = useState({});
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("");
  const [allPost, setAllPost] = useState([]);
  const [nextPost, setNextPost] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const colRef = collection(db, "posts");
      const newRef = filter
        ? query(colRef, where("user.username", "==", username))
        : query(
            colRef,
            where("user.username", "==", username),
            limit(ITEMS_PER_PAGE)
          );

      //GET FULL SIZE
      let allPost = [];
      onSnapshot(colRef, (snapshot) => {
        // let results = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data?.user?.username === username && inPost(data.title, filter)) {
            allPost.push({ id: doc.id, ...doc.data() });
          }
        });
        setTotal(allPost.length);
      });

      onSnapshot(newRef, (snapshot) => {
        let results = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (inPost(data.title, filter)) {
            results.push({ id: doc.id, ...doc.data() });
          }
        });
        if (filter) results = results.slice(0, ITEMS_PER_PAGE); //limit
        // console.log("allPost", allPost);
        // //   setLastDocs(lastVisible);
        // console.log("lastItem", results[results.length - 1]);
        // console.log(
        //   "nextPos",
        //   getIndexOfLastItem(allPost, results[results.length - 1])
        // );
        const newPos = getIndexOfLastItem(allPost, results[results.length - 1]);
        setNextPost(newPos);
        setPosts(results);
        setAllPost(allPost);
      });
    };
    fetchData();
  }, [username, filter]);

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

  const inPost = (title, filter) => {
    if (title.toLowerCase().includes(filter.toLowerCase())) {
      return true;
    }
    return false;
  };
  const getIndexOfLastItem = (allPost, item) => {
    for (let i = 0; i < allPost.length; i++) {
      const post = allPost[i];
      if (post.id === item.id) {
        return i;
      }
    }
    return -1;
  };
  const handleSetFilter = debounce((e) => setFilter(e.target.value), 500);
  const handleLoadmorePost = async () => {
    const results = allPost.slice(nextPost + 1, nextPost + 1 + ITEMS_PER_PAGE);
    // console.log("nextPost in loadmore", nextPost);
    // console.log("post in loadmore", posts);
    // console.log("result in loadmore", results);
    setPosts([...posts, ...results]);
    setNextPost(nextPost + ITEMS_PER_PAGE);
  };

  if (!username) return;
  return (
    <Layout>
      <div className="container !mb-10">
        <div className="pt-10"></div>
        <AuthorBox user={user} className="w-2/3 mb-10"></AuthorBox>
        <div className="flex justify-between items-">
          <Heading>Bài viết của {user?.fullname}</Heading>
          <input
            placeholder="Search a post..."
            className="py-4 px-5 mb-5 border border-gray-300 outline-none rounded-lg"
            onChange={handleSetFilter}
          ></input>
        </div>
        <div className="grid-layout grid-layout--primary">
          {posts.map((item) => (
            <PostItem key={item.id} data={item}></PostItem>
          ))}
        </div>
        {posts.length < total && (
          <Button onClick={handleLoadmorePost} className="mx-auto mt-10 ">
            Load more
          </Button>
        )}
      </div>
    </Layout>
  );
};

export default AuthorPage;
