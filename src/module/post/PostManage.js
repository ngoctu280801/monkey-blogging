import { Pagination } from "../../components/pagination";
import { Table } from "../../components/table";
import React, { useState } from "react";
import DashboardHeading from "../dashboard/DashboardHeading";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { ITEMS_PER_PAGE, postStatus } from "../../utils/constants";
import Button from "../../components/button/Button";
import { debounce } from "lodash";
import Swal from "sweetalert2";
import { ActionDelete, ActionEdit, ActionView } from "../../components/action";
import { LabelStatus } from "../../components/label";

const PostManage = () => {
  const [postList, setPostList] = useState([]);
  const [filter, setFilter] = useState("");
  const [total, setTotal] = useState(0);
  const [lastDocs, setLastDocs] = useState();
  console.log(postList);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const colRef = collection(db, "posts");
      const newRef = filter
        ? query(
            colRef,
            where("title", ">=", filter),
            where("title", "<=", filter + "utf8"),
            limit(ITEMS_PER_PAGE)
          )
        : query(colRef, limit(ITEMS_PER_PAGE));
      const documentSnapshots = await getDocs(newRef);

      const lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];

      //GET FULL SIZE
      const colRefSize = filter
        ? query(
            colRef,
            where("title", ">=", filter),
            where("title", "<=", filter + "utf8")
          )
        : query(colRef);
      onSnapshot(colRefSize, (snapshot) => {
        console.log("total", snapshot.size);

        setTotal(snapshot.size);
      });

      onSnapshot(newRef, (snapshot) => {
        let results = [];
        snapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() });
        });

        setPostList(results);
      });
      setLastDocs(lastVisible);
    };
    fetchData();
  }, [filter]);

  const handleLoadmorePost = async () => {
    const nextRef = filter
      ? query(
          collection(db, "posts"),
          where("title", ">=", filter),
          where("title", "<=", filter + "utf8"),

          limit(ITEMS_PER_PAGE),
          startAfter(lastDocs || 0)
        )
      : query(
          collection(db, "posts"),
          startAfter(lastDocs || 0),
          limit(ITEMS_PER_PAGE)
        );
    onSnapshot(nextRef, (snapshot) => {
      let results = [];
      snapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
      console.log("Resullt", results);
      setPostList([...postList, ...results]);
    });

    const documentSnapshots = await getDocs(nextRef);

    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastDocs(lastVisible);
  };

  const renderPostItem = (post) => {
    const date = post?.createAt?.seconds
      ? new Date(post?.createAt?.seconds * 1000)
      : new Date();
    const formatDate = new Date(date).toLocaleDateString("vi-VI");
    return (
      <tr key={post.id}>
        <td title={post.id}>{post.id.slice(0, 5) + "..."}</td>
        <td>
          <div className="flex items-center gap-x-3">
            <img
              src={post.image}
              alt=""
              className="w-[66px] h-[55px] rounded object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold limit_wrap" title={post.title}>
                {post.title}
              </h3>
              <time className="text-sm text-gray-500">{formatDate}</time>
            </div>
          </div>
        </td>
        <td>
          <span className="text-gray-500">{post.category?.name}</span>
        </td>
        <td>
          <span className="text-gray-500 font-semibold">
            {post.user?.fullname}
          </span>
        </td>
        <td>
          {" "}
          {post.status === postStatus.APPROVED && (
            <LabelStatus type="success">Approved</LabelStatus>
          )}
          {post.status === postStatus.PENDING && (
            <LabelStatus type="warning">Pending</LabelStatus>
          )}
          {post.status === postStatus.REJECTED && (
            <LabelStatus type="danger">Rejected</LabelStatus>
          )}
        </td>
        <td>
          <div className="flex items-center gap-x-3 text-gray-500">
            <ActionView></ActionView>
            <ActionEdit></ActionEdit>
            <ActionDelete
              onClick={() => handleDeletePost(post.id)}
            ></ActionDelete>
          </div>
        </td>
      </tr>
    );
  };
  const handleDeletePost = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(doc(db, "posts", id));
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };

  const handleSetFilter = debounce((e) => setFilter(e.target.value), 500);
  return (
    <div>
      <DashboardHeading title="All posts" desc="Manage all posts">
        <div className="mb-10 flex justify-end">
          <div className="w-full max-w-[300px]">
            <input
              onChange={handleSetFilter}
              type="text"
              className="w-full p-4 rounded-lg border border-solid border-gray-300"
              placeholder="Search post..."
            />
          </div>
        </div>
      </DashboardHeading>

      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Post</th>
            <th>Category</th>
            <th>Author</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {postList.length > 0 && postList.map((post) => renderPostItem(post))}
        </tbody>
      </Table>
      <div className="mt-10">
        {postList.length < total && (
          <Button
            kind="ghost"
            className="mx-auto w-[200px]"
            onClick={handleLoadmorePost}
          >
            More
          </Button>
        )}
      </div>
    </div>
  );
};

export default PostManage;
