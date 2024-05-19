

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
        if(data === true){
            alert("Producto borrado correctamente, actualice la pagina par ver los cambios")
        }else if(data === false){
            alert("Usted no es el dueño de este producto")
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert
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
            alert("No puede agregar productos que usted creo");
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
            alert("Compra finalizada correctamente, recibira un mail con la informacion del tiquet");
        } else {
            alert("Hubo un error al finalizar la compra");
        }
    })
    .catch(error => {
        console.error('Error al finalizar la compra:', error);
        alert("Hubo un error al finalizar la compra");
    });
}

function deleteUsers(id) {

    console.log(id)
    fetch('', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
    })
    .then(response => response.json())
    .then(data => {
        if(data === true){
            alert("usuario borrado correctamente, actualice la pagina par ver los cambios")
        }else if(data === false){
            alert("El usuario no ha estado desconectado el tiempo suficiente")
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert
    });
}
