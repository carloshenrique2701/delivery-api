const API_BASE_URL = 'http://localhost:3000';

async function apiClient(endpoint, options = {}) {

    try {
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {

            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
            
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        
        return data;

    } catch (error) {
        console.error('Erro ao fazer requisição para o servidor: ', error);
    }
    
}

export { apiClient };