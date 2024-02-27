import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './views/HomePage';
import Register from './views/Register';
import SignIn from './views/SignIn';
import Create from './views/Create';
import Apply from './views/Apply';
import Applications from './views/Applications';
import ViewMyAppliedProjects from './views/ViewMyAppliedProjects';
import ViewMySelectedProjects from './views/ViewMySelectedProjects';
import Profile from './views/Profile';

const App = () => {
  return (
    
      <Routes>
        <Route exact path='/' element={<SignIn/>}/>
        <Route exact path='/home' element={<Home/>} />
        <Route exact path='/register' element={<Register/>} />
        <Route exact path='/create' element={<Create/>} />
        <Route exact path='/apply/:prj_id/:title' element={<Apply/>} />
        <Route exact path='/applications' element={<Applications/>}/>
        <Route exact path='/applied-projects' element={<ViewMyAppliedProjects/>}/>
        <Route exact path='/selected-projects' element={<ViewMySelectedProjects/>} />
        <Route exact path='/profile' element={<Profile/>}/>
        {/* Other routes */}
      </Routes>
    
  )
}

export default App
