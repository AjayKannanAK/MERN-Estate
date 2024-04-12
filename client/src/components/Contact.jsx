import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact({listing}) {
  const [landlordInfo, setLandlordInfo] = useState(null);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  console.log(message);

  useEffect(() => {
    try {
        setError(false);
        fetch(`/api/user/listingUserInfo/${listing.userRef}`).then(async (res) => {
            const data = await res.json();
            if(data.success == false) {
                setError(data.message);
                return;
            }
            setLandlordInfo(data);
            console.log(landlordInfo);
        });
    } catch (error) {
        setError(error.message);
    }
  }, [listing.userRef]);

  const handleChange = (e) => {
    setMessage(e.target.value);
  }

  return (
    <>
        {landlordInfo && (
            <div className='flex flex-col gap-2 mt-5'>
                <p>Contact <span className='font-semibold'>{landlordInfo.username}</span> for <span className='font-semibold'>{listing.name.toLowerCase()}</span></p>
                <textarea name="message" id="message" placeholder='Enter your message here...' rows="2" className='border rounded-lg p-3' onChange={handleChange} value={message}></textarea>
                <Link to={`mailto:${landlordInfo.email}?subject=Regarding ${listing.name}&body=${message}`} className='bg-slate-700 text-white rounded-lg p-3 hover:opacity-95 uppercase text-center'>Send Message</Link>
            </div>
        )}
    </>
  )
}
