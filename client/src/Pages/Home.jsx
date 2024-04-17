import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import {Navigation} from 'swiper/modules';
import 'swiper/css/bundle'
import Listing from './Listing';
import ListingItem from '../components/ListingItem';
 
export default function () {
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  //console.log(offerListings)
  //console.log(rentListings)
  //console.log(saleListings)
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data= await res.json();
        if(data.success === false){
          console.log(data.message);
        }
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error.message);
      }
    }

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data= await res.json();
        if(data.success === false){
          console.log(data.message);
        }
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error.message);
      }
    }

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data= await res.json();
        if(data.success === false){
          console.log(data.message);
        }
        setSaleListings(data);
      } catch (error) {
        console.log(error.message);
      }
    }

    fetchOfferListings();
  }, []);

  return (
    <div>
      {/* Top */}
      <div className='flex flex-col gap-6 max-w-6xl mx-auto py-28 px-3'>
        <h1 className='text-slate-700 text-3xl lg:text-6xl font-bold'>Find your next <span className='text-slate-500'>perfect</span>
        <br/>place with ease
        </h1>

        <div className='text-gray-500 text-xs sm:text-sm'>Dream Estate is the best place to find your next perfect place to live.
          <br/>We have a wide range of properties for you to choose from.
        </div>

        <Link to={"/search"} className='text-blue-700 font-bold text-xs sm:text-sm hover:underline'>Let's start now...</Link>
      </div>

    {/* Swiper */}
    <Swiper navigation>
      {offerListings && offerListings.length > 0 && offerListings.map((listing) => (
        <SwiperSlide key={listing._id}>
          <div className='h-[500px]' style={{background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize: 'cover'}}></div>
        </SwiperSlide>
      ))}
    </Swiper>

    {/* listing results for offer, sale and rent */}
    <div className='max-w-6xl mx-auto p-3 my-10 flex flex-col gap-8'>
      {/* Offer Listings */}
      {offerListings && offerListings.length > 0 && (
        <div>
          <div className='my-3'>
            <h1 className='text-slate-600 font-bold text-2xl'>Recent offers</h1>
            <Link to={'/search?offer=true'} className='text-blue-800 text-sm hover:underline'>Show more offers</Link>
          </div>
          <div className='flex flex-wrap gap-4'>
            {offerListings.map((listing) => (
              <ListingItem listing={listing} key={listing._id} />
            ))}
          </div>
        </div>
      )}

      {/* Rent Listings */}
      {rentListings && rentListings.length > 0 && (
        <div>
          <div className='my-3'>
            <h1 className='text-slate-600 font-bold text-2xl'>Recent places for rent</h1>
            <Link to={'/search?type=rent'} className='text-blue-800 text-sm hover:underline'>Show more places for rent</Link>
          </div>
          <div className='flex flex-wrap gap-4'>
            {rentListings.map((listing) => (
              <ListingItem listing={listing} key={listing._id} />
            ))}
          </div>
        </div>
      )}

      {/* Sale Listings */}
      {saleListings && saleListings.length > 0 && (
        <div>
          <div className='my-3'>
            <h1 className='text-slate-600 font-bold text-2xl'>Recent places for sale</h1>
            <Link to={'/search?type=sale'} className='text-blue-800 text-sm hover:underline'>Show more places for sale</Link>
          </div>
          <div className='flex flex-wrap gap-4'>
            {saleListings.map((listing) => (
              <ListingItem listing={listing} key={listing._id} />
            ))}
          </div>
        </div>
      )}
    </div>

    </div>
  )
}
