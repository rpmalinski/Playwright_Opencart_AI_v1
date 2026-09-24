import dotenv from 'dotenv';

dotenv.config();

export class Helper {

    static convertPriceToNumber (price: string): number {
        const priceWithoutCurrency = price.replace(/[^0-9.]/g, '');
        return parseFloat(priceWithoutCurrency);
    }

    static getProductDetails () {
        return{
            productName: "MacBook",
            productQuantity: "1",
            totalPrice: "$602.00"
        };
    }

    static getLoginDetails () {
        return{
            email: process.env.APP_EMAIL || 'pavanol@xyz.com',
            password: process.env.APP_PASSWORD || 'test@123'
        };  
    }
}