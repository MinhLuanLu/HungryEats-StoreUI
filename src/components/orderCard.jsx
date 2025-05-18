import React from 'react'
import { useEffect, useState } from 'react';
import {
  CardMeta,
  CardHeader,
  CardGroup,
  CardDescription,
  CardContent,
  Button,
  Card,
  Image,
} from 'semantic-ui-react'
import pendingOrder from '../assets/icons/pendingorder.png';
import processingOrder from '../assets/icons/processingorder.png';
import readyOrder from '../assets/icons/readyorder.png';
import { orderStatusConfig } from '../../config';

const OrderCard = ({ order, stage, AcceptPendingButton, DeclinePendingButton, AcceptReadyButton, removeOrderButton }) => {

  return(

    <CardGroup>
      <Card fluid color={
        stage === 'pending'
          ? 'orange'
          : stage === 'processing'
          ? 'blue'
          : 'green'
      }>
        <CardContent>
          <Image
            floated='right'
            size='mini'
            src={
              stage === 'pending'
            ? pendingOrder
            : stage === 'processing'
            ? processingOrder
            : readyOrder
            }
          />
          <CardHeader>OrderID: #{order.Order_id}</CardHeader>
          <CardMeta>Name: {order.Username}</CardMeta>
          
          {order.Food_item.map((food, index)=>(
              <CardDescription key={index}>
                  <Image
                      floated='left'
                      size='mini'
                      src={food.Food_image}
                  />
                  <strong>{food.Food_name}({food.Food_quantity}x)</strong>
              </CardDescription>
          ))}

          {order.Drink_item != undefined && order.Drink_item.map((drink, index)=>(
            <CardDescription key={index}>
                  <Image
                      floated='left'
                      size='mini'
                      src={`http://localhost:3000/${drink.Drink_image}`}
                  />
                  <strong>{drink.Drink_name}({drink.Drink_quantity}x)</strong>
            </CardDescription>
          ))}
          
        </CardContent>
        {stage === orderStatusConfig.pending || stage === orderStatusConfig.unprocessing ? (
          <CardContent extra>
            <div className='ui two buttons'>
              <Button basic color='grey' onClick={()=> DeclinePendingButton(order)}>
                Cancel
              </Button>
              <Button basic color='orange' onClick={()=> AcceptPendingButton(order)}>
                Accept
              </Button>
            </div>
          </CardContent>
        ) : null }

        {stage === orderStatusConfig.procesing && (
          <CardContent extra>
            <div className='ui two buttons'>
              <Button basic color='blue' onClick={()=> AcceptReadyButton(order)}>
                Ready
              </Button>
            </div>
          </CardContent>
        )}
        {stage === orderStatusConfig.ready && (
          <CardContent extra>
            <div className='ui two buttons'>
              <Button basic color='grey' onClick={()=> removeOrderButton(order)}>
                Remove
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </CardGroup>
  )
}

export default OrderCard