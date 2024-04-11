import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import {Navigation} from 'swiper/modules';
import 'swiper/css/bundle'


export default function Listing() {
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  SwiperCore.use([Navigation]);

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
            </>
        )}
    </main>
  )
}
