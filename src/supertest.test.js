import { expect } from 'chai';  
import supertest from 'supertest';

const expects = expect;

const requester = supertest('http://localhost:8080')

describe('testing proyect',()=>{
    describe('test products',()=>{
        it('El endpoint post /realtimeproducts debe crear productos en la pantalla realtimeproducts', async()=>{
            const productMok = {
                title: 'pulceras',
                description: 'se ponen en los brazos',
                price: 1,
                stock:34,
            }
            const { statusCode, _body } = await requester.post('/realtimeproducts').send(productMok);
            console.log(statusCode)
            console.log({body:_body})
        })
    })
})