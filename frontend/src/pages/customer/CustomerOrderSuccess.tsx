
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CheckCircle, ClipboardList, ArrowLeft } from "lucide-react";

interface Order {
  id?: number;
  order_number?: string;
  status?: string;
  customer_name?: string;
}

export default function CustomerOrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { qrToken } = useParams<{ qrToken: string }>();

  const order = location.state?.order as Order | undefined;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm">

        <div className="mb-5 flex justify-center">
          <CheckCircle size={76} className="text-green-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
          Order Placed Successfully!
        </h1>

        <p className="mt-3 text-gray-500">
          Thank you for ordering. Your order has been received successfully.
        </p>

        <div className="my-7 rounded-xl bg-gray-50 p-5">
          <div className="mb-3 flex items-center justify-center gap-2 text-gray-600">
            <ClipboardList size={20} />
            <span className="font-medium">Order Information</span>
          </div>

          <p className="text-sm text-gray-500">Order Number</p>

          <p className="mt-1 break-all text-lg font-bold text-gray-900">
            {order?.order_number || (order?.id ? `#${order.id}` : "Confirmed")}
          </p>

          <div className="mt-4">
            <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              {order?.status || "PENDING"}
            </span>
          </div>

          {order?.customer_name && (
            <p className="mt-4 text-sm text-gray-600">
              Customer: {order.customer_name}
            </p>
          )}
        </div>

        <p className="mb-6 text-sm text-gray-500">
          Your order is now placed. Please wait while the restaurant processes it.
        </p>

        <button
          onClick={() => navigate(`/table/${qrToken}`)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3 font-semibold text-white hover:bg-gray-800"
        >
          <ArrowLeft size={18} />
          Back to Menu
        </button>
      </div>
    </div>
  );
}
