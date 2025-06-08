import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { PaymentProvider } from "./contexts/PaymentContext";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Profile from "./pages/Profile/Profile";
import CarInspection from "./pages/Services/CarInspection";
import TowTruck from "./pages/Services/TowTruck";
import SpareParts from "./pages/Services/SpareParts";
import Mechanics from "./pages/Services/Mechanics";
import UsedCars from "./pages/UsedCars/UsedCars";
import Feedback from "./pages/Feedback/Feedback";
import ChatBot from "./pages/ChatBot/ChatBot";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import NotFound from "./pages/NotFound/NotFound";
import Community from "./pages/Community/Community";
import FAQ from "./pages/Community/FAQ";
import UsedCarsList from "./pages/Cars/UsedCarsList";
import UsedCarDetails from "./pages/Cars/UsedCarDetails";
import SparePartsList from "./pages/Cars/SparePartsList";
import SparePartDetail from "./pages/Cars/SparePartDetail";
import ManageSpareParts from "./pages/Mechanic/ManageSpareParts";
import EditSparePart from "./pages/Mechanic/EditSparePart";
import MechanicOrders from "./pages/Mechanic/MechanicOrders";
import MyOrders from "./pages/Profile/MyOrders";
import PaymentConfirmation from "./pages/Payment/PaymentConfirmation";
import PaymentGateway from "./pages/Payment/PaymentGateway";
import MechanicBooking from "./pages/Services/MechanicBooking";
import AdminLogin from "./pages/Auth/AdminLogin";
import AdminDashboard from "./pages/Admin/Dashboard";
import TermsOfService from "./pages/terms/TermsOfService";
import PrivacyPolicycar from "./pages/terms/PrivacyPol";
import Cookcar from "./pages/terms/Cook";

function App() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  return (
    <ThemeProvider value={{ isDarkMode, setIsDarkMode }}>
      <AuthProvider>
        <PaymentProvider>
          <Router>
            <Routes>
              {/* Admin Routes - Outside main layout */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              {/* Main Layout Routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<SignUp />} />
                <Route path="profile" element={<Profile />} />
                <Route path="profile/orders" element={<MyOrders />} />
                <Route path="inspection" element={<CarInspection />} />
                <Route path="tow-truck" element={<TowTruck />} />
                <Route path="spare-parts" element={<SpareParts />} />
                <Route path="feedback" element={<Feedback />} />
                <Route path="mechanics" element={<Mechanics />} />
                <Route path="used-cars" element={<UsedCars />} />
                <Route path="chatbot" element={<ChatBot />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="community" element={<Community />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="spare-parts-list" element={<SparePartsList />} />
                <Route path="spare-parts-details/:id" element={<SparePartDetail />} />
                <Route path="mechanic/spare-parts" element={<ManageSpareParts />} />
                <Route path="mechanic/edit-spare-part/:id" element={<EditSparePart />} />
                <Route path="mechanic/orders" element={<MechanicOrders />} />
                <Route
                  path="used-cars-list"
                  element={<UsedCarsList />}
                />
                <Route
                  path="used-car-details/:id"
                  element={<UsedCarDetails />}
                />
                <Route
                  path="payment/confirmation"
                  element={<PaymentConfirmation />}
                />
                <Route path="payment" element={<PaymentGateway />} />
                <Route path="mechanic-booking" element={<MechanicBooking />} />
                <Route path="terms-of-service" element={<TermsOfService />} />
                <Route path="privacy-policy" element={<PrivacyPolicycar />} />
                <Route path="cookie-policy" element={<Cookcar />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Router>
        </PaymentProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
