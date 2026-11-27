
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";


import CustomerMenu from "./pages/customer/CustomerMenu";
import CustomerCart from "./pages/customer/CustomerCart";
import CustomerCheckout from "./pages/customer/CustomerCheckout";
import CustomerOrderSuccess from "./pages/customer/CustomerOrderSuccess";
import StaffOrders from "./pages/staff/StaffOrders";
import KitchenDashboard from "./pages/kitchen/KitchenDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Routes */}
        <Route path="/table/:qrToken" element={<CustomerMenu />} />
        <Route path="/table/:qrToken/cart" element={<CustomerCart />} />
        <Route path="/table/:qrToken/checkout" element={<CustomerCheckout />} />
        <Route path="/table/:qrToken/order-success" element={<CustomerOrderSuccess />}/>
        <Route path="/staff/orders" element={<StaffOrders />} />
        <Route path="/kitchen/dashboard" element={<KitchenDashboard />} />

        {/* Staff Routes */}
        <Route path="/login" element={<Login />} />
        

        {/* Default Route */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
