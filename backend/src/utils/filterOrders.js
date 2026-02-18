function dinamicFilter(orders, status, minValue, maxValue, itens, startDate, endDate) {
    
    
    let filtredOrders = orders;

    const minNum = parseFloat(minValue);
    const maxNum = parseFloat(maxValue);
    const itensNum = parseInt(itens);

    if (status && status.trim() !== '') {
        filtredOrders = filtredOrders.filter(p =>
            p.order.last_status_name === status
        );
    }

    if (!isNaN(minNum) && minNum > 0) {
        filtredOrders = filtredOrders.filter(p =>
            p.order.total_price > minNum
        );
    }

    if (!isNaN(maxNum) && maxNum > 0) {
        filtredOrders = filtredOrders.filter(p =>
            p.order.total_price < maxNum
        );
    }

    if (!isNaN(itensNum) && itensNum > 0) {
        filtredOrders = filtredOrders.filter(p =>
            p.order.items.length === itensNum
        );
    }

    if (startDate) {
        const [year, month, day] = startDate.split('-').map(Number);
        const startTimestamp = new Date(year, month - 1, day, 0, 0, 0, 0).getTime();

        filtredOrders = filtredOrders.filter(p =>
            p.order.created_at >= startTimestamp
        );
    }

    if (endDate) {
        const [year, month, day] = endDate.split('-').map(Number);
        const endTimestamp = new Date(year, month - 1, day, 23, 59, 59, 999).getTime();

        filtredOrders = filtredOrders.filter(p =>
            p.order.created_at <= endTimestamp
        );
    }

    return filtredOrders;

}

module.exports = { dinamicFilter };
