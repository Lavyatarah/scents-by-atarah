import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { FaTrash, FaArrowLeft, FaWhatsapp } from "react-icons/fa";
import { useLocation } from "wouter";

export default function Checkout() {
  const [, navigate] = useLocation();
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setLoading(true);
    try {
      const whatsappMessage = encodeURIComponent(
        `Hi Scent by Atarah 📦\n\nI'd like to order:\n${items
          .map((item) => `• ${item.name} (Qty: ${item.quantity})`)
          .join("\n")}\n\nTotal: KSH ${total.toLocaleString()}\n\nPlease let me know the payment details.`,
      );
      window.open(`https://wa.me/254768702377?text=${whatsappMessage}`, "_blank");
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to open WhatsApp order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pt-20 pb-12">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <button
          onClick={() => navigate("/shop")}
          className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6"
        >
          <FaArrowLeft /> Back to Shop
        </button>

        <h1 className="font-serif text-3xl mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 border border-border rounded-lg hover:border-primary/50 transition"
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />

                  <div className="flex-1">
                    <h3 className="font-serif text-base mb-1">{item.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      KSH {Number(item.price).toLocaleString()}
                    </p>

                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, Math.max(1, item.quantity - 1))
                        }
                        className="px-2 py-1 border border-border text-xs hover:border-primary"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, Math.max(1, parseInt(e.target.value) || 1))
                        }
                        className="w-12 text-center text-sm border border-border py-1"
                      />
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 border border-border text-xs hover:border-primary"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold mb-4">
                      KSH {(Number(item.price) * item.quantity).toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-600 transition"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="border border-border p-6 rounded-lg sticky top-24">
                <h3 className="font-serif text-lg mb-4">Order Summary</h3>

                <div className="space-y-2 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>KSH {total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>FREE</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="flex justify-between font-semibold mb-6 text-lg">
                  <span>Total</span>
                  <span>KSH {total.toLocaleString()}</span>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={loading || items.length === 0}
                  className="w-full mb-3 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {loading ? "Opening WhatsApp..." : (
                    <>
                      <FaWhatsapp className="mr-2" /> Place WhatsApp Order
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const whatsappMessage = encodeURIComponent(
                      `Hi Scent by Atarah 📦\n\nI'd like to order:\n${items
                        .map((i) => `• ${i.name} (Qty: ${i.quantity})`)
                        .join("\n")}\n\nTotal: KSH ${total.toLocaleString()}`
                    );
                    window.open(
                      `https://wa.me/254768702377?text=${whatsappMessage}`,
                      "_blank"
                    );
                  }}
                >
                  Order via WhatsApp
                </Button>

                <button
                  onClick={() => clearCart()}
                  className="w-full mt-3 text-xs text-muted-foreground hover:text-red-500 transition"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
