const FS = require('../services/fileService');
const FO = require('../utils/filterOrders');
const SM = require('../utils/stateMachine');
const NOSV = require('../utils/newOrderSchemaValidation');
const NOC = require('../utils/newOrderConstruction');
const OU = require('../utils/orderUpdater');
const OUSV = require('../utils/orderUpdaterSchemaValidation');

async function getAllOrders(req, res) {

    try {

        const { status, minValue, maxValue, itens, startDate, endDate } = req.query;
        const orders = await FS.readFile();
        
        const filtredOrders = FO.dinamicFilter(orders, status, minValue, maxValue, itens, startDate, endDate);
        
        return res.status(200).json(filtredOrders);

    } catch (error) {
        console.error('Erro ao carregar os pedidos: ', error);
        return res.status(500).json({ message: "Erro no servidor ao buscar pedidos. Tente novamente mais tarde." });
    }

}

async function getOrderById(req, res) {
    
    try {
        
        const { id } = req.params;

        if (!id) return res.status(400).json({ mensagem: 'É necessário um id.' });

        const orders = await FS.readFile();
        const order = orders.find(o => o.order_id === id);
        if (!order) return res.status(404).json({ message: 'Pedido não encontrado.' });

        return res.status(200).json(order)

    } catch (error) {
        console.error('Erro ao procurar pedido: ', error);
        return res.status(500).json({ message: "Erro no servidor ao buscar pedido. Tente novamente mais tarde." });
    }

}

async function createOrder(req, res) {

    try {

        const { order } = req.body;

        if (!NOSV.isOrderValid(order)) return res.status(400).json({ message: 'Estrutura inválida. Consulte nossa documentação.' });

        const newOrder = NOC.newOrder(order);

        const orders = await FS.readFile();

        orders.push(newOrder);

        await FS.saveFile(orders);

        return res.status(201).json({ message: 'Pedido salvo com sucesso!' });
        
    } catch (error) {
        console.error('Erro ao criar pedido: ',error);
        return res.status(500).json({ message: 'Erro no servidor ao criar pedido. Tente novamente mais tarde.' })
    }

}

async function deleteOrder(req, res) {
    
    try {
        
        const { id } = req.params;

        if (!id) return res.status(400).json({ message: 'É necessário um id.' });

        let orders = await FS.readFile();
        const order = orders.find(o => o.order_id === id)

        if (!order) return res.status(404).json({ message: 'Id não encontrado.' });
               
        
        if (!SM.deleteStatusValidation(order)) return res.status(404).json({ message: 'Não é possível excluir pedido com status em CANCELED/DELIVERED.' });

        orders = orders.filter(o => o.order_id !== id);

        await FS.saveFile(orders)

        return res.status(200).json({ message: 'Pedido excluído.' });

    } catch (error) {
        console.error('Erro ao excluir pedido: ',error);
        return res.status(500).json({ message: 'Erro ao excluir pedido. Tente novamente mais tarde.' })
    }

}

async function updateStatus(req, res) {
    
    try {

        const { id } = req.params;
        const { status } = req.body;
        const orders = await FS.readFile();

        if (!id) return res.status(400).json({ mensagem: 'É necessário um id.' });
        if (!status) return res.status(400).json({ mensagem: 'É necessário um status.' });

        const order = orders.find(o => o.order_id === id);
        if (!order) return res.status(404).json({ mensagem: 'Pedido não encontrado.' });

        if (!SM.isValidTransition(order.order.last_status_name, status)) return res.status(400).json({ mensagem: 'Não é possível atualizar para esse status.' });
        
        order.order.last_status_name = status;
        order.order.statuses.push({
            created_at: Date.now(),
            name: status,
            order_id: order.order_id,
            origin: "STORE"
        });

        await FS.saveFile(orders);

        return res.status(200).json({ message: 'Atualizado com sucesso!' });

    } catch (error) {
        console.error("Erro ao atualizar status do pedido: ", error);
        return res.status(500).json({ message: "Erro ao atualizar status do pedido. Tente novamente mais tarde." });
    }

}

async function updateOrder(req, res) {

    try {

        const { id } = req.params;
        const sentFields = Object.keys(req.body);

        if (!id) return res.status(400).json({ message: 'Falta o ID.' });

        const orders = await FS.readFile();

        if (!SM.isValidUpdate(orders, id, sentFields)) return res.status(400).json({ message: 'Não está permitido fazer atualizações desse campo.' }) 
        if (!OUSV.isSchemaValid(req.body)) {
            return res.status(400).json({ message: 'Formato dos dados inválido para atualização.' });
        }
        
        const updatedOrders = OU.partialUpdate(orders, id, req.body);

        await FS.saveFile(updatedOrders);

        return res.status(200).json({ message: 'Pedido atualizado com sucesso!' });

    } catch (error) {
        console.error('Erro ao atualizar pedido: ', error);
        return res.status(500).json({ message: 'Erro no servidor ao atualizar pedido. Tente novamente mais tarde.' })
    }
    
}

module.exports = { updateOrder, getAllOrders, getOrderById, createOrder, deleteOrder, updateStatus };
