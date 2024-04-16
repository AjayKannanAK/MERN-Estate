import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ListingItem from '../components/ListingItem';

export default function Search() {

  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'createdAt',
    order: 'desc',
  });
  //console.log(sidebarData);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  console.log(listings);

  const handleChange = (e) => {
    if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
      setSidebarData({
        ...sidebarData,
        type: e.target.id
      });
    }

    if(e.target.id === 'searchTerm') {
      setSidebarData({
        ...sidebarData,
        searchTerm: e.target.value
      })
    }
    
    if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setSidebarData({
        ...sidebarData,
        [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false  //sometimes we will get info from url so in that case it will be a string 'true' or 'false' so we need to handle these cases also
      })
    }

    if(e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'createdAt';
      const order = e.target.value.split('_')[1] || 'desc';
      setSidebarData({
        ...sidebarData,
        sort,
        order
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlParams= new URLSearchParams();
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('type', sidebarData.type);
    urlParams.set('parking', sidebarData.parking);
    urlParams.set('furnished', sidebarData.furnished);
    urlParams.set('offer', sidebarData.offer);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('order', sidebarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if( searchTermFromUrl || typeFromUrl || parkingFromUrl || furnishedFromUrl || offerFromUrl || sortFromUrl || orderFromUrl ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || "createdAt",
        order: orderFromUrl || 'desc',
      });
    }

    try {
      const fetchListings = async () => {
        setLoading(true);
        setError(false);
        setShowMore(false);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if(data.success === false) {
          setError(data.message);
          setLoading(false);
          return;
        }
        if(data.length > 8) {
          setShowMore(true);
        } else{ setShowMore(false); }
        setLoading(false);
        setListings(data);
      }
      fetchListings();
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }

  }, [location.search])

  const handleShowMore = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    //navigate(`/search?${searchQuery}`);
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if(data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]); //we wanna keep the previous listings and also we need to add new listings. But as data is an array and we need to add that to aprevious existing array - we spraed operate the data as well
  }

  return (
    <div className='flex flex-col md:flex-row'>
        <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                <div className='flex items-center gap-2'>
                    <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                    <input id='searchTerm' placeholder='Search...' type='text' className=' border rounded-lg p-3 w-full' onChange={handleChange} value={sidebarData.searchTerm}/>
                </div>
                <div className='flex flex-row items-center gap-2 flex-wrap'>
                  <label className='font-semibold'>Type:</label>
                  <div className='flex flex-row gap-2'>
                    <input type='checkbox' id='all' className='w-5' onChange={handleChange} checked={sidebarData.type == 'all'}/>
                    <label>Rent & Sale</label>
                  </div>
                  <div className='flex flex-row gap-2'>
                    <input type='checkbox' id='rent' className='w-5' onChange={handleChange} checked={sidebarData.type == 'rent'}/>
                    <label>Rent</label>
                  </div>
                  <div className='flex flex-row gap-2'>
                    <input type='checkbox' id='sale' className='w-5' onChange={handleChange} checked={sidebarData.type == 'sale'}/>
                    <label>Sale</label>
                  </div>
                  <div className='flex flex-row gap-2'>
                    <input type='checkbox' id='offer' className='w-5' onChange={handleChange} checked={sidebarData.offer}/>
                    <label>Offer</label>
                  </div>
                </div>
                <div className='flex flex-row gap-2 flex-wrap'>
                  <label className='font-semibold'>Amenities:</label>
                  <div className='flex flex-row gap-2'>
                    <input type='checkbox' id='parking' className='w-5' onChange={handleChange} checked={sidebarData.parking}/>
                    <label>Parking</label>
                  </div>
                  <div className='flex flex-row gap-2'>
                    <input type='checkbox' id='furnished' className='w-5' onChange={handleChange} checked={sidebarData.furnished}/>
                    <label>Furnished</label>
                  </div>
                </div>
                <div className='flex flex-row items-center gap-2'>
                  <label className='font-semibold'>Sort:</label>
                  <select onChange={handleChange} defaultValue={'createdAt_desc'} id='sort_order' className='border rounded-lg p-3'>
                    <option value='regularPrice_desc' >Price high to low</option>
                    <option value='regularPrice_asc'>Price low to high</option>
                    <option value='createdAt_desc'>Latest</option>
                    <option value='createdAt_asc'>Oldest</option>
                  </select>
                </div>
                <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Searching...' : 'Search'}</button>
            </form>
        </div>
        <div className='flex-1'>
            <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing results:</h1>
            <div className='p-7 flex flex-wrap gap-4'>
              {!loading && listings.length === 0 && (
                <p className='text-slate-700 text-xl'>No listing found!</p>
              )}
              {loading && (
                <p className='text-xl text-slate-700 text-center w-full'>Loading...</p> //text-center w-full => to make it appear on center and also you need to change flex-1 in the div then only it works
              )}
              {!loading && listings && listings.map((listing) => (
                <ListingItem key={listing._id} listing={listing}/>
              ))}
              {showMore && <button onClick={handleShowMore} className='text-green-700 hover:underline w-full text-center'>Show more</button>}
            </div>
        </div>
    </div>
  )
}
