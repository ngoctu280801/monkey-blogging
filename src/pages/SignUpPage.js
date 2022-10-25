import React from "react";
import styled from "styled-components";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { useForm } from "react-hook-form";
import { IconEyeClose } from "../components/icon";
import Field from "../components/field/Field";

const SignUpPageStyles = styled.div`
  min-height: 100vh;
  padding: 40px;
  .logo {
    margin: 0 auto 20px;
  }
  .heading {
    text-align: center;
    color: ${(props) => props.theme.primary};
    font-size: 40px;
    font-weight: 600;
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }
  .form {
    max-width: 600px;
    margin: 0 auto;
  }
`;
const SignUpPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, watch },
  } = useForm({});
  const handleSignUp = (values) => {
    console.log(values);
  };
  return (
    <SignUpPageStyles>
      <div className="container">
        <img srcSet="/logo.png 2x" alt="monkey-blogging" className="logo" />
        <h1 className="heading">Money Blogging</h1>
        <form className="form" onSubmit={handleSubmit(handleSignUp)}>
          <Field>
            <Label className="label" htmlFor="fullname">
              Fullname
            </Label>
            <Input
              name="fullname"
              type="text"
              placeholder="Enter your fullname"
              control={control}
            ></Input>
          </Field>
          <Field>
            <Label className="label" htmlFor="email">
              Email Address
            </Label>
            <Input
              name="email"
              type="email"
              placeholder="Enter your Email Address"
              control={control}
            ></Input>
          </Field>
          <Field>
            <Label className="label" htmlFor="password">
              Password
            </Label>
            <Input
              name="password"
              type="password"
              //   className="input"
              placeholder="Enter your password"
              control={control}
              hasIcon
            >
              <IconEyeClose className="input-icon"></IconEyeClose>
            </Input>
          </Field>
        </form>
      </div>
    </SignUpPageStyles>
  );
};

export default SignUpPage;
