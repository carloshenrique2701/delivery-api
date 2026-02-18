document.getElementById('addItem').addEventListener('click', () => {

    const item = document.getElementById('itemSelect').value;
    const itemCondiments = document.getElementById('itemCondiments').value;
    const qntItem = document.getElementById('qntItem').value;

    if (qntItem <= 0) {
        alert('Quantidade inválida');
        return;
    }

    newItem(item, qntItem, itemCondiments)


});

const PRICE_LIST = {

    PizzaMargherita: 40.23,
    BatataFritaEspecial: 10.33,
    CamaraoInternacional: 455.62,
    CamaraoDelicia: 344.36,
    CamaraoAlfredo: 322.22,
    HamburguerDeSiri: 34.33,
    DonutsRosados: 42.28,
    BolinhosnoVapor: 10.20
    
};
const CONTMENTS_LIST = {

    nenhum: 0,
    arroz: 14,
    batata: 10,
    camarao: 52,
    salada: 6
    
};

function newItem(item, qntItem, itemCondiments) {

    const table = document.getElementById('ProductList');
    const tr = document.createElement('tr');
    const itemId = item + Date.now(); 
    let condimentsPrice;
    if (itemCondiments !== "") {
        condimentsPrice = CONTMENTS_LIST[itemCondiments];
    } else {
        condimentsPrice = 0;
    }
    
    tr.innerHTML = `
        <td class="item-name" data-key="${item}">${formatItemName(item)}</td>
        <td class="item-condments">${itemCondiments + ' + R$ ' + condimentsPrice}</td>
        <td class="item-qnt">${qntItem}</td>
        <td class="item-price">R$ ${((PRICE_LIST[item] * qntItem) + condimentsPrice).toFixed(2)}</td>
        <td>
            <button type="button" class="delete-btn" data-item-id="${itemId}">Excluir</button>
        </td>
    `;
    
    tr.dataset.itemId = itemId;
    tr.classList.add('item');
    
    const deleteBtn = tr.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function() {
        
        removeItem(this.dataset.itemId);

    });
    
    table.appendChild(tr);
    updateFinalValue();

}

function formatCurrency(value) {
    return `R$ ${value.toFixed(2)}`;
}

function formatItemName(itemName) {
    const nameMap = {
        'PizzaMargherita': 'Pizza Margherita',
        'BatataFritaEspecial': 'Batata Frita Especial',
        'CamaraoInternacional': 'Camarão Internacional',
        'CamaraoDelicia': 'Camarão Delicia',
        'CamaraoAlfredo': 'Camarão Alfredo',
        'HamburguerDeSiri': 'Hamburguer De Siri',
        'DonutsRosados': 'Donuts Rosados',
        'BolinhosnoVapor': 'Bolinhos no Vapor',
    };
    
    return nameMap[itemName] || itemName
        .replace(/([A-Z])/g, ' $1')
        .replace(/(\d+)/g, ' $1')
        .trim()
        .toLowerCase()
        .replace(/^./, str => str.toUpperCase());
}



function removeItem(itemId) {

    const row = document.querySelector(`tr[data-item-id="${itemId}"]`);

    if (row) {
        row.remove();
        updateFinalValue();
    }

}

let totalValue = 0;

function updateFinalValue() {

    const totalValueElement = document.getElementById('totalValue');
    const rows = document.querySelectorAll('.item');

    let totalValue = 0;

    rows.forEach(row => {

        const itemQnt = parseInt(row.querySelector('.item-qnt').textContent);
        const condimentsText = row.querySelector('.item-condments').textContent;
        
        
        const itemKey = row.querySelector('.item-name').dataset.key;
        const itemPrice = PRICE_LIST[itemKey] || 0;

        


        let condimentsPrice = 0;

        if (condimentsText) {
            const condimentName = condimentsText.split(' + ')[0];
            condimentsPrice = CONTMENTS_LIST[condimentName] || 0;
        }

        if (!isNaN(itemQnt)) {
            totalValue += (itemPrice * itemQnt) + condimentsPrice;
        }

    });

    totalValueElement.textContent = `R$ ${totalValue.toFixed(2)}`;
}

