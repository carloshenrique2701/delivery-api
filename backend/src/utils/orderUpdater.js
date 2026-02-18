function partialUpdate(allOrders, orderId, newData) {

    return allOrders.map(item => {

        
        if (item.order_id === orderId) {
            return {
                ...item, 
                order: {
                    ...item.order, 
                    ...newData     // Sobrescreve apenas payments, customer, etc.
                }
            };
        }


        return item; // Retorna os outros pedidos sem alteração

    });

}

module.exports = { partialUpdate };