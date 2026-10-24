
import Navbar from './Componants/Navbar/NavBar'
import { Link, Route, Routes } from "react-router-dom";
import HomePage from "./assets/HomePage/HomePage"
import About  from './assets/About/About';
import Team from './assets/Team/Team';
import Booking from './assets/Reservation/Booking';
import Login from "./assets/LogIn/Login"
import Register from './assets/Register/Register';
import Services from './assets/Services/Services';
import Footer from './Componants/Footer/Footer';
function App() {
  

  return (
    <>
     <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/About" element={<About />} />
        <Route path="/team" element={<Team />} />
        <Route path='/Services' element={<Services />} />
        <Route path="/Booking" element={<Booking />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} /> 
      </Routes>
      <Footer />
    </>
  )
}

export default App


