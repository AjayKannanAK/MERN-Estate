import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'
import About from './Pages/About'
import Profile from './Pages/Profile'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import CreateListing from './Pages/CreateListing'
import UpdateListing from './Pages/UpdateListing'
import Listing from './Pages/Listing'
import Search from './Pages/Search'


export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/sign-in' element={<SignIn />}/>
          <Route path='/sign-up' element={<SignUp />}/>
          <Route path='/about' element={<About />}/>
          <Route path='/listing/:listingId' element={<Listing />}/>
          <Route path='/search' element={<Search />} />
          <Route element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />}/>
            <Route path='/create-listing' element={<CreateListing />}/>
            <Route path='/update-listing/:listingId' element={<UpdateListing />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
//why we are adding PrivateRoute -> This is because we don't want to show these pages to unauthenticated users. If they try to acess these pages then they will be redirected to signin page
