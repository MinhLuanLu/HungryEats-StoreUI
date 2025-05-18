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
  Select,
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

function CreateFood({open, onclose, data , newFoodItem}) {
  const [dataFrom, setDataFrom] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [file, setFile] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [menuOption, setMenuOption] = useState([]);
  const [createMenu, setCreateMenu] = useState(false);
  const [selectMenu, setSelectMenu] = useState(null);

  useEffect(()=>{
    /////////////////////////////////////////////

    setUser(JSON.parse(localStorage.getItem("user")));
    setMenuOption(data.map(item => ({
      key: item.Menu_id,
      value: item.Menu_id,
      text: item.Menu_name

    })));
    setCreateMenu(false);
    
  },[data])


  function handleOnChange(e){
    const { name, value } = e.target;
    setDataFrom(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectMenu = (e, { name, value }) => {
    setSelectMenu(value);
    dataFrom.Menu_name = "emty"
    dataFrom.SelectMenu = selectMenu
  };


  function checkFile(e){
    const file = e.target.files[0];
    if(file){
      setFile(true);
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }


  async function fetchCreateFood(){
    dataFrom.isNewMenu = createMenu;
    dataFrom.Store = user;
    /////////////////////////////
    const formData = new FormData();
    formData.append('image', imageFile); // 'image' should match backend field name
    formData.append('Food', JSON.stringify(dataFrom));

    if(imageFile){
      try{
        const sendImage = await axios.post(`${API_LOCATION}/v1/food`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if(sendImage.data.success){
          console.log(sendImage.data.message)
          //alert('update image successfully.');
          newFoodItem(sendImage.data.data);
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

    if(!createMenu && selectMenu == null){
      alert('Please select menu');
      return
    }

    if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
        return;
    }

    if(!file){
      alert('Please choose food image to create a new food');
      return;
    }
    //////////////////////////////////////////////////////////////////////////////////
    console.log('create food with image');
    const createFood = await fetchCreateFood();
    return

   
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
            <FormGroup widths='equal'>
              { createMenu ?
                <>
                  <FormField
                    control={Input}
                    label='Menu name'
                    placeholder='Enter here'
                    name="Menu_name"
                    value={dataFrom.Menu_name}
                    onChange={handleOnChange}
                  />
                  <Button secondary onClick={()=> setCreateMenu(false)}>Cancle</Button>
                </>
                :
                <>
                  <FormField
                    control={Select}
                    label='Select Menu'
                    placeholder='Select Menu'
                    name={JSON.stringify(menuOption.text)}
                    value={menuOption.value}
                    options={menuOption}
                    onChange={handleSelectMenu}
                  />
                  <Button secondary onClick={()=> setCreateMenu(true)}>Create menu</Button>
                </>
                
              }
            </FormGroup>
            {createMenu &&
              <FormField
                  control={Input}
                  label='Menu description'
                  placeholder='Enter description here'
                  name="Menu_description"
                  value={dataFrom.Menu_description}
                  onChange={handleOnChange}
                  
                  
              />
            }
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
                type='number'
                />
                <FormField
                    control={Input}
                    label='Quantity'
                    name= "Quantity"
                    placeholder='Enter here'
                    value={dataFrom.Quantity}
                    onChange={handleOnChange}
                    type='number'
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