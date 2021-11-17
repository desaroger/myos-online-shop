import * as connection from './utils/connection'
import * as query from './utils/query';
import * as data from './utils/data';
import { Product } from '../src/entity/Product';

describe('Products resolver', () => {
    beforeAll(connection.create);
    afterAll(connection.close);
    beforeEach(connection.clear);

    it('gets all products', async () => {
        await Product.insert(data.productPencil())
        await Product.insert(data.productLamp())

        const response = await query.run(`
            query Products {
              products {
                id
                title
                description
                price
                picture
              }
            }
        `)
        expect(response).toEqual({
            data: {
                products: [
                    {
                        id: '1',
                        ...data.productPencil()
                    },
                    {
                        id: '2',
                        ...data.productLamp()
                    }
                ]
            }
        })
    })

    it('gets product by id', async () => {
        await Product.create(data.productPencil()).save()
        await Product.create(data.productLamp()).save()

        const response = await query.run(`
            query Product($id: String!) {
              product(id: $id) {
                id
                title
                description
                picture
                price
              }
            }
        `, {
            id: '2'
        })
        expect(response).toEqual({
            data: {
                product: {
                    id: '2',
                    ...data.productLamp()
                }
            }
        })
    })

    it('create products', async () => {
        expect(await Product.count()).toEqual(0)
        const response = await query.run(`
            mutation CreateProduct($data: CreateProductInput!) {
              createProduct(data: $data) {
                id
              }
            }
        `, {
            data: data.productPencil()
        })
        expect(response).toMatchObject({
            data: {
                createProduct: {
                    id: '1'
                }
            }
        })

        expect(await Product.find()).toMatchObject([
            {
                id: 1,
                ...data.productPencil()
            }
        ])
    })
})
