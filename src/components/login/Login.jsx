import { useState } from "react";
import "./login.scss";
import { collection, query, where, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import upload from "../../lib/upload";

const Login = () => {
  const [profileImg, setProfileImg] = useState({
    file: null,
    url: "",
  });

  const [loading, setLoading] = useState(false);

  const handleProfilePicture = (e) => {
    if (e.target.files[0]) {
      setProfileImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  //////////////////////////////
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target);
      const { username, email, password } = Object.fromEntries(formData);

      // VALIDATE INPUTS
      if (!username || !email || !password) {
        toast.warn("Please enter inputs!");
        setLoading(false);
        return;
      }
      if (!profileImg.file) {
        toast.warn("Please upload profile picture!");
        setLoading(false);
        return;
      }

      // VALIDATE UNIQUE USERNAME
      const usersRef = collection(db, "chatheads");
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        toast.warn("Select another username");
        setLoading(false);
        return;
      }

      const res = await createUserWithEmailAndPassword(auth, email, password);

      const imgUrl = await upload(profileImg.file);

      await setDoc(doc(db, "chatheads", res.user.uid), {
        username,
        email,
        profileImg: imgUrl,
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });

      toast.success("Account created successfully!");
    } catch (err) {
        console.log(err);
        toast.error(err.message);
    } finally {
        setLoading(false);
    }
  };
  ///////////////////////////

  ///////////////////////////
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Clicked");

    try {
      const formData = new FormData(e.target);
      const email = formData.get("email");
      const password = formData.get("password");
  
      await signInWithEmailAndPassword(auth, email, password);
      window.location.reload();
    } catch (err) {
      console.log(err);
      toast.error("Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };
  /////////////////////////

  return (
    <div className="login">

      <div className="item">

        <h2>VirtuMart Customer Care Portal</h2>

        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button disabled={loading}>{loading ? "Loading" : "Sign In"}</button>
        </form>

      </div>

{/*   <div className="separator"></div>
      <div className="item">

        <h2>Create an Account</h2>

        <form onSubmit={handleRegister}>
          <label htmlFor="file">
            <img src={profileImg.url || "./profileImg.png"} alt="" />
            Upload an image
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleProfilePicture}
          />
          <input type="text" placeholder="Username" name="username" />
          <input type="text" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button disabled={loading}>{loading ? "Loading" : "Sign Up"}</button>
        </form>

      </div> */}
    </div>
  );
};

export default Login;
