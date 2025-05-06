import React, { useState } from 'react';
import { API_LOCATION } from '../../config';
import { socketConfig } from '../../config';


  

export default function Food({ foodData, onclose, saveChange, SocketIO }) {

  const [food, setFood] = useState({ ...foodData });

  function handleChange(e) {
    const { name, value } = e.target;
    setFood(prev => ({ ...prev, [name]: value }));
  }

  function handleSave() {
    saveChange(food);

    if(SocketIO){
      SocketIO.current.emit(socketConfig.updateFoodData, {Food: food})
    }
  }

  return (
    <div style={styles.card}>
      <button style={styles.xbutton} onClick={onclose}>X</button>
      <div>
        <img
          src={`${API_LOCATION}/${food.Food_image}`}
          alt={food.Food_name}
          style={styles.image}
        />
        <button style={styles.changeImage}>change image</button>
      </div>
      <div style={styles.details}>
        <input
          name="Food_name"
          value={food.Food_name}
          onChange={handleChange}
          placeholder="Food Name"
          style={styles.input}
        />
        <textarea
          name="Food_description"
          value={food.Food_description}
          onChange={handleChange}
          placeholder="Food Description"
          rows={4}
          style={styles.textarea}
        />
        <div style={styles.meta}>
          <div style={styles.inputWrapper}>
            <label style={styles.label}>Price (Kr)</label>
            <input
              name="Price"
              type="number"
              value={food.Price}
              onChange={handleChange}
              placeholder="Price"
              style={styles.input}
            />
          </div>
          <div style={styles.inputWrapper}>
            <label style={styles.label}>Quantity (X)</label>
            <input
              name="Quantity"
              type="number"
              value={food.Quantity}
              onChange={handleChange}
              placeholder="Quantity"
              style={styles.input}
            />
          </div>
        </div>
        <p style={styles.date}>
          📅 Added on: {new Date(food.Created_at).toLocaleDateString()}
        </p>
        <button onClick={handleSave} style={styles.saveButton}>Save Changes</button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    width: '60%',
    margin: '2rem auto',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    fontFamily: '"Segoe UI", sans-serif',
    position: 'relative',
    paddingBottom: '20px',
    overflow:"auto" // Add bottom padding for Save button
  },
  xbutton: {
    position: 'absolute',
    right: '15px',
    top: '10px',
    background: 'red',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: '400px',
    objectFit: 'cover',
  },
  details: {
    padding: '1.5rem',
  },
  input: {
    width: '100%',
    padding: '0.8rem',
    marginBottom: '1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  textarea: {
    width: '100%',
    padding: '0.8rem',
    marginBottom: '1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    resize: 'vertical',
  },
  name: {
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
    color: '#333',
    fontWeight: 'bold',
  },
  meta: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    marginBottom: '1rem',
  },
  inputWrapper: {
    width: '45%', // To align the inputs side by side
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '0.5rem',
    display: 'block',
  },
  date: {
    fontSize: '0.9rem',
    color: '#888',
    marginBottom: '1rem',
  },
  saveButton: {
    backgroundColor: '#008080',
    color: '#fff',
    border: 'none',
    padding: '0.8rem 1.5rem',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    width: '100%',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },

  changeImage:{
    position:"absolute",
    left:10,
    top:10
  }
  
};
