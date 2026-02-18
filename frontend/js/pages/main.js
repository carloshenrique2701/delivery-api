import { getOrders } from '../api/orders.js';
import { populateOrderTable } from '../components/orderTable.js';

async function initOrdersPage() {
    const filtersForm = document.getElementById('filtersForm');
    
    filtersForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const status = document.getElementById('status-filter').value;
        const minValue = document.getElementById('min-total-price').value;
        const maxValue = document.getElementById('max-total-price').value;
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        const itens = document.getElementById('itens').value;

        const filters = {};
    
        if (status && status !== '') filters.status = status;
        if (minValue && minValue !== '') filters.minValue = minValue;
        if (maxValue && maxValue !== '') filters.maxValue = maxValue;
        if (startDate && startDate !== '') filters.startDate = startDate;
        if (endDate && endDate !== '') filters.endDate = endDate;
        if (itens && itens !== '') filters.itens = itens;
    
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Filtrando...';
        submitBtn.disabled = true;

        try {
            
            const filtredOrders = await getOrders(filters);
            
            renderOrders(filtredOrders);
            
        } catch (error) {
            console.error('Erro ao filtrar pedidos:', error);
            alert('Erro ao aplicar filtros. Tente novamente.');
            
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }

    });
    
    // Carrega pedidos iniciais
    const orders = await getOrders();
    renderOrders(orders);
    
    function renderOrders(orders) {

        populateOrderTable(orders);

    }
}

document.addEventListener('DOMContentLoaded', initOrdersPage);