import DashboardHeading from "../dashboard/DashboardHeading";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import Table from "../../components/table/Table";
import { ActionDelete, ActionEdit, ActionView } from "../../components/action";
import { useNavigate } from "react-router-dom";

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

  const renderUserItem = (user) => (
    <tr key={user.id}>
      <td title={user.id}>{user.id.slice(0, 5) + "..."}</td>
      <td className="whitespace-nowrap">
        <div className="flex items-center gap-x-2">
          <img
            src="/user.png"
            alt="user"
            className="w-10 h-10 rounded-md object-cover flex-shrink-0"
          ></img>
          <div className="flex flex-col flex-1">
            <p className="font-semibold">{user.fullname}</p>
            <p className="text-sm text-gray-400 font-medium">5/8/2022</p>
          </div>
        </div>
      </td>

      <td>
        <h3 className="font-semibold">Mason</h3>
      </td>
      <td>{user.email}</td>
      <td>Approved</td>
      <td>Admin</td>
      <td>
        <div className="flex items-center  gap-x-3">
          <ActionEdit
            onClick={() => navigate(`/manage/update-user?id=${user.id}`)}
          ></ActionEdit>
          <ActionDelete
            onClick={() => handleDeleteUser(user.id)}
          ></ActionDelete>
        </div>
      </td>
    </tr>
  );

  const handleDeleteUser = (id) => {
    console.log(id);
  };

  return (
    <div>
      <DashboardHeading
        title="Users"
        desc="Manage your user"
      ></DashboardHeading>
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
