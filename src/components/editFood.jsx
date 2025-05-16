import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios';
import { API_LOCATION } from "../../config";
import {
  ModalHeader,
  ModalDescription,
  ModalContent,
  ModalActions,
  Button,
  Image,
  Modal,
  Form,
  FormField,
  FormGroup,
  Input
} from 'semantic-ui-react'

function EditFood({open, foodData, onclose, saveChange, SocketIO, uploadImage }) {

  const [food, setFood] = useState({ ...foodData });
  const [imageFile, setImageFile] = useState(null);
  const [file, setFile] = useState(false)
  const [newImage, setNewImage] = useState(null)


  useEffect(() => {
    setFile(false)
    setFood({ ...foodData });
  }, [foodData]);

  function handleOnChange(e) {
    const { name, value } = e.target;
    setFood(prev => ({ ...prev, [name]: value }));
  }

  function handleSaveChangeInfo() {
    saveChange(food);
    if (SocketIO) {
      SocketIO.current.emit('updateFoodData', { Food: food });
    }
  };


  async function handleUploadImage(){
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
          //alert('update image successfully.');
          setNewImage(sendImage.data.data);
          setFood(sendImage.data.data);
          uploadImage(sendImage.data.data)
        }
        
      }
      catch(error){
        console.log(error)
      }
    }
  }


  function checkFile(e){
    const file = e.target.files[0];
    if(file){
      setFile(true);
      setImageFile(file);
    }
  }


  async function handleSaveChange() {
    if(file){
      console.log('Update food info and image')
      handleSaveChangeInfo();
      await handleUploadImage();
      return
    }

    console.log('update only food info.')
    handleSaveChangeInfo()
  }

  return (
    <Modal
      open={open}
    >
      <ModalHeader>Upload image</ModalHeader>
      <input type="file" className="uploadImage" style={{marginLeft:20}} onChange={checkFile}/>
      <ModalContent image>
        <Image size='large' src={foodData.Food_image} />
        <ModalDescription style={{ width: '100%'}}>
            <Form>
                
                <FormField
                    control={Input}
                    label='Food name'
                    placeholder='Food name'
                    name="Food_name"
                    value={food.Food_name}
                    onChange={handleOnChange}
                    
                />
                <FormField
                    control={Input}
                    label='Food_description'
                    name= "Food_description"
                    placeholder='Food_description'
                    value={food.Food_description}
                    onChange={handleOnChange}
                />
                
                <FormGroup>
                  <FormField
                    control={Input}
                    name = "Price"
                    label='Price (Kr)'
                    placeholder='Price'
                    value={food.Price}
                    onChange={handleOnChange}
                  />
                  <FormField
                      control={Input}
                      label='Quantity(x)'
                      name="Quantity"
                      placeholder='Quantity'
                      value={food.Quantity}
                      onChange={handleOnChange}
                  />
                </FormGroup>
                
               
            </Form>
        </ModalDescription>
      </ModalContent>
      <ModalActions>
        <Button onClick={() => onclose()} negative>Cancel</Button>
        <Button onClick={handleSaveChange} positive>
          Save change
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default EditFood

