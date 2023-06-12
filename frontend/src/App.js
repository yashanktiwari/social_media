import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './Pages/LoginPage';
import SignupPage from './Pages/SignupPage';
import HomePage from './Pages/HomePage';
import AllUsers from './Components/AllUsers';
import UserProfile from './Components/UserProfile';
import MyPosts from './Components/MyPosts';
import { ToastContainer } from 'react-toastify';

function App() {

  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<HomePage />} />
          <Route exact path='/login' element={<LoginPage />} />
          <Route exact path='/signup' element={<SignupPage />} />
          <Route exact path='/allusers' element={<AllUsers />} />
          <Route exact path='/myposts/:id' element={<MyPosts />} />
          <Route exact path='/profile/:id' element={<UserProfile />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
