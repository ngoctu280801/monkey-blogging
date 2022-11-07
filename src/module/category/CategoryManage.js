import DashboardHeading from "../dashboard/DashboardHeading";
import React, { useEffect, useState } from "react";
import { Button } from "../../components/button";
import Table from "../../components/table/Table";
import { LabelStatus } from "../../components/label";
import { ActionDelete, ActionEdit, ActionView } from "../../components/action";
import { db } from "../../firebase/firebase-config";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { categoryStatus } from "../../utils/constants";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CategoryManage = () => {
  const [categoryList, setCategoryList] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const colRef = collection(db, "categories");
    onSnapshot(colRef, (snapshot) => {
      let results = [];
      snapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
      setCategoryList(results);
    });
  }, [categoryList]);

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
    // try {
    //   await deleteDoc(doc(db, "categories", id));
    //   toast.success("Category deleted");
    // } catch (error) {
    //   toast.error(error.message);
    // }
  };

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
    </div>
  );
};

export default CategoryManage;
