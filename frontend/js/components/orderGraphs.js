let monthChartInstance = null;
let statusChartInstance = null;


export function createGraphs(orders) {
    
    const allOrders = document.getElementById('all-orders');
    allOrders.textContent = 'Total de pedidos: ' + orders.length;

    createDiagramMonths(orders);
    createDiagramStatus(orders);

}

const MONTHS = {
    '01': 'Jan', '02': 'Fev', '03': 'Mar', '04': 'Abr',
    '05': 'Mai', '06': 'Jun', '07': 'Jul', '08': 'Ago',
    '09': 'Set', '10': 'Out', '11': 'Nov', '12': 'Dez'
};

function createDiagramMonths(orders) {

    const ordersByMonth = {};
    
    //Inicializa todos os meses com 0
    for (let month in MONTHS) {

        ordersByMonth[month] = 0;

    }
    
    orders.forEach(order => {

        const date = new Date(order.order.created_at);
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        
        if (ordersByMonth[month] !== undefined) {
            ordersByMonth[month]++;
        }
    });
    

    
    //Lista para colocar nográfico
    const monthsOrdered = Object.keys(MONTHS).sort(); 
    const monthLabels = monthsOrdered.map(m => MONTHS[m]); 
    const monthData = monthsOrdered.map(m => ordersByMonth[m]); 
    
    const ctx = document.getElementById('order-months-graph').getContext('2d');
    
    if (monthChartInstance) {
        monthChartInstance.destroy();
    }

    monthChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: monthLabels,
            datasets: [{

                label: 'Quantidade de Pedidos',

                data: monthData,

                backgroundColor: '#f8c361',

                borderColor: '#ffa600',

                borderWidth: 1,

                borderRadius: 5,

                barPercentage: 0.7

            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {

                title: {
                    display: true,
                    text: 'Pedidos por Mês',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    }
                },

                legend: {
                    display: false
                },

                tooltip: {

                    backgroundColor: '#333',

                    titleColor: '#fff',

                    bodyColor: '#ddd',

                    titleFont: { 
                        size: 11, 
                        weight: 'bold' 
                    },

                    bodyFont: { 
                        size: 10 
                    },
                    
                    padding: 6,

                    cornerRadius: 4,

                    displayColors: false,

                    callbacks: {
                        title: function(context) {

                            return context[0].label;

                        },
                        label: function(context) {

                            const monthIndex = context.dataIndex;
                            const monthNumber = monthsOrdered[monthIndex];
                            
                            const ordersThisMonth = orders.filter(order => {

                                const date = new Date(order.order.created_at);
                                const orderMonth = String(date.getMonth() + 1).padStart(2, '0');
                                return orderMonth === monthNumber;

                            });
                            
                            const totalValue = ordersThisMonth.reduce((sum, order) => 

                                sum + order.order.total_price, 0

                            );
                            
                            const formattedTotal = totalValue.toLocaleString('pt-BR', {

                                style: 'currency',
                                currency: 'BRL',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0

                            });
                            
                            return [

                                `${context.raw} pedido${context.raw !== 1 ? 's' : ''}`,
                                `Total: ${formattedTotal}`

                            ];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            return value + ' pedido' + (value !== 1 ? 's' : '');
                        }
                    },
                    title: {
                        display: true,
                        text: 'Qtd de Pedidos',
                        font: {
                            weight: 'bold'
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Mês',
                        font: {
                            weight: 'bold'
                        }
                    }
                }
            }
        }
    });
    
}
function createDiagramStatus(orders) {

    let statusCount = {

        RECEIVED: 0,
        CONFIRMED: 0,
        DISPATCHED: 0,
        DELIVERED: 0,
        CANCELED: 0

    }

    orders.forEach(order => {

        const status = order.order.last_status_name;

        if (statusCount.hasOwnProperty(status)) {
            statusCount[status] += 1;
        }

    });
    
    const statusLabels = Object.keys(statusCount);
    const statusData = Object.values(statusCount);
    
    const statusColors = {
        RECEIVED: '#3498db',     // Azul
        CONFIRMED: '#f39c12',     // Laranja
        DISPATCHED: '#9b59b6',    // Roxo
        DELIVERED: '#2ecc71',     // Verde
        CANCELED: '#e74c3c'       // Vermelho
    };
    
    const backgroundColors = statusLabels.map(status => statusColors[status]);
    const borderColors = statusLabels.map(status => statusColors[status]);
    
    const totalOrders = orders.length;
    const percentages = statusData.map(count => 
        totalOrders > 0 ? ((count / totalOrders) * 100).toFixed(1) : 0
    );
    


    const ctx = document.getElementById('order-status-graph').getContext('2d');
    
    if (statusChartInstance) {
        statusChartInstance.destroy();
    }

    statusChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {

            labels: statusLabels,

            datasets: [{

                data: statusData,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 2,
                hoverOffset: 15,
                spacing: 5

            }]

        },
        options: {

            responsive: true,

            maintainAspectRatio: false,

            cutout: '60%', 

            plugins: {

                title: {

                    display: true,
                    text: 'Distribuição de Pedidos por Status',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    }

                },

                legend: {
                    
                    position: 'right',
                    labels: {
                        font: {
                            size: 12
                        },
                        generateLabels: function(chart) {

                            const data = chart.data;

                            if (data.labels.length && data.datasets.length) {

                                return data.labels.map((label, i) => {

                                    const value = data.datasets[0].data[i];
                                    const percentage = ((value / totalOrders) * 100).toFixed(1);

                                    return {

                                        text: `${label}: ${value} (${percentage}%)`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        strokeStyle: data.datasets[0].borderColor[i]
                                        
                                    };

                                });

                            }
                            return [];
                        }
                    }
                },
                tooltip: {

                    callbacks: {

                        label: function(context) {

                            const label = context.label || '';
                            const value = context.raw;
                            const percentage = percentages[context.dataIndex];
                            return `${label}: ${value} pedido${value !== 1 ? 's' : ''} (${percentage}%)`;
                       
                        },

                        afterBody: function(context) {
                            
                            const statusIndex = context[0].dataIndex;
                            const statusName = statusLabels[statusIndex];
                            
                            const ordersThisStatus = orders.filter(order => order.order.last_status_name === statusName);
                            
                            const totalValue = ordersThisStatus.reduce((sum, order) => sum + order.order.total_price, 0);
                            
                            const formattedTotal = totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                            
                            return [

                                `Valor total: ${formattedTotal}`,
                                '─────────────',

                                ...ordersThisStatus.slice(0, 5).map(order => 

                                    `${order.order.customer.name}: ${order.order.total_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`

                                ),

                                ordersThisStatus.length > 5 ? `... e mais ${ordersThisStatus.length - 5} pedido(s)` : ''

                            ];
                        }
                    }
                }
            }
        }
    });

}


