

const socket = io();

function deleteProduct() {
    const productId = document.getElementById('productId').value;

    fetch('/realtimeproducts', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: productId }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        window.location.href = '/realtimeproducts';
    })
    .catch(error => {
        console.error('Error:', error);
        window.location.href = '/realtimeproducts';
    });
}

function agregado(id){
    fetch(`/api/carts/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => {
        if (response.ok) {
            alert("Producto Agregado correctamente");
        } else {
            alert("Hubo un error al agregar el producto");
        }
    })
    .catch(error => {
        console.error('Hubo un error al agregar el producto:', error);
        alert("Hubo un error al agregar el producto");
    });
}

function finalizarCompra(id){
    fetch(`/api/carts/${id}/purchase`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.ok) {
            alert("Compra finalizada correctamente");
        } else {
            alert("Hubo un error al finalizar la compra");
        }
    })
    .catch(error => {
        console.error('Error al finalizar la compra:', error);
        alert("Hubo un error al finalizar la compra");
    });
}
