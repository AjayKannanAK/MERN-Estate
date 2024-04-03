import { useEffect, useRef, useState } from "react";//we are using this to create a reference between input and img element - so that on clicking image choose file button will be clicked and we hide the choose file button
import { useSelector } from "react-redux";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage";
import { app } from "../firebase";

export default function Profile() {
  const {currentUser} = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
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

  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="font-semibold text-3xl text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input type="file" ref={fileRef} hidden accept="image/*" onChange={(e) => {setFile(e.target.files[0])}}/>
        <img onClick={() => { fileRef.current.click() } } className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" src={formData.avatar || currentUser.avatar} alt="Profile Image"/>
        <p className="text-sm self-center">{ 
             fileUploadError ? <span className="text-red-700">Error Image Upload (Size should be less than 2mb)</span> :
             filePercentage > 0 && filePercentage < 100 ? <span className="text-slate-700">{`Uploading ${filePercentage}%`}</span> :
             filePercentage === 100 ? <span className="text-green-700">Image Successfully uploaded!</span> : ""
        }</p>
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
