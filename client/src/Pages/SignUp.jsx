import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //the below function is used to store the user entered input values(username, email, password) while they enter the details
  const handleChange = (e) => {
    setFormData(
      {
        ...formData, //if you are not using this then previous stored values will be lost -> say username is stored in formdata, but on entering email - only email will be stored and username will be gone
        [e.target.id] : e.target.value
      }
    );
  }
  //console.log(formData);


  //the below function is used to fetch a backend call on clicking signup button
  const handleSubmit = async (e) => {
    // e.preventDefault(); -> Prevent the default behavior of clicking on the link. By preventing the default behaviour we are making the browser to do tasks which we have mentioned in this function
    e.preventDefault();  //without this if you click signup button then page will refresh and values will be lost. so to prevent this we are using this

    try {
      setLoading(true); //while clicking the buttom we make loading to true so that we can disable the button and change the button text from "SIGN UP" to "LOADING..."

      const res = await fetch("/api/auth/signup", {   //see we are not adding the full address "http://localhost:8080". This is because we have created a proxy in vite.config.js which says each time a request starts with /api => add "http://localhost:8080" to its front
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      }) ;

      const data = await res.json();
      //console.log(data);
      if(data.success == false) {
        setError(data.message);
        setLoading(false);
        return
      }
      setLoading(false);
      setError(null); //if there is an previous error message then on successfull user creation - the previous error will be still displayed. So we are setting error to null on successfull user creation so that previous error message will be removed
      navigate("/sign-in") //On successfull user creation we are navigating to sign-in page
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
    
  }

  return (
     <div className='max-w-lg mx-auto p-3'>{/*mx-auto is use to bring it to the center*/}
        <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input type='text' placeholder='username' className='border p-3 rounded-lg' id='username' onChange={handleChange}/>
          <input type='email' placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
          <input type='password' placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange}/>
          <button disabled={loading} className='text-white rounded-lg bg-slate-700 hover:opacity-95 p-3 uppercase disabled:opacity-80'>{loading ? "Loading..." : "Sign Up"}</button>
          <OAuth />
        </form>
        <div className='flex gap-2 mt-5'>
          <p>Have an account?</p>
          <Link to={"/sign-in"}><span className='text-blue-700'>Sign in</span></Link>
        </div>
        {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}
