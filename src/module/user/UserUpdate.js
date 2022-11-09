import { doc, getDoc, updateDoc } from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import slugify from "slugify";
import { Button } from "../../components/button";
import { Radio } from "../../components/checkbox";
import { Field } from "../../components/field";
import FieldCheckboxes from "../../components/field/FieldCheckboxes";
import ImageUpload from "../../components/image/ImageUpload";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import { db } from "../../firebase/firebase-config";
import useFirebaseImage from "../../hooks/useFirebaseImage";
import { userRole, userStatus } from "../../utils/constants";
import DashboardHeading from "../dashboard/DashboardHeading";

const UserUpdate = () => {
  const {
    control,
    reset,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { isSubmitting },
  } = useForm({
    mode: "onChange",
  });

  const { handleChangeImage, progress, image, setImage, handleDeleteImage } =
    useFirebaseImage(setValue, getValues);
  const [params] = useSearchParams();
  const userId = params.get("id");
  const navigate = useNavigate();
  let image_name = "";
  if (image) {
    image_name = /%2F(\S+)\?/gm.exec(image)[1];
    console.log("image_name", image_name);
  }

  useEffect(() => {
    async function fetchData() {
      if (!userId) return;
      const colRef = doc(db, "users", userId);
      const singleDoc = await getDoc(colRef);
      console.log({ ...singleDoc.data(), image: singleDoc.data().avatar });
      const image = singleDoc.data().avatar;
      setImage(image);
      reset({ ...singleDoc.data() });
    }
    fetchData();
  }, [userId, reset, setImage]);

  const watchStatus = watch("status");
  const watchRole = watch("role");

  const handleUpdateUser = async (values) => {
    const colRef = doc(db, "users", userId);
    await updateDoc(colRef, {
      ...values,

      username: slugify(values.username || values.fullname, {
        lower: true,
        replacement: "",
        trim: true,
      }),
      avatar: image,
      status: Number(values.status),
      role: Number(values.role),
    });
    toast.success("Update Successfully");
    navigate("/manage/user");
  };
  const handleDeleteAvatar = async () => {
    const colRef = doc(db, "users", userId);
    const singleDoc = await getDoc(colRef);
    await updateDoc(colRef, {
      ...singleDoc.data(),
      avatar: "",
    });
    handleDeleteImage();
  };
  return (
    <div>
      <DashboardHeading
        title="Update user"
        desc="Update user information"
      ></DashboardHeading>
      <form onSubmit={handleSubmit(handleUpdateUser)}>
        <div className="w-[200px] h-[200px] mx-auto rounded-full mb-10">
          <ImageUpload
            name="image"
            onChange={handleChangeImage}
            progress={progress}
            image={image}
            handleDeleteImage={handleDeleteAvatar}
            className="!rounded-full h-full"
          ></ImageUpload>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Fullname</Label>
            <Input
              name="fullname"
              placeholder="Enter your fullname"
              control={control}
            ></Input>
          </Field>
          <Field>
            <Label>Username</Label>
            <Input
              name="username"
              placeholder="Enter your username"
              control={control}
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Email</Label>
            <Input
              name="email"
              placeholder="Enter your email"
              control={control}
              type="email"
              disabled={true}
            ></Input>
          </Field>
          <Field>
            <Label>Password</Label>
            <Input
              name="password"
              placeholder="Enter your password"
              control={control}
              type="password"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Status</Label>
            <FieldCheckboxes>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === userStatus.ACTIVE}
                value={userStatus.ACTIVE}
              >
                Active
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === userStatus.PENDING}
                value={userStatus.PENDING}
              >
                Pending
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === userStatus.BAN}
                value={userStatus.BAN}
              >
                Banned
              </Radio>
            </FieldCheckboxes>
          </Field>
          <Field>
            <Label>Role</Label>
            <FieldCheckboxes>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.ADMIN}
                value={userRole.ADMIN}
              >
                Admin
              </Radio>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.MOD}
                value={userRole.MOD}
              >
                Moderator
              </Radio>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.USER}
                value={userRole.USER}
              >
                User
              </Radio>
            </FieldCheckboxes>
          </Field>
        </div>
        <Button
          kind="primary"
          type="submit"
          className="mx-auto w-[200px]"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Update user
        </Button>
      </form>
    </div>
  );
};

export default UserUpdate;
