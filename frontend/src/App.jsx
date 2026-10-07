import {BrowserRouter, Routes , Route} from "react-router-dom";
import Home from "./pages/home/Home";
import Services from "./pages/services/Services";
import OfferService from "./pages/offer-service/OfferService";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/services" element={<Services/>} />
          <Route path="/offer-service" element={<OfferService/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
