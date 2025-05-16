import React from 'react'
import { useState, useEffect } from 'react';
import { API_LOCATION } from '../../config';
import axios from 'axios';
import {
  ModalHeader,
  ModalDescription,
  ModalContent,
  ModalActions,
  Button,
  Image,
  Modal,
  Form,
  Input,
  FormField,
  Header,
  FormGroup
} from 'semantic-ui-react';
import noImage from '../assets/images/noImage.png';

const fromRequire = [
    "Menu_name",
    "Food_name",
    "Food_description",
    "Price",
    "Quantity"
]

function CreateFood({open, onclose, newFoodItem}) {
  const [dataFrom, setDataFrom] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [file, setFile] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")))

  useEffect(()=>{
    setImagePreview(null);
    setUser(JSON.parse(localStorage.getItem("user")));
  },[])


  function handleOnChange(e){
    const { name, value } = e.target;
    setDataFrom(prev => ({ ...prev, [name]: value }));
  }

  function checkFile(e){
    const file = e.target.files[0];
    if(file){
      setFile(true);
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  async function fetchCreateFood() {
    dataFrom.Store = user
    try{
        const createFood = await axios.post(`${API_LOCATION}/v1/store/create/food`,{
            dataFrom
        });

        if(createFood.data.success){
            console.log(createFood.data.message)
            newFoodItem(createFood.data.data);
            return {success: true}
        };
        console.log("Failed to fetch create food!");
        return {success: false}
    }
    catch(error){
        console.log(error)
        return {success: true}
    }
  };

  async function handleUploadImage(){
    const formData = new FormData();
    formData.append('image', imageFile); // 'image' should match backend field name
    formData.append('Food', JSON.stringify(newFood));

    if(imageFile){
      try{
        const sendImage = await axios.post(`${API_LOCATION}/v1/store/upload/food/image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if(sendImage.data.success){
          console.log(sendImage.data.message)
          //alert('update image successfully.');
          setFood(sendImage.data.data);
        }
        
      }
      catch(error){
        console.log(error)
      }
    }
  }

  async function handleCreate(){
    const missingFields = fromRequire.filter(
        key => !dataFrom[key] || dataFrom[key].toString().trim() === ""
    );

    if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
        return;
    }

    //////////////////////////////////////////////////////////////////////////////////
    if(file){
        console.log('create food with image');
        const createFood = await fetchCreateFood();

        if(createFood.success){
            console.log('create food successfully, start upload food image')
            await handleUploadImage();
        }
        return
    };

    console.log('create food no image.');
    await fetchCreateFood()
  }


  return (
    <Modal
      open={open}
    >
      <ModalHeader>Create Food</ModalHeader>
      <input type='file' style={{marginLeft:20}} onChange={checkFile}/>
      <ModalContent image>
        <Image size='medium' src= {imagePreview == null ? noImage : imagePreview} />
        <ModalDescription style={{ width: '100%'}}>
          <Form>
            <FormField
                control={Input}
                label='Menu name'
                placeholder='Enter here'
                name="Menu_name"
                value={dataFrom.Menu_name}
                onChange={handleOnChange}
            />
            <FormField
                control={Input}
                label='Food name'
                placeholder='Enter here'
                name="Food_name"
                value={dataFrom.Food_name}
                onChange={handleOnChange}
                
                
            />
            <FormField
                control={Input}
                label='Food_description'
                name= "Food_description"
                placeholder='Enter here'
                value={dataFrom.Food_description}
                onChange={handleOnChange}
            />
            <FormGroup widths='equal'>
                <FormField
                control={Input}
                label='Price (Kr)'
                placeholder='Enter here'
                name="Price"
                value={dataFrom.Price}  
                onChange={handleOnChange}  
                />
                <FormField
                    control={Input}
                    label='Quantity'
                    name= "Quantity"
                    placeholder='Enter here'
                    value={dataFrom.Quantity}
                    onChange={handleOnChange}
                />
            </FormGroup>
          </Form>
        </ModalDescription>
      </ModalContent>
      <ModalActions>
        <Button onClick={() => onclose()} negative>Cancel</Button>
        <Button onClick={handleCreate} positive>
          Create
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default CreateFood