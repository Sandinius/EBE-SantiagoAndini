import {fileURLToPath} from "url";
import {dirname} from "path";
import bcrypt from 'bcrypt';
import { faker } from "@faker-js/faker";

export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10));

export const isValidPassword = (user,password) => bcrypt.compareSync(password,user.password);

export const generateProductsFine = () =>{
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        thumbnail: null,
        code: faker.commerce.isbn(10),
        stock:faker.number.int({ min: 1, max: 100 }),
    
    }
} 
export const generateProductsWrong = () =>{
    return {
        id: faker.database.mongodbObjectId(),
        title: null,
        description: faker.commerce.productDescription(),
        price: null,
        thumbnail: null,
        code: faker.commerce.isbn(10),
        stock:faker.number.int({ min: 1, max: 100 }),
    
    }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;