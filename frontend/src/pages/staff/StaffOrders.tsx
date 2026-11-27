
import { useEffect, useState } from "react";
import { RefreshCw, ShoppingBag, CheckCircle } from "lucide-react";
import api from "../../services/api";

interface OrderItem {
  id: number;
  menu_item_name: string;
  quantity: number;
  unit_price: string;
  subtotal: string;
  special_instructions: string;
}

interface Order {
  id: number;
  order_number: string;
  table_number: string;
  customer_name: string;
  customer_phone: string;
  status: string;
  notes: string;
  items: OrderItem[];
  created_at: string;
}

export default function StaffOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [verifyingId, setVerifyingId] = useState<number | null>(null);

  const fetchOrders = async () => {
    try {
      setError("");

      const response = await api.get("/orders/list/");

      setOrders(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        "Unable to load orders. Please check your login."
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyOrder = async (orderId: number) => {
    try {
      setVerifyingId(orderId);
      setError("");
      setSuccess("");

      await api.post(`/orders/${orderId}/verify/`);

      setSuccess("Order verified successfully.");

      await fetchOrders();
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        "Unable to verify this order."
      );
    } finally {
      setVerifyingId(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = (date: string) =>
    new Date(date).toLocaleString();

  const pendingOrders = orders.filter(
    order => order.status === "PENDING"
  ).length;

  const verifiedOrders = orders.filter(
    order => order.status === "VERIFIED"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Orders Dashboard
            </h1>

            <p className="text-sm text-gray-500">
              Manage and verify customer orders
            </p>
          </div>

          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-700"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Dashboard Statistics */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Orders
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-800">
              {orders.length}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Pending Verification
            </p>

            <h2 className="mt-2 text-3xl font-bold text-orange-600">
              {pendingOrders}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Verified Orders
            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {verifiedOrders}
            </h2>
          </div>

        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 rounded-lg bg-green-50 p-4 text-green-700">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <p className="py-10 text-center text-gray-500">
            Loading orders...
          </p>

        ) : orders.length === 0 ? (

          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <ShoppingBag
              className="mx-auto mb-3 text-gray-400"
              size={36}
            />

            <p className="text-gray-600">
              No orders found.
            </p>
          </div>

        ) : (

          <div className="space-y-4">

            {orders.map(order => (

              <div key={order.id} className="rounded-xl bg-white p-5 shadow-sm">
                {/* Order Header */}
                <div className="flex flex-wrap justify-between gap-3 border-b pb-4">

                  <div>
                    <h2 className="font-bold text-gray-800">
                      Order #{order.order_number.slice(0, 8)}
                    </h2>

                    <p className="text-sm text-gray-500">
                      Table {order.table_number}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">

                    <span
                      className={`h-fit rounded-full px-3 py-1 text-sm font-medium ${
                        order.status === "PENDING"
                          ? "bg-orange-100 text-orange-700"
                          : order.status === "VERIFIED"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "PREPARING"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "READY"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>

                    {/* Verify Button */}
                    {String(order.status).trim().toUpperCase() === "PENDING" && (
                        <button
                            type="button"
                            onClick={() => verifyOrder(order.id)}
                            disabled={verifyingId !== null}
                            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <CheckCircle size={16} />

                            {verifyingId === order.id
                            ? "Verifying..."
                            : "Verify Order"}
                        </button>
                        )}

                  </div>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-1 gap-2 py-4 text-sm sm:grid-cols-2">

                  <p>
                    <strong>Customer:</strong>{" "}
                    {order.customer_name || "Guest"}
                  </p>

                  <p>
                    <strong>Phone:</strong>{" "}
                    {order.customer_phone || "Not provided"}
                  </p>

                  <p>
                    <strong>Placed:</strong>{" "}
                    {formatDate(order.created_at)}
                  </p>

                </div>

                {/* Ordered Items */}
                <div className="border-t pt-3">

                  <h3 className="mb-3 font-semibold text-gray-700">
                    Ordered Items
                  </h3>

                  <div className="space-y-3">

                    {order.items.map(item => (

                      <div
                        key={item.id}
                        className="flex justify-between gap-3 text-sm"
                      >

                        <div>
                          <p className="font-medium">
                            {item.menu_item_name} × {item.quantity}
                          </p>

                          {item.special_instructions && (
                            <p className="text-gray-500">
                              Note: {item.special_instructions}
                            </p>
                          )}
                        </div>

                        <p className="whitespace-nowrap font-medium">
                          Rs. {item.subtotal}
                        </p>

                      </div>

                    ))}

                  </div>
                </div>

                {/* Order Notes */}
                {order.notes && (
                  <p className="mt-4 border-t pt-3 text-sm text-gray-600">
                    <strong>Order notes:</strong> {order.notes}
                  </p>
                )}

              </div>

            ))}

          </div>
        )}

      </div>
    </div>
  );
}
