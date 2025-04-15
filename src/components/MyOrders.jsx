import React from "react";

const MyOrders = ({ orders }) => {
  return (
    <section className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-semibold text-[#5b2333]">My Orders</h2>
      <p className="text-sm text-gray-700 mt-2">
        {orders.length} total orders placed.
      </p>

      {/* Orders List */}
      <div className="mt-4">
        {orders.map((order) => (
          <div key={order.id} className="flex justify-between items-center py-3 border-b">
            <div>
              <h3 className="text-lg font-semibold text-black">{order.product}</h3>
              <p className="text-sm text-gray-600">
                Order ID: {order.id} • Placed on: {order.date}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-black">{order.quantity} units</p>
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  order.status === "Delivered"
                    ? "bg-green-200 text-green-800"
                    : order.status === "Processing"
                    ? "bg-yellow-200 text-yellow-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MyOrders;
