import DashboardHeading from "../dashboard/DashboardHeading";
import React, { useEffect, useState } from "react";
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
import Table from "../../components/table/Table";
import { ActionDelete, ActionEdit, ActionView } from "../../components/action";
import { useNavigate } from "react-router-dom";
import { ITEMS_PER_PAGE, userRole, userStatus } from "../../utils/constants";
import { LabelStatus } from "../../components/label";
import Swal from "sweetalert2";
import { deleteUser, getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import Button from "../../components/button/Button";
import { debounce } from "lodash";

const UserManage = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [lastDocs, setLastDocs] = useState();
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const colRef = collection(db, "users");
      const newRef = filter
        ? query(
            colRef,
            where("username", ">=", filter),
            where("username", "<=", filter + "utf8"),
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
            where("username", ">=", filter),
            where("username", "<=", filter + "utf8")
          )
        : query(colRef);
      onSnapshot(colRefSize, (snapshot) => {
        console.log("size", snapshot.size);
        setTotal(snapshot.size);
      });

      onSnapshot(newRef, (snapshot) => {
        let results = [];
        snapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() });
        });

        setUsers(results);
      });
      setLastDocs(lastVisible);
    };
    fetchData();
  }, [filter]);
  console.log(users);

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

  const handleLoadmoreUser = async () => {
    const nextRef = filter
      ? query(
          collection(db, "users"),
          where("username", ">=", filter),
          where("username", "<=", filter + "utf8"),

          limit(ITEMS_PER_PAGE),
          startAfter(lastDocs || 0)
        )
      : query(
          collection(db, "users"),
          startAfter(lastDocs || 0),
          limit(ITEMS_PER_PAGE)
        );
    onSnapshot(nextRef, (snapshot) => {
      let results = [];
      snapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
      console.log("Resullt", results);
      setUsers([...users, ...results]);
    });

    const documentSnapshots = await getDocs(nextRef);

    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastDocs(lastVisible);
  };

  const handleSetFilter = debounce((e) => setFilter(e.target.value), 500);
  return (
    <div>
      <DashboardHeading
        title="Users"
        desc="Manage your user"
      ></DashboardHeading>
      <div className="flex justify-between mb-10">
        <input
          placeholder="Search by username..."
          className="py-4 px-5 mb-5 border border-gray-300 outline-none rounded-lg"
          onChange={handleSetFilter}
        ></input>
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
      {users.length < total && (
        <Button onClick={handleLoadmoreUser} className="mx-auto mt-5">
          Load more
        </Button>
      )}
    </div>
  );
};

export default UserManage;
