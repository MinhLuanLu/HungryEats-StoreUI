export const API_LOCATION = "http://localhost:3000";
export const SOCKETIO_LOCATION = "http://localhost:3001";

export const ADMIN = {
    business: "business",
    private: "private"
}


export const socketConfig = {
    processOrder: "user.newOrderHandler.1",
    confirmRecivedOrder: "store.confirmRecivedOrder.1",
    updateStoreState: "store.updateStoreState.1",
    orderAction: "store.orderAction.1"
}

export const orderStatusConfig = {
    unprocessing: 'unprocessing',// default
    pending: "pending", // when store recived the order
    procesing: "processing",// when store recived order
    ready: "ready", // when order is ready
    done: "done", // when order is ready
    cancle : "cancle", // when store cancle order
    failed: "failed"
}

export const storeStatus = {
    customer: false
}
