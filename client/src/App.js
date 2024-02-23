import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './views/HomePage';
import Register from './views/Register';
import SignIn from './views/SignIn';
import Create from './views/Create';

const App = () => {
  return (
    
      <Routes>
        <Route exact path='/' element={<SignIn/>}/>
        <Route exact path='/home' element={<Home/>} />
        <Route exact path='/register' element={<Register/>} />
        <Route exact path='/create' element={<Create/>} />
        {/* Other routes */}
      </Routes>
    
  )
}

export default App
