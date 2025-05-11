import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_LOCATION } from "../../config";
import Header from "../components/header";

export default function Discount() {
  const [discounts, setDiscounts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDiscount, setCurrentDiscount] = useState(null);
  const [user] = useState(() => JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    async function fetchDiscounts() {
      try {
        const response = await axios.get(`${API_LOCATION}/v1/store/discounts/${user?.Store_id}`);
        if (response.data.success) {
          setDiscounts(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching discounts:", error);
      }
    }

    fetchDiscounts();
  }, [user]);

  const handleAddDiscount = () => {
    setCurrentDiscount({
      Discount_type: "percentage",
      Discount_value: 0,
      Purchase_count: 0,
      Discount_code: "",
      add: true,
    });
    setIsEditing(true);
  };

  const handleEditDiscount = (discount) => {
    setCurrentDiscount({ ...discount });
    setIsEditing(true);
  };

  const handleChange = (field, value) => {
    setCurrentDiscount((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRemoveDiscount = async () => {
    if (!currentDiscount || !currentDiscount.Discounts_id) return;

    try {
      // You may call DELETE endpoint here
      console.log("------------- delete discount ---------------")
      const deleteDiscount = await axios.delete(`${API_LOCATION}/v1/store/discounts/${currentDiscount.Discounts_id}`);
      if(deleteDiscount.data.success){
        console.log(deleteDiscount.data.message);
        setDiscounts(deleteDiscount.data.data);
      }

      setDiscounts((prev) =>
        prev.filter((d) => d.Discounts_id !== currentDiscount.Discounts_id)
      );
      setIsEditing(false);
    } catch (error) {
      console.error("Error deleting discount:", error);
    }
  };

  const handleSubmit = async () => {
    if(currentDiscount.Discount_value == 0 || currentDiscount.Discount_type == "" || currentDiscount.Purchase_count == 0 || currentDiscount.Discount_code == ""){
      alert("Complete insert all value of discount.");
      return
    }

    if (currentDiscount.add) {
      console.log('---------- create discount ---------------');
      currentDiscount.Store = user
      // Call POST endpoint here
      const createDiscount = await axios.post(`${API_LOCATION}/v1/store/discounts`, {
        Data: currentDiscount
      });
      if(createDiscount.data.success){
        console.log(createDiscount.data.message);
        setDiscounts(createDiscount.data.data);
      }


      const newDiscount = { ...currentDiscount, Discounts_id: Date.now() }; // Temp ID
      setDiscounts([...discounts, newDiscount]);
    } 
    
    else {
      console.log('----------- update discount --------------');
      currentDiscount.Store = user
      // Call PATCH endpoint here
      const updateDiscount = await axios.patch(`${API_LOCATION}/v1/store/discounts`, {
        Data: currentDiscount
      });
      if(updateDiscount.data.success){
        console.log(updateDiscount.data.message);
        setDiscounts(updateDiscount.data.data);
      }

      setDiscounts((prev) =>
        prev.map((d) =>
          d.Discounts_id === currentDiscount.Discounts_id ? currentDiscount : d
        )
      );
    }

    setIsEditing(false);
    setCurrentDiscount(null);
  };

  return (
    <>
      <div style={styles.container}>
        <h2 style={styles.header}>Customize Discounts</h2>

        <div style={styles.section}>
          <h3 style={styles.subheader}>Existing Discounts</h3>
          {discounts.length === 0 ? (
            <p>No discounts available.</p>
          ) : (
            <ul style={styles.discountList}>
              {discounts.map((d) => (
                <li
                  key={d.Discounts_id}
                  style={styles.discountListItem}
                  onClick={() => handleEditDiscount(d)}
                >
                  <strong>Type:</strong> {d.Discount_type} | <strong>Value:</strong> {d.Discount_value}
                  {d.Discount_type === "percentage" && "%"} | <strong>Purchase Count:</strong> {d.Purchase_count} |
                  <p> Discount code: <strong>{d.Discount_code}</strong></p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button onClick={handleAddDiscount} style={styles.addButton}>
          Add Discount
        </button>

        {isEditing && currentDiscount && (
          <div style={styles.section}>
            <h3 style={styles.subheader}>
              {currentDiscount.add ? "Add Discount" : "Edit Discount"}
            </h3>
            <div style={styles.discountCard}>
              <label style={styles.label}>
                Type:
                <select
                  value={currentDiscount.Discount_type}
                  onChange={(e) => handleChange("Discount_type", e.target.value)}
                  style={styles.input}
                >
                  <option value="percentage">Percentage</option>
                  <option value="percentage">...</option>
                </select>
              </label>
              <label style={styles.label}>
                Value:
                <input
                  type="number"
                  value={currentDiscount.Discount_value}
                  onChange={(e) =>
                    handleChange("Discount_value", Number(e.target.value))
                  }
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>
                Purchase Count:
                <input
                  type="number"
                  value={currentDiscount.Purchase_count}
                  onChange={(e) =>
                    handleChange("Purchase_count", Number(e.target.value))
                  }
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>
                Discount Code:
                <input
                  value={currentDiscount.Discount_code}
                  onChange={(e) =>
                    handleChange("Discount_code", e.target.value)
                  }
                  style={styles.input}
                />
              </label>

              <div style={styles.buttonContainer}>
                {!currentDiscount.add && (
                  <button
                    onClick={handleRemoveDiscount}
                    style={styles.removeButton}
                  >
                    Remove
                  </button>
                )}
                <button onClick={handleSubmit} style={styles.updateButton}>
                  {currentDiscount.add ? "Add" : "Update"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: "700px",
    margin: "40px auto",
    padding: "20px",
    border: "2px solid #ccc",
    borderRadius: "10px",
    background: "#f9f9f9",
    fontFamily: "Arial, sans-serif",
    marginTop:"100px"
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  section: {
    marginBottom: "30px",
  },
  subheader: {
    marginBottom: "10px",
  },
  discountCard: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "15px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fff",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    fontSize: "14px",
  },
  input: {
    padding: "6px 10px",
    fontSize: "14px",
    borderRadius: "5px",
    border: "1px solid #aaa",
    marginTop: "4px",
  },
  removeButton: {
    margin: "5px",
    padding: "8px 12px",
    fontSize: "14px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  updateButton: {
    margin: "5px",
    padding: "8px 12px",
    fontSize: "14px",
    backgroundColor: "#f1c40f",
    color: "#000000",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  addButton: {
    padding: "10px 16px",
    fontSize: "14px",
    backgroundColor: "#2ecc71",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  discountList: {
    listStyleType: "none",
    paddingLeft: "0",
  },
  discountListItem: {
    background: "#eef",
    marginBottom: "8px",
    padding: "10px",
    borderRadius: "5px",
    fontSize: "14px",
    cursor: "pointer",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
  },
};
