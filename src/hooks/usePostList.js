import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { debounce } from "lodash";
import { useEffect } from "react";
import { useState } from "react";
import { getIndexOfLastItem, inPost } from "../config";
import { db } from "../firebase/firebase-config";
import { ITEMS_PER_PAGE } from "../utils/constants";

export default function usePostList(username = "") {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("");
  const [allPost, setAllPost] = useState([]);
  const [nextPost, setNextPost] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const colRef = collection(db, "posts");
      let newRef = colRef;
      if (username !== "") {
        newRef = filter
          ? query(colRef, where("user.username", "==", username))
          : query(
              colRef,
              where("user.username", "==", username),
              limit(ITEMS_PER_PAGE)
            );
      } else {
        if (!filter) newRef = query(colRef, limit(ITEMS_PER_PAGE));
      }

      //GET FULL SIZE
      let allPost = [];
      onSnapshot(colRef, (snapshot) => {
        // let results = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (username !== "") {
            if (
              data?.user?.username === username &&
              inPost(data.title, filter)
            ) {
              allPost.push({ id: doc.id, ...doc.data() });
            }
          } else {
            if (inPost(data.title, filter)) {
              allPost.push({ id: doc.id, ...doc.data() });
            }
          }
        });
        console.log("sizee", allPost.length);
        setTotal(allPost.length);
      });

      onSnapshot(newRef, (snapshot) => {
        console.log("snapshot", snapshot.size);
        let results = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          console.log("data", data);
          if (inPost(data.title, filter)) {
            results.push({ id: doc.id, ...doc.data() });
          }
        });
        console.log("results", results);
        if (filter) results = results.slice(0, ITEMS_PER_PAGE); //limit
        console.log("itemsLast", results[results.length - 1]);
        const newPos = getIndexOfLastItem(allPost, results[results.length - 1]);
        setNextPost(newPos);
        setPosts(results);
        setAllPost(allPost);
      });
    };
    fetchData();
  }, [username, filter]);

  const handleSetFilter = debounce((e) => setFilter(e.target.value), 500);
  const handleLoadmorePost = async () => {
    const results = allPost.slice(nextPost + 1, nextPost + 1 + ITEMS_PER_PAGE);
    // console.log("nextPost in loadmore", nextPost);
    // console.log("post in loadmore", posts);
    // console.log("result in loadmore", results);
    setPosts([...posts, ...results]);
    setNextPost(nextPost + ITEMS_PER_PAGE);
  };
  return {
    posts,
    total,
    handleLoadmorePost,
    handleSetFilter,
  };
}
