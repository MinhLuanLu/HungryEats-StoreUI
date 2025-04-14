import { useEffect, useState } from "react";
import '../styles/orderManagement.css';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div style={{ flex: 1 }}>
      <div className="container">
        <div className="headerContainer">
          <div className="header-left">
            <h2>Orders Management</h2>
          </div>
          <div className="header-right">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button>All Orders</button>
          </div>
        </div>

        <div className="orderContainer">
            <table className="tableContainer">
                <thead>
                <tr>
                    <th>OrderId</th>
                    <th>Customer</th>
                    <th>Details</th>
                    <th>Pickuptime</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>25</td>
                    <td>Isabella</td>
                    <td className="details-cell">Sushi, cola</td>
                    <td>10:20AM</td>
                    <td><span className="status pending">Pending</span></td>
                    <td>
                    <button className="accept-btn">Accept</button>
                    <button className="decline-btn">Decline</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

      </div>
    </div>
  );
}
