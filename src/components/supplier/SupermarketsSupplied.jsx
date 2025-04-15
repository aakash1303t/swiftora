import React from "react";

const supermarkets = [
  {
    name: "FreshMart",
    orders: 156,
    lastOrder: "2 hours ago",
    satisfactionRate: "98%",
    returnsRate: "0.5%",
    amount: "£45,000",
    paymentStatus: "Up to date",
    status: "Active",
    statusColor: "bg-green-100 text-green-700",
  }, 
  {
    name: "SuperValue",
    orders: 98,
    lastOrder: "5 hours ago",
    satisfactionRate: "95%",
    returnsRate: "1.2%",
    amount: "£32,000",
    paymentStatus: "Up to date",
    status: "Active",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    name: "QuickStop",
    orders: 72,
    lastOrder: "1 day ago",
    satisfactionRate: "92%",
    returnsRate: "2.1%",
    amount: "£28,000",
    paymentStatus: "7 days overdue",
    status: "Pending",
    statusColor: "bg-yellow-100 text-yellow-700",
    overdue: true,
  },
  {
    name: "Metro Foods",
    orders: 64,
    lastOrder: "3 hours ago",
    satisfactionRate: "97%",
    returnsRate: "0.8%",
    amount: "£25,000",
    paymentStatus: "Up to date",
    status: "Active",
    statusColor: "bg-green-100 text-green-700",
  },
];

const SupermarketsSupplied = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Supermarkets Supplied</h2>
        <a href="#" className="text-blue-600 font-medium">View All</a>
      </div>
      <p className="text-gray-500 mb-4">{supermarkets.length} active partners</p>

      <div className="space-y-4">
        {supermarkets.map((market, index) => (
          <div key={index} className="border-b pb-4 last:border-b-0">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{market.name}</h3>
                <p className="text-gray-500 text-sm">
                  {market.orders} orders • Last order: {market.lastOrder}
                </p>
                <div className="flex space-x-6 mt-1 text-sm">
                  <span className="text-gray-600">Satisfaction Rate <strong>{market.satisfactionRate}</strong></span>
                  <span className="text-gray-600">Returns Rate <strong>{market.returnsRate}</strong></span>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold">{market.amount}</p>
                <p className={`text-sm ${market.overdue ? "text-red-500 font-medium" : "text-green-600"}`}>
                  {market.paymentStatus}
                </p>
                <span className={`px-2 py-1 rounded text-sm ${market.statusColor}`}>
                  {market.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupermarketsSupplied;
