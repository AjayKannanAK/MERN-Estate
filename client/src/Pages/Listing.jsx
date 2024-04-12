import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import {Navigation} from 'swiper/modules';
import 'swiper/css/bundle'
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare } from 'react-icons/fa';
import { useSelector } from "react-redux";
import Contact from '../components/Contact';


export default function Listing() {
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  SwiperCore.use([Navigation]);
  const [copied, setCopied] = useState(false);
  const {currentUser} = useSelector((state) => state.user);
  const [contact, setContact] = useState(false); //if this is true we should not show Contact Landlord button, instead we should show 1)"listing name and owner name" of the listing, 2) a "textarea" to write the details and 3) "Send message" button which comes from Contact component

  useEffect(() => {
    try {
        setLoading(true);
        setError(false);
        fetch(`/api/listing/get/${params.listingId}`).then(async (res) => {
            const data = await res.json();
            if(data.success == false) {
                setError(data.message);
                //setListing(null);
                setLoading(false);
                return;
            }
            setListing(data);
            setLoading(false);
        })
    } catch (error) {
        setError(error.message);
        setLoading(false);
    }
  }, [params.listingId]); //we can also leave the dependency array empty. Basic idea is as soon as we come to this page, we need to get the listingId from url and need to get the listing detils using api and use the listing details accordingly
                          //why using useState => we need to fetch the listing details once we reach this page, so only using useEffect
  return (
    <main>
        {loading && <p className='text-center my-7 font-semibold text-2xl'>Loading...</p>}
        {error && <p className='text-center my-7 font-semibold text-2xl'>Something went wrong!</p>}
        {listing && !loading && !error && (
            <>
                <Swiper navigation>
                    {listing.imageUrls.map((url) => (
                        <SwiperSlide key={url}>
                            <div className='h-[550px]' style={{background: `url(${url}) center no-repeat`, backgroundSize: 'cover' }}></div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
                    <FaShare className='text-slate-500' onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            setCopied(true);
                            setTimeout(() => {
                            setCopied(false);
                            }, 2000);
                        }}
                    />
                </div>
                {copied && ( <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>Link copied!</p> )}

                <div className='max-w-4xl mx-auto p-3'>
                    <h1 className='font-semibold text-2xl my-7'>{listing.name} - ${" "}{listing.offer ? listing.discountedPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}{listing.type=="rent" && " / month"}</h1>
                    <div className='flex flex-col gap-2'>
                        <div className='flex gap-2 items-center font-semibold text-sm'>
                            <FaMapMarkerAlt className='text-green-700'/>
                            <p className='text-slate-600'>{listing.address}</p>
                        </div>
                        <div className='flex gap-4'>
                            <p className='bg-red-900 text-white text-center p-1 rounded-lg w-full max-w-56'>{listing.type=="rent" ? "For Rent" : "For Sale"}</p>
                            {listing.offer && <p className='bg-green-900 text-white text-center p-1 rounded-lg w-full max-w-56'>${+listing.regularPrice - +listing.discountedPrice} discount</p>}
                        </div>
                        <p className='text-slate-800'><span className='font-semibold text-black'>Description - </span>{listing.description}</p>
                        <ul className='text-green-900 font-semibold flex items-center gap-4 sm:gap-6 flex-wrap'>
                            <li className='flex items-center gap-1'>
                                <FaBed className='text-lg'/>
                                <p className='text-sm whitespace-nowrap'>{listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : `${listing.bedrooms} Bed`}</p>
                            </li>
                            <li className='flex items-center gap-1'>
                                <FaBath className='text-lg'/>
                                <p className='text-sm whitespace-nowrap'>{listing.bathrooms > 1 ? `${listing.bathrooms} Beds` : `${listing.bathrooms} Bed`}</p>
                            </li>
                            <li className='flex items-center gap-1'>
                                <FaParking className='text-lg'/>
                                <p className='text-sm whitespace-nowrap'>{listing.parking ? "Parking spot" : "No parking"}</p>
                            </li>
                            <li className='flex items-center gap-1'>
                                <FaChair className='text-lg'/>
                                <p className='text-sm whitespace-nowrap'>{listing.furnished ? "Furnished" : "Not furnished"}</p>
                            </li>
                        </ul>
                        {currentUser && (listing.userRef != currentUser._id) && !contact && (
                            <button onClick={() => setContact(true) } className='bg-slate-700 text-white rounded-lg p-3 hover:opacity-95 uppercase mt-7'>Contact Landlord</button>
                        )}
                        {contact && <Contact listing={listing} />}
                    </div>
                </div>
            </>
        )}
    </main>
  )
}
