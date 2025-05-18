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
} from 'semantic-ui-react';
import noImage from '../assets/images/noImage.png';

function EditMenu({open, menuData, onclose, saveChange }) {

  const [menu, setMenu] = useState({ ...menuData });
  const [imageFile, setImageFile] = useState(null);
  const [file, setFile] = useState(false)
  const [newImage, setNewImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));


  useEffect(() => {
    setFile(false)
    setMenu({ ...menuData });
  }, [menuData]);

  function handleOnChange(e) {
    const { name, value } = e.target;
    setMenu(prev => ({ ...prev, [name]: value }));
  }
 
  async function handleUpdateMenu(){
    const formData = new FormData();
    formData.append('image', imageFile); // 'image' should match backend field name
    formData.append('Menu', JSON.stringify(menu));
   
    try{
        const sendImage = await axios.patch(`${API_LOCATION}/v1/menu`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if(sendImage.data.success){
          console.log(sendImage.data.message);
          saveChange()

        }
        
      }
      catch(error){
        console.log(error)
    }
  }


  function checkFile(e){
    const file = e.target.files[0];
    if(file){
      setFile(true);
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }


  async function handleSaveChange() {
    await handleUpdateMenu()
  }

  return (
    <Modal
      open={open}
    >
      <ModalHeader>Upload image</ModalHeader>
      <input type="file" className="uploadImage" style={{marginLeft:20}} onChange={checkFile}/>
      <ModalContent image>
        <Image size='medium' src= {imagePreview == null ? noImage : imagePreview} />
        <ModalDescription style={{ width: '100%'}}>
            <Form>
                
                <FormField
                    control={Input}
                    label='Menu name'
                    placeholder='Menu name'
                    name="Menu_name"
                    value={menu.Menu_name}
                    onChange={handleOnChange}
                    
                />
                <FormField
                    control={Input}
                    label='Menu_description'
                    name= "Menu_description"
                    placeholder='Menu_description'
                    value={menu.Menu_description}
                    onChange={handleOnChange}
                />
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

export default EditMenu

