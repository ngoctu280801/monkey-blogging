import DashboardHeading from "../dashboard/DashboardHeading";
import React, { useEffect, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import Table from "../../components/table/Table";
import { ActionDelete, ActionEdit, ActionView } from "../../components/action";
import { useNavigate } from "react-router-dom";
import { userRole, userStatus } from "../../utils/constants";
import { LabelStatus } from "../../components/label";
import Swal from "sweetalert2";
import { deleteUser, getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import Button from "../../components/button/Button";

const UserManage = () => {
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const colRef = collection(db, "users");
      onSnapshot(colRef, (snapshot) => {
        let results = [];
        snapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() });
        });
        setUsers(results);
        console.log("users: ", results);
      });
    };
    fetchData();
  }, []);

  const renderLabelStatus = (status) => {
    switch (status) {
      case userStatus.ACTIVE:
        return <LabelStatus type="success">Active</LabelStatus>;
      case userStatus.PENDING:
        return <LabelStatus type="warning">Pending</LabelStatus>;
      case userStatus.BAN:
        return <LabelStatus type="danger">BAN</LabelStatus>;

      default:
        break;
    }
  };

  const renderLabelRole = (role) => {
    switch (role) {
      case userRole.ADMIN:
        return <div className="font-semibold">Admin</div>;
      case userRole.MOD:
        return <div className="font-semibold">Moderator</div>;
      case userRole.USER:
        return <div className="font-semibold">User</div>;

      default:
        break;
    }
  };

  const renderUserItem = (user) => (
    <tr key={user.id}>
      <td title={user.id}>{user.id.slice(0, 5) + "..."}</td>
      <td className="whitespace-nowrap">
        <div className="flex items-center gap-x-2">
          <img
            src={user.avatar || "/user.png"}
            alt="user"
            className="w-10 h-10 rounded-md object-cover flex-shrink-0"
          ></img>
          <div className="flex flex-col flex-1">
            <p className="font-semibold">{user.fullname}</p>
            <p className="text-sm text-gray-400 font-medium">
              {new Date(user.createAt?.seconds * 1000).toLocaleDateString(
                "vi-VI"
              ) || "5/8/2022"}
            </p>
          </div>
        </div>
      </td>

      <td>
        <h3 title={user.username} className="font-semibold whitespace-nowrap">
          {user.username.slice(0, 10) + "..." || "Mason"}
        </h3>
      </td>
      <td title={user.email}>{user.email.slice(0, 10) + "..."}</td>
      <td>{renderLabelStatus(Number(user.status))}</td>
      <td>{renderLabelRole(Number(user.role))}</td>
      <td>
        <div className="flex items-center  gap-x-3">
          <ActionEdit
            onClick={() => navigate(`/manage/update-user?id=${user.id}`)}
          ></ActionEdit>
          <ActionDelete onClick={() => handleDeleteUser(user)}></ActionDelete>
        </div>
      </td>
    </tr>
  );

  const handleDeleteUser = (user) => {
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
        // await deleteUser(user);

        await deleteDoc(doc(db, "users", user.id));

        Swal.fire("Deleted!", "User has been deleted.", "success");
      }
    });
  };

  return (
    <div>
      <DashboardHeading
        title="Users"
        desc="Manage your user"
      ></DashboardHeading>
      <div className="flex justify-end mb-10">
        <Button kind="ghost" to="/manage/add-user">
          Add new user
        </Button>
      </div>
      <Table>
        <thead>
          <th>Id</th>
          <th>Info</th>
          <th>Username</th>
          <th>Email address</th>
          <th>Status</th>
          <th>Role</th>
          <th>Actions</th>
        </thead>
        <tbody>
          {users.length > 0 && users.map((user) => renderUserItem(user))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserManage;
