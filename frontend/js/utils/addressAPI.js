export async function addressAPI(cep) {
  
  const cleanCep = cep.replace(/\D/g, '');
  
  if (cleanCep.length !== 8) {
    throw new Error('CEP inválido');
  }
  
  const url = `https://viacep.com.br/ws/${cleanCep}/json/`;
  
  try {
    
    const response = await fetch(url);
    
    if (!response.ok) throw new Error('Erro na requisição');
    
    const data = await response.json();
    
    if (data.erro) {

      throw new Error('CEP não encontrado');

    }
    
    const coordsUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${data.logradouro}, ${data.bairro}, ${data.localidade}, ${data.uf}, Brasil&limit=1`;
    
    const coordsResponse = await fetch(coordsUrl, {

      headers: {
        'User-Agent': 'Delivery-API/1.0'
      }

    });
    
    const coordsData = await coordsResponse.json();
    
    let coordinates = {
      latitude: 0,
      longitude: 0,
      id: Math.floor(Math.random() * 77777)
    };
    
    if (coordsData && coordsData.length > 0) {

      coordinates = {
        latitude: parseFloat(coordsData[0].lat),
        longitude: parseFloat(coordsData[0].lon),
        id: Math.floor(Math.random() * 77777)
      };

    }
    
    return {

      country: 'Brasil',
      state: data.uf,
      city: data.localidade,
      neighborhood: data.bairro,
      street: data.logradouro,
      coordinates: coordinates

    };
    
  } catch (error) {
    console.error('Erro ao buscar endereço:', error);
    throw error;
  }

}