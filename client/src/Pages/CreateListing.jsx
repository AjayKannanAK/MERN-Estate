import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react'
import { app } from '../firebase';

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  //console.log(files);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  //console.log(formData);
  const [uploading, setUploading] = useState(false);

  const handleImageSubmit = () => {
    if(files.length > 0 && files.length <7 && formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false); //if there is a previous error, then on successfull image upload we need to clear the previous error
      const promises = [];
      for(var i=0; i<files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises).then((
        results)=> { //this results is nothing but the array of download urls which got received as promises -> results can be named as anything eg. urls
        setFormData({

          //...formData, imageUrls: results
          ...formData, imageUrls: formData.imageUrls.concat(results) //why we are writing like this -> this is because say if we added 2 images then in imageUrls 2 urls will be there, say if we added 2 more images then this 2 new urls which is in array form will be concatinated with imageUrls array which previously has 2 urls inside it
        });
        setImageUploadError(false); //if there is a previous error, then on successfull image upload we need to clear the previous error
        setUploading(false);
      }).catch((error) => {
        setImageUploadError('Image upload failed (2 mb max per image)');
        setUploading(false);
      })
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  }

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred/snapshot.totalBytes) * 100;
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(
            (downloadURL) => {
              resolve(downloadURL);//it will send the downurl back as a promise
            }
          )
        },
      )
    })
  }

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((url, i) => {  //url is the item and i is the index. You don't need to specify url also as we are not using it, instead you can replace url with _ -> (url, i) -> (_, i)
        return i!=index
      })
    })
  }

  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
        <form className='flex flex-col sm:flex-row gap-4'>
          <div className='flex flex-col gap-4 flex-1'>
            <input type='text' placeholder='Name' className='border rounded-lg p-3' id='name' minLength="10" maxLength="64" required />
            <textarea type='text' placeholder='Description' className='border rounded-lg p-3' id='description' required />
            <input type='text' placeholder='Address' className='border rounded-lg p-3' id='address' required />
            <div className='flex gap-6 flex-wrap'>
              <div className='flex gap-2'>
                <input type='checkbox' id='sale' className='w-5'/>
                <span>Sell</span>
              </div>
              <div className='flex gap-2'>
                <input type='checkbox' id='rent' className='w-5'/>
                <span>Rent</span>
              </div>
              <div className='flex gap-2'>
                <input type='checkbox' id='parking' className='w-5'/>
                <span>Parking spot</span>
              </div>
              <div className='flex gap-2'>
                <input type='checkbox' id='furnished' className='w-5'/>
                <span>Furnished</span>
              </div>
              <div className='flex gap-2'>
                <input type='checkbox' id='offer' className='w-5'/>
                <span>Offer</span>
              </div>
            </div>
            <div className='flex gap-6 flex-wrap'>
              <div className='flex gap-2 items-center'>
                <input type="number" id='bedrooms' className='border border-gray-300 rounded-lg p-3' min="1" max="10" required />
                <p>Beds</p>
              </div>
              <div className='flex gap-2 items-center'>
                <input type="number" id='bathrooms' className='border border-gray-300 rounded-lg p-3' min="1" max="10" required />
                <p>Baths</p>
              </div>
              <div className='flex gap-2 items-center'>
                <input type="number" id='regularPrice' className='border border-gray-300 rounded-lg p-3' min="1" max="10" required />
                <div className='flex flex-col items-center'>
                  <p>Regular Price</p>
                  <span className='text-xs'>($ / month)</span>
                </div>
              </div>
              <div className='flex gap-2 items-center'>
                <input type="number" id='discountPrice' className='border border-gray-300 rounded-lg p-3' min="1" max="10" required />
                <div className='flex flex-col items-center'>
                  <p>Discounted Price</p>
                  <span className='text-xs'>($ / month)</span>
                </div>
              </div>
            </div>
          </div>
          <div className='flex flex-col flex-1 gap-4'>
            <p className='font-semibold'>Images:
              <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
            </p>
            <div className='flex gap-4'>
              <input onChange={(e) => {setFiles(e.target.files)}} type='file' accept='image/*' id='images' multiple className='p-3 border border-gray-300 rounded w-full'/>
              <button disabled={uploading} type="button" onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>{uploading ? "Uploading..." : "Upload"}</button>
            </div>
            <p className='text-red-700'>{imageUploadError && imageUploadError}</p>
            {/* {imageUploadError && <p className="text-red-700">{imageUploadError}</p>} both the above line and this line does the same job */}
            {formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
              <div key={url} className='flex justify-between border p-3 items-center'>
                <img src={url} alt='listing image' className='w-20 h-20 rounded-lg object-contain' />
                <button type="button" onClick={() => { handleRemoveImage(index) }} className='p-3 text-red-700 uppercase hover:opacity-75'>Delete</button>
              </div>
            ))}
            <button className='bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80 uppercase'>Create Listing</button>
          </div>
        </form>
    </main>
  )
}

//1)
//when we type="button" to an button element, then it will prevent the default behaviour of submitting and we can add an onClick to the button
//this is superusefull when we have a button inside a form. Because on clicking the button it will submit the form data or trigger the
//onSubmit which we written inside form. To prevent this we add type="button" and we will use that for some other purpose

//2)
//<button type="button" onClick={handleRemoveImage(index)} className='p-3 text-red-700 uppercase hover:opacity-75'>Delete</button>
//<button type="button" onClick={() => { handleRemoveImage(index) }} className='p-3 text-red-700 uppercase hover:opacity-75'>Delete</button>
//In the first approach handleRemoveImage will be called as soon as the button gets rendered (i.e during rendering phase itself) -> this will remove the imgae
//on its own without clicking -> this is not the intended behaviour
//Second approach is the crct way because handleRemoveImage will be called once we click the button

//2) Continued...
//<button onClick={delete(index)}>Button</button>
//In this snippet, the onClick event handler is assigned the result of calling the delete function with the index parameter immediately. 
//This means that the delete function will be called once during the rendering phase, and its return value will be assigned to the onClick event handler. 
//This is not the intended behavior, as you want the delete function to be called when the button is clicked, not during rendering.

//2) Continued...
//<button onClick={() => {delete(index)}}>Button</button>
//In this snippet, the onClick event handler is defined using an arrow function. When the button is clicked, the arrow function will be executed, and inside it, the delete function will be called with the index parameter. 
//This is the correct approach if you want to call the delete function with the index parameter when the button is clicked.