"use client";

import { signIn } from "next-auth/react";
import ContentHeading from "../../Layout/Typography/ContentHeading";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { AuthAction } from "../AuthContextProvider";

export default function LoginModalContent({contentSwitchCallback, closeCallback, successCallback}: {contentSwitchCallback: (newAction: AuthAction) => void, closeCallback: () => void, successCallback: () => void}) {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col justify-center text-center my-2 mx-4 gap-4">
      <ContentHeading as="h2" className="m-0">Log In</ContentHeading>
      <form className="flex flex-col justify-center gap-4" action={async (formData) => {
        setMessage("");
        setLoading(true);
        const response = await signIn("credentials", {redirect: false, username: formData.get("username"), password: formData.get("password")});
        setLoading(false);
        if (response && response.ok) {
          setSuccess(true);
          setMessage("Login Successful"); //TODO: Replace with toast
          successCallback();
          setTimeout(() => {closeCallback();}, 100);
        }
        else if (response && response.status == 401)
          setMessage("Invalid Credentials");
        else
          setMessage("An error occurred.");
      }}>
        <div>
          <label htmlFor="user">Username</label><br/>
          <input required id="user" name="username" type="text" onChange={() => setMessage("")}/>
        </div>
        <div>
          <label htmlFor="pass">Password</label><br/>
          <input required id="pass" name="password" type="password" onChange={() => setMessage("")}/>
        </div>
        <button type="submit" className="text-xl rounded-md bg-jj-purple-1 text-white p-2 flex justify-center" disabled={success || loading}>
          {loading ?
            <FaSpinner size={20} className="animate-spin"/>
            : "Log In"
          }
        </button>
      </form>
      <div className="flex justify-around gap-4">
        <a onClick={() => contentSwitchCallback("Sign Up")}>Create Account</a>
        <a onClick={() => contentSwitchCallback("Recovery")}>Account Recovery</a>
      </div>
      {message &&
        <span className={`${success ? "text-green-700" : "text-red-700"} animate-flash`}>{message}</span>
      }
    </div>
  );
}