export const seedOrders = (users: any[], products: any[]) => [
  {
    userId: users[1]._id,
    products: [
      {
        productId: products[0]._id,
        quantity: 1,
        price: products[0].price,
      },
      {
        productId: products[1]._id,
        quantity: 2,
        price: products[1].price,
      },
    ],
    totalAmount: products[0].price + products[1].price * 2,
    status: "completed",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    userId: users[2]._id,
    products: [
      {
        productId: products[3]._id,
        quantity: 1,
        price: products[3].price,
      },
    ],
    totalAmount: products[3].price,
    status: "pending",
    date: new Date(),
  },
  {
    userId: users[3]._id,
    products: [
      {
        productId: products[5]._id,
        quantity: 1,
        price: products[5].price,
      },
      {
        productId: products[6]._id,
        quantity: 1,
        price: products[6].price,
      },
    ],
    totalAmount: products[5].price + products[6].price,
    status: "in progress",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    userId: users[4]._id,
    products: [
      {
        productId: products[8]._id,
        quantity: 2,
        price: products[8].price,
      },
    ],
    totalAmount: products[8].price * 2,
    status: "cancelled",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    userId: users[5]._id,
    products: [
      {
        productId: products[4]._id,
        quantity: 1,
        price: products[4].price,
      },
    ],
    totalAmount: products[4].price,
    status: "completed",
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
  {
    userId: users[1]._id,
    products: [
      {
        productId: products[2]._id,
        quantity: 1,
        price: products[2].price,
      },
      {
        productId: products[11]._id,
        quantity: 1,
        price: products[11].price,
      },
    ],
    totalAmount: products[2].price + products[11].price,
    status: "in progress",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
];
