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
