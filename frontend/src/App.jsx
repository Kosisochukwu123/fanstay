// App.jsx
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { fetchCurrentUser } from "./redux/authSlice";
import { initServiceWorkerFromStoredConsent } from "./utils/consent";
import Navbar from "./components/layout/Navbar";
import MobileBottomNav from "./components/layout/MobileBottomNav";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AIAssistant from "./components/common/AIAssistant";
import CookieConsent from "./components/common/CookieConsent";

// Public pages
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import PropertyDetail from "./pages/PropertyDetail";
import NotFound from "./pages/NotFound";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Guest pages
import Favorites from "./pages/Favorites";
import GuestDashboard from "./pages/guest/GuestDashboard";
import BookingDetail from "./pages/BookingDetail";
import Messages from "./pages/Messages";
import MessagesInbox from "./pages/MessagesInbox";
import Profile from "./pages/Profile";

// Host pages
import HostDashboard from "./pages/host/HostDashboard";
import HostListings from "./pages/host/HostListings";
import ListingForm from "./pages/host/ListingForm";
import HostReservations from "./pages/host/HostReservations";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminHostApplications from "./pages/admin/AdminHostApplications";
import AdminGiftCards from "./pages/admin/AdminGiftCards";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminSiteSettings from "./pages/admin/AdminSiteSettings";

// FIFA World Cup 2026™ Pages
import FIFABanner from "./components/layout/FIFABanner";
import FIFATicketsPortal from "./pages/fifa/TicketsPortal";
import FIFAHospitalityPackages from "./pages/fifa/HospitalityPackages";
import FIFAIDRegistration from "./pages/fifa/FIFAIDRegistration";
import FIFAResaleMarketplace from "./pages/fifa/ResaleMarketplace";
import FIFATicketTransfer from "./pages/fifa/TicketTransfer";
import FIFAParkingPasses from "./pages/fifa/ParkingPasses";
import FIFASalesPhases from "./pages/fifa/SalesPhases";
import FIFATicketCategories from "./pages/fifa/TicketCategories";
import FIFAGeneralFAQ from "./pages/fifa/GeneralFAQ";
import FIFARegisterUpdates from "./pages/fifa/RegisterUpdates";
import FIFALegalDocuments from "./pages/fifa/LegalDocuments";
import FIFAFanFestival from "./pages/fifa/FanFestivalLocations";
import FIFAEventDetail from "./pages/fifa/EventDetail";
import FIFAAllEvents from "./pages/fifa/AllEvents";
import FIFAWorldCupHome from "./pages/fifa/WorldCupHome";

function App() {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);

  useEffect(() => {
    dispatch(fetchCurrentUser());
    initServiceWorkerFromStoredConsent();
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  return (
    <>
      {/* <Navbar /> */}
      <main style={{ minHeight: "70vh" }}>
        <Routes>
          {/* Public - Original */}
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />

          {/* FIFA World Cup 2026™ Routes */}
          <Route path="/fifa" element={<FIFAWorldCupHome />} />
          <Route path="/fifa/tickets" element={<FIFATicketsPortal />} />
          <Route path="/fifa/hospitality" element={<FIFAHospitalityPackages />} />
          <Route path="/fifa/register" element={<FIFAIDRegistration />} />
          <Route path="/fifa/resale" element={<FIFAResaleMarketplace />} />
          <Route path="/fifa/transfer" element={<FIFATicketTransfer />} />
          <Route path="/fifa/parking" element={<FIFAParkingPasses />} />
          <Route path="/fifa/sales-phases" element={<FIFASalesPhases />} />
          <Route path="/fifa/categories" element={<FIFATicketCategories />} />
          <Route path="/fifa/faq" element={<FIFAGeneralFAQ />} />
          <Route path="/fifa/updates" element={<FIFARegisterUpdates />} />
          <Route path="/fifa/legal" element={<FIFALegalDocuments />} />
          <Route path="/fifa/fan-festival" element={<FIFAFanFestival />} />
          <Route path="/fifa/event/:id" element={<FIFAEventDetail />} />
          <Route path="/fifa/events/all" element={<FIFAAllEvents />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Authenticated - any role */}
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <MessagesInbox />
              </ProtectedRoute>
            }
          />

          <Route
            path="/messages/:userId"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings/:id"
            element={
              <ProtectedRoute>
                <BookingDetail />
              </ProtectedRoute>
            }
          />

          {/* Guest */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={["guest"]}>
                <GuestDashboard />
              </ProtectedRoute>
            }
          />

          {/* Host */}
          <Route
            path="/host/dashboard"
            element={
              <ProtectedRoute roles={["host", "admin"]}>
                <HostDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/host/listings"
            element={
              <ProtectedRoute roles={["host", "admin"]}>
                <HostListings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/host/listings/new"
            element={
              <ProtectedRoute roles={["host", "admin"]}>
                <ListingForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/host/listings/:id/edit"
            element={
              <ProtectedRoute roles={["host", "admin"]}>
                <ListingForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/host/reservations"
            element={
              <ProtectedRoute roles={["host", "admin"]}>
                <HostReservations />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/properties"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminProperties />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/hosts"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminHostApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/gift-cards"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminGiftCards />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reviews"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminReviews />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminSiteSettings />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <MobileBottomNav />
      {/* <AIAssistant /> */}
      <CookieConsent />
      <ToastContainer position="top-right" autoClose={3000} theme={mode} />
    </>
  );
}

export default App;