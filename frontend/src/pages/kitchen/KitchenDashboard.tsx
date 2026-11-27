
import { useEffect, useState } from "react";
import { RefreshCw, ChefHat, Clock } from "lucide-react";
import api from "../../services/api";

interface KitchenOrderItem {
  id: number;
  menu_item_name: string;
  quantity: number;
  status: string;
  notes?: string;
}

interface KitchenOrder {
  id: number;
  order: number;
  status: string;
  received_at: string;
  items: KitchenOrderItem[];
}

export default function KitchenDashboard() {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchOrders = async () => {
    try {
      setError("");

      const response = await api.get("/kitchen/orders/");

      setOrders(
        Array.isArray(response.data)
          ? response.data
          : response.data.results || []
      );
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        "Unable to load kitchen orders."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    orderId: number,
    newStatus: string
  ) => {
    try {
      setUpdatingId(orderId);
      setError("");

      await api.patch(`/kitchen/orders/${orderId}/status/`, {
        status: newStatus,
      });

      await fetchOrders();
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Unable to update order status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center">
        Loading kitchen orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-800">
              <ChefHat />
              Kitchen Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Verified customer orders
            </p>
          </div>

          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow hover:bg-gray-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow">
            <ChefHat className="mx-auto mb-3 text-gray-400" size={40} />
            <h2 className="text-xl font-semibold">
              No verified orders
            </h2>
            <p className="mt-2 text-gray-500">
              Verified orders will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl bg-white p-5 shadow"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold">
                    Kitchen Order #{order.id}
                  </h2>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                    {order.status}
                  </span>
                </div>

                <p className="mb-3 flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={15} />
                  {new Date(order.received_at).toLocaleString()}
                </p>

                <div className="space-y-3 border-t pt-4">
                  {order.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between gap-3"
                    >
                      <div>
                        <p className="font-medium">
                          {item.menu_item_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                        {item.notes && (
                          <p className="text-sm text-orange-600">
                            Note: {item.notes}
                          </p>
                        )}
                      </div>

                      <span className="text-sm font-semibold">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 border-t pt-4">
                  {order.status === "PENDING" && (
                    <button
                      onClick={() => updateStatus(order.id, "ACCEPTED")}
                      disabled={updatingId !== null}
                      className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      Accept Order
                    </button>
                  )}

                  {order.status === "ACCEPTED" && (
                    <button
                      onClick={() => updateStatus(order.id, "PREPARING")}
                      disabled={updatingId !== null}
                      className="w-full rounded-lg bg-orange-500 py-2 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
                    >
                      Start Preparing
                    </button>
                  )}

                  {order.status === "PREPARING" && (
                    <button
                      onClick={() => updateStatus(order.id, "READY")}
                      disabled={updatingId !== null}
                      className="w-full rounded-lg bg-green-600 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      Mark as Ready
                    </button>
                  )}

                  {order.status === "READY" && (
                    <p className="text-center font-semibold text-green-700">
                      Order is ready for waiter
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
