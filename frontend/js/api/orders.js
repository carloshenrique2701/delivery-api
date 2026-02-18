import { apiClient } from './client.js';

export async function getOrders(filters = {}) {

    const queryParams = new URLSearchParams(filters).toString();
    console.log(queryParams)
    return apiClient(`/orders?${queryParams}`);

}

export async function getOrderById(id) {

    return apiClient(`/orders/${id}`);

}

export async function createOrder(orderData) {

    return apiClient('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
    });

}

export async function updateOrder(id, order) {

    return apiClient(`/orders/${id}`, {
        method: 'PUT',
        body: JSON.stringify( order )
    });
    
}
export async function updateOrderStatus(id, status) {

    return apiClient(`/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
    });
    
}

export async function deleteOrderById(id) {

    return apiClient(`/orders/${id}`, {
        method: 'DELETE'
    });
    
}