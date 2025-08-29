import { Html, Head, Preview, Body } from "@react-email/components";
import * as React from "react";

export default function Email({ name = "Customer", orderItems = [] }) {
  const total = orderItems.reduce(
    (sum, item) => sum + (item.quantity || 1) * item.price,
    0
  );

  return (
    <Html>
      <Head />
      <Preview>Your CravingCart Order Confirmation</Preview>
      <Body
        style={{
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f4f4f4",
          padding: "20px",
        }}
      >
        <table
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <tbody>
            {/* Header */}
            <tr style={{ backgroundColor: "#ff5722" }}>
              <td
                style={{
                  padding: "20px",
                  textAlign: "center",
                  color: "#fff",
                }}
              >
                <h1 style={{ margin: "0", fontSize: "24px" }}>CravingCart</h1>
              </td>
            </tr>

            {/* Greeting */}
            <tr>
              <td style={{ padding: "20px" }}>
                <h2 style={{ margin: "0 0 10px" }}>
                  Thank you for your order, {name}!
                </h2>
                <p style={{ margin: "0", fontSize: "16px" }}>
                  Your food will be on its way shortly 🍽️
                </p>
              </td>
            </tr>

            {/* Order Summary Table */}
            <tr>
              <td style={{ padding: "20px" }}>
                <table width="100%" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f8f8f8" }}>
                      <th
                        style={{
                          padding: "10px",
                          textAlign: "left",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Item
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          textAlign: "left",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Quantity
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          textAlign: "left",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((item, index) => (
                      <tr key={index}>
                        <td
                          style={{
                            padding: "10px",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          {item.name}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            borderBottom: "1px solid #eee",
                            marginTop:"15px",
                          }}
                        >
                          {item.quantity || 1}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          ₹{(item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Total */}
                <p
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    marginTop: "20px",
                  }}
                >
                  Total: ₹{total.toFixed(2)}
                </p>
              </td>
            </tr>

            {/* Delivery Info */}
            <tr>
              <td style={{ padding: "20px" }}>
                <h3 style={{ marginBottom: "10px" }}>Delivery Information</h3>
                <p style={{ margin: "0", fontSize: "16px" }}>
                  Our delivery partner will contact you shortly. Please keep your
                  phone available.
                </p>
              </td>
            </tr>

            {/* Footer */}
            <tr style={{ backgroundColor: "#f4f4f4" }}>
              <td
                style={{
                  padding: "20px",
                  textAlign: "center",
                  fontSize: "14px",
                  color: "#666",
                }}
              >
                <p style={{ margin: "0" }}>
                  Thank you for choosing CravingCart!
                  <br />
                  Need help? Contact us at{" "}
                  <a href="mailto:support@cravingcart.com">
                    support@cravingcart.com
                  </a>
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </Body>
    </Html>
  );
}
