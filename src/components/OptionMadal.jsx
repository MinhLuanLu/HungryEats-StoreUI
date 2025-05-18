import React from 'react'
import { API_LOCATION } from '../../config'
import axios from 'axios'
import {
  ModalContent,
  ModalActions,
  Button,
  Header,
  Icon,
  Modal,
} from 'semantic-ui-react'

function OptionModal({data ,onClose, open, message, title, deleteItem}) {

    async function HandleDeleteItem() {
        console.log("Delete food item", data)
        try{
            const deleteFood = await axios.delete(`${API_LOCATION}/v1/food/${data.Food_id}`);
            if(deleteFood.data.success){
              console.log(deleteFood.data.message);
              deleteItem(data)
            }
        }
        catch(error){
            console.log(error)
        }
    }
 
  return (
    <Modal
      closeIcon
      open={open}
      onClose={() => onClose()}
    >
      <Header icon='food' content={title} />
      <ModalContent>
        <p>
          {message}
        </p>
      </ModalContent>
      <ModalActions>
        <Button color='red' onClick={() => onClose()}>
          <Icon name='remove' /> No
        </Button>
        <Button color='green' onClick={HandleDeleteItem}>
          <Icon name='checkmark' /> Yes
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default OptionModal