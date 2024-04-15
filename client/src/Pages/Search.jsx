import React from 'react'

export default function Search() {
  return (
    <div className='flex flex-col md:flex-row'>
        <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
            <form className='flex flex-col gap-8'>
                <div className='flex items-center gap-2'>
                    <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                    <input id='searchTerm' placeholder='Search...' type='text' className=' border rounded-lg p-3 w-full'/>
                </div>
                <div className='flex flex-row items-center gap-2 flex-wrap'>
                  <label className='font-semibold'>Type:</label>
                  <div className='flex flex-row gap-2'>
                    <input type='checkbox' id='all' className='w-5'/>
                    <label>Rent & Sale</label>
                  </div>
                  <div className='flex flex-row gap-2'>
                    <input type='checkbox' id='rent' className='w-5'/>
                    <label>Rent</label>
                  </div>
                  <div className='flex flex-row gap-2'>
                    <input type='checkbox' id='sale' className='w-5'/>
                    <label>Sale</label>
                  </div>
                  <div className='flex flex-row gap-2'>
                    <input type='checkbox' id='offer' className='w-5'/>
                    <label>Offer</label>
                  </div>
                </div>
                <div className='flex flex-row gap-2 flex-wrap'>
                  <label className='font-semibold'>Amenities:</label>
                  <div className='flex flex-row gap-2'>
                    <input type='checkbox' id='parking' className='w-5'/>
                    <label>Parking</label>
                  </div>
                  <div className='flex flex-row gap-2'>
                    <input type='checkbox' id='furnished' className='w-5'/>
                    <label>Furnished</label>
                  </div>
                </div>
                <div className='flex flex-row items-center gap-2'>
                  <label className='font-semibold'>Sort:</label>
                  <select id='sort_order' className='border rounded-lg p-3'>
                    <option>Price high to low</option>
                    <option>Price low to high</option>
                    <option>Latest</option>
                    <option>Oldest</option>
                  </select>
                </div>
                <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>Search</button>
            </form>
        </div>
        <div>
            <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing results:</h1>
        </div>
    </div>
  )
}