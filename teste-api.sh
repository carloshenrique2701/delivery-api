#!/bin/bash

echo "=== TESTANDO API DE PEDIDOS ==="
echo

echo "1. GET all orders:"
curl -s -X GET "http://localhost:3000/orders" | json_pp
echo -e "\n----------------------------------------\n"

echo "2. GET order by ID (válido):"
curl -s -X GET "http://localhost:3000/orders/a1b2c3d4-e5f6-4788-a999-b1c2d3e4f501" | json_pp
echo -e "\n----------------------------------------\n"

echo "3. GET order by ID (inválido - ID não existe):"
curl -s -X GET "http://localhost:3000/orders/id-que-nao-existe-123" | json_pp
echo -e "\n----------------------------------------\n"

echo "4. POST order (válido):"
curl -s -X POST "http://localhost:3000/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "order": {
      "payments": [
        {
          "prepaid": true,
          "value": 75.5,
          "origin": "CREDIT_CARD"
        }
      ],
      "store": {
        "name": "Coco Bambu Teste",
        "id": "f052054c-e0a0-4768-ab55-7cb7ead57371"
      },
      "items": [
        {
          "code": 1234,
          "name": "Pizza Margherita",
          "price": 65.0,
          "quantity": 1,
          "discount": 0,
          "condiments": []
        },
        {
          "code": 5678,
          "name": "Coca Cola 2L",
          "price": 12.5,
          "quantity": 2,
          "discount": 2.0,
          "condiments": []
        }
      ],
      "customer": {
        "name": "João Silva",
        "temporary_phone": "+5511999999999"
      },
      "delivery_address": {
        "reference": "Próximo ao mercado",
        "street_name": "Rua das Flores",
        "postal_code": "01234-567",
        "country": "BR",
        "city": "São Paulo",
        "neighborhood": "Centro",
        "street_number": "123",
        "state": "SP",
        "coordinates": {
          "latitude": -23.5505,
          "longitude": -46.6333,
          "id": 123456
        }
      }
    }
  }' | json_pp
echo -e "\n----------------------------------------\n"

echo "5. POST order (inválido - dados faltando):"
curl -s -X POST "http://localhost:3000/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "order": {
      "payments": [],
      "store": {
        "name": "Loja Teste"
      },
      "items": [],
      "customer": {},
      "delivery_address": {}
    }
  }' | json_pp
echo -e "\n----------------------------------------\n"

echo "6. PATCH status (válido - RECEIVED → CONFIRMED):"
curl -s -X PATCH "http://localhost:3000/orders/d4e5f6a7-b8c9-5011-d222-e4f504/status" \
  -H "Content-Type: application/json" \
  -d '{"status": "CONFIRMED"}' | json_pp
echo -e "\n----------------------------------------\n"

echo "7. PATCH status (inválido - CONFIRMED → RECEIVED):"
curl -s -X PATCH "http://localhost:3000/orders/a1b2c3d4-e5f6-4788-a999-b1c2d3e4f501/status" \
  -H "Content-Type: application/json" \
  -d '{"status": "RECEIVED"}' | json_pp
echo -e "\n----------------------------------------\n"

echo "8. PUT update (válido - campos permitidos):"
curl -s -X PUT "http://localhost:3000/orders/d4e5f6a7-b8c9-5011-d222-e4f504" \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "name": "Roberto Almeida Santos",
      "temporary_phone": "+5561999999999"
    },
    "delivery_address": {
      "reference": "Edifício Office Tower - Sala 505",
      "street_name": "SCN Quadra 2",
      "postal_code": "70.712-900",
      "country": "BR",
      "city": "Brasília",
      "neighborhood": "Asa Norte",
      "street_number": "Sala 505",
      "state": "Distrito Federal",
      "coordinates": {
        "latitude": -15.79,
        "longitude": -47.885,
        "id": 1323180
      }
    }
  }' | json_pp
echo -e "\n----------------------------------------\n"

echo "9. PUT update (inválido - campos não permitidos para o status):"
curl -s -X PUT "http://localhost:3000/orders/c3d4e5f6-a7b8-4900-c111-d3e4f503" \
  -H "Content-Type: application/json" \
  -d '{
    "payments": [
      {
        "prepaid": false,
        "value": 200.0,
        "origin": "CASH"
      }
    ]
  }' | json_pp
echo -e "\n----------------------------------------\n"

echo "10. DELETE order (válido - RECEIVED):"
curl -s -X DELETE "http://localhost:3000/orders/d4e5f6a7-b8c9-5011-d222-e4f504" | json_pp
echo -e "\n----------------------------------------\n"

echo "11. DELETE order (inválido - CANCELED não pode ser deletado):"
curl -s -X DELETE "http://localhost:3000/orders/b2c3d4e5-f6a7-4899-b000-c2d3e4f502" | json_pp
echo -e "\n----------------------------------------\n"

echo "12. GET com filtros (status=RECEIVED, minValue=30, maxValue=100):"
curl -s -X GET "http://localhost:3000/orders?status=RECEIVED&minValue=30&maxValue=100" | json_pp
echo -e "\n----------------------------------------\n"

echo "=== FIM DOS TESTES ==="