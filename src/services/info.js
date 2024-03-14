export const generateProductsInfo = (product) => {
    return `One or more properties were incomplete or invalid.
    List of required properties:
    title: needs to be an string, recived ${product.title}
    stock: needs to be an number, recived ${product.stock}
    price: needs to be an number, recived ${product.price}
    description: needs to be an string, recived ${product.description}`
}