import * as connection from './utils/connection'
import * as query from './utils/query';
import * as data from './utils/data';
import { Order, OrderStatus } from '../src/entity/Order';
import { OrderItem } from '../src/entity/OrderItem';
import { Product } from '../src/entity/Product';
import { SetOrderItemInput } from '../src/resolver/inputs/SetOrderItemInput';

describe('Orders resolver', () => {
    let productPencil;
    let productLamp;
    let order;

    beforeAll(connection.create);
    afterAll(connection.close);
    beforeEach(async () => {
        await connection.close()
        await connection.create()
        productPencil = await Product.create(data.productPencil()).save()
        productLamp = await Product.create(data.productLamp()).save()

        order = await Order.create({
            status: OrderStatus.CART
        }).save()
        order.items = Promise.resolve([
            await OrderItem.create({
                productId: productPencil.id,
                orderId: order.id,
                quantity: 3
            }).save(),
            await OrderItem.create({
                productId: productLamp.id,
                orderId: order.id,
                quantity: 1
            }).save()
        ])
        await order.save()
    });

    it('gets order by id', async () => {
        const response = await query.run(`
            query Order($id: String!) {
              order(id: $id) {
                id
                status
                price
                items {
                    product {
                        title
                        price
                    }
                    quantity
                }
              }
            }
        `, {
            id: '1'
        })
        expect(response).toEqual({
            data: {
                order: {
                    id: '1',
                    status: 'cart',
                    price: 199 * 3 + 566,
                    items: [
                        {
                            product: {
                                title: 'Pencil 2H',
                                price: 199
                            },
                            quantity: 3
                        },
                        {
                            product: {
                                title: 'Table lamp 8w',
                                price: 566
                            },
                            quantity: 1
                        }
                    ]
                }
            }
        })
    })

    it('modifies cart', async () => {
        const response = await query.run(`
            mutation SetOrderItem($data: SetOrderItemInput!) {
              setOrderItem(data: $data) {
                id
                price
                status
              }
            }
        `, {
            data: <SetOrderItemInput> {
                orderId: `${order.id}`,
                productId: `${productPencil.id}`,
                quantity: 10
            }
        })
        expect(response).toEqual({
            data: {
                setOrderItem: {
                    id: `${order.id}`,
                    status: 'cart',
                    price: 199 * 10 + 566
                }
            }
        })
    })

    it('confirms cart', async () => {
        const response = await query.run(`
            mutation Confirm($id: String!) {
              confirm(id: $id) {
                id
                price
                status
              }
            }
        `, {
            id: `${order.id}`
        })
        expect(response).toEqual({
            data: {
                confirm: {
                    id: `${order.id}`,
                    status: 'confirmed',
                    price: 199 * 3 + 566
                }
            }
        })
    })

    it('fixes the price on confirm', async () => {
        order.finalPrice = 99
        await order.save()

        expect(await order.price).toEqual(199 * 3 + 566)

        order.status = OrderStatus.CONFIRMED
        await order.save()

        expect(await order.price).toEqual(99)
    })

})
