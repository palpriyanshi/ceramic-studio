import React, { useState, useEffect } from "react";
import { Package, Calendar, Tag, FileText, XCircle, AlertCircle } from "lucide-react";
import { fetchMyOrders, cancelOrder } from "../services/order.service";

export default function Orders({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchMyOrders(user.token);
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load order history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      getOrders();
    }
  }, [user]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await cancelOrder(orderId, user.token);
      alert("Order successfully cancelled.");
      // Reload orders to reflect status change
      getOrders();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to cancel order.");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-250";
      case "confirmed":
      case "processing":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-250";
      case "cancelled":
      case "refunded":
      default:
        return "bg-red-50 text-red-800 border-red-200";
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center">
        <p className="text-neutral-500 text-sm">Please log in to view your orders.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 md:px-8 bg-sand-100 font-sans min-h-screen animate-fade-in">
      <div className="text-center mb-12 space-y-2">
        <h1 className="text-3xl md:text-4xl font-serif font-medium tracking-wide uppercase text-neutral-950">
          Your Orders
        </h1>
        <div className="w-12 h-[2px] bg-sand-700 mx-auto" />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-3">
          <Package className="h-10 w-10 text-neutral-350 animate-pulse" />
          <p className="text-neutral-500 text-xs tracking-wider uppercase">Loading orders...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 p-4 text-center text-sm text-red-700">
          <AlertCircle className="h-5 w-5 mx-auto mb-2 text-red-650" />
          <p>{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-24 bg-sand-200/20 border border-sand-300/40 p-8 space-y-4">
          <Package className="h-16 w-16 text-neutral-300 mx-auto stroke-[1]" />
          <p className="text-neutral-500 text-sm">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order._id} className="bg-sand-200/20 border border-sand-300/50 p-6 md:p-8 space-y-6">
              {/* Order Header info */}
              <div className="flex flex-wrap items-center justify-between border-b border-sand-300 pb-4 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-sand-300 flex items-center justify-center rounded">
                    <FileText className="h-5 w-5 text-neutral-700" />
                  </div>
                  <div>
                    <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-500">Order ID</h3>
                    <p className="text-xs font-mono font-bold text-neutral-950 truncate max-w-[150px] sm:max-w-none">
                      {order._id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-500">Date</h3>
                    <p className="text-xs font-semibold text-neutral-800 flex items-center justify-end">
                      <Calendar className="h-3.5 w-3.5 mr-1 text-neutral-500" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <span className={`px-2.5 py-0.5 border text-[10px] uppercase font-bold tracking-widest ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-4 border-b border-sand-200/50 pb-4 last:border-0 last:pb-0">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-16 h-16 object-cover bg-sand-200 border border-sand-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-serif font-semibold text-neutral-950 truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-xs font-semibold text-neutral-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order calculations & footer */}
              <div className="border-t border-sand-300 pt-4 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6">
                {/* Shipping Details */}
                <div className="text-xs text-neutral-600 space-y-1">
                  <h4 className="font-bold text-neutral-900">Ship To:</h4>
                  <p>{order.shippingAddress.fullName}</p>
                  <p className="italic">{order.shippingAddress.email}</p>
                  <p className="max-w-xs">{order.shippingAddress.address}</p>
                </div>

                {/* Costs details */}
                <div className="w-full sm:w-64 space-y-1.5 text-xs text-neutral-600 border-l border-sand-250 sm:pl-6 pl-0">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-neutral-950">${order.itemsTotal.toFixed(2)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-700">
                      <span>Discount</span>
                      <span>-${order.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-semibold text-neutral-950">
                      {order.shippingCharge === 0 ? "FREE" : `$${order.shippingCharge.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="border-t border-sand-350 my-1 pt-1.5 flex justify-between text-sm font-bold text-neutral-950">
                    <span>Total Paid</span>
                    <span>${order.grandTotal.toFixed(2)}</span>
                  </div>

                  {/* Cancel button */}
                  {["pending", "confirmed"].includes(order.status) && (
                    <div className="pt-3">
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="w-full border border-red-650 hover:bg-red-50 text-red-700 text-[10px] font-sans tracking-widest uppercase py-2 transition-colors cursor-pointer text-center font-bold flex items-center justify-center space-x-1"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Cancel Order</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
