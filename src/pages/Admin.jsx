import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Settings, FolderPlus, ArrowLeft, Check, AlertTriangle, X, Package, Calendar, FileText, DollarSign } from "lucide-react";
import { adminCreateProduct, adminUpdateProduct, adminDeleteProduct, adminFetchAllOrders, adminUpdateOrderStatus } from "../services/admin.service";

export default function Admin({ user, products, onRefreshProducts }) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form Fields state
  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [salePrice, setSalePrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [hoverImage, setHoverImage] = useState("");
  const [description, setDescription] = useState("");
  const [inStock, setInStock] = useState(true);

  // Details fields
  const [material, setMaterial] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [capacity, setCapacity] = useState("");
  const [care, setCare] = useState("");

  const [errorMsg, setErrorMsg] = useState("");

  // Toast & custom confirmation state
  const [toasts, setToasts] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState(null); // { message, onConfirm, onCancel }

  const showToast = (message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Tab & Order states
  const [activeTab, setActiveTab] = useState("inventory"); // "inventory" | "orders"
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Custom cancellation status state
  const [targetStatus, setTargetStatus] = useState("");
  const [cancelReasonText, setCancelReasonText] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);

  const loadOrders = async () => {
    if (!user?.token) return;
    try {
      setOrdersLoading(true);
      setOrdersError("");
      const data = await adminFetchAllOrders(user.token);
      setOrders(data);
    } catch (err) {
      console.error(err);
      setOrdersError(err.message || "Failed to load orders.");
    } finally {
      setOrdersLoading(false);
    }
  };

  // Always fetch orders on mount/user change so metrics are populated immediately
  useEffect(() => {
    loadOrders();
  }, [user]);

  const handleStatusChange = async (orderId, newStatus) => {
    if (newStatus === "cancelled") {
      // Set state to show reason input field
      setTargetStatus("cancelled");
      setCancelReasonText("");
      return;
    }

    setConfirmDialog({
      message: `Are you sure you want to change order status to "${newStatus}"?`,
      onConfirm: async () => {
        try {
          setStatusUpdating(true);
          await adminUpdateOrderStatus(orderId, newStatus, user.token);
          showToast("Order status updated successfully!");
          await loadOrders();
          // Update selectedOrder if open
          if (selectedOrder && selectedOrder._id === orderId) {
            setSelectedOrder(prev => ({ ...prev, status: newStatus }));
          }
        } catch (err) {
          console.error(err);
          showToast(err.message || "Failed to update order status.", "error");
        } finally {
          setStatusUpdating(false);
          setTargetStatus("");
        }
      },
      onCancel: () => {
        setTargetStatus("");
      }
    });
  };

  const handleSaveCancelledStatus = async (orderId) => {
    if (!cancelReasonText.trim()) {
      showToast("Please provide a cancellation reason.", "error");
      return;
    }

    try {
      setStatusUpdating(true);
      await adminUpdateOrderStatus(orderId, "cancelled", user.token, cancelReasonText);
      showToast("Order cancelled successfully!");
      await loadOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(prev => ({ 
          ...prev, 
          status: "cancelled",
          cancelledAt: new Date(),
          cancelReason: cancelReasonText
        }));
      }
      setTargetStatus("");
      setCancelReasonText("");
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to cancel order.", "error");
    } finally {
      setStatusUpdating(false);
    }
  };


  const resetForm = () => {
    setEditingProduct(null);
    setProductId("");
    setName("");
    setPrice(0);
    setSalePrice("");
    setCategory("");
    setImage("");
    setHoverImage("");
    setDescription("");
    setInStock(true);
    setMaterial("");
    setDimensions("");
    setCapacity("");
    setCare("");
    setErrorMsg("");
  };

  const handleOpenCreate = () => {
    resetForm();
    setFormOpen(true);
  };

  const handleOpenEdit = (p) => {
    resetForm();
    setEditingProduct(p);
    setProductId(p.id);
    setName(p.name);
    setPrice(p.price);
    setSalePrice(p.salePrice || "");
    setCategory(p.category);
    setImage(p.image);
    setHoverImage(p.hoverImage || "");
    setDescription(p.description || "");
    setInStock(p.inStock !== undefined ? p.inStock : true);

    if (p.details) {
      setMaterial(p.details.material || "");
      setDimensions(p.details.dimensions || "");
      setCapacity(p.details.capacity || "");
      setCare(p.details.care || "");
    }
    setFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name || price <= 0 || !category || !image) {
      setErrorMsg("Please fill in Name, Price, Category, and Image URL.");
      return;
    }

    const details = {
      material: material || undefined,
      dimensions: dimensions || undefined,
      capacity: capacity || undefined,
      care: care || undefined,
    };

    const payload = {
      name,
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : undefined,
      category,
      image,
      hoverImage: hoverImage || undefined,
      description: description || undefined,
      details: Object.values(details).some(v => v !== undefined) ? details : undefined,
      inStock,
    };

    try {
      if (editingProduct) {
        // Edit existing product
        await adminUpdateProduct(editingProduct.id, payload, user.token);
        showToast("Product updated successfully!");
      } else {
        // Create new product requires ID
        if (!productId) {
          setErrorMsg("Custom ID is required for new products (e.g. p10).");
          return;
        }
        await adminCreateProduct({ ...payload, _id: productId }, user.token);
        showToast("Product created successfully!");
      }
      setFormOpen(false);
      resetForm();
      onRefreshProducts();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Failed to save product.");
    }
  };

  const handleDelete = (prodId) => {
    setConfirmDialog({
      message: `Are you sure you want to delete product "${prodId}"?`,
      onConfirm: async () => {
        try {
          await adminDeleteProduct(prodId, user.token);
          showToast("Product deleted successfully!");
          onRefreshProducts();
        } catch (err) {
          console.error(err);
          showToast(err.message || "Failed to delete product.", "error");
        }
      }
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-800 border-amber-250";
      case "confirmed":
      case "processing":
        return "bg-blue-50 text-blue-850 border-blue-200";
      case "shipped":
        return "bg-purple-50 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-50 text-green-800 border-green-250";
      case "cancelled":
      case "refunded":
      default:
        return "bg-red-50 text-red-800 border-red-200";
    }
  };

  const totalRevenue = orders
    .filter(o => o.status !== "cancelled" && o.status !== "refunded")
    .reduce((sum, o) => sum + o.grandTotal, 0);

  const pendingPrepCount = orders.filter(
    o => o.status === "pending" || o.status === "processing" || o.status === "confirmed"
  ).length;

  const inStockCount = products.filter(p => p.inStock).length;

  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center">
        <AlertTriangle className="h-12 w-12 text-red-650 mx-auto mb-4" />
        <h2 className="text-xl font-serif font-bold text-neutral-950">Access Denied</h2>
        <p className="text-neutral-500 text-sm mt-2">Only administrators can access the Admin Panel.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 md:px-8 bg-sand-100 font-sans min-h-screen animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-sand-300 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-medium uppercase tracking-wide text-neutral-950 flex items-center">
            <Settings className="h-6 w-6 mr-2 text-sand-700" />
            Admin Dashboard
          </h1>
          <p className="text-xs text-neutral-500 mt-1 uppercase tracking-widest">
            Manage Pottery Studio
          </p>
        </div>

        {activeTab === "inventory" && (
          <button
            onClick={handleOpenCreate}
            className="bg-neutral-950 hover:bg-neutral-850 text-white text-xs font-sans tracking-widest uppercase px-6 py-3 transition-colors cursor-pointer flex items-center justify-center space-x-1.5 animate-fade-in"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Product</span>
          </button>
        )}
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in">
        <div className="bg-sand-200/30 border border-sand-350 p-5 flex items-center space-x-4">
          <div className="p-3 bg-neutral-950 text-white rounded">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Total Revenue</p>
            <h3 className="text-lg font-serif font-bold text-neutral-950 mt-0.5">${totalRevenue.toFixed(2)}</h3>
          </div>
        </div>

        <div className="bg-sand-200/30 border border-sand-350 p-5 flex items-center space-x-4">
          <div className="p-3 bg-neutral-950 text-white rounded">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Total Orders</p>
            <h3 className="text-lg font-serif font-bold text-neutral-950 mt-0.5">{orders.length}</h3>
          </div>
        </div>

        <div className="bg-sand-200/30 border border-sand-350 p-5 flex items-center space-x-4">
          <div className="p-3 bg-neutral-950 text-white rounded">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Pending Prep</p>
            <h3 className="text-lg font-serif font-bold text-neutral-950 mt-0.5">{pendingPrepCount}</h3>
          </div>
        </div>

        <div className="bg-sand-200/30 border border-sand-350 p-5 flex items-center space-x-4">
          <div className="p-3 bg-neutral-950 text-white rounded">
            <Settings className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Active Inventory</p>
            <h3 className="text-lg font-serif font-bold text-neutral-950 mt-0.5">{inStockCount} / {products.length}</h3>
          </div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-sand-300 mb-8 space-x-6">
        <button
          onClick={() => setActiveTab("inventory")}
          className={`pb-3 text-sm font-sans font-bold uppercase tracking-widest transition-all cursor-pointer relative ${
            activeTab === "inventory" ? "text-neutral-950" : "text-neutral-400 hover:text-neutral-600"
          }`}
        >
          Inventory
          {activeTab === "inventory" && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-neutral-950" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 text-sm font-sans font-bold uppercase tracking-widest transition-all cursor-pointer relative ${
            activeTab === "orders" ? "text-neutral-950" : "text-neutral-400 hover:text-neutral-600"
          }`}
        >
          Orders
          {activeTab === "orders" && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-neutral-950" />
          )}
        </button>
      </div>

      {activeTab === "inventory" && (
        <div className="bg-sand-200/20 border border-sand-300/40 overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-sand-250 border-b border-sand-300 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">Image</th>
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Stock Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-250">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-sand-200/30 transition-colors text-sm text-neutral-800">
                    <td className="py-4 px-6 font-mono font-bold text-xs">{product.id}</td>
                    <td className="py-4 px-6">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover bg-sand-200 border border-sand-200"
                      />
                    </td>
                    <td className="py-4 px-6 font-serif font-semibold text-neutral-950">{product.name}</td>
                    <td className="py-4 px-6 text-xs uppercase tracking-wider">{product.category}</td>
                    <td className="py-4 px-6">
                      {product.salePrice ? (
                        <div className="flex flex-col">
                          <span className="text-clay-500 font-semibold">${product.salePrice.toFixed(2)}</span>
                          <span className="text-neutral-400 line-through text-xs">${product.price.toFixed(2)}</span>
                        </div>
                      ) : (
                        <span>${product.price.toFixed(2)}</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-0.5 border text-[9px] uppercase font-bold tracking-widest rounded-full
                          ${product.inStock ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}
                        `}
                      >
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="p-2 border border-sand-300 hover:border-neutral-900 text-neutral-600 hover:text-neutral-950 transition-colors bg-white cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 border border-sand-300 hover:border-red-650 hover:bg-red-50 text-neutral-600 hover:text-red-700 transition-colors bg-white cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="space-y-6 animate-fade-in">
          {ordersLoading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-3">
              <Package className="h-10 w-10 text-neutral-350 animate-pulse" />
              <p className="text-neutral-500 text-xs tracking-wider uppercase">Loading customer orders...</p>
            </div>
          ) : ordersError ? (
            <div className="bg-red-50 border border-red-200 p-4 text-center text-sm text-red-700">
              <AlertTriangle className="h-5 w-5 mx-auto mb-2 text-red-650" />
              <p>{ordersError}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-24 bg-sand-200/20 border border-sand-300/40 p-8 space-y-4">
              <Package className="h-16 w-16 text-neutral-350 mx-auto stroke-[1]" />
              <p className="text-neutral-500 text-sm">No orders found in database.</p>
            </div>
          ) : (
            <div className="bg-sand-200/20 border border-sand-300/40 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-sand-250 border-b border-sand-300 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                      <th className="py-4 px-6">Order ID</th>
                      <th className="py-4 px-6">Customer</th>
                      <th className="py-4 px-6">Date</th>
                      <th className="py-4 px-6">Total</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-250">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-sand-200/30 transition-colors text-sm text-neutral-800">
                        <td className="py-4 px-6 font-mono font-bold text-xs">{order._id}</td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="font-semibold text-neutral-950">{order.user?.name || "Guest / Deleted"}</span>
                            <span className="text-neutral-500 text-xs">{order.user?.email || order.shippingAddress?.email || ""}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-xs">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 font-semibold text-neutral-950">
                          ${order.grandTotal.toFixed(2)}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-2 py-0.5 border text-[9px] uppercase font-bold tracking-widest rounded-full
                              ${getStatusStyle(order.status)}
                            `}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-xs uppercase tracking-wider font-bold border border-sand-300 hover:border-neutral-950 px-3 py-1.5 transition-colors bg-white cursor-pointer"
                          >
                            Details / Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Editor Overlay Modal Form */}
      {formOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 font-sans animate-fade-in">
          <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={() => setFormOpen(false)} />
          <div className="relative bg-sand-100 max-w-2xl w-full p-8 border border-sand-300 shadow-2xl z-10 flex flex-col my-8 animate-slide-up">
            <button
              onClick={() => setFormOpen(false)}
              className="absolute right-4 top-4 text-neutral-500 hover:text-neutral-950 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-serif font-semibold text-neutral-950 border-b border-sand-300 pb-3 mb-6">
              {editingProduct ? `Edit Product: ${editingProduct.id}` : "Create New Product"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-xs text-red-700 p-3 font-semibold">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* ID only editable on creation */}
                <div className="space-y-1">
                  <label className="text-xs text-neutral-600 uppercase">Product ID *</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingProduct}
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    placeholder="e.g. p10"
                    className="w-full bg-white disabled:bg-sand-200 border border-sand-300 px-3 py-2 text-sm focus:outline-none focus:border-sand-700 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-600 uppercase">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Rustic Speckled Mug"
                    className="w-full bg-white border border-sand-300 px-3 py-2 text-sm focus:outline-none focus:border-sand-700 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-600 uppercase">Category *</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Clay Mugs"
                    className="w-full bg-white border border-sand-300 px-3 py-2 text-sm focus:outline-none focus:border-sand-700 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs text-neutral-600 uppercase">Price ($) *</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      min="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-white border border-sand-300 px-3 py-2 text-sm focus:outline-none focus:border-sand-700 transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-neutral-600 uppercase">Sale Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={salePrice}
                      onChange={(e) => setSalePrice(e.target.value)}
                      placeholder="Optional"
                      className="w-full bg-white border border-sand-300 px-3 py-2 text-sm focus:outline-none focus:border-sand-700 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-600 uppercase">Image URL *</label>
                  <input
                    type="url"
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full bg-white border border-sand-300 px-3 py-2 text-sm focus:outline-none focus:border-sand-700 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-600 uppercase">Hover Image URL</label>
                  <input
                    type="url"
                    value={hoverImage}
                    onChange={(e) => setHoverImage(e.target.value)}
                    placeholder="Optional hover alternate"
                    className="w-full bg-white border border-sand-300 px-3 py-2 text-sm focus:outline-none focus:border-sand-700 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-600 uppercase">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white border border-sand-300 px-3 py-2 text-sm focus:outline-none focus:border-sand-700 transition-colors resize-none font-sans"
                />
              </div>

              {/* Details Subsection */}
              <div>
                <h4 className="text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-500 mb-3 border-b border-sand-200 pb-1">
                  Product Specifications (Details)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-neutral-600 uppercase">Material</label>
                    <input
                      type="text"
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      placeholder="e.g. Stoneware Clay"
                      className="w-full bg-white border border-sand-300 px-3 py-2 text-sm focus:outline-none focus:border-sand-700 transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-neutral-600 uppercase">Dimensions</label>
                    <input
                      type="text"
                      value={dimensions}
                      onChange={(e) => setDimensions(e.target.value)}
                      placeholder="e.g. 3.5' Diameter x 4' Height"
                      className="w-full bg-white border border-sand-300 px-3 py-2 text-sm focus:outline-none focus:border-sand-700 transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-neutral-600 uppercase">Capacity</label>
                    <input
                      type="text"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      placeholder="e.g. 12 oz"
                      className="w-full bg-white border border-sand-300 px-3 py-2 text-sm focus:outline-none focus:border-sand-700 transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-neutral-600 uppercase">Care Instructions</label>
                    <input
                      type="text"
                      value={care}
                      onChange={(e) => setCare(e.target.value)}
                      placeholder="e.g. Dishwasher safe"
                      className="w-full bg-white border border-sand-300 px-3 py-2 text-sm focus:outline-none focus:border-sand-700 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Stock toggle */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="w-4.5 h-4.5 accent-neutral-900 border-sand-300 rounded cursor-pointer"
                />
                <label htmlFor="inStock" className="text-xs text-neutral-700 uppercase select-none cursor-pointer font-semibold">
                  Product is in stock
                </label>
              </div>

              <div className="flex space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="flex-1 border border-neutral-950 text-neutral-950 hover:bg-neutral-100 text-xs font-sans tracking-widest uppercase py-3 transition-colors cursor-pointer text-center font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-neutral-950 hover:bg-neutral-850 text-white text-xs font-sans tracking-widest uppercase py-3 transition-colors cursor-pointer text-center font-semibold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Overlay Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 font-sans animate-fade-in">
          <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={() => { setSelectedOrder(null); setTargetStatus(""); }} />
          <div className="relative bg-sand-100 max-w-3xl w-full p-8 border border-sand-300 shadow-2xl z-10 flex flex-col my-8 animate-slide-up">
            <button
              onClick={() => { setSelectedOrder(null); setTargetStatus(""); }}
              className="absolute right-4 top-4 text-neutral-500 hover:text-neutral-950 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-serif font-semibold text-neutral-950 border-b border-sand-300 pb-3 mb-6 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-sand-700" />
              Manage Order: <span className="font-mono text-base ml-2 text-neutral-600">{selectedOrder._id}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Left Column: Customer & Shipping Details */}
              <div className="space-y-4">
                <div className="bg-sand-200/30 p-4 border border-sand-250 rounded space-y-2">
                  <h4 className="text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-500">Customer Info</h4>
                  <p className="text-sm font-semibold text-neutral-950">{selectedOrder.user?.name || "N/A"}</p>
                  <p className="text-xs text-neutral-650">{selectedOrder.user?.email || "N/A"}</p>
                </div>

                <div className="bg-sand-200/30 p-4 border border-sand-250 rounded space-y-2">
                  <h4 className="text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-500">Shipping Address</h4>
                  <p className="text-sm font-semibold text-neutral-950">{selectedOrder.shippingAddress?.fullName}</p>
                  <p className="text-xs text-neutral-650">{selectedOrder.shippingAddress?.email}</p>
                  <p className="text-xs text-neutral-700 whitespace-pre-line leading-relaxed">{selectedOrder.shippingAddress?.address}</p>
                </div>

                <div className="bg-sand-200/30 p-4 border border-sand-250 rounded space-y-2">
                  <h4 className="text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-500">Payment Information</h4>
                  <div className="flex justify-between text-xs text-neutral-700">
                    <span>Method:</span>
                    <span className="font-semibold uppercase">{selectedOrder.payment?.method}</span>
                  </div>
                  <div className="flex justify-between text-xs text-neutral-700">
                    <span>Status:</span>
                    <span className="font-semibold uppercase">{selectedOrder.payment?.status}</span>
                  </div>
                  {selectedOrder.payment?.paidAt && (
                    <div className="flex justify-between text-xs text-neutral-700">
                      <span>Paid At:</span>
                      <span>{new Date(selectedOrder.payment.paidAt).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Order items and management */}
              <div className="space-y-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-500 mb-3 border-b border-sand-250 pb-1">Items Summary</h4>
                  <div className="max-h-40 overflow-y-auto space-y-3 pr-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-3 text-xs border-b border-sand-200/30 pb-2 last:border-0">
                        <img src={item.thumbnail} alt={item.title} className="w-10 h-10 object-cover bg-sand-200 border border-sand-250" />
                        <div className="flex-1 min-w-0">
                          <p className="font-serif font-semibold text-neutral-950 truncate">{item.title}</p>
                          <p className="text-neutral-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                        </div>
                        <span className="font-semibold text-neutral-950">${item.subtotal.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-sand-300 pt-3 mt-3 space-y-1.5 text-xs text-neutral-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-neutral-950">${selectedOrder.itemsTotal.toFixed(2)}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-green-700">
                        <span>Discount</span>
                        <span>-${selectedOrder.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="font-semibold text-neutral-950">${selectedOrder.shippingCharge.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-neutral-950 border-t border-sand-250 pt-1.5 mt-1.5">
                      <span>Total</span>
                      <span>${selectedOrder.grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Status management block */}
                <div className="border-t border-sand-300 pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-600 uppercase font-bold tracking-wider">Current Status:</span>
                    <span className={`px-2.5 py-0.5 border text-[10px] uppercase font-bold tracking-widest ${getStatusStyle(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-neutral-600 uppercase font-semibold">Update Status to:</label>
                    <select
                      value={targetStatus || selectedOrder.status}
                      disabled={statusUpdating}
                      onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                      className="w-full bg-white border border-sand-300 px-3 py-2 text-sm focus:outline-none focus:border-sand-700 transition-colors uppercase tracking-widest text-xs font-semibold cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>

                  {targetStatus === "cancelled" && (
                    <div className="space-y-2 p-3 bg-red-50/50 border border-red-200/50 rounded animate-fade-in">
                      <label className="text-xs text-red-800 uppercase font-semibold">Cancellation Reason:</label>
                      <input
                        type="text"
                        value={cancelReasonText}
                        onChange={(e) => setCancelReasonText(e.target.value)}
                        placeholder="e.g. Out of stock, customer request, etc."
                        className="w-full bg-white border border-red-350 px-3 py-2 text-xs focus:outline-none focus:border-red-700 transition-colors"
                      />
                      <div className="flex space-x-2 pt-1">
                        <button
                          type="button"
                          onClick={() => { setTargetStatus(""); setCancelReasonText(""); }}
                          className="flex-1 bg-white border border-neutral-350 hover:bg-neutral-50 text-neutral-700 text-[10px] font-sans tracking-widest uppercase py-1.5 transition-colors cursor-pointer text-center font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveCancelledStatus(selectedOrder._id)}
                          className="flex-1 bg-red-600 hover:bg-red-750 text-white text-[10px] font-sans tracking-widest uppercase py-1.5 transition-colors cursor-pointer text-center font-semibold"
                        >
                          Confirm Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedOrder.status === "cancelled" && selectedOrder.cancelReason && (
                    <div className="bg-red-50/50 border border-red-200 p-3 rounded text-xs text-red-800">
                      <span className="font-bold">Cancellation Reason:</span> {selectedOrder.cancelReason}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-sand-300 pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => { setSelectedOrder(null); setTargetStatus(""); }}
                className="bg-neutral-950 hover:bg-neutral-850 text-white text-xs font-sans tracking-widest uppercase px-6 py-2.5 transition-colors cursor-pointer text-center font-semibold"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications container */}
      <div className="fixed bottom-6 right-6 z-[60] space-y-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center space-x-3 px-4 py-3 rounded border shadow-lg animate-slide-left min-w-[280px] max-w-sm ${
              toast.type === "error"
                ? "bg-red-50 text-red-800 border-red-200"
                : "bg-green-50 text-green-800 border-green-200"
            }`}
          >
            {toast.type === "error" ? (
              <AlertTriangle className="h-4.5 w-4.5 text-red-650 shrink-0" />
            ) : (
              <Check className="h-4.5 w-4.5 text-green-650 shrink-0" />
            )}
            <p className="text-xs font-semibold flex-1">{toast.message}</p>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Confirmation Modal Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center p-4 font-sans animate-fade-in">
          <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xs" onClick={() => {
            if (confirmDialog.onCancel) confirmDialog.onCancel();
            setConfirmDialog(null);
          }} />
          <div className="relative bg-sand-100 max-w-md w-full p-6 border border-sand-300 shadow-2xl z-10 flex flex-col space-y-4 animate-scale-up">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-250 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-800" />
              </div>
              <div>
                <h4 className="text-base font-serif font-semibold text-neutral-950">Are you sure?</h4>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{confirmDialog.message}</p>
              </div>
            </div>
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => {
                  if (confirmDialog.onCancel) confirmDialog.onCancel();
                  setConfirmDialog(null);
                }}
                className="flex-1 border border-neutral-350 hover:bg-neutral-100 text-neutral-750 text-[10px] font-sans tracking-widest uppercase py-2.5 transition-colors cursor-pointer text-center font-bold"
              >
                No, Cancel
              </button>
              <button
                onClick={() => {
                  confirmDialog.onConfirm();
                  setConfirmDialog(null);
                }}
                className="flex-1 bg-neutral-950 hover:bg-neutral-850 text-white text-[10px] font-sans tracking-widest uppercase py-2.5 transition-colors cursor-pointer text-center font-bold"
              >
                Yes, Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
