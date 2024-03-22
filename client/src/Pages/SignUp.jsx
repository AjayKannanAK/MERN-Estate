import { Link } from 'react-router-dom'

export default function SignUp() {
  return (
     <div className='max-w-lg mx-auto p-3'>{/*mx-auto is use to bring it to the center*/}
        <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
        <form className='flex flex-col gap-4'>
          <input type='text' placeholder='username' className='border p-3 rounded-lg' id='username'/>
          <input type='email' placeholder='email' className='border p-3 rounded-lg' id='email'/>
          <input type='password' placeholder='password' className='border p-3 rounded-lg' id='password'/>
          <button className='text-white rounded-lg bg-slate-700 hover:opacity-95 p-3 uppercase disabled:opacity-80'>Sign up</button>
        </form>
        <div className='flex gap-2 mt-5'>
          <p>Have an account?</p>
          <Link to={"/sign-in"}><span className='text-blue-700'>Sign in</span></Link>
        </div>
    </div>
  )
}
