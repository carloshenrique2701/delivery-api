function isSchemaValid(reqBody) {
    
    const validators = {

        payments: (value) => {

            if (!Array.isArray(value) || value.length === 0) return false;
            return value.every(p => 
                typeof p.prepaid === "boolean" &&
                typeof p.value === "number" && p.value >= 0 &&
                typeof p.origin === "string"
            );

        },

        customer: (value) => {

            return (
                value && typeof value === "object" &&
                typeof value.name === "string" &&
                typeof value.temporary_phone === "string"
            );

        },

        delivery_address: (value) => {

            if (!value || typeof value !== "object") return false;
            
            const addressFields = [
                "reference", "street_name", "postal_code", "country", 
                "city", "neighborhood", "street_number", "state", "coordinates"
            ];
            
            const hasFields = addressFields.every(field => field in value);
            if (!hasFields) return false;

            const { coordinates } = value;
            return (
                coordinates && typeof coordinates === "object" &&
                typeof coordinates.latitude === "number" &&
                typeof coordinates.longitude === "number" &&
                typeof coordinates.id === "number"
            );

        }

    };

    
    const camposEnviados = Object.keys(reqBody);

    
    return camposEnviados.every(campo => {

        const validator = validators[campo];

        if (!validator) return false; 

        return validator(reqBody[campo]); 

    });
}

module.exports = { isSchemaValid };
