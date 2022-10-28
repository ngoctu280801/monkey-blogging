import { values } from "lodash";
import React, { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import Button from "../components/button/Button";
import Field from "../components/field/Field";
import { IconEyeClose, IconEyeOpen } from "../components/icon";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { useAuth } from "../contexts/auth-context";
import AuthenticationPage from "./AuthenticationPage";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase-config";

const schema = yup.object({
  email: yup
    .string()
    .required("Please enter your email")
    .email("Please enter valid email address"),
  password: yup
    .string()
    .min(8, "Your password must be at least 8 characters or greater")
    .required("Please enter your password"),
});

const SignInPage = () => {
  const [togglePassword, setTogglePassword] = useState(false);
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, watch, reset },
  } = useForm({ mode: "onChange", resolver: yupResolver(schema) });
  console.log("email login: ", values.email);
  useEffect(() => {
    document.title = "Sign In";
    if (userInfo?.email) navigate("/");
  }, [userInfo]);

  useEffect(() => {
    const arrErrors = Object.values(errors);
    if (arrErrors.length > 0)
      toast.error(arrErrors[0].message, {
        pauseOnHover: false,
        delay: 100,
      });
  }, [errors]);
  const handleSignIn = async (values) => {
    if (!isValid) return;
    await signInWithEmailAndPassword(auth, values.email, values.password);
    toast.success("Login Successfully");
    navigate("/");
  };
  return (
    <AuthenticationPage>
      <form onSubmit={handleSubmit(handleSignIn)}>
        <Field>
          <Label htmlFor="email">Email Address</Label>
          <Input
            name="email"
            type="email"
            placeholder="Enter your Email Address"
            control={control}
          ></Input>
        </Field>
        <Field>
          <Label htmlFor="password">Password</Label>
          <Input
            name="password"
            type={togglePassword ? "text" : "password"}
            //   className="input"
            placeholder="Enter your password"
            control={control}
            hasIcon
          >
            {togglePassword ? (
              <IconEyeOpen
                className="input-icon"
                onClick={() => setTogglePassword(false)}
              ></IconEyeOpen>
            ) : (
              <IconEyeClose
                className="input-icon"
                onClick={() => setTogglePassword(true)}
              ></IconEyeClose>
            )}
          </Input>
        </Field>
        <div className="have-account">
          You havev't had an account yet?{" "}
          <NavLink to={"/sign-up"}>Sign Up</NavLink>
        </div>
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
          style={{ margin: "0 auto", maxWidth: "300px", width: "100%" }}
        >
          Sign In
        </Button>
      </form>
    </AuthenticationPage>
  );
};

export default SignInPage;
