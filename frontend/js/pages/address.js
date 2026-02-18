import { addressAPI } from '../utils/addressAPI.js';

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


export async function findAddress() {
    

    const addressPostalCodeValue = addressPostalCode.value;
    
    let coordinates = { latitude: 0, longitude: 0, id: Math.floor(Math.random() * 77777) };
    
    try {

        const addressData = await addressAPI(addressPostalCodeValue);

        if (addressData && addressData.coordinates) {
            coordinates = addressData.coordinates;
        }
        
    } catch (error) {

        console.error('Não foi possível buscar coordenadas, usando valores padrão');

    }

    return coordinates;

}

disableAddressFields(true);
clearAddressFields();