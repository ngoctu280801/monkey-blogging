import React, { Fragment, useState } from "react";
import { IconEyeClose, IconEyeOpen } from "../icon";
import Input from "./Input";

const InputPasswordToggle = ({ control }) => {
  const [togglePassword, setTogglePassword] = useState(false);
  if (!control) return null;
  return (
    <Fragment>
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
    </Fragment>
  );
};

export default InputPasswordToggle;
