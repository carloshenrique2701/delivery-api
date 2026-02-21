import { openModalDetails } from './orderModalDetails.js';
import { createGraphs } from './orderGraphs.js';
import { deleteOrderById } from '../api/orders.js';


export function populateOrderTable(orders) {
    
    const table = document.getElementById('table');

    table.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Quantidade de itens</th>
                    <th>Valor Total do Pedido</th>
                    <th>Status</th>
                    <th>Data</th>
                    <th>Ações</th>
                </tr>
            </thead>

            <tbody id="orderTable"></tbody>

            <tfoot>
                <tr>
                    <th colspan="5">Fim da lista</th>
                </tr>
            </tfoot>
        </table>
    `;

    const orderTable = document.getElementById('orderTable');

    orders.forEach(order => {
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${order.order.items.length}</td>
            <td>R$ ${order.order.total_price}</td>
            <td>${formatStatus(order.order.last_status_name)}</td>
            <td>${formatDate(order.order.created_at)}</td>
            <td>
                <div class="btn-group">
                    <button class="delete" data-id="${order.order_id}">Excluir</button>
                    <button class="edit" data-id="${order.order_id}">Editar</button>
                </div>
            </td>
        `;
        
        
        tr.addEventListener('click', (e) => {
            
            if (!e.target.closest('button')) {
                openModalDetails(order);
            }

        });

        const deleteBtn = tr.querySelector('.delete');
        deleteBtn.addEventListener('click', async () => {

            await deleteOrderById(order.order_id);
            window.location.reload();

        });
        


        const editBtn = tr.querySelector('.edit');
        editBtn.addEventListener('click', (e) => {

            e.stopPropagation(); 
            window.location.href = `pages/edit-order.html?id=${order.order_id}`;
        
        });
        
        orderTable.appendChild(tr);

    });

    createGraphs(orders);

}

function formatStatus(status) {
    
    const formatedStatus = {
        RECEIVED: 'Recebido',
        CONFIRMED: 'Confirmado',
        DISPATCHED: 'Enviado',
        DELIVERED: 'Entregue',
        CANCELED: 'Cancelado'
    }

    return formatedStatus[status];

}

function formatDate(date) {
    
    return new Date(date).toLocaleString('pt-BR');

}

