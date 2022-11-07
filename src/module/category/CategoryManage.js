import DashboardHeading from "../dashboard/DashboardHeading";
import React, { useEffect, useState } from "react";
import { Button } from "../../components/button";
import Table from "../../components/table/Table";
import { LabelStatus } from "../../components/label";
import { ActionDelete, ActionEdit, ActionView } from "../../components/action";
import { db } from "../../firebase/firebase-config";
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
import { categoryStatus, ITEMS_PER_PAGE } from "../../utils/constants";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";

const CategoryManage = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [filter, setFilter] = useState("");
  const [lastDocs, setLastDocs] = useState();
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      const colRef = collection(db, "categories");
      const newRef = filter
        ? query(
            colRef,
            where("name", ">=", filter),
            where("name", "<=", filter + "utf8")
          )
        : query(colRef, limit(ITEMS_PER_PAGE));
      const documentSnapshots = await getDocs(newRef);

      const lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];

      //GET FULL SIZE
      onSnapshot(colRef, (snapshot) => {
        setTotal(snapshot.size);
      });

      onSnapshot(newRef, (snapshot) => {
        let results = [];
        snapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() });
        });
        setCategoryList(results);
      });
      setLastDocs(lastVisible);
    }
    fetchData();
  }, [filter]);

  const handleLoadmoreCategory = async () => {
    const nextRef = query(
      collection(db, "categories"),
      startAfter(lastDocs || 0),
      limit(ITEMS_PER_PAGE)
    );
    onSnapshot(nextRef, (snapshot) => {
      let results = [];
      snapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
      setCategoryList([...categoryList, ...results]);
    });

    const documentSnapshots = await getDocs(nextRef);

    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastDocs(lastVisible);
  };

  const handleDeleteCategory = async (id) => {
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
        await deleteDoc(doc(db, "categories", id));
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };

  const handleSetFilter = debounce((e) => setFilter(e.target.value), 500);

  return (
    <div>
      <DashboardHeading title="Categories" desc="Manage your category">
        <Button kind="ghost" height="60px" to="/manage/add-category">
          Create Category
        </Button>
      </DashboardHeading>
      <input
        placeholder="Search category..."
        className="py-4 px-5 mb-5 border border-gray-300 outline-none rounded-lg"
        onChange={handleSetFilter}
      ></input>
      <Table>
        <thead>
          <th>Id</th>
          <th>Name</th>
          <th>Slug</th>
          <th>Status</th>
          <th>Actions</th>
        </thead>
        <tbody>
          {categoryList.length > 0 &&
            categoryList.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td className="italic text-gray-400">{category.slug}</td>
                <td>
                  {category.status === categoryStatus.APPROVED && (
                    <LabelStatus type="success">Approved</LabelStatus>
                  )}
                  {category.status === categoryStatus.UNAPPROVED && (
                    <LabelStatus type="warning">Unapproved</LabelStatus>
                  )}
                </td>
                <td>
                  <div className="flex items-center  gap-x-3">
                    <ActionView></ActionView>
                    <ActionEdit
                      onClick={() =>
                        navigate(`/manage/update-category?id=${category.id}`)
                      }
                    ></ActionEdit>
                    <ActionDelete
                      onClick={() => handleDeleteCategory(category.id)}
                    ></ActionDelete>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      {categoryList.length < total && (
        <Button onClick={handleLoadmoreCategory} className="mx-auto mt-5">
          Load more
        </Button>
      )}
    </div>
  );
};

export default CategoryManage;
