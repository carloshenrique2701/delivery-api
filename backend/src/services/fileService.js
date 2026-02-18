const fs = require('fs').promises;
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'pedidos.json');

async function readFile() {
    
    try {
        
        const data = await fs.readFile(dataPath, 'utf-8');
        const orders = JSON.parse(data);
        
        return orders;

    } catch (error) {
        console.error('Erro ao ler o arquivo: ', error);
        throw error; 
    }

}

async function saveFile(orders) {
    
    try {
        
        const newFile = JSON.stringify(orders, null, 2);
        await fs.writeFile(dataPath, newFile);
        console.log('Arquivo salvo com sucesso!');    

    } catch (error) {
        console.error('Erro ao salvar o arquivo: ', error);
        throw error; 
    }

}


module.exports = { saveFile, readFile };