// C:\Users\Mikel\PycharmProjects\TypeScriptPlaywrightAuto\test_utils\test-data-factory.ts

import { Faker, en } from '@faker-js/faker';

const customFaker = new Faker({ locale: [en] });


const TEST_ADDRESS =
{
    line1: '123 Test St',
    line2: 'Testbury',
    country: 'United States',
    state: 'California',
    city: 'Test City',
    postcode: '12345',
    phone: '1234567890'
};


export interface TestUser
{
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    password: string;
    dob: Date;
    gender: string;

    address:
    {
        line1: string;
        line2: string;
        country: string;
        state: string;
        city: string;
        postcode: string;
        phone: string;
    };
}


export class TestDataFactory
{
    static createUser(): TestUser
    {
        const firstName = customFaker.person.firstName();
        const lastName = customFaker.person.lastName();


        return {
            firstName,
            lastName,

            fullName:
                `${firstName} ${lastName}`,

            email:
                customFaker.internet.email(
                    {
                        firstName,
                        lastName
                    }
                ),

            password:
                'password123',

            dob:
                customFaker.date.birthdate(
                    {
                        min: 18,
                        max: 70,
                        mode: 'age'
                    }
                ),

            gender:
                Math.random() > 0.5
                    ? 'id_gender1'
                    : 'id_gender2',

            address:
            {
                ...TEST_ADDRESS
            }
        };
    }
}