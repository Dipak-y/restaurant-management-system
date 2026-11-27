
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";
import api from "../../services/api";

export default function CustomerCheckout() {
  const { qrToken } = useParams<{ qrToken: string }>();
  const navigate = useNavigate();

  const {
    items,
    totalItems,
    totalPrice,
    clearCart,
  } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handlePlaceOrder = async () => {
    if (!qrToken || items.length === 0) {
      setError("Your cart is empty or the table QR code is invalid.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      // A unique key prevents duplicate orders when the request is retried.
      const idempotencyKey = crypto.randomUUID();

      const response = await api.post("/orders/", {
        idempotency_key: idempotencyKey,
        table_token: qrToken,
        customer_name: customerName,
        customer_phone: customerPhone,
        notes,
        items: items.map((item) => ({
          menu_item_id: item.id,
          quantity: item.quantity,
          special_instructions: item.special_instructions,
        })),
      });

      clearCart();

      navigate(`/table/${qrToken}/order-success`, {
        state: { order: response.data },
      });
    } catch (err: any) {
      console.error("Order placement error:", err);
      setError(
        err.response?.data?.detail ||
        "Unable to place your order. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <ShoppingCart size={48} className="mb-4 text-gray-400" />
        <h2 className="text-xl font-bold">Your cart is empty</h2>
        <button
          onClick={() => navigate(`/table/${qrToken}`)}
          className="mt-5 rounded-lg bg-black px-5 py-3 text-white"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-4 py-5">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <button onClick={() => navigate(`/table/${qrToken}/cart`)}>
            <ArrowLeft />
          </button>
          <h1 className="text-xl font-bold">Checkout</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        <section className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Customer Details</h2>

          <label className="mb-2 block text-sm font-medium">
            Name (optional)
          </label>
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter your name"
            className="mb-4 w-full rounded-lg border p-3 outline-none focus:border-black"
          />

          <label className="mb-2 block text-sm font-medium">
            Phone Number (optional)
          </label>
          <input
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="Enter your phone number"
            className="w-full rounded-lg border p-3 outline-none focus:border-black"
          />
        </section>

        <section className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>

          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between gap-4 border-b py-3 last:border-0"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  Rs. {item.price.toFixed(2)} × {item.quantity}
                </p>
              </div>
              <p className="font-semibold">
                Rs. {(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}

          <div className="mt-4 flex justify-between border-t pt-4">
            <span className="text-gray-600">
              Total ({totalItems} items)
            </span>
            <span className="text-xl font-bold">
              Rs. {totalPrice.toFixed(2)}
            </span>
          </div>
        </section>

        <section className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Order Notes</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional requests?"
            rows={3}
            className="w-full rounded-lg border p-3 outline-none focus:border-black"
          />
        </section>

        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          onClick={handlePlaceOrder}
          disabled={submitting}
          className="w-full rounded-xl bg-black py-4 font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {submitting ? "Placing Order..." : "Place Order"}
        </button>
      </main>
    </div>
  );
}
