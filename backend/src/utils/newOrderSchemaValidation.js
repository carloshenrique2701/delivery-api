function isOrderValid(order) {
    
    if (!order || typeof order !== "object") return false;

    //General fields
    const requiredFields = [
        "payments",
        "store",
        "items",
        "customer",
        "delivery_address"
    ];

    for (const field of requiredFields) {
        if (!(field in order)) return false;
    }

    //Payments
    if (!Array.isArray(order.payments) || order.payments.length === 0) return false;

    for (const payment of order.payments) {
        if (typeof payment.prepaid !== "boolean") return false;
        if (typeof payment.value !== "number" || payment.value < 0) return false;
        if (typeof payment.origin !== "string") return false;
    }

    //Store Info
    if (typeof order.store !== "object") return false;
    if (typeof order.store.name !== "string") return false;
    if (typeof order.store.id !== "string") return false;

    //Item's Validation
    if (!Array.isArray(order.items) || order.items.length === 0) return false;

    for (const item of order.items) {
        if (typeof item.code !== "number") return false;
        if (typeof item.name !== "string") return false;
        if (typeof item.price !== "number" || item.price < 0) return false;
        if (typeof item.quantity !== "number" || item.quantity <= 0) return false;
        if (typeof item.discount !== "number") return false;

        if (!Array.isArray(item.condiments)) return false;
    }

    //Costume's Validation
    if (typeof order.customer !== "object") return false;
    if (typeof order.customer.name !== "string") return false;
    if (typeof order.customer.temporary_phone !== "string") return false;

    //Adress Validation
    const address = order.delivery_address;

    if (typeof address !== "object") return false;

    const addressFields = [
        "reference",
        "street_name",
        "postal_code",
        "country",
        "city",
        "neighborhood",
        "street_number",
        "state",
        "coordinates"
    ];

    for (const field of addressFields) {
        if (!(field in address)) return false;
    }

    if (typeof address.coordinates !== "object") return false;
    if (typeof address.coordinates.latitude !== "number") return false;
    if (typeof address.coordinates.longitude !== "number") return false;
    if (typeof address.coordinates.id !== "number") return false;

    return true;
    
}

module.exports = { isOrderValid };