
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ShoppingCart, Plus, LoaderCircle } from "lucide-react";

import api from "../../services/api";
import { useCart } from "../../context/CartContext";

interface Table {
  id: number;
  table_number: string;
  section?: string;
}

interface Category {
  id: number;
  name: string;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string | number;
  image: string | null;
  category: number;
  is_available: boolean;
}

export default function CustomerMenu() {
  const { qrToken } = useParams<{ qrToken: string }>();
  const navigate = useNavigate();

  const { addToCart, totalItems, totalPrice } = useCart();

  const [table, setTable] = useState<Table | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!qrToken) {
      setError("Invalid table QR code.");
      setLoading(false);
      return;
    }

    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError("");

        const [tableResponse, categoryResponse, menuResponse] =
          await Promise.all([
            api.get(`/table/qr/${qrToken}/`),
            api.get("/menu/categories/"),
            api.get("/menu/items/"),
          ]);

        setTable(tableResponse.data);

        const categoryData = categoryResponse.data;
        setCategories(
          Array.isArray(categoryData)
            ? categoryData
            : categoryData.results || []
        );

        const menuData = menuResponse.data;
        setMenuItems(
          Array.isArray(menuData) ? menuData : menuData.results || []
        );
      } catch (err) {
        console.error("Menu loading error:", err);
        setError("Unable to load the menu. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [qrToken]);

  const filteredItems =
    selectedCategory === null
      ? menuItems
      : menuItems.filter(
          (item) => item.category === selectedCategory
        );

  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      image: item.image,
    });
  };

  const getImageUrl = (image: string | null) => {
    if (!image) return null;

    if (image.startsWith("http")) {
      return image;
    }

    return `http://127.0.0.1:8000${image}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <LoaderCircle className="animate-spin" size={24} />
          <span>Loading menu...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <p className="mb-4 text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-black px-5 py-2 text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Restaurant Menu
            </h1>

            {table && (
              <p className="mt-1 text-sm text-gray-500">
                Table {table.table_number}
                {table.section ? ` · ${table.section}` : ""}
              </p>
            )}
          </div>

          <button
            onClick={() => navigate(`/table/${qrToken}/cart`)}
            className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
          >
            <ShoppingCart size={19} />
            <span>Cart ({totalItems})</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Welcome */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Explore Our Menu
          </h2>
          <p className="mt-2 text-gray-500">
            Choose your favourite food and add it to your cart.
          </p>
        </section>

        {/* Categories */}
        <section className="mb-8">
          <div className="flex gap-3 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium ${
                selectedCategory === null
                  ? "bg-black text-white"
                  : "bg-white text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Items
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium ${
                  selectedCategory === category.id
                    ? "bg-black text-white"
                    : "bg-white text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </section>

        {/* Menu Items */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              {selectedCategory === null
                ? "All Food Items"
                : categories.find(
                    (category) => category.id === selectedCategory
                  )?.name}
            </h3>

            <span className="text-sm text-gray-500">
              {filteredItems.length} items
            </span>
          </div>

          {filteredItems.length === 0 ? (
            <div className="rounded-xl bg-white py-16 text-center text-gray-500">
              No food items available in this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md"
                >
                  {/* Food Image */}
                  <div className="h-48 bg-gray-100">
                    {item.image ? (
                      <img
                        src={getImageUrl(item.image) || ""}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        No image available
                      </div>
                    )}
                  </div>

                  {/* Food Details */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {item.name}
                      </h4>

                      <span className="shrink-0 font-semibold text-gray-900">
                        Rs. {Number(item.price).toFixed(2)}
                      </span>
                    </div>

                    <p className="mt-2 min-h-10 text-sm text-gray-500">
                      {item.description || "Delicious food prepared fresh."}
                    </p>

                    <button
                      disabled={!item.is_available}
                      onClick={() => handleAddToCart(item)}
                      className={`mt-4 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-medium ${
                        item.is_available
                          ? "bg-black text-white hover:bg-gray-800"
                          : "cursor-not-allowed bg-gray-200 text-gray-500"
                      }`}
                    >
                      <Plus size={18} />
                      {item.is_available ? "Add to Cart" : "Unavailable"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Bottom Cart Summary */}
      {totalItems > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-30 mx-auto max-w-2xl">
          <button
            onClick={() => navigate(`/table/${qrToken}/cart`)}
            className="flex w-full items-center justify-between rounded-xl bg-black px-5 py-4 text-white shadow-lg"
          >
            <span className="flex items-center gap-2 font-medium">
              <ShoppingCart size={20} />
              View Cart ({totalItems} items)
            </span>

            <span className="font-semibold">
              Rs. {totalPrice.toFixed(2)}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
