import { addressAPI } from '../utils/addressAPI.js';
import { createOrder } from '../api/orders.js';

const PRICE_LIST = {

    PizzaMargherita: { price: 40.23, code: 1234 },
    BatataFritaEspecial: { price: 10.33, code: 202 },
    CamaraoInternacional: { price: 455.62, code: 5001 },
    CamaraoDelicia: { price: 344.36, code: 105 },
    CamaraoAlfredo: { price: 322.22, code: 4012 },
    HamburguerDeSiri: { price: 34.33, code: 3456 },
    DonutsRosados: { price: 42.28, code: 823 },
    BolinhosnoVapor: { price: 10.20, code: 6418 }

};

const addressPostalCode = document.getElementById('addressPostalCode');
const addressCountry = document.getElementById('addressCountry');
const addressState = document.getElementById('addressState');
const addressCity = document.getElementById('addressCity');
const addressNeighborhood = document.getElementById('addressNeighborhood');
const addressStreet = document.getElementById('addressStreet');

function disableAddressFields(disabled = true) {

    [addressCountry, addressState, addressCity, addressNeighborhood, addressStreet].forEach(field => {
        
        if (field) {
            field.disabled = disabled;
            if (disabled) {
                field.classList.add('disabled-field');
            } else {
                field.classList.remove('disabled-field');
            }
        }

    });

}

function clearAddressFields() {

    addressCountry.value = '';
    addressState.value = '';
    addressCity.value = '';
    addressNeighborhood.value = '';
    addressStreet.value = '';
    addressPostalCode.value = '';

}

async function fetchAddressByCEP(cep) {
    
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length === 8) {

        try {
            
            addressPostalCode.classList.add('loading');
            
            const addressData = await addressAPI(cep);
            
            if (addressData) {

                addressCountry.value = addressData.country || 'Brasil';
                addressState.value = addressData.state || '';
                addressCity.value = addressData.city || '';
                addressNeighborhood.value = addressData.neighborhood || '';
                addressStreet.value = addressData.street || '';
                
                disableAddressFields(true);

            }


        } catch (error) {

            console.error('Erro ao buscar CEP:', error);
            alert('CEP não encontrado. Preencha os campos manualmente.');
            clearAddressFields();
            disableAddressFields(false); 

        } finally {

            addressPostalCode.classList.remove('loading');

        }

    } else if (cleanCep.length === 0) {
        
        clearAddressFields();
        disableAddressFields(false);

    }
}

let cepTimeout;
addressPostalCode.addEventListener('input', (e) => {

    const cep = e.target.value;
    
    clearTimeout(cepTimeout);
    
    if (!cep) {
        clearAddressFields();
        disableAddressFields(false);
        return;
    }
    
    cepTimeout = setTimeout(() => {
        fetchAddressByCEP(cep);
    }, 500);

});

addressPostalCode.addEventListener('blur', (e) => {

    const cep = e.target.value;

    if (cep) {
        fetchAddressByCEP(cep);
    }

});


const newOrderForm = document.getElementById('newOrderForm');

newOrderForm.addEventListener('submit', async (e) => {
    
    e.preventDefault(); 

    const customerName = document.getElementById('customerName').value; 
    const customerPhone = document.getElementById('customerPhone').value; 

    const addressPostalCodeValue = addressPostalCode.value;
    const addressCountryValue = addressCountry.value;
    const addressStateValue = addressState.value;
    const addressCityValue = addressCity.value;
    const addressNeighborhoodValue = addressNeighborhood.value;
    const addressStreetValue = addressStreet.value;
    const addressNumber = document.getElementById('addressNumber').value;
    const addressReference = document.getElementById('addressReference').value;
    
    let coordinates = { latitude: 0, longitude: 0, id: Math.floor(Math.random() * 77777) };
    
    try {

        const addressData = await addressAPI(addressPostalCodeValue);

        if (addressData && addressData.coordinates) {
            coordinates = addressData.coordinates;
        }
        
    } catch (error) {

        console.error('Não foi possível buscar coordenadas, usando valores padrão');

    }

    const totalValueElement = document.getElementById('totalValue');
    const totalValueText = totalValueElement.textContent;
    const originalTotal = parseFloat(totalValueText.replace('R$', '').trim());
    const finalValue = originalTotal;
    
    const paymentMode = document.getElementById('paymentMode').value;


    const rows = document.querySelectorAll('.item');
    const items = []; 
    
    rows.forEach((row) => {

        const itemName = row.querySelector('.item-name').textContent;
        const itemKey = row.querySelector('.item-name').dataset.key;
        const itemCondiments = row.querySelector('.item-condiments')?.textContent || ''; 
        const itemQnt = parseInt(row.querySelector('.item-qnt').textContent);
        
        const itemData = PRICE_LIST[itemKey];
        
        if (itemData) {
            
            items.push({
                code: itemData.code,
                name: itemName,
                price: itemData.price, 
                quantity: itemQnt,
                discount: 0, 
                condiments: itemCondiments && itemCondiments !== 'Nenhum' ? [itemCondiments] : [] 
            });
        }

    });
    
    if (items.length === 0) {
        alert('Adicione pelo menos um item ao pedido');
        return;
    }

    const orderData = {
        order: {
            payments: [
                {
                    prepaid: false,
                    value: finalValue, 
                    origin: paymentMode
                }
            ],
            store: {
                name: "Coco Bambu Teste",
                id: "f052054c-e0a0-4768-ab55-7cb7ead57371"
            },
            items: items, 
            customer: {
                name: customerName,
                temporary_phone: customerPhone
            },
            delivery_address: {
                reference: addressReference,
                street_name: addressStreetValue,
                postal_code: addressPostalCodeValue,
                country: addressCountryValue || 'Brasil',
                city: addressCityValue,
                neighborhood: addressNeighborhoodValue,
                street_number: addressNumber,
                state: addressStateValue,
                coordinates: coordinates 
            }
        }
    };

    const submitBtn = newOrderForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {

        await createOrder(orderData);
        alert(`Pedido criado com sucesso!`);
        window.location.href = '../index.html';

    } catch (error) {

        console.error('Erro ao criar pedido:', error);
        alert('Erro ao criar pedido. Tente novamente.');

    } finally {

        submitBtn.disabled = false;
        submitBtn.textContent = 'Finalizar Pedido';

    }
    
});

disableAddressFields(true);
clearAddressFields();