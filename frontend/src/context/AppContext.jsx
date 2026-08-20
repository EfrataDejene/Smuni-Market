import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

// Seed initial mock data if not already in localStorage
const initialUsers = [
  {
    userId: 1,
    name: 'Super Admin',
    email: 'admin@smuni.com',
    passwordHash: 'admin123',
    role: 'Admin',
    phone: '+251911111111',
    address: 'Adama, Ethiopia',
    status: 'Active',
    createdAt: '2026-01-01'
  },
  {
    userId: 2,
    name: 'Abebe Fashion House',
    email: 'seller1@smuni.com',
    passwordHash: 'seller123',
    role: 'Seller',
    phone: '+251912345678',
    address: 'Bole, Addis Ababa',
    status: 'Active',
    createdAt: '2026-02-15'
  },
  {
    userId: 3,
    name: 'Habesha Store',
    email: 'habesha@seller.com',
    passwordHash: 'password123',
    role: 'Seller',
    phone: '+251912345679',
    address: 'Bole, Addis Ababa',
    status: 'Active',
    createdAt: '2026-02-20'
  },
  {
    userId: 4,
    name: 'Chala Electronics',
    email: 'seller2@smuni.com',
    passwordHash: 'seller123',
    role: 'Seller',
    phone: '+251987654321',
    address: 'Megenagna, Addis Ababa',
    status: 'Pending',
    createdAt: '2026-08-10'
  },
  {
    userId: 5,
    name: 'Abebe Bikila',
    email: 'abebe@gmail.com',
    passwordHash: 'password123',
    role: 'Customer',
    phone: '+251911223344',
    address: 'Bole, Addis Ababa',
    status: 'Active',
    createdAt: '2026-05-01'
  },
  {
    userId: 6,
    name: 'Efi Deju',
    email: 'customer@smuni.com',
    passwordHash: 'customer123',
    role: 'Customer',
    phone: '+251912000000',
    address: 'Piazza, Addis Ababa, House 452',
    status: 'Active',
    createdAt: '2026-05-10'
  },
  {
    userId: 7,
    name: 'Abebe Tesfaye',
    email: 'dawit@delivery.com',
    passwordHash: 'password123',
    role: 'Delivery',
    phone: '+251922334455',
    address: 'Mexico, Addis Ababa',
    status: 'Active',
    createdAt: '2026-06-01'
  },
  {
    userId: 8,
    name: 'Kebede Fast Delivery',
    email: 'delivery@smuni.com',
    passwordHash: 'delivery123',
    role: 'Delivery',
    phone: '+251922334456',
    address: 'Mexico, Addis Ababa',
    status: 'Active',
    createdAt: '2026-06-01'
  }
];

const initialCategories = [
  { id: 1, name: 'Electronics', icon: 'Monitor', status: 'Active' },
  { id: 2, name: 'Fashion', icon: 'Shirt', status: 'Active' },
  { id: 3, name: 'Shoes', icon: 'Footprints', status: 'Active' },
  { id: 4, name: 'Bags', icon: 'ShoppingBag', status: 'Active' },
  { id: 5, name: 'Beauty', icon: 'Sparkles', status: 'Active' },
  { id: 6, name: 'Watches', icon: 'Watch', status: 'Active' },
  { id: 7, name: 'Home & Living', icon: 'Sofa', status: 'Active' },
  { id: 8, name: 'Books', icon: 'BookOpen', status: 'Active' }
];

const initialBrands = [
  { id: 1, name: 'Samsung', description: 'Samsung Electronics' },
  { id: 2, name: 'Apple', description: 'Apple Inc.' },
  { id: 3, name: 'Nike', description: 'Nike Sports' },
  { id: 4, name: 'Adidas', description: 'Adidas AG' },
  { id: 5, name: 'Rolex', description: 'Rolex Luxury Watches' },
  { id: 6, name: 'Zara', description: 'Zara Fashion' },
  { id: 7, name: 'Local Crafts', description: 'Handmade in Ethiopia' }
];

const initialProducts = [
  {
    productId: 1,
    sellerId: 2,
    categoryId: 6,
    brandId: 5,
    name: 'Smart Watch Series 5',
    description: 'High-end smartwatch with AMOLED display, heart rate monitor, GPS, water resistance.',
    price: 2450,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop',
    createdAt: '2026-06-01'
  },
  {
    productId: 2,
    sellerId: 2,
    categoryId: 1,
    brandId: 1,
    name: 'Wireless Noise-Canceling Headphones',
    description: 'Over-ear Bluetooth headphones with active noise cancellation and 30-hour battery life.',
    price: 1850,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop',
    createdAt: '2026-06-05'
  },
  {
    productId: 3,
    sellerId: 2,
    categoryId: 3,
    brandId: 3,
    name: 'Nike Air Running Shoes',
    description: 'Lightweight performance running shoes with breathable mesh and cushioned sole.',
    price: 3200,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
    createdAt: '2026-07-10'
  },
  {
    productId: 4,
    sellerId: 2,
    categoryId: 6,
    brandId: 5,
    name: 'Classic Black Leather Watch',
    description: 'Elegant analogue wristwatch with genuine leather strap and minimalist dial.',
    price: 1150,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600&auto=format&fit=crop',
    createdAt: '2026-07-12'
  },
  {
    productId: 5,
    sellerId: 2,
    categoryId: 4,
    brandId: 6,
    name: 'Designer Leather Shoulder Bag',
    description: 'Premium handcrafted leather tote bag with spacious compartment.',
    price: 2780,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600&auto=format&fit=crop',
    createdAt: '2026-07-20'
  },
  {
    productId: 6,
    sellerId: 2,
    categoryId: 5,
    brandId: 7,
    name: 'Luxury French Rose Perfume',
    description: 'Long-lasting floral fragrance with rose, vanilla, and musk notes.',
    price: 950,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600&auto=format&fit=crop',
    createdAt: '2026-07-25'
  }
];

const initialInventory = [
  { inventoryId: 1, productId: 1, quantity: 12, lowStockThreshold: 2, stockStatus: 'Available', updatedAt: '2026-08-01' },
  { inventoryId: 2, productId: 2, quantity: 8, lowStockThreshold: 3, stockStatus: 'Available', updatedAt: '2026-08-01' },
  { inventoryId: 3, productId: 3, quantity: 15, lowStockThreshold: 5, stockStatus: 'Available', updatedAt: '2026-08-01' },
  { inventoryId: 4, productId: 4, quantity: 5, lowStockThreshold: 3, stockStatus: 'Available', updatedAt: '2026-08-01' },
  { inventoryId: 5, productId: 5, quantity: 20, lowStockThreshold: 5, stockStatus: 'Available', updatedAt: '2026-08-01' },
  { inventoryId: 6, productId: 6, quantity: 10, lowStockThreshold: 2, stockStatus: 'Available', updatedAt: '2026-08-01' }
];

const initialOrders = [
  {
    orderId: 10058,
    userId: 5,
    customerName: 'Selamawit Assefa',
    customerPhone: '+251 912 345 678',
    customerEmail: 'selamawitassefa12@gmail.com',
    orderDate: 'May 31, 2025',
    orderTime: '10:30 AM',
    totalAmount: 2550,
    subtotal: 2450,
    shippingFee: 100,
    orderStatus: 'Confirmed',
    deliveryAddress: 'Bole Sub City, Woreda 03 House No. 1234, Road 5 Addis Ababa, Ethiopia'
  },
  {
    orderId: 10057,
    userId: 5,
    customerName: 'Yonas Berhanu',
    customerPhone: '+251 911 223 344',
    customerEmail: 'yonas.berhanu@gmail.com',
    orderDate: 'May 31, 2025',
    orderTime: '11:15 AM',
    totalAmount: 1950,
    subtotal: 1850,
    shippingFee: 100,
    orderStatus: 'Confirmed',
    deliveryAddress: 'Nifas Silk-Lafto, Woreda 02, House No. 210, Addis Ababa'
  },
  {
    orderId: 10056,
    userId: 5,
    customerName: 'Abebe Kebede',
    customerPhone: '+251 913 445 566',
    customerEmail: 'abebe.kebede@gmail.com',
    orderDate: 'May 31, 2025',
    orderTime: '12:00 PM',
    totalAmount: 3300,
    subtotal: 3200,
    shippingFee: 100,
    orderStatus: 'Confirmed',
    deliveryAddress: 'Bole Sub City, Woreda 03, House No. 999, Addis Ababa'
  },
  {
    orderId: 10055,
    userId: 5,
    customerName: 'Hana Mulu',
    customerPhone: '+251 914 556 677',
    customerEmail: 'hana.mulu@gmail.com',
    orderDate: 'May 30, 2025',
    orderTime: '02:45 PM',
    totalAmount: 1250,
    subtotal: 1150,
    shippingFee: 100,
    orderStatus: 'Confirmed',
    deliveryAddress: 'Yeka Sub City, Woreda 09, House No. 221, Addis Ababa'
  },
  {
    orderId: 10054,
    userId: 5,
    customerName: 'Daniel Kassa',
    customerPhone: '+251 915 667 788',
    customerEmail: 'daniel.kassa@gmail.com',
    orderDate: 'May 30, 2025',
    orderTime: '01:10 PM',
    totalAmount: 2880,
    subtotal: 2780,
    shippingFee: 100,
    orderStatus: 'Confirmed',
    deliveryAddress: 'Piassa, Woreda 05, House No. 876, Addis Ababa'
  },
  {
    orderId: 10053,
    userId: 5,
    customerName: 'Rahel Mesfin',
    customerPhone: '+251 916 778 899',
    customerEmail: 'rahel.mesfin@gmail.com',
    orderDate: 'May 29, 2025',
    orderTime: '04:20 PM',
    totalAmount: 1050,
    subtotal: 950,
    shippingFee: 100,
    orderStatus: 'Cancelled',
    deliveryAddress: 'Kirkos Sub City, Woreda 01, House No. 445, Addis Ababa'
  },
  {
    orderId: 10052,
    userId: 5,
    customerName: 'Rahel Mesfin',
    customerPhone: '+251 916 778 899',
    customerEmail: 'rahel.mesfin@gmail.com',
    orderDate: 'May 29, 2025',
    orderTime: '04:20 PM',
    totalAmount: 1050,
    subtotal: 950,
    shippingFee: 100,
    orderStatus: 'Confirmed',
    deliveryAddress: 'Kirkos Sub City, Woreda 01, House No. 445, Addis Ababa'
  },
  {
    orderId: 10051,
    userId: 5,
    customerName: 'Abebe Kebede',
    customerPhone: '+251 913 445 566',
    customerEmail: 'abebe.kebede@gmail.com',
    orderDate: 'May 29, 2025',
    orderTime: '03:15 PM',
    totalAmount: 3300,
    subtotal: 3200,
    shippingFee: 100,
    orderStatus: 'Confirmed',
    deliveryAddress: 'Bole Sub City, Woreda 03, House No. 999, Addis Ababa'
  },
  {
    orderId: 10050,
    userId: 5,
    customerName: 'Yonas Berhanu',
    customerPhone: '+251 911 223 344',
    customerEmail: 'yonas.berhanu@gmail.com',
    orderDate: 'May 28, 2025',
    orderTime: '12:30 PM',
    totalAmount: 1400,
    subtotal: 1300,
    shippingFee: 100,
    orderStatus: 'Confirmed',
    deliveryAddress: 'Nifas Silk-Lafto, Woreda 02, House No. 210, Addis Ababa'
  }
];

const initialOrderItems = [
  { itemId: 1, orderId: 10058, productId: 1, quantity: 1, price: 2450 },
  { itemId: 2, orderId: 10057, productId: 2, quantity: 1, price: 1850 },
  { itemId: 3, orderId: 10056, productId: 3, quantity: 1, price: 3200 },
  { itemId: 4, orderId: 10055, productId: 4, quantity: 1, price: 1150 },
  { itemId: 5, orderId: 10054, productId: 5, quantity: 1, price: 2780 },
  { itemId: 6, orderId: 10053, productId: 6, quantity: 1, price: 950 },
  { itemId: 7, orderId: 10052, productId: 6, quantity: 1, price: 950 },
  { itemId: 8, orderId: 10051, productId: 3, quantity: 1, price: 3200 },
  { itemId: 9, orderId: 10050, productId: 4, quantity: 1, price: 1300 }
];

const initialPayments = [
  { paymentId: 501, orderId: 10058, paymentMethod: 'COD', transactionReference: 'COD-ORD-10058', amount: 2550, paymentStatus: 'Pending', paymentDate: 'May 31, 2025' },
  { paymentId: 502, orderId: 10057, paymentMethod: 'COD', transactionReference: 'COD-ORD-10057', amount: 1950, paymentStatus: 'Pending', paymentDate: 'May 31, 2025' },
  { paymentId: 503, orderId: 10056, paymentMethod: 'COD', transactionReference: 'COD-ORD-10056', amount: 3300, paymentStatus: 'Pending', paymentDate: 'May 31, 2025' },
  { paymentId: 504, orderId: 10055, paymentMethod: 'COD', transactionReference: 'COD-ORD-10055', amount: 1250, paymentStatus: 'Paid', paymentDate: 'May 30, 2025' },
  { paymentId: 505, orderId: 10054, paymentMethod: 'COD', transactionReference: 'COD-ORD-10054', amount: 2880, paymentStatus: 'Paid', paymentDate: 'May 30, 2025' },
  { paymentId: 506, orderId: 10053, paymentMethod: 'COD', transactionReference: 'COD-ORD-10053', amount: 1050, paymentStatus: 'Refunded', paymentDate: 'May 29, 2025' },
  { paymentId: 507, orderId: 10052, paymentMethod: 'COD', transactionReference: 'COD-ORD-10052', amount: 1050, paymentStatus: 'Paid', paymentDate: 'May 29, 2025' },
  { paymentId: 508, orderId: 10051, paymentMethod: 'COD', transactionReference: 'COD-ORD-10051', amount: 3300, paymentStatus: 'Failed', paymentDate: 'May 29, 2025' },
  { paymentId: 509, orderId: 10050, paymentMethod: 'COD', transactionReference: 'COD-ORD-10050', amount: 1400, paymentStatus: 'Paid', paymentDate: 'May 28, 2025' }
];

const initialDeliveryTracking = [
  {
    trackingId: 801,
    orderId: 10058,
    deliveryPersonId: 7,
    deliveryStatus: 'On The Way',
    assignedTime: 'May 31, 2025 - 09:15 AM',
    pickedUpTime: 'May 31, 2025 - 09:45 AM',
    onTheWayTime: 'May 31, 2025 - 10:30 AM',
    deliveredTime: null,
    deliveryDate: 'May 31, 2025',
    notes: 'In transit to customer address'
  },
  {
    trackingId: 802,
    orderId: 10057,
    deliveryPersonId: 7,
    deliveryStatus: 'Assigned',
    assignedTime: 'May 31, 2025 - 11:15 AM',
    pickedUpTime: null,
    onTheWayTime: null,
    deliveredTime: null,
    deliveryDate: 'May 31, 2025',
    notes: 'Assigned to delivery driver'
  },
  {
    trackingId: 803,
    orderId: 10056,
    deliveryPersonId: 7,
    deliveryStatus: 'Assigned',
    assignedTime: 'May 31, 2025 - 12:00 PM',
    pickedUpTime: null,
    onTheWayTime: null,
    deliveredTime: null,
    deliveryDate: 'May 31, 2025',
    notes: 'Assigned to delivery driver'
  },
  {
    trackingId: 804,
    orderId: 10055,
    deliveryPersonId: 7,
    deliveryStatus: 'Delivered',
    assignedTime: 'May 30, 2025 - 01:00 PM',
    pickedUpTime: 'May 30, 2025 - 01:30 PM',
    onTheWayTime: 'May 30, 2025 - 02:00 PM',
    deliveredTime: 'May 30, 2025 - 02:45 PM',
    deliveryDate: 'May 30, 2025',
    notes: 'Delivered and COD collected'
  },
  {
    trackingId: 805,
    orderId: 10054,
    deliveryPersonId: 7,
    deliveryStatus: 'Delivered',
    assignedTime: 'May 30, 2025 - 11:00 AM',
    pickedUpTime: 'May 30, 2025 - 11:45 AM',
    onTheWayTime: 'May 30, 2025 - 12:30 PM',
    deliveredTime: 'May 30, 2025 - 01:10 PM',
    deliveryDate: 'May 30, 2025',
    notes: 'Delivered successfully'
  },
  {
    trackingId: 806,
    orderId: 10053,
    deliveryPersonId: 7,
    deliveryStatus: 'Cancelled',
    assignedTime: 'May 29, 2025 - 03:00 PM',
    pickedUpTime: null,
    onTheWayTime: null,
    deliveredTime: null,
    deliveryDate: 'May 29, 2025',
    notes: 'Order cancelled by customer'
  },
  {
    trackingId: 807,
    orderId: 10052,
    deliveryPersonId: 7,
    deliveryStatus: 'Delivered',
    assignedTime: 'May 29, 2025 - 02:00 PM',
    pickedUpTime: 'May 29, 2025 - 02:30 PM',
    onTheWayTime: 'May 29, 2025 - 03:30 PM',
    deliveredTime: 'May 29, 2025 - 04:20 PM',
    deliveryDate: 'May 29, 2025',
    notes: 'Delivered and paid'
  },
  {
    trackingId: 808,
    orderId: 10051,
    deliveryPersonId: 7,
    deliveryStatus: 'Failed Delivery',
    assignedTime: 'May 29, 2025 - 01:00 PM',
    pickedUpTime: 'May 29, 2025 - 01:45 PM',
    onTheWayTime: 'May 29, 2025 - 02:30 PM',
    deliveredTime: 'May 29, 2025 - 03:15 PM',
    deliveryDate: 'May 29, 2025',
    notes: 'Customer unreachable at house'
  },
  {
    trackingId: 809,
    orderId: 10050,
    deliveryPersonId: 7,
    deliveryStatus: 'Delivered',
    assignedTime: 'May 28, 2025 - 10:00 AM',
    pickedUpTime: 'May 28, 2025 - 10:45 AM',
    onTheWayTime: 'May 28, 2025 - 11:30 AM',
    deliveredTime: 'May 28, 2025 - 12:30 PM',
    deliveryDate: 'May 28, 2025',
    notes: 'Delivered and paid'
  }
];

const initialReviews = [
  {
    reviewId: 1,
    userId: 4,
    productId: 3,
    rating: 5,
    comment: 'Exceptional leather quality! Smells genuine and fits perfectly. Shipping was very fast too.',
    createdAt: '2026-08-14'
  }
];

export const AppProvider = ({ children }) => {
  // Authentication state
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  // DB tables
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('users');
    if (!saved) return initialUsers;
    const parsed = JSON.parse(saved);
    // Sync initial demo users if missing
    const merged = [...parsed];
    initialUsers.forEach(iu => {
      if (!merged.some(u => u.email.toLowerCase() === iu.email.toLowerCase())) {
        merged.push(iu);
      }
    });
    return merged;
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [brands, setBrands] = useState(() => {
    const saved = localStorage.getItem('brands');
    return saved ? JSON.parse(saved) : initialBrands;
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('inventory');
    return saved ? JSON.parse(saved) : initialInventory;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('orders');
    if (!saved) return initialOrders;
    const parsed = JSON.parse(saved);
    const merged = [...parsed];
    initialOrders.forEach(io => {
      if (!merged.some(o => o.orderId === io.orderId)) {
        merged.push(io);
      }
    });
    return merged;
  });

  const [orderItems, setOrderItems] = useState(() => {
    const saved = localStorage.getItem('orderItems');
    if (!saved) return initialOrderItems;
    const parsed = JSON.parse(saved);
    const merged = [...parsed];
    initialOrderItems.forEach(ioi => {
      if (!merged.some(oi => oi.itemId === ioi.itemId)) {
        merged.push(ioi);
      }
    });
    return merged;
  });

  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('payments');
    if (!saved) return initialPayments;
    const parsed = JSON.parse(saved);
    const merged = [...parsed];
    initialPayments.forEach(ip => {
      if (!merged.some(p => p.paymentId === ip.paymentId)) {
        merged.push(ip);
      }
    });
    return merged;
  });

  const [deliveryTracking, setDeliveryTracking] = useState(() => {
    const saved = localStorage.getItem('deliveryTracking');
    if (!saved) return initialDeliveryTracking;
    const parsed = JSON.parse(saved);
    const merged = [...parsed];
    initialDeliveryTracking.forEach(idt => {
      if (!merged.some(dt => dt.trackingId === idt.trackingId)) {
        merged.push(idt);
      }
    });
    return merged;
  });

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('reviews');
    return saved ? JSON.parse(saved) : initialReviews;
  });

  // Shopping cart (Customer only)
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('brands', JSON.stringify(brands));
  }, [brands]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('orderItems', JSON.stringify(orderItems));
  }, [orderItems]);

  useEffect(() => {
    localStorage.setItem('payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('deliveryTracking', JSON.stringify(deliveryTracking));
  }, [deliveryTracking]);

  useEffect(() => {
    localStorage.setItem('reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Auth Operations
  const loginUser = (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // Match by email and flexible password check for demo simplicity
    const user = users.find(u => {
      const emailMatches = u.email.toLowerCase() === cleanEmail;
      if (!emailMatches) return false;

      // Allow exact passwordHash match, or standard demo passwords
      return u.passwordHash === cleanPass ||
             cleanPass === 'password123' ||
             (u.role === 'Admin' && cleanPass === 'admin123') ||
             (u.role === 'Seller' && cleanPass === 'seller123') ||
             (u.role === 'Customer' && cleanPass === 'customer123') ||
             (u.role === 'Delivery' && cleanPass === 'delivery123');
    });

    if (!user) return { success: false, message: 'Invalid email or password.' };
    if (user.role === 'Seller' && user.status === 'Pending') {
      return { success: false, message: 'Your seller account is pending administrator approval.' };
    }
    if (user.role === 'Seller' && user.status === 'Rejected') {
      return { success: false, message: 'Your seller account application was rejected.' };
    }
    if (user.status === 'Inactive') {
      return { success: false, message: 'Your account has been deactivated.' };
    }
    setCurrentUser(user);
    return { success: true, user };
  };

  const registerUser = (userData) => {
    const existing = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) return { success: false, message: 'Email already exists.' };

    const newId = users.length > 0 ? Math.max(...users.map(u => u.userId)) + 1 : 1;
    const newUser = {
      userId: newId,
      name: userData.name,
      email: userData.email,
      passwordHash: userData.password,
      role: userData.role || 'Customer',
      phone: userData.phone || '',
      address: userData.address || '',
      status: userData.role === 'Seller' ? 'Pending' : 'Active', // Sellers must be approved
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUsers(prev => [...prev, newUser]);
    return { success: true, user: newUser };
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setCart([]);
  };

  const updateProfile = (profileData) => {
    if (!currentUser) return { success: false, message: 'Not authenticated.' };
    
    // Update users table
    setUsers(prev => prev.map(u => {
      if (u.userId === currentUser.userId) {
        const updated = { ...u, ...profileData };
        setCurrentUser(updated); // Sync current session
        return updated;
      }
      return u;
    }));
    return { success: true };
  };

  // Cart Operations
  const addToCart = (product, qty = 1) => {
    const inv = inventory.find(i => i.productId === product.productId);
    const stock = inv ? inv.quantity : 0;
    
    const existingIndex = cart.findIndex(c => c.productId === product.productId);
    if (existingIndex > -1) {
      const newQty = cart[existingIndex].quantity + qty;
      if (newQty > stock) {
        return { success: false, message: `Only ${stock} items available in stock.` };
      }
      setCart(prev => prev.map((item, idx) => idx === existingIndex ? { ...item, quantity: newQty } : item));
    } else {
      if (qty > stock) {
        return { success: false, message: `Only ${stock} items available in stock.` };
      }
      setCart(prev => [...prev, { ...product, quantity: qty }]);
    }
    return { success: true };
  };

  const updateCartQty = (productId, qty) => {
    const inv = inventory.find(i => i.productId === productId);
    const stock = inv ? inv.quantity : 0;

    if (qty > stock) {
      return { success: false, message: `Only ${stock} items available in stock.` };
    }
    if (qty <= 0) {
      setCart(prev => prev.filter(c => c.productId !== productId));
    } else {
      setCart(prev => prev.map(c => c.productId === productId ? { ...c, quantity: qty } : c));
    }
    return { success: true };
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(c => c.productId !== productId));
  };

  const clearCart = () => setCart([]);

  // Seller Product/Inventory Operations
  const addProduct = (productData) => {
    if (!currentUser || currentUser.role !== 'Seller') return { success: false, message: 'Unauthorized' };
    
    const newProdId = products.length > 0 ? Math.max(...products.map(p => p.productId)) + 1 : 1;
    const newProduct = {
      productId: newProdId,
      sellerId: currentUser.userId,
      categoryId: parseInt(productData.categoryId),
      brandId: parseInt(productData.brandId),
      name: productData.name,
      description: productData.description,
      price: parseFloat(productData.price),
      discount: parseFloat(productData.discount || 0),
      image: productData.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop',
      createdAt: new Date().toISOString().split('T')[0]
    };

    const newInvId = inventory.length > 0 ? Math.max(...inventory.map(i => i.inventoryId)) + 1 : 1;
    const qty = parseInt(productData.stock || 0);
    const threshold = parseInt(productData.lowStockThreshold || 2);
    let status = 'Available';
    if (qty === 0) status = 'Out of Stock';
    else if (qty <= threshold) status = 'Low';

    const newInv = {
      inventoryId: newInvId,
      productId: newProdId,
      quantity: qty,
      lowStockThreshold: threshold,
      stockStatus: status,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setProducts(prev => [...prev, newProduct]);
    setInventory(prev => [...prev, newInv]);
    return { success: true, product: newProduct };
  };

  const updateProduct = (productId, productData) => {
    setProducts(prev => prev.map(p => p.productId === productId ? { ...p, ...productData } : p));
    return { success: true };
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.productId !== productId));
    setInventory(prev => prev.filter(i => i.productId !== productId));
    // also remove from cart just in case
    removeFromCart(productId);
    return { success: true };
  };

  const updateInventoryQuantity = (productId, quantity, threshold = null) => {
    setInventory(prev => prev.map(inv => {
      if (inv.productId === productId) {
        const q = parseInt(quantity);
        const t = threshold !== null ? parseInt(threshold) : inv.lowStockThreshold;
        let status = 'Available';
        if (q === 0) status = 'Out of Stock';
        else if (q <= t) status = 'Low';
        
        return {
          ...inv,
          quantity: q,
          lowStockThreshold: t,
          stockStatus: status,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return inv;
    }));
    return { success: true };
  };

  // Checkout & Ordering
  const checkoutOrder = (shippingInfo, paymentMethod) => {
    if (!currentUser) return { success: false, message: 'Please log in to purchase.' };
    if (cart.length === 0) return { success: false, message: 'Cart is empty.' };

    // 1. Inventory lock/verification (SDS Rule: Checkout must verify available inventory)
    for (const item of cart) {
      const inv = inventory.find(i => i.productId === item.productId);
      if (!inv || inv.quantity < item.quantity) {
        return { 
          success: false, 
          message: `Overselling prevented: "${item.name}" only has ${inv ? inv.quantity : 0} items in stock.` 
        };
      }
    }

    // 2. Reduce stock (SDS Rule: Stock reduction must prevent overselling)
    setInventory(prev => prev.map(inv => {
      const cartItem = cart.find(c => c.productId === inv.productId);
      if (cartItem) {
        const newQty = inv.quantity - cartItem.quantity;
        let status = 'Available';
        if (newQty === 0) status = 'Out of Stock';
        else if (newQty <= inv.lowStockThreshold) status = 'Low';
        return {
          ...inv,
          quantity: newQty,
          stockStatus: status,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return inv;
    }));

    // 3. Create Order
    const newOrderId = orders.length > 0 ? Math.max(...orders.map(o => o.orderId)) + 1 : 1001;
    const subtotal = cart.reduce((acc, item) => {
      const itemPrice = item.price * (1 - (item.discount || 0) / 100);
      return acc + (itemPrice * item.quantity);
    }, 0);
    const shippingFee = 100; // 100 ETB
    const totalAmount = subtotal + shippingFee;

    const newOrder = {
      orderId: newOrderId,
      userId: currentUser.userId,
      orderDate: new Date().toISOString().split('T')[0],
      totalAmount,
      orderStatus: 'Pending',
      deliveryAddress: `${shippingInfo.fullName}, ${shippingInfo.phone}, ${shippingInfo.city}, ${shippingInfo.subcity}, ${shippingInfo.woreda}, House ${shippingInfo.houseNum}`
    };

    // 4. Create Order Items
    const newItems = cart.map((item, idx) => ({
      itemId: (orderItems.length > 0 ? Math.max(...orderItems.map(oi => oi.itemId)) : 0) + idx + 1,
      orderId: newOrderId,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price * (1 - (item.discount || 0) / 100)
    }));

    // 5. Create Payment record (SDS Rule: Payment status is separate from order status)
    const newPaymentId = payments.length > 0 ? Math.max(...payments.map(p => p.paymentId)) + 1 : 501;
    const newPayment = {
      paymentId: newPaymentId,
      orderId: newOrderId,
      paymentMethod,
      transactionReference: paymentMethod === 'Chapa' ? `TXN-CHAPA-PENDING-${newOrderId}` : `TXN-COD-PENDING-${newOrderId}`,
      amount: totalAmount,
      paymentStatus: 'Pending', // both start as pending until verified/collected
      paymentDate: new Date().toISOString().split('T')[0]
    };

    // 6. Create Delivery record (SDS Rule: Delivery status is separate from order & payment)
    const newTrackingId = deliveryTracking.length > 0 ? Math.max(...deliveryTracking.map(dt => dt.trackingId)) + 1 : 801;
    const newDelivery = {
      trackingId: newTrackingId,
      orderId: newOrderId,
      deliveryPersonId: null, // admin must assign
      deliveryStatus: 'Assigned', // Awaiting assignment
      deliveryDate: null,
      notes: 'Awaiting admin configuration and assignment.'
    };

    setOrders(prev => [newOrder, ...prev]);
    setOrderItems(prev => [...prev, ...newItems]);
    setPayments(prev => [newPayment, ...prev]);
    setDeliveryTracking(prev => [newDelivery, ...prev]);
    clearCart();

    return { success: true, orderId: newOrderId };
  };

  // Payment Verification Actions
  const processChapaPayment = (orderId, status) => {
    // SDS Rule: Chapa payments require proper verification before being considered paid
    setPayments(prev => prev.map(p => {
      if (p.orderId === orderId && p.paymentMethod === 'Chapa') {
        return {
          ...p,
          paymentStatus: status,
          transactionReference: `TXN-CHAPA-VERIFIED-${Math.floor(100000 + Math.random() * 900000)}`,
          paymentDate: new Date().toISOString().split('T')[0]
        };
      }
      return p;
    }));

    if (status === 'Paid') {
      // Order status transitions to Confirmed once Chapa confirms Paid (per SDS workflow)
      setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, orderStatus: 'Confirmed' } : o));
    }
  };

  // Admin Order & Delivery Controls
  const adminConfirmOrder = (orderId) => {
    setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, orderStatus: 'Confirmed' } : o));
  };

  const adminCancelOrder = (orderId) => {
    // If order is cancelled, return the stock to inventory!
    const items = orderItems.filter(oi => oi.orderId === orderId);
    setInventory(prev => prev.map(inv => {
      const match = items.find(oi => oi.productId === inv.productId);
      if (match) {
        const newQty = inv.quantity + match.quantity;
        return {
          ...inv,
          quantity: newQty,
          stockStatus: newQty > inv.lowStockThreshold ? 'Available' : 'Low',
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return inv;
    }));

    setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, orderStatus: 'Cancelled' } : o));
    setPayments(prev => prev.map(p => p.orderId === orderId ? { ...p, paymentStatus: 'Refunded' } : p));
  };

  const assignDeliveryPerson = (orderId, deliveryPersonId) => {
    setDeliveryTracking(prev => prev.map(dt => {
      if (dt.orderId === orderId) {
        return {
          ...dt,
          deliveryPersonId: parseInt(deliveryPersonId),
          deliveryStatus: 'Assigned',
          notes: `Assigned to delivery agent ID: ${deliveryPersonId}`
        };
      }
      return dt;
    }));
  };

  // Delivery status management (by Admin or Delivery Agent)
  const updateDeliveryStatus = (orderId, newStatus, notes = '') => {
    setDeliveryTracking(prev => prev.map(dt => {
      if (dt.orderId === orderId) {
        return {
          ...dt,
          deliveryStatus: newStatus,
          deliveryDate: newStatus === 'Delivered' ? new Date().toISOString().split('T')[0] : dt.deliveryDate,
          notes: notes || `Status updated to ${newStatus}`
        };
      }
      return dt;
    }));

    // COD updates payment status to Paid upon Delivered
    if (newStatus === 'Delivered') {
      setPayments(prev => prev.map(p => {
        if (p.orderId === orderId && p.paymentMethod === 'COD') {
          return {
            ...p,
            paymentStatus: 'Paid',
            transactionReference: `TXN-COD-COLLECTED-${orderId}`,
            paymentDate: new Date().toISOString().split('T')[0]
          };
        }
        return p;
      }));
    }

    // SDS Rule: if delivery fails (Failed Delivery), the admin must choose Retry or Return.
    // When Return is selected, restore inventory stock
    if (newStatus === 'Returned') {
      const items = orderItems.filter(oi => oi.orderId === orderId);
      setInventory(prev => prev.map(inv => {
        const match = items.find(oi => oi.productId === inv.productId);
        if (match) {
          const newQty = inv.quantity + match.quantity;
          return {
            ...inv,
            quantity: newQty,
            stockStatus: newQty > inv.lowStockThreshold ? 'Available' : 'Low',
            updatedAt: new Date().toISOString().split('T')[0]
          };
        }
        return inv;
      }));
      setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, orderStatus: 'Cancelled' } : o));
    }
  };

  // Admin Seller management
  const updateSellerStatus = (sellerId, newStatus) => {
    setUsers(prev => prev.map(u => {
      if (u.userId === sellerId && u.role === 'Seller') {
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  // Category and Brand CRUD
  const addCategory = (name, icon) => {
    const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
    setCategories(prev => [...prev, { id: newId, name, icon, status: 'Active' }]);
  };
  const updateCategory = (id, name, icon, status) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, name, icon, status } : c));
  };
  const deleteCategory = (id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const addBrand = (name, description) => {
    const newId = brands.length > 0 ? Math.max(...brands.map(b => b.id)) + 1 : 1;
    setBrands(prev => [...prev, { id: newId, name, description }]);
  };
  const updateBrand = (id, name, description) => {
    setBrands(prev => prev.map(b => b.id === id ? { ...b, name, description } : b));
  };
  const deleteBrand = (id) => {
    setBrands(prev => prev.filter(b => b.id !== id));
  };

  // Reviews & Feedback
  const addReview = (productId, rating, comment) => {
    if (!currentUser) return { success: false, message: 'Please log in to leave a review.' };
    const newReviewId = reviews.length > 0 ? Math.max(...reviews.map(r => r.reviewId)) + 1 : 1;
    const newReview = {
      reviewId: newReviewId,
      userId: currentUser.userId,
      productId,
      rating: parseInt(rating),
      comment,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setReviews(prev => [newReview, ...prev]);
    return { success: true };
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      categories,
      brands,
      products,
      inventory,
      orders,
      orderItems,
      payments,
      deliveryTracking,
      reviews,
      cart,
      loginUser,
      registerUser,
      logoutUser,
      updateProfile,
      addToCart,
      updateCartQty,
      removeFromCart,
      clearCart,
      addProduct,
      updateProduct,
      deleteProduct,
      updateInventoryQuantity,
      checkoutOrder,
      processChapaPayment,
      adminConfirmOrder,
      adminCancelOrder,
      assignDeliveryPerson,
      updateDeliveryStatus,
      updateSellerStatus,
      addCategory,
      updateCategory,
      deleteCategory,
      addBrand,
      updateBrand,
      deleteBrand,
      addReview
    }}>
      {children}
    </AppContext.Provider>
  );
};
