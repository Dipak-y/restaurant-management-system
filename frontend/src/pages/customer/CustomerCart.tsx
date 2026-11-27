
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingCart } from "lucide-react";

import { useCart } from "../../context/CartContext";

export default function CustomerCart() {
  const { qrToken } = useParams();
  const navigate = useNavigate();

  const {
    items,
    updateQuantity,
    removeFromCart,
    updateInstructions,
    totalItems,
    totalPrice,
  } = useCart();

  const handleCheckout = () => {
    navigate(`/table/${qrToken}/checkout`);
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="bg-white px-5 py-6 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center gap-4">
          <button
            onClick={() => navigate(`/table/${qrToken}`)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          >
            <ArrowLeft size={22} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Your Cart
            </h1>
            <p className="text-sm text-slate-500">
              Review your selected items
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8">

        {items.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <ShoppingCart
              size={48}
              className="mx-auto mb-4 text-slate-300"
            />

            <h2 className="text-xl font-semibold text-slate-800">
              Your cart is empty
            </h2>

            <p className="mt-2 text-slate-500">
              Add some delicious food from our menu.
            </p>

            <button
              onClick={() => navigate(`/table/${qrToken}`)}
              className="mt-6 rounded-lg bg-orange-600 px-6 py-3 font-medium text-white hover:bg-orange-700"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

            {/* Cart Items */}
            <div className="space-y-5 lg:col-span-2">

              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row">

                    {/* Food Image */}
                    {item.image ? (
                      <img
                        src={
                          item.image.startsWith("http")
                            ? item.image
                            : `http://127.0.0.1:8000${item.image}`
                        }
                        alt={item.name}
                        className="h-28 w-full rounded-lg object-cover sm:w-32"
                      />
                    ) : (
                      <div className="flex h-28 w-full items-center justify-center rounded-lg bg-orange-50 text-sm text-orange-400 sm:w-32">
                        No image
                      </div>
                    )}

                    {/* Food Details */}
                    <div className="flex-1">

                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-slate-800">
                            {item.name}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            NPR {item.price.toFixed(2)} each
                          </p>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Remove item"
                        >
                          <Trash2 size={19} />
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="mt-4 flex items-center justify-between">

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="rounded-lg border p-2 hover:bg-slate-100"
                          >
                            <Minus size={16} />
                          </button>

                          <span className="font-semibold">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="rounded-lg border p-2 hover:bg-slate-100"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <p className="font-semibold text-slate-800">
                          NPR {(item.price * item.quantity).toFixed(2)}
                        </p>

                      </div>

                    </div>
                  </div>

                  {/* Special Instructions */}
                  <div className="mt-5">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Special Instructions
                    </label>

                    <textarea
                      value={item.special_instructions}
                      onChange={(event) =>
                        updateInstructions(item.id, event.target.value)
                      }
                      placeholder="Example: Less spicy, no onion..."
                      rows={2}
                      className="w-full rounded-lg border border-slate-300 p-3 text-sm outline-none focus:border-orange-500"
                    />
                  </div>

                </div>
              ))}

            </div>

            {/* Order Summary */}
            <div className="h-fit rounded-xl bg-white p-6 shadow-sm">

              <h2 className="text-lg font-semibold text-slate-800">
                Order Summary
              </h2>

              <div className="mt-5 flex justify-between text-sm text-slate-600">
                <span>Total Items</span>
                <span>{totalItems}</span>
              </div>

              <div className="mt-4 flex justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span>NPR {totalPrice.toFixed(2)}</span>
              </div>

              <div className="my-5 border-t border-slate-200" />

              <div className="flex justify-between font-bold text-slate-800">
                <span>Total</span>
                <span>NPR {totalPrice.toFixed(2)}</span>
              </div>

              <p className="mt-3 text-xs text-slate-400">
                Taxes and service charges, if applicable, will be calculated at checkout.
              </p>

              <button
                onClick={handleCheckout}
                className="mt-6 w-full rounded-lg bg-orange-600 py-3 font-semibold text-white transition hover:bg-orange-700"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate(`/table/${qrToken}`)}
                className="mt-3 w-full rounded-lg border border-slate-300 py-3 font-medium text-slate-700 hover:bg-slate-50"
              >
                Continue Ordering
              </button>

            </div>

          </div>
        )}

      </main>
    </div>
  );
}
