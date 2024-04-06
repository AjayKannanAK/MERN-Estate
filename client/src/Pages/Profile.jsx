import { useEffect, useRef, useState } from "react";//we are using this to create a reference between input and img element - so that on clicking image choose file button will be clicked and we hide the choose file button
import { useDispatch, useSelector } from "react-redux";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage";
import { app } from "../firebase";
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserFailure, signOutUserStart, signOutUserSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from "../redux/user/userSlice";
import { Link } from "react-router-dom";

export default function Profile() {
  const {currentUser, loading, error} = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  //console.log(file);
  //console.log(filePercentage);
  //console.log('Unable to upload image', fileUploadError);
  //console.log(formData);

  useEffect(() =>{ //if there is a change in file then we will add some logic inside callback function which handles file upload to firebase
    if(file) {
      handleFileUpload(file); //we wanna pass this file to this function so that the file gets uploaded to firebase storage
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    //const fileName = file.name; //we can write like this itself but if someone uploads the same file twice then it will cause some naming errors. So to prevent that we need to make each file name unique by adding current time to the file name
    const fileName = new Date().getTime() + file.name; //this will make file name unique
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred/snapshot.totalBytes) * 100;
        //console.log(`Upload is ${progress}% done`);
        setFilePercentage(Math.round(progress));
      },
      (error) => { //if there is an error while upload we need to handle error
        setFileUploadError(true);
      },
      () => { //aftre upload is done, we need to get image address(download url) and we need to store this in a form data and when user clicks update - along with other updated values image address also needs to be updated in db
        getDownloadURL(uploadTask.snapshot.ref).then(
          (downloadURL) => {
            setFormData({
              ...formData, avatar: downloadURL
            });
            setFileUploadError(false);//Suppose a previous error exists then fileUploadError erroe will be true. Then on successfull image upload we want to make fileUploadError false. This is done by this line of code.
          }
        )
      }
    );
  }

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
      dispatch(updateUserStart());

      const res = await fetch(`api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if(data.success == false) {
        dispatch(updateUserFailure(data.message));
        setUpdateSuccess(false);//if the previous update is success then updateSuccess will be true, so in case an error happens after a successfull update we need to again set updateSuccess to false
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);//on successfull update we need to set updateSuccess to true -> so that we can show success message to the user
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      setUpdateSuccess(false);//if the previous update is success then updateSuccess will be true, so in case an error happens after a successfull update we need to again set updateSuccess to false
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(`api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if(data.success == false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());

      const res = await fetch("api/auth/signout");
      const data = await res.json();

      if(data.success == false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
        dispatch(signOutUserFailure(data.message));
    }
  }

  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="font-semibold text-3xl text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="file" ref={fileRef} hidden accept="image/*" onChange={(e) => {setFile(e.target.files[0])}}/>
        <img onClick={() => { fileRef.current.click() } } className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" src={formData.avatar || currentUser.avatar} alt="Profile Image"/>
        <p className="text-sm self-center">{ 
             fileUploadError ? <span className="text-red-700">Error Image Upload (Size should be less than 2mb)</span> :
             filePercentage > 0 && filePercentage < 100 ? <span className="text-slate-700">{`Uploading ${filePercentage}%`}</span> :
             filePercentage === 100 ? <span className="text-green-700">Image Successfully uploaded!</span> : ""
        }</p>
        <input className="rounded-lg p-3" type="text" placeholder="username" defaultValue={currentUser.username} id="username" onChange={handleChange}/>
        <input className="rounded-lg p-3" type="email" placeholder="email" defaultValue={currentUser.email} id="email" onChange={handleChange}/>
        <input className="rounded-lg p-3" type="password" placeholder="password" id="password" onChange={handleChange}/>
        <button disabled={loading} className="bg-slate-700 text-white rounded-lg p-3 hover:opacity-95 uppercase disabled:opacity-80">{loading ? "Loading..." : "Update"}</button>
        {/* <button className="bg-green-600 text-white rounded-lg p-3 hover:opacity-95 uppercase disabled:opacity-80">Create Listing</button> */}
        <Link to={"/create-listing"} className="bg-green-600 text-white rounded-lg p-3 text-center hover:opacity-95 ">Create Listing</Link>
      </form>
      <div className="flex justify-between mt-5">
        <p onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete account</p>
        <p onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign out</p>
      </div>
      {error && <p className="text-red-700 mt-5">{error}</p>}
      {/* <p className="text-red-700 mt-5">{error ? error : ""}</p> both the above one and this one are same*/}
      <p className="text-green-700 mt-5">{updateSuccess ? "User is updated successfully!" : "" }</p>
    </div>
  )
}
