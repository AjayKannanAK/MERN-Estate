import { useSelector } from "react-redux"

export default function Profile() {
  const {currentUser} = useSelector((state) => state.user);
  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="font-semibold text-3xl text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
      <img className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" src={currentUser.avatar} alt="Profile Image"/>
        <input className="rounded-lg p-3" type="text" placeholder="username" id="username" />
        <input className="rounded-lg p-3" type="email" placeholder="email" id="email" />
        <input className="rounded-lg p-3" type="text" placeholder="password" id="password" />
        <button className="bg-slate-700 text-white rounded-lg p-3 hover:opacity-95 uppercase disabled:opacity-80">Update</button>
        {/* <button className="bg-green-600 text-white rounded-lg p-3 hover:opacity-95 uppercase disabled:opacity-80">Create Listing</button> */}
      </form>
      <div className="flex justify-between mt-5">
        <p className="text-red-700 cursor-pointer">Delete account</p>
        <p className="text-red-700 cursor-pointer">Sign out</p>
      </div>
    </div>
  )
}
