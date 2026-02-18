import { updateOrderStatus } from '../api/orders.js';

export function createModalDetails(order) {

    const modal = document.createElement('div');
    modal.classList.add('modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');



    //CABEÇALHO DO MODAL
    const header = document.createElement('div');
    header.classList.add('modal-header');

    const title = document.createElement('h2');
    title.textContent = `Pedido do(a) ${order.order.customer.name}`; 
    
    const closeBtn = document.createElement('span');
    closeBtn.classList.add('close-modal');
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => document.body.removeChild(modal);
    
    header.appendChild(title);
    header.appendChild(closeBtn);
    modalContent.appendChild(header);



    //CORPO DO MODAL
    const body = document.createElement('div');
    body.classList.add('modal-body');



    //Status e ID do Pedido
    const statusInfo = document.createElement('div');
    statusInfo.classList.add('status-info');
    
    const statusBadge = document.createElement('span');
    statusBadge.classList.add('status-badge', `status-${order.order.last_status_name.toLowerCase()}`);
    statusBadge.textContent = order.order.last_status_name;
    
    statusInfo.innerHTML = `
        <p><strong>ID do Pedido:</strong> ${order.order_id}</p>
        <p><strong>Data do Pedido:</strong> ${new Date(order.order.created_at).toLocaleString('pt-BR')}</p>
    `;

    statusInfo.appendChild(statusBadge);
    body.appendChild(statusInfo);



    //Informações da Loja
    const storeSection = document.createElement('div');
    storeSection.classList.add('info-section');
    storeSection.innerHTML = `
        <h3>Loja</h3>
        <p><strong>Nome:</strong> ${order.order.store.name}</p>
        <p><strong>ID:</strong> ${order.order.store.id}</p>
    `;
    body.appendChild(storeSection);



    //Itens do Pedido
    const itemsSection = document.createElement('div');
    itemsSection.classList.add('info-section');
    itemsSection.innerHTML = '<h3>Itens</h3>';
    
    const itemsList = document.createElement('div');
    itemsList.classList.add('items-list');
    
    order.order.items.forEach(item => {

        const itemCard = document.createElement('div');

        itemCard.classList.add('item-card');
        
        itemCard.innerHTML = `
            <div class="item-header">
                <strong>${item.name}</strong> (Cód: ${item.code})
            </div>
            <div class="item-details">
                <span>Quantidade: ${item.quantity}</span>
                <span>Preço unitário: R$ ${item.price.toFixed(2)}</span>
                <span>Desconto: R$ ${item.discount.toFixed(2)}</span>
                <span class="item-total">Total: R$ ${item.total_price}</span>
            </div>
            ${item.observations ? `<div class="item-obs">Obs: ${item.observations}</div>` : ''}
        `;

        itemsList.appendChild(itemCard);

    });
    
    itemsSection.appendChild(itemsList);



    // Total do pedido
    const totalDiv = document.createElement('div');
    totalDiv.classList.add('total-price');
    totalDiv.innerHTML = `<strong>Total do Pedido: R$ ${order.order.total_price.toFixed(2)}</strong>`;
    itemsSection.appendChild(totalDiv);
    
    body.appendChild(itemsSection);



    //Informações do Cliente
    const customerSection = document.createElement('div');
    customerSection.classList.add('info-section');
    customerSection.innerHTML = `
        <h3>Cliente</h3>
        <p><strong>Nome:</strong> ${order.order.customer.name}</p>
        <p><strong>Telefone:</strong> ${order.order.customer.temporary_phone}</p>
    `;
    body.appendChild(customerSection);




    //Endereço de Entrega
    const address = order.order.delivery_address;
    const addressSection = document.createElement('div');
    addressSection.classList.add('info-section');
    addressSection.innerHTML = `
        <h3>Endereço de Entrega</h3>
        <p><strong>Rua:</strong> ${address.street_name}, ${address.street_number}</p>
        <p><strong>Bairro:</strong> ${address.neighborhood}</p>
        <p><strong>Cidade/UF:</strong> ${address.city}/${address.state}</p>
        <p><strong>CEP:</strong> ${address.postal_code}</p>
        <p><strong>Referência:</strong> ${address.reference}</p>
        <p><strong>País:</strong> ${address.country}</p>
        <p><strong>Coordenadas:</strong> ${address.coordinates.latitude}, ${address.coordinates.longitude}</p>
    `;
    body.appendChild(addressSection);




    //Pagamentos
    const paymentsSection = document.createElement('div');
    paymentsSection.classList.add('info-section');
    paymentsSection.innerHTML = '<h3>Pagamentos</h3>';
    
    order.order.payments.forEach(payment => {
        const paymentDiv = document.createElement('div');
        paymentDiv.classList.add('payment-item');
        paymentDiv.innerHTML = `
            <p><strong>Origem:</strong> ${payment.origin}</p>
            <p><strong>Valor:</strong> R$ ${payment.value.toFixed(2)}</p>
            <p><strong>Pré-pago:</strong> ${payment.prepaid ? 'Sim' : 'Não'}</p>
        `;
        paymentsSection.appendChild(paymentDiv);
    });
    
    body.appendChild(paymentsSection);




    //Histórico de Status
    const statusHistorySection = document.createElement('div');
    statusHistorySection.classList.add('info-section');
    statusHistorySection.innerHTML = '<h3>Histórico de Status</h3>';
    
    const historyList = document.createElement('ul');
    historyList.classList.add('status-history');
    
    order.order.statuses.sort((a, b) => a.created_at - b.created_at).forEach(status => {
        const statusItem = document.createElement('li');
        statusItem.innerHTML = `
            <span class="status-name">${status.name}</span>
            <span class="status-date">${new Date(status.created_at).toLocaleString('pt-BR')}</span>
            <span class="status-origin">(${status.origin})</span>
        `;
        historyList.appendChild(statusItem);
    });

    statusHistorySection.appendChild(historyList);
    body.appendChild(statusHistorySection);

    modalContent.appendChild(body);




    //RODAPÉ DO MODAL
    const footer = document.createElement('div');
    footer.classList.add('modal-footer');
    
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Fechar';
    closeButton.classList.add('btn', 'btn-secondary');
    closeButton.onclick = () => document.body.removeChild(modal);
    
    footer.appendChild(closeButton);
    
    
    const currentStatus = order.order.last_status_name;
    const nextPossibleStatus = getNextPossibleStatus(currentStatus);
    
    
    const statusMessageBox = document.createElement('div');
    statusMessageBox.classList.add('status-message-box');
    
    
    const canUpdate = nextPossibleStatus.length > 0 && currentStatus !== 'DELIVERED' && currentStatus !== 'CANCELED';
    const canCancel = currentStatus !== 'DELIVERED' && currentStatus !== 'CANCELED';
    
    if (canUpdate || canCancel) {
        
        if (canUpdate && nextPossibleStatus.length > 0) {
            
            //Para status que não seja CANCELED, mostrar o próximo status disponível
            const nextStatus = nextPossibleStatus.find(s => s !== 'CANCELED') || nextPossibleStatus[0];
            
            if (nextStatus) {

                const updateButton = document.createElement('button');
                updateButton.textContent = `Avançar para ${nextStatus}`;
                updateButton.classList.add('btn', 'btn-primary');
                updateButton.onclick = async () => {
                    await handleStatusUpdate(order.order_id, nextStatus, modal);
                };

                footer.appendChild(updateButton);

            }

        }
        
        
        if (canCancel && currentStatus !== 'CANCELED') {

            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancelar Pedido';
            cancelButton.classList.add('btn', 'btn-danger');
            cancelButton.onclick = async () => {

                if (confirm('Tem certeza que deseja cancelar este pedido?')) {
                    await handleStatusUpdate(order.order_id, 'CANCELED', modal);
                }

            };

            footer.appendChild(cancelButton);

        }
        
        
        //Mensagem informativa sobre o que pode fazer
        statusMessageBox.textContent = canUpdate && canCancel 
            ? 'Este pedido pode ser avançado para o próximo status ou cancelado.'
            : canUpdate 
                ? 'Este pedido pode ser avançado para o próximo status.'
                : 'Este pedido pode ser cancelado.';
        statusMessageBox.classList.add('status-message-info');

    } else {

        //Pedido finalizado (DELIVERED ou CANCELED)
        statusMessageBox.textContent = currentStatus === 'DELIVERED' 
            ? 'Pedido entregue com sucesso. Não é possível alterar o status.'
            : 'Pedido cancelado. Não é possível alterar o status.';
        statusMessageBox.classList.add('status-message-final');

    }
    
    
    footer.insertBefore(statusMessageBox, closeButton);
    
    modalContent.appendChild(footer);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            document.body.removeChild(modal);
        }
    });

}


export function openModalDetails(order) {
    createModalDetails(order);
    const modal = document.querySelector('.modal:last-child');
    modal.style.display = 'flex';
}



function getNextPossibleStatus(currentStatus) {
    const transitions = {
        RECEIVED: ['CONFIRMED', 'CANCELED'],
        CONFIRMED: ['DISPATCHED', 'CANCELED'],
        DISPATCHED: ['DELIVERED', 'CANCELED'],
        DELIVERED: [],
        CANCELED: []
    };
    
    return transitions[currentStatus] || [];
}



async function handleStatusUpdate(orderId, newStatus, modal) {

    try {
        

        const updateButton = modal.querySelector('.btn-primary, .btn-danger');
        if (updateButton) {
            updateButton.disabled = true;
            updateButton.textContent = 'Atualizando...';
        }
        
        
        const result = await updateOrderStatus(orderId, newStatus);
        
        
        alert(`Status atualizado para ${newStatus} com sucesso!`);
        
        
        document.body.removeChild(modal);
        
        
        
    } catch (error) {

        console.error('Erro ao atualizar status:', error);
        
        
        let errorMessage = 'Erro ao atualizar status. ';
        
        if (error.message.includes('400')) {
            errorMessage += 'Transição de status não permitida.';
        } else if (error.message.includes('404')) {
            errorMessage += 'Pedido não encontrado.';
        } else if (error.message.includes('500')) {
            errorMessage += 'Erro no servidor. Tente novamente mais tarde.';
        } else {
            errorMessage += error.message;
        }
        
        alert(`${errorMessage}`);
        

        if (updateButton) {
            updateButton.disabled = false;
            updateButton.textContent = newStatus === 'CANCELED' ? 'Cancelar Pedido' : `Avançar para ${newStatus}`;
        }
    }
}