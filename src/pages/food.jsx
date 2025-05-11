import React, { useState } from 'react';
import { API_LOCATION } from '../../config';
import { socketConfig } from '../../config';
import axios from 'axios';
import "../styles/food.css";

export default function Food({ foodData, onclose, saveChange, SocketIO }) {
  const [food, setFood] = useState({ ...foodData });
  const [imageFile, setImageFile] = useState(null);
  const [newImage, setNewImage] = useState(null)

  function handleChange(e) {
    const { name, value } = e.target;
    setFood(prev => ({ ...prev, [name]: value }));
  }

  function handleSave() {
    saveChange(food);

    if (SocketIO) {
      SocketIO.current.emit(socketConfig.updateFoodData, { Food: food });
    }
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      console.log(file)
    }
  }


  async function handleSendImage(){
    const formData = new FormData();
    formData.append('image', imageFile); // 'image' should match backend field name
    formData.append('Food', JSON.stringify(food));
    if(imageFile){
      try{
        const sendImage = await axios.post(`${API_LOCATION}/v1/store/upload/food/image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if(sendImage.data.success){
          console.log(sendImage.data.message)
          alert('update image successfully.');
          setNewImage(sendImage.data.data)
        }
      }
      catch(error){
        console.log(error)
      }
    }
  }

  return (
    <div className="card">
      <div className="imageContainer">
        <button className="xbutton" onClick={onclose}>X</button>
        <img
          src={food.Food_image}
          alt={food.Food_name}
          className="image"
        />
        <div className="uploadImageContainer">
          <input type="file" className="uploadImage" onChange={handleImageChange}/>
          <button onClick={()=> handleSendImage()} className='updateImageButton'>Upload</button>
        </div>
      </div>
      <div className="details">
        <input
          name="Food_name"
          value={food.Food_name}
          onChange={handleChange}
          placeholder="Food Name"
          className="input"
        />
        <textarea
          name="Food_description"
          value={food.Food_description}
          onChange={handleChange}
          placeholder="Food Description"
          rows={4}
          className="textarea"
        />
        <div className="meta">
          <div className="inputWrapper">
            <label className="label">Price (Kr)</label>
            <input
              name="Price"
              type="number"
              value={food.Price}
              onChange={handleChange}
              placeholder="Price"
              className="input"
            />
          </div>
          <div className="inputWrapper">
            <label className="label">Quantity (X)</label>
            <input
              name="Quantity"
              type="number"
              value={food.Quantity}
              onChange={handleChange}
              placeholder="Quantity"
              className="input"
            />
          </div>
        </div>
        <p className="date">
          📅 Added on: {new Date(food.Created_at).toLocaleDateString()}
        </p>
        <button onClick={handleSave} className="saveButton">Save Changes</button>
      </div>
    </div>
  );
}
