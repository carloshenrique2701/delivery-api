function isValidTransition(current, next) {
    
    const transitions = {
        RECEIVED: ['CONFIRMED', 'CANCELED'],
        CONFIRMED: ['DISPATCHED', 'CANCELED'],
        DISPATCHED: ['DELIVERED', 'CANCELED'],
        DELIVERED: [],
        CANCELED: []
    }

    return transitions[current]?.includes(next);
}

function isValidUpdate(orders, id, sentFields) {
    
    const orderToUpdate = orders.find(o => o.order_id === id);

    const authorizations = {
        RECEIVED: ['payments', 'delivery_address', 'customer'],
        CONFIRMED: ['payments', 'customer'],
        DISPATCHED: [],
        DELIVERED: [],
        CANCELED: []
    }

    const status = orderToUpdate.order.last_status_name;

    if (!authorizations[status]) return false;

    return sentFields.every(campo => authorizations[status].includes(campo));

}

function deleteStatusValidation(order) {

    const status = order.order.last_status_name;

    if (status === 'CANCELED' || status === 'DELIVERED') {
        return false;
    }
    
    return true;

}

module.exports = { isValidTransition, isValidUpdate, deleteStatusValidation };
