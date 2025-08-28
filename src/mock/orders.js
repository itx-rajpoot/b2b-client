export const orders = [
  {
    orderId: 0, 
    user: "user_id",
    venue: "venue_id",
    tableNo: 666,
    tip: 2,
    tax: 3,
    subtotal: 25,
    total: 30, 
    orderConfirmation: "stripe_transaction_no",
    method: "credit",
    rewards: null,
    lp: null,
    isTab: true,
    date: new Date(),
    orders: [{
      orderNo: 154869,// PENDING TO ADD TO MODEL 
      date: new Date(),// PENDING TO ADD TO MODEL 
      status: 2, 
      server: "George Potvin",// In any part is something related to server identification
      items: [
        {
          item: "item_id_1",
          quantity: 3,
          price: 5,
          name: "Cocktail Cherry Lips",
          additionals: ["Fries", "Ketchup"]
        },
        {
          item: "item_id_2",
          quantity: 2,
          price: 4,
          name: "Margarita",
          additionals: []
        },
        {
          item: "item_id_3",
          quantity: 1,
          price: 2,
          name: "Coke",
          additionals: []
        },
      ]
    }, {
      orderNo: 154870,// PENDING TO ADD TO MODEL 
      date: new Date(),// PENDING TO ADD TO MODEL 
      status: 1, 
      server: "George Potvin",// In any part is something related to server identification
      items: [
        {
          item: "item_id_1",
          quantity: 1,
          price: 2,
          name: "Coke",
          additionals: []
        },
      ]
    }, {
      orderNo: 154231,// PENDING TO ADD TO MODEL 
      date: new Date(),// PENDING TO ADD TO MODEL 
      status: -1, 
      server: "George Potvin",// In any part is something related to server identification
      items: [
        {
          item: "item_id_1",
          quantity: 1,
          price: 66,
          name: "Cuba Libre",
          additionals: []
        },
      ]
    }],
  },
  {
    orderId: 1, 
    user: "user_id",
    venue: "venue_id",
    tableNo: 234,
    tip: 0,
    tax: 2,
    subtotal: 10,
    total: 12, 
    orderConfirmation: "stripe_transaction_no",
    method: "credit",
    rewards: null,
    lp: null,
    isTab: true,
    date: new Date(),
    orders: [{
      orderNo: 13524,// PENDING TO ADD TO MODEL 
      date: new Date() - 400000,// PENDING TO ADD TO MODEL 
      status: 1, 
      server: "George Potvin",// In any part is something related to server identification
      items: [
        {
          item: "item_id_2",
          quantity: 2,
          price: 4,
          name: "Margarita",
          additionals: []
        },
        {
          item: "item_id_3",
          quantity: 1,
          price: 2,
          name: "Coke",
          additionals: []
        },
      ]
    }],
  },
  {
    orderId: 2, 
    user: "user_id",
    venue: "venue_id",
    tableNo: 234,
    tip: 0,
    tax: 2,
    subtotal: 10,
    total: 12, 
    orderConfirmation: "stripe_transaction_no",
    method: "credit",
    rewards: null,
    lp: null,
    isTab: true,
    date: new Date(),
    orders: [{
      orderNo: 13524,// PENDING TO ADD TO MODEL 
      date: new Date() - 400000,// PENDING TO ADD TO MODEL 
      status: 2, 
      server: "George Potvin",// In any part is something related to server identification
      items: [
        {
          item: "item_id_2",
          quantity: 2,
          price: 4,
          name: "Margarita",
          additionals: []
        },
        {
          item: "item_id_3",
          quantity: 1,
          price: 2,
          name: "Coke",
          additionals: []
        },
      ]
    }],
  },
  {
    orderId: 3, 
    user: "user_id",
    venue: "venue_id",
    tableNo: 234,
    tip: 0,
    tax: 0,
    subtotal: 8,
    total: 8, 
    orderConfirmation: "stripe_transaction_no",
    method: "credit",
    rewards: null,
    lp: null,
    isTab: true,
    date: new Date(),
    orders: [{
      orderNo: 12524,// PENDING TO ADD TO MODEL 
      date: new Date() - 400000,// PENDING TO ADD TO MODEL 
      status: 1, 
      server: "George Potvin",// In any part is something related to server identification
      items: [
        {
          item: "item_id_2",
          quantity: 2,
          price: 4,
          name: "Margarita",
          additionals: []
        },
      ]
    }],
  },
]