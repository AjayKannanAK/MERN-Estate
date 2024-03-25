import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {useDispatch, useSelector} from 'react-redux'
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  //const [loading, setLoading] = useState(false);
  //const [error, setError] = useState(null);
  const {loading, error} = useSelector((state) => state.user); //user -> state name is user inside userSlice.js
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id] : e.target.value
    });
  }
  //console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      //setLoading(true);
      dispatch(signInStart());

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if(data.success == false) {
        //setError(data.message);
        //setLoading(false);
        dispatch(signInFailure(data.message));
        return
      }
      //setLoading(false);
      //setError(null);
      dispatch(signInSuccess(data));
      navigate("/")
    } catch (error) {
      //setError(error.message);
      //setLoading(false);
      dispatch(signInFailure(error.message));
    }

  }

  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-3xl font-semibold text-center my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="text" placeholder="Email" className="border rounded-lg p-3" id="email" onChange={handleChange}/>
        <input type="password" placeholder="Password" className="border rounded-lg p-3" id="password" onChange={handleChange}/>
        <button className="bg-slate-700 text-white rounded-lg p-3 hover:opacity-95 disabled:opacity-80 uppercase">{ loading ? "Loading..." : "Sign In"}</button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont Have an account?</p>
        <Link to={"/sign-up"} className="text-blue-700"><span>Sign up</span></Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  )
}