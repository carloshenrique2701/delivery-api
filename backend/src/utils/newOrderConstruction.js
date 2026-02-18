const { v4: uuidv4 } = require('uuid');

function newOrder(orderData) {

    let orderId = uuidv4();
    let totalPrice = 0;
    const createdAt = Date.now();

    const items = orderData.items.map(item => {

        const itemTotal = (item.price * item.quantity) - item.discount;

        totalPrice += itemTotal;

        return {
            ...item,
            total_price: itemTotal.toFixed(2),
            observations: item.observations || null
        };

    });

    const constructedOrder = {

        store_id: orderData.store.id,
        order_id: orderId,
        order: {
            created_at: createdAt,
            total_price: parseInt(totalPrice.toFixed(2)),
            order_id: orderId,
            last_status_name: "RECEIVED",
            statuses: [
                {
                    name: "RECEIVED",
                    created_at: createdAt,
                    order_id: orderId,
                    origin: "STORE"
                }
            ],
            store: orderData.store,
            payments: orderData.payments,
            customer: orderData.customer,
            delivery_address: orderData.delivery_address,
            items
        }

    };

    return constructedOrder;
    
}

module.exports = { newOrder };