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
