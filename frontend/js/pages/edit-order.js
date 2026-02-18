import { getOrderById } from '../api/orders.js';
import { updateOrder } from '../api/orders.js';
import { findAddress } from './address.js';

let status

document.addEventListener('DOMContentLoaded', async () => {

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    let order;

    try {

        order = await getOrderById(id);

        checkForm(order);        
        
    } catch (error) {
        console.error('Erro ao procurar pedido.');
        alert('Erro ao procurar pedido.');
        setTimeout(() => {
            window.location.href='../index.html';
        }, 1500);
    }

});

function checkForm(order) {
    
    status = order.order.last_status_name;
    let permition;

    if (status === 'CANCELED' || status === 'DELIVERED' || status === 'DISPATCHED') permition = false;
    if (status === 'CONFIRMED' || status === 'RECEIVED') permition = true;

    const sectionAddress = document.getElementById('sectionAddress');

    if (permition) {
        
        if (status === 'CONFIRMED') {
            
            const div = document.createElement('div');
            div.classList.add('message');
            const strong = document.createElement('strong');
            strong.textContent = 'Não é permitido editar essa seção com o status de CONFIRMED!';

            div.appendChild(strong);
            sectionAddress.innerHTML = '';
            sectionAddress.appendChild(div);

            populateForm(order, status);

        } else if (status === 'RECEIVED') {
            populateForm(order);
        }

    } else {

        alert("Não é possível editar um pedido com status CANCELADO, ENVIADO ou ENTREGUE");
        window.location.href= '../index.html';

    }

}

function populateForm(order) {
    
    if (status === 'RECEIVED') {

        document.getElementById('addressPostalCode').value = order.order.delivery_address.postal_code;
        document.getElementById('addressCountry').value = order.order.delivery_address.country;
        document.getElementById('addressState').value = order.order.delivery_address.state;
        document.getElementById('addressCity').value = order.order.delivery_address.city;
        document.getElementById('addressNeighborhood').value = order.order.delivery_address.neighborhood;
        document.getElementById('addressStreet').value = order.order.delivery_address.street_name;
        document.getElementById('addressNumber').value = order.order.delivery_address.street_number;

    }
    
    document.getElementById('customerName').value = order.order.customer.name; 
    document.getElementById('customerPhone').value = order.order.customer.temporary_phone; 

    document.getElementById('paymentMode').value = order.order.payments[0].origin ;
    document.getElementById('totalValue').textContent = 'R$ ' + order.order.total_price;

}

document.getElementById('editOrderForm').addEventListener('submit', async (e) => {
    
    e.preventDefault();

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value; 

    const totalValueElement = document.getElementById('totalValue');
    const totalValueText = totalValueElement.textContent;
    const originalTotal = parseFloat(totalValueText.replace('R$', '').trim());
    const finalValue = originalTotal;

    const paymentMode = document.getElementById('paymentMode').value;
    const prepaid = document.getElementById('prepaid').checked;

    let order;
    
    if (status === 'RECEIVED') {

        const addressPostalCodeValue = document.getElementById('addressPostalCode').value;
        const addressCountryValue = document.getElementById('addressCountry').value;
        const addressStateValue = document.getElementById('addressState').value;
        const addressCityValue = document.getElementById('addressCity').value;
        const addressNeighborhoodValue = document.getElementById('addressNeighborhood').value;
        const addressStreetValue = document.getElementById('addressStreet').value;
        const addressNumber = document.getElementById('addressNumber').value;
        const addressReference = document.getElementById('addressReference').value;
        const coordinates = await findAddress();

        order = {
            payments: [
                {
                    prepaid: prepaid,
                    value: finalValue,
                    origin: paymentMode
                }
            ],
            customer: {
                name: customerName,
                temporary_phone: customerPhone
            },
            delivery_address: {
                reference: addressReference,
                street_name: addressStreetValue,
                postal_code: addressPostalCodeValue,
                country: addressCountryValue || 'BR',
                city: addressCityValue,
                neighborhood: addressNeighborhoodValue,
                street_number: addressNumber,
                state: addressStateValue,
                coordinates: coordinates 
            }
        }        

        try {
            
            await updateOrder(id, order);
            window.location.href= '../index.html';


        } catch (error) {
            console.error('Erro ao enviar dados para o servidor: ', error);
            window.location.href= '../index.html';
        }

    } else if (status === 'CONFIRMED') {

        order = {
            payments: [
                {
                    prepaid: prepaid,
                    value: finalValue,
                    origin: paymentMode
                }
            ],
            customer: {
                name: customerName,
                temporary_phone: customerPhone
            }
        }        

        try {
            
            await updateOrder(id, order);
            window.location.href= '../index.html';


        } catch (error) {
            console.error('Erro ao enviar dados para o servidor: ', error);
            window.location.href= '../index.html';
        }

    } else {
        alert('Ocorreu um erro. Tente novamente mais tarde');
        window.location.href= '../index.html';
    }

});