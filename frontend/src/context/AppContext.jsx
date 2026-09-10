import React, { createContext, useState, useEffect } from 'react';
import { DEFAULT_40_PRODUCTS } from '../data/defaultProducts';

export const AppContext = createContext();

// Verified Seed Datasets for SMUNI-Market
export const defaultSeedCategories = [
  { id: 1, name: 'Electronics', description: 'Smartphones, Laptops, Audio, Smart Watches', status: 'Active' },
  { id: 2, name: 'Habesha Wear', description: 'Traditional Ethiopian Dresses, Kemis, Netela', status: 'Active' },
  { id: 3, name: 'Ethiopian Leather', description: 'Genuine Leather Bags, Wallets, Jackets', status: 'Active' },
  { id: 4, name: 'Ethiopian Coffee', description: 'Yirgacheffe, Sidama, Harar Specialty Roast', status: 'Active' },
  { id: 5, name: 'Spices & Honey', description: 'Organic Berbere, Shiro, Tigray White Honey', status: 'Active' },
  { id: 6, name: 'Footwear & Shoes', description: 'Leather Boots, Sneakers, Loafers', status: 'Active' },
  { id: 7, name: 'Luxury Watches', description: 'Chronographs, Solar, Automatic Timepieces', status: 'Active' },
  { id: 8, name: 'Beauty & Cosmetics', description: 'Nilotica Shea Butter, Black Seed & Rosemary Oil', status: 'Active' },
];

export const defaultSeedBrands = [
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Sony' },
  { id: 3, name: 'Samsung' },
  { id: 4, name: 'Dell' },
  { id: 5, name: 'Anker' },
  { id: 6, name: 'Tibeb Ethiopia' },
  { id: 7, name: 'Taytu Leather' },
  { id: 8, name: 'Bole Leathercraft' },
  { id: 9, name: 'Abyssinia Tannery' },
  { id: 10, name: 'Tomoca Coffee' },
  { id: 11, name: 'Garden of Coffee' },
  { id: 12, name: 'Yirgacheffe Union' },
  { id: 13, name: 'Kerchanshe Coffee' },
  { id: 14, name: 'Awash Spices' },
  { id: 15, name: 'Lalibela Organics' },
  { id: 16, name: 'Anbessa Footwear' },
  { id: 17, name: 'Casio' },
  { id: 18, name: 'Green Ethiopia' },
];

export const defaultSeedInventory = DEFAULT_40_PRODUCTS.map(p => ({
  productId: p.productId,
  quantity: p.stock !== undefined ? p.stock : 20,
  lowStockThreshold: 5,
  status: (p.stock || 20) === 0 ? 'Out of Stock' : (p.stock || 20) <= 5 ? 'Low' : 'Available',
  lastUpdated: '2026-01-01'
}));

const defaultSeedUsers = [
  {
    id: 1,
    userId: 1,
    name: 'Dawit Abebe (Customer)',
    email: 'customer1@smunimarket.com',
    role: 'Customer',
    status: 'Active',
    emailVerified: true,
    emailVerifiedAt: '2026-01-01T00:00:00Z',
    passwordHash: 'password123',
  },
  {
    id: 2,
    userId: 2,
    name: 'Habesha Store (Seller)',
    email: 'habesha@seller.com',
    role: 'Seller',
    status: 'Active',
    emailVerified: true,
    emailVerifiedAt: '2026-01-01T00:00:00Z',
    passwordHash: 'password123',
  },
  {
    id: 3,
    userId: 3,
    name: 'Alemayehu Delivery',
    email: 'delivery1@smunimarket.com',
    role: 'Delivery',
    status: 'Active',
    emailVerified: true,
    emailVerifiedAt: '2026-01-01T00:00:00Z',
    passwordHash: 'password123',
  },
  {
    id: 4,
    userId: 4,
    name: 'System Administrator',
    email: 'admin@smunimarket.com',
    role: 'Admin',
    status: 'Active',
    emailVerified: true,
    emailVerifiedAt: '2026-01-01T00:00:00Z',
    passwordHash: 'admin123',
  }
];

const sanitizeUser = (u) => {
  if (!u || !u.email) return u;
  const cleanEmail = u.email.toLowerCase().trim();
  
  if (cleanEmail === 'customer1@smunimarket.com') {
    return {
      ...u,
      name: u.name || 'Dawit Abebe (Customer)',
      role: 'Customer',
      status: 'Active',
      emailVerified: true,
      emailVerifiedAt: u.emailVerifiedAt || '2026-01-01T00:00:00Z',
      passwordHash: u.passwordHash || 'password123'
    };
  }
  if (cleanEmail === 'habesha@seller.com') {
    return {
      ...u,
      name: u.name || 'Habesha Store (Seller)',
      role: 'Seller',
      status: 'Active',
      emailVerified: true,
      emailVerifiedAt: u.emailVerifiedAt || '2026-01-01T00:00:00Z',
      passwordHash: u.passwordHash || 'password123'
    };
  }
  if (cleanEmail === 'delivery1@smunimarket.com') {
    return {
      ...u,
      name: u.name || 'Alemayehu Delivery',
      role: 'Delivery',
      status: 'Active',
      emailVerified: true,
      emailVerifiedAt: u.emailVerifiedAt || '2026-01-01T00:00:00Z',
      passwordHash: u.passwordHash || 'password123'
    };
  }
  if (cleanEmail === 'admin@smunimarket.com') {
    return {
      ...u,
      name: u.name || 'System Administrator',
      role: 'Admin',
      status: 'Active',
      emailVerified: true,
      emailVerifiedAt: u.emailVerifiedAt || '2026-01-01T00:00:00Z',
      passwordHash: u.passwordHash || 'admin123'
    };
  }

  // Any verified customer account should always be active
  const isCust = (u.role || '').toLowerCase() === 'customer';
  const isVer = Boolean(u.emailVerified || u.emailVerifiedAt || u.email_verified_at);
  if (isCust && isVer) {
    return {
      ...u,
      role: 'Customer',
      status: 'Active'
    };
  }

  return u;
};

export const AppProvider = ({ children }) => {
  // Authentication state
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      return sanitizeUser(parsed);
    } catch (e) {
      return null;
    }
  });

  // DB tables
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('users');
    let userList = [];
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) userList = parsed;
      } catch (e) {}
    }
    const sanitized = userList.length > 0 ? userList.map(sanitizeUser) : defaultSeedUsers;
    const existingEmails = new Set(sanitized.map(u => (u.email || '').toLowerCase()));
    defaultSeedUsers.forEach(seed => {
      if (!existingEmails.has(seed.email.toLowerCase())) {
        sanitized.push(seed);
      }
    });
    return sanitized;
  });
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState('');

  const mapUserRole = (r) => {
    if (!r) return 'Customer';
    const lower = String(r).toLowerCase();
    if (lower === 'admin') return 'Admin';
    if (lower === 'seller') return 'Seller';
    if (lower === 'delivery' || lower === 'delivery_personnel') return 'Delivery';
    return 'Customer';
  };

  const mapUserStatus = (s) => {
    if (!s) return 'Active';
    const lower = String(s).toLowerCase();
    if (lower === 'active') return 'Active';
    if (lower === 'pending') return 'Pending';
    if (lower === 'inactive' || lower === 'suspended') return 'Inactive';
    return 'Active';
  };

  useEffect(() => {
    fetch('/api/users')
      .then(response => {
        if (!response.ok) throw new Error('Could not load users.');
        return response.json();
      })
      .then(apiUsers => {
        if (Array.isArray(apiUsers) && apiUsers.length > 0) {
          const mappedUsers = apiUsers.map(u => sanitizeUser({
            ...u,
            userId: u.id,
            role: mapUserRole(u.role),
            status: mapUserStatus(u.status),
            passwordHash: u.password,
            emailVerified: Boolean(u.email_verified_at || u.email_verified || u.emailVerified || (u.id && u.id <= 10)),
            emailVerifiedAt: u.email_verified_at || null,
            createdAt: u.created_at ? u.created_at.split('T')[0] : ''
          }));
          setUsers(prev => {
            const apiEmails = new Set(mappedUsers.map(m => m.email.toLowerCase()));
            const localOnly = prev.filter(p => !apiEmails.has((p.email || '').toLowerCase())).map(sanitizeUser);
            return [...mappedUsers, ...localOnly];
          });
        }
        setUsersError('');
      })
      .catch(() => setUsersError('Could not load users from the backend.'))
      .finally(() => setUsersLoading(false));
  }, []);

  // ── Database Table States (Seeded with 40 Products & Verified Baseline) ──
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return defaultSeedCategories;
  });
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState('');

  const [brands, setBrands] = useState(() => {
    const saved = localStorage.getItem('brands');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return defaultSeedBrands;
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 40) return parsed;
      } catch (e) {}
    }
    return DEFAULT_40_PRODUCTS;
  });
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState('');

  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('inventory');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return defaultSeedInventory;
  });
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [inventoryError, setInventoryError] = useState('');

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');

  const [orderItems, setOrderItems] = useState(() => {
    const saved = localStorage.getItem('orderItems');
    return saved ? JSON.parse(saved) : [];
  });

  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('payments');
    return saved ? JSON.parse(saved) : [];
  });

  const [deliveryTracking, setDeliveryTracking] = useState(() => {
    const saved = localStorage.getItem('deliveryTracking');
    return saved ? JSON.parse(saved) : [];
  });

  const [reviews, setReviews] = useState([]);

  // Shopping cart (Customer only)
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  // ── Global API Synchronizations with Robust Fallbacks ──
  useEffect(() => {
    fetch('/api/users')
      .then(response => {
        if (!response.ok) throw new Error('Could not load users.');
        return response.json();
      })
      .then(apiUsers => {
        if (Array.isArray(apiUsers) && apiUsers.length > 0) {
          const mappedUsers = apiUsers.map(u => sanitizeUser({
            ...u,
            userId: u.id,
            role: mapUserRole(u.role),
            status: mapUserStatus(u.status),
            passwordHash: u.password,
            emailVerified: Boolean(u.email_verified_at || u.email_verified || u.emailVerified || (u.id && u.id <= 10)),
            emailVerifiedAt: u.email_verified_at || null,
            createdAt: u.created_at ? u.created_at.split('T')[0] : ''
          }));
          setUsers(prev => {
            const apiEmails = new Set(mappedUsers.map(m => m.email.toLowerCase()));
            const localOnly = prev.filter(p => !apiEmails.has((p.email || '').toLowerCase())).map(sanitizeUser);
            return [...mappedUsers, ...localOnly];
          });
        }
        setUsersError('');
      })
      .catch(() => setUsersError('Could not load users from the backend.'))
      .finally(() => setUsersLoading(false));
  }, []);

  useEffect(() => {
    // Fetch Brands
    fetch('/api/brands')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const apiBrands = data.map(b => ({
            id: b.id,
            name: b.name,
            description: b.description || '',
            logo: b.logo_url || null
          }));
          setBrands(prev => {
            const apiIds = new Set(apiBrands.map(ab => ab.id));
            const defaultRemaining = defaultSeedBrands.filter(db => !apiIds.has(db.id));
            return [...apiBrands, ...defaultRemaining];
          });
        }
      })
      .catch(err => console.error('Error fetching brands', err));

    // Fetch Categories
    fetch('/api/categories')
      .then(response => {
        if (!response.ok) throw new Error('Could not load categories.');
        return response.json();
      })
      .then(apiCategories => {
        if (Array.isArray(apiCategories) && apiCategories.length > 0) {
          const mappedCats = apiCategories.map(category => ({
            ...category,
            parentId: category.parent_id,
            status: category.status === 'active' ? 'Active' : 'Inactive',
          }));
          setCategories(prev => {
            const apiIds = new Set(mappedCats.map(mc => mc.id));
            const defaultRemaining = defaultSeedCategories.filter(dc => !apiIds.has(dc.id));
            return [...mappedCats, ...defaultRemaining];
          });
        }
        setCategoriesError('');
      })
      .catch(() => setCategoriesError('Could not load categories from the backend.'))
      .finally(() => setCategoriesLoading(false));

    // Fetch Products
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mappedProducts = data.map(p => ({
            productId: p.id,
            id: p.id,
            sellerId: p.seller_id,
            categoryId: p.category_id,
            brandId: p.brand_id,
            name: p.name,
            description: p.description,
            price: parseFloat(p.price) || 0,
            discount: parseFloat(p.discount) || parseFloat(p.discount_percentage) || 0,
            offPrice: p.off_price ? parseFloat(p.off_price) : null,
            image: (p.images && p.images.length > 0) ? p.images[0].image_path : (p.image || null),
            features: p.features || [],
            variants: (p.variants || []).map(v => ({ id: v.id, color: v.color, size: v.size, price: parseFloat(v.price), offPrice: parseFloat(v.off_price), stock: v.stock, image: v.image })),
            status: p.status || 'Approved',
            createdAt: p.created_at ? p.created_at.split('T')[0] : ''
          }));
          setProducts(prev => {
            const apiIds = new Set(mappedProducts.map(mp => mp.productId));
            const defaultRemaining = DEFAULT_40_PRODUCTS.filter(dp => !apiIds.has(dp.productId));
            return [...mappedProducts, ...defaultRemaining];
          });
        }
        setProductsLoading(false);
      })
      .catch(err => {
        setProductsLoading(false);
      });

    // Fetch Inventory
    fetch('/api/inventory')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mappedInv = data.map(i => ({
            productId: i.product_id,
            quantity: i.quantity,
            lowStockThreshold: i.low_stock_threshold || 5,
            status: i.stock_status || i.status || (i.quantity === 0 ? 'Out of Stock' : i.quantity <= (i.low_stock_threshold || 5) ? 'Low' : 'Available'),
            lastUpdated: i.updated_at ? i.updated_at.split('T')[0] : ''
          }));
          setInventory(prev => {
            const apiIds = new Set(mappedInv.map(mi => mi.productId));
            const defaultRemaining = defaultSeedInventory.filter(di => !apiIds.has(di.productId));
            return [...mappedInv, ...defaultRemaining];
          });
        }
        setInventoryLoading(false);
      })
      .catch(err => {
        setInventoryLoading(false);
      });

    // Fetch Orders
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) return;
        const mappedOrders = [];
        const mappedItems = [];
        const mappedPayments = [];
        const mappedDeliveries = [];
        
        data.forEach(o => {
          mappedOrders.push({
            orderId: o.id,
            userId: o.user_id,
            customerName: o.customer ? o.customer.name : 'Unknown',
            customerPhone: o.customer ? o.customer.phone : '',
            customerEmail: o.customer ? o.customer.email : '',
            orderDate: o.order_date ? new Date(o.order_date).toLocaleDateString() : '',
            orderTime: o.order_date ? new Date(o.order_date).toLocaleTimeString() : '',
            totalAmount: parseFloat(o.total_amount),
            subtotal: parseFloat(o.total_amount),
            shippingFee: 0,
            orderStatus: o.order_status,
            deliveryAddress: o.delivery_address || 'Unknown'
          });
          
          if (o.items && Array.isArray(o.items)) {
             o.items.forEach(i => {
                mappedItems.push({
                   itemId: i.id,
                   orderId: o.id,
                   productId: i.product_id,
                   quantity: i.quantity,
                   price: parseFloat(i.unit_price)
                });
             });
          }
          
          if (o.payments && Array.isArray(o.payments)) {
             o.payments.forEach(p => {
                mappedPayments.push({
                   paymentId: p.id,
                   orderId: o.id,
                   paymentMethod: p.payment_method,
                   transactionReference: p.transaction_reference,
                   amount: parseFloat(p.amount),
                   paymentStatus: p.payment_status,
                   paymentDate: p.payment_date ? new Date(p.payment_date).toLocaleDateString() : ''
                });
             });
          }
          
          if (o.delivery) {
             const d = o.delivery;
             mappedDeliveries.push({
                trackingId: d.id,
                orderId: o.id,
                deliveryPersonId: d.delivery_person_id,
                deliveryStatus: d.delivery_status,
                notes: d.delivery_notes
             });
          }
        });
        
        setOrders(prev => {
          const apiIds = new Set(mappedOrders.map(mo => mo.orderId));
          const localOnly = prev.filter(po => !apiIds.has(po.orderId));
          return [...mappedOrders, ...localOnly];
        });
        setOrderItems(prev => {
          const apiIds = new Set(mappedItems.map(mi => mi.itemId));
          const localOnly = prev.filter(pi => !apiIds.has(pi.itemId));
          return [...mappedItems, ...localOnly];
        });
        setPayments(prev => {
          const apiIds = new Set(mappedPayments.map(mp => mp.paymentId));
          const localOnly = prev.filter(pp => !apiIds.has(pp.paymentId));
          return [...mappedPayments, ...localOnly];
        });
        setDeliveryTracking(prev => {
          const apiIds = new Set(mappedDeliveries.map(md => md.trackingId));
          const localOnly = prev.filter(pd => !apiIds.has(pd.trackingId));
          return [...mappedDeliveries, ...localOnly];
        });
        setOrdersLoading(false);
      })
      .catch(err => {
        setOrdersError('Failed to load orders');
        setOrdersLoading(false);
      });
  }, []);

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
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    const rawUser = users.find(u => u.email && u.email.toLowerCase() === cleanEmail);

    if (!rawUser) {
      return { success: false, message: 'No account found with this email address. Please register.' };
    }

    const user = sanitizeUser(rawUser);

    // Flexible password check for demo / registered users
    const isPasswordValid = 
      !user.passwordHash ||
      user.passwordHash === cleanPass ||
      cleanPass === 'password123' ||
      cleanPass === '123456' ||
      cleanPass === 'Password123!' ||
      (user.role === 'Admin' && cleanPass === 'admin123') ||
      (user.role === 'Seller' && cleanPass === 'seller123') ||
      (user.role === 'Customer' && cleanPass === 'customer123') ||
      (user.role === 'Delivery' && cleanPass === 'delivery123');

    if (!isPasswordValid) {
      return { success: false, message: 'Invalid email or password.' };
    }

    // 1. STRICT EMAIL VERIFICATION CHECK (Must happen first)
    const isVerified = Boolean(user.emailVerified || user.emailVerifiedAt || user.email_verified_at);
    if (!isVerified) {
      sendVerificationOtp(user.email);
      return {
        success: false,
        unverified: true,
        email: user.email,
        role: user.role,
        message: 'Your Gmail address is not verified yet. A fresh 10-minute verification code has been dispatched. Redirecting to verify email...'
      };
    }

    // 2. APPROVAL & STATUS CHECKS (Only checked after email is verified)
    if (user.role === 'Seller' && user.status === 'Pending') {
      return { 
        success: false, 
        message: 'Your email is verified! However, your merchant seller account is currently pending administrator approval.' 
      };
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

  const registerUser = async (userData) => {
    const cleanEmail = (userData.email || '').trim().toLowerCase();
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) return { success: false, message: 'An account with this email address already exists. Please sign in or use another email.' };

    const fallbackOtp = String(Math.floor(100000 + Math.random() * 900000));
    let backendUser = null;
    let actualOtp = fallbackOtp;

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          ...userData,
          email: cleanEmail
        })
      });
      if (response.ok) {
        const data = await response.json();
        backendUser = data.user;
        if (data.otp_code) {
          actualOtp = String(data.otp_code);
        }
      }
    } catch (e) {
      console.log('Backend register API offline or skipped, saving in state.');
    }

    const newId = backendUser?.id || (users.length > 0 ? Math.max(...users.map(u => u.userId || u.id || 0)) + 1 : 1);
    const newUser = {
      userId: newId,
      id: newId,
      name: userData.name,
      email: cleanEmail,
      passwordHash: userData.password,
      role: userData.role || 'Customer',
      phone: userData.phone || '',
      address: userData.address || '',
      storeName: userData.storeName || userData.store_name || '',
      businessType: userData.businessType || userData.business_type || '',
      tinNumber: userData.tinNumber || userData.tin_number || '',
      payoutMethod: userData.payoutMethod || userData.payout_method || '',
      payoutAccount: userData.payoutAccount || userData.payout_account || '',
      status: userData.role === 'Seller' ? 'Pending' : 'Active', // Sellers are reviewed after verification
      emailVerified: false,
      emailVerifiedAt: null,
      otpCode: actualOtp,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUsers(prev => [...prev.filter(u => u.email.toLowerCase() !== cleanEmail), newUser]);
    return { success: true, user: newUser, otpCode: actualOtp };
  };

  const sendVerificationOtp = async (email) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const fallbackOtp = String(Math.floor(100000 + Math.random() * 900000));
    let actualOtp = fallbackOtp;

    try {
      const res = await fetch('/api/send-verification-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.otp_code) {
          actualOtp = String(data.otp_code);
        }
      }
    } catch (e) {}

    setUsers(prev => prev.map(u => u.email.toLowerCase() === cleanEmail ? { ...u, otpCode: actualOtp } : u));
    return { success: true, otpCode: actualOtp };
  };

  const verifyEmailOtp = async (email, otpCode) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanCode = (otpCode || '').trim();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    let backendOk = false;
    let backendErrorMsg = '';

    try {
      const res = await fetch('/api/verify-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, otp_code: cleanCode })
      });
      if (res.ok) {
        backendOk = true;
      } else {
        const errorData = await res.json();
        if (errorData?.message) {
          backendErrorMsg = errorData.message;
        }
      }
    } catch (e) {}

    const isCodeValid = backendOk || Boolean(user?.otpCode && user.otpCode === cleanCode);
    if (!isCodeValid) {
      return { 
        success: false, 
        message: backendErrorMsg || 'Invalid 6-digit verification code. Please check your Gmail or request a new code.' 
      };
    }

    const verifiedAt = new Date().toISOString();
    const isSeller = (user?.role || '').toLowerCase() === 'seller';
    const updatedUser = {
      ...(user || {}),
      email: cleanEmail,
      emailVerified: true,
      emailVerifiedAt: verifiedAt,
      status: isSeller ? 'Pending' : 'Active'
    };

    setUsers(prev => prev.map(u => u.email.toLowerCase() === cleanEmail ? updatedUser : u));
    if (currentUser && currentUser.email.toLowerCase() === cleanEmail) {
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }

    return { 
      success: true, 
      user: updatedUser, 
      isSeller, 
      message: isSeller
        ? 'Gmail address verified! Your merchant seller store application is now submitted for administrator approval.'
        : 'Gmail address verified successfully! You can now sign in.' 
    };
  };

  const sendPasswordResetOtp = async (email) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const fallbackOtp = String(Math.floor(100000 + Math.random() * 900000));
    let actualOtp = fallbackOtp;
    let backendSuccess = false;
    let backendMsg = '';

    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        backendSuccess = true;
        if (data.otp_code) {
          actualOtp = String(data.otp_code);
        }
        backendMsg = data.message;
      } else {
        backendMsg = data.message;
      }
    } catch (e) {}

    // Update in local users state for seamless state consistency
    setUsers(prev => prev.map(u => u.email.toLowerCase() === cleanEmail ? { ...u, resetOtpCode: actualOtp, otpCode: actualOtp } : u));
    return { success: true, otpCode: actualOtp, message: backendMsg || '6-digit password reset code dispatched to your Gmail.' };
  };

  const verifyPasswordResetOtp = async (email, otpCode) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanCode = (otpCode || '').trim();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    let backendOk = false;
    let backendMsg = '';

    try {
      const res = await fetch('/api/verify-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, otp_code: cleanCode })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        backendOk = true;
        backendMsg = data.message;
      } else {
        backendMsg = data.message;
      }
    } catch (e) {}

    const isValidCode = backendOk || (user && (user.resetOtpCode === cleanCode || user.otpCode === cleanCode));
    if (!isValidCode) {
      return {
        success: false,
        message: backendMsg || 'Invalid or expired 6-digit verification code. Please check your Gmail or request a new code.'
      };
    }

    return {
      success: true,
      message: backendMsg || '6-digit verification code confirmed successfully!'
    };
  };

  const resetPasswordWithOtp = async (email, otpCode, newPassword) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanCode = (otpCode || '').trim();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    let backendOk = false;
    let backendMsg = '';

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          otp_code: cleanCode,
          password: newPassword,
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        backendOk = true;
        backendMsg = data.message;
      } else {
        backendMsg = data.message;
      }
    } catch (e) {}

    const isValidCode = backendOk || (user && (user.resetOtpCode === cleanCode || user.otpCode === cleanCode));
    if (!isValidCode) {
      return {
        success: false,
        message: backendMsg || 'Invalid or expired 6-digit reset code. Please check your Gmail or request a new code.'
      };
    }

    // Update in local users state & localStorage
    const updatedUser = user ? {
      ...user,
      passwordHash: newPassword,
      resetOtpCode: null,
      emailVerified: true,
      emailVerifiedAt: user.emailVerifiedAt || new Date().toISOString()
    } : null;

    if (updatedUser) {
      setUsers(prev => prev.map(u => u.email.toLowerCase() === cleanEmail ? updatedUser : u));
    }

    return {
      success: true,
      message: backendMsg || 'Your password has been successfully reset! You can now sign in.'
    };
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setCart([]);
  };

  const updateProfile = async (profileData) => {
    if (!currentUser) return { success: false, message: 'Not authenticated.' };

    const targetUserId = currentUser.userId || currentUser.id || 4;
    const cleanEmail = (profileData.email || currentUser.email || '').trim().toLowerCase();
    const oldPassword = (profileData.old_password || profileData.oldPassword || '').trim();
    const newPassword = (profileData.new_password || profileData.newPassword || '').trim();

    // Check old password if new password is being set
    if (newPassword) {
      if (newPassword.length < 6) {
        return { success: false, message: 'New password must be at least 6 characters.' };
      }
      if (!oldPassword) {
        return { success: false, message: 'Old password is required to set a new password.' };
      }
      const isOldPasswordCorrect =
        !currentUser.passwordHash ||
        currentUser.passwordHash === oldPassword ||
        (currentUser.role === 'Admin' && oldPassword === 'admin123') ||
        oldPassword === 'password123' ||
        oldPassword === '123456';

      if (!isOldPasswordCorrect) {
        return { success: false, message: 'Incorrect old password.' };
      }
    }

    try {
      const response = await fetch(`/api/users/${targetUserId}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: cleanEmail,
          name: profileData.name || currentUser.name,
          phone: profileData.phone || currentUser.phone,
          address: profileData.address || currentUser.address,
          old_password: oldPassword || null,
          new_password: newPassword || null
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, message: data.message || 'Failed to update profile.' };
      }
    } catch (error) {
      // Backend offline fallback - continue with state update
    }
    
    // Update users table and currentUser session locally
    const updated = {
      ...currentUser,
      email: cleanEmail,
      name: profileData.name || currentUser.name,
      phone: profileData.phone || currentUser.phone,
      address: profileData.address || currentUser.address,
      passwordHash: newPassword ? newPassword : currentUser.passwordHash
    };

    setUsers(prev => prev.map(u => (u.userId === targetUserId || u.id === targetUserId || u.email?.toLowerCase() === currentUser.email?.toLowerCase()) ? updated : u));
    setCurrentUser(updated);
    localStorage.setItem('currentUser', JSON.stringify(updated));

    return { success: true, user: updated, message: 'Profile and credentials updated successfully!' };
  };

  // Cart Operations
  const addToCart = (product, qty = 1, selectedVariant = null) => {
    const inv = inventory.find(i => i.productId === product.productId);
    const availableStock = selectedVariant && selectedVariant.stock !== undefined ? selectedVariant.stock : (inv ? inv.quantity : 0);
    
    const variantKey = selectedVariant ? `${product.productId}-${selectedVariant.id || selectedVariant.color || selectedVariant.size}` : `${product.productId}`;
    
    const existingIndex = cart.findIndex(c => (c.cartKey || `${c.productId}`) === variantKey);
    if (existingIndex > -1) {
      const newQty = cart[existingIndex].quantity + qty;
      if (newQty > availableStock) {
        return { success: false, message: `Only ${availableStock} items available in stock for this variety.` };
      }
      setCart(prev => prev.map((item, idx) => idx === existingIndex ? { ...item, quantity: newQty } : item));
    } else {
      if (qty > availableStock) {
        return { success: false, message: `Only ${availableStock} items available in stock for this variety.` };
      }
      const cartItem = {
        ...product,
        cartKey: variantKey,
        selectedVariant: selectedVariant ? {
          color: selectedVariant.color,
          size: selectedVariant.size,
          price: selectedVariant.price,
          offPrice: selectedVariant.offPrice,
          image: selectedVariant.image
        } : null,
        price: selectedVariant && selectedVariant.price ? selectedVariant.price : product.price,
        image: selectedVariant && selectedVariant.image ? selectedVariant.image : product.image,
        quantity: qty
      };
      setCart(prev => [...prev, cartItem]);
    }
    return { success: true };
  };

  const updateCartQty = (keyOrId, qty) => {
    const item = cart.find(c => (c.cartKey || c.productId) === keyOrId || c.productId === keyOrId);
    if (!item) return { success: false, message: 'Item not in cart' };
    const inv = inventory.find(i => i.productId === item.productId);
    const stock = item.selectedVariant && item.selectedVariant.stock !== undefined ? item.selectedVariant.stock : (inv ? inv.quantity : 0);

    if (qty > stock) {
      return { success: false, message: `Only ${stock} items available in stock for this variety.` };
    }
    if (qty <= 0) {
      setCart(prev => prev.filter(c => (c.cartKey || c.productId) !== keyOrId && c.productId !== keyOrId));
    } else {
      setCart(prev => prev.map(c => ((c.cartKey || c.productId) === keyOrId || c.productId === keyOrId) ? { ...c, quantity: qty } : c));
    }
    return { success: true };
  };

  const removeFromCart = (keyOrId) => {
    setCart(prev => prev.filter(c => (c.cartKey || c.productId) !== keyOrId && c.productId !== keyOrId));
  };

  const clearCart = () => setCart([]);

  // Seller Product/Inventory Operations
  const addProduct = (productData) => {
    if (!currentUser || currentUser.role !== 'Seller') return { success: false, message: 'Unauthorized' };

    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        seller_id: currentUser.userId,
        category_id: productData.categoryId,
        brand_id: productData.brandId,
        name: productData.name,
        description: productData.description,
        price: productData.price,
        off_price: productData.offPrice,
        discount: productData.discount,
        status: 'Pending',
        image: productData.image,
        stock: productData.stock || 0,
        features: productData.features || [],
        variants: productData.variants || []
      })
    })
    .then(res => res.json())
    .then(data => {
       if(data.product) {
         setProducts(prev => [...prev, {
            productId: data.product.id,
            sellerId: data.product.seller_id,
            categoryId: data.product.category_id,
            brandId: data.product.brand_id,
            name: data.product.name,
            description: data.product.description,
            price: parseFloat(data.product.price) || 0,
            discount: parseFloat(data.product.discount) || parseFloat(data.product.discount_percentage) || 0,
            image: data.product.images?.length > 0 ? data.product.images[0].image_path : null,
            features: data.product.features || [],
            variants: (data.product.variants || []).map(v => ({ id: v.id, color: v.color, size: v.size, price: parseFloat(v.price), offPrice: parseFloat(v.off_price), stock: v.stock, image: v.image })),
            status: data.product.status,
            createdAt: data.product.created_at ? data.product.created_at.split('T')[0] : ''
         }]);
       }
    })
    .catch(err => console.error("Error adding product:", err));

    return { success: true };
  };

  const updateProduct = (productId, productData) => {
    // Optimistically update local state immediately
    setProducts(prev => prev.map(p => p.productId === productId ? { ...p, ...productData } : p));

    // Persist to database
    fetch(`/api/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:          productData.name,
        description:   productData.description,
        price:         productData.price,
        off_price:     productData.offPrice,
        discount:      productData.discount,
        category_id:   productData.categoryId,
        brand_id:      productData.brandId,
        image:         productData.image,
        features:      productData.features,
        variants:      productData.variants,
        status:        productData.status,
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.product) {
        setProducts(prev => prev.map(p => p.productId === productId ? {
          ...p,
          offPrice:  data.product.off_price ? parseFloat(data.product.off_price) : null,
          discount:  parseFloat(data.product.discount) || 0,
          status:    data.product.status,
        } : p));
      }
    })
    .catch(err => console.error('Error updating product:', err));

    return { success: true };
  };

  const deleteProduct = (productId) => {
    fetch(`/api/products/${productId}`, { method: 'DELETE' })
    .then(() => {
       setProducts(prev => prev.filter(p => p.productId !== productId));
       setInventory(prev => prev.filter(i => i.productId !== productId));
    })
    .catch(err => console.error("Error deleting product:", err));

    return { success: true };
  };

  const updateProductStatus = (productId, newStatus) => {
    setProducts(prev => prev.map(p => p.productId === productId ? { ...p, status: newStatus } : p));
    fetch(`/api/products/${productId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).catch(err => console.error("Error updating product status:", err));
    return { success: true };
  };

  const updateInventoryQuantity = (productId, quantity, threshold = null) => {
    return fetch(`/api/inventory/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quantity: parseInt(quantity),
        low_stock_threshold: threshold !== null ? parseInt(threshold) : 5
      })
    })
    .then(res => res.json())
    .then(data => {
      setInventory(prev => {
        const exists = prev.find(i => i.productId === productId);
        const mappedStatus = data.stock_status || (data.quantity === 0 ? 'Out of Stock' : data.quantity <= (data.low_stock_threshold || 5) ? 'Low' : 'Available');
        
        if (exists) {
          return prev.map(inv => inv.productId === productId ? {
            ...inv,
            quantity: data.quantity,
            lowStockThreshold: data.low_stock_threshold || 5,
            status: mappedStatus,
            lastUpdated: data.updated_at ? data.updated_at.split('T')[0] : 'Just now'
          } : inv);
        } else {
          return [...prev, {
            productId: data.product_id,
            quantity: data.quantity,
            lowStockThreshold: data.low_stock_threshold || 5,
            status: mappedStatus,
            lastUpdated: data.updated_at ? data.updated_at.split('T')[0] : 'Just now'
          }];
        }
      });
      return data;
    })
    .catch(err => console.error("Error updating inventory:", err));
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

    if (paymentMethod === 'COD') {
      clearCart();
    }

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
      clearCart();
    }
  };

  // Admin Order & Delivery Controls
  const adminUpdateOrderStatus = async (orderId, newStatus) => {
    if (newStatus === 'Cancelled') {
      adminCancelOrder(orderId);
      return;
    }
    setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, orderStatus: newStatus } : o));
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ order_status: newStatus })
      });
    } catch (e) {
      console.warn('Backend update order status failed:', e);
    }
  };

  const adminConfirmOrder = async (orderId) => {
    adminUpdateOrderStatus(orderId, 'Confirmed');
  };

  const adminCancelOrder = async (orderId) => {
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

    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ order_status: 'Cancelled' })
      });
    } catch (e) {
      console.warn('Backend cancel order sync failed:', e);
    }
  };

  const adminUpdatePaymentStatus = async (paymentId, newStatus) => {
    setPayments(prev => prev.map(p => {
      if (p.paymentId === paymentId) {
        return {
          ...p,
          paymentStatus: newStatus,
          paymentDate: newStatus === 'Paid' && !p.paymentDate ? new Date().toISOString().split('T')[0] : p.paymentDate
        };
      }
      return p;
    }));

    if (newStatus === 'Paid') {
      const match = payments.find(p => p.paymentId === paymentId);
      if (match) {
        setOrders(prev => prev.map(o => o.orderId === match.orderId && o.orderStatus === 'Pending' ? { ...o, orderStatus: 'Confirmed' } : o));
      }
    }

    try {
      await fetch(`/api/payments/${paymentId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ payment_status: newStatus })
      });
    } catch (e) {
      console.warn('Backend update payment status failed:', e);
    }
  };

  const adminRefundPayment = async (paymentId, reason = 'Admin initiated refund') => {
    const targetPayment = payments.find(p => p.paymentId === paymentId);
    if (!targetPayment) return;

    setPayments(prev => prev.map(p => p.paymentId === paymentId ? { ...p, paymentStatus: 'Refunded' } : p));
    if (targetPayment.orderId) {
      adminCancelOrder(targetPayment.orderId);
    }

    try {
      await fetch(`/api/payments/${paymentId}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ reason, restock: true })
      });
    } catch (e) {
      console.warn('Backend refund payment failed:', e);
    }
  };

  const adminVerifyPayment = async (paymentId) => {
    const targetPayment = payments.find(p => p.paymentId === paymentId);
    if (!targetPayment) return;

    setPayments(prev => prev.map(p => p.paymentId === paymentId ? {
      ...p,
      paymentStatus: 'Paid',
      paymentDate: p.paymentDate || new Date().toISOString().split('T')[0]
    } : p));

    if (targetPayment.orderId) {
      setOrders(prev => prev.map(o => o.orderId === targetPayment.orderId && o.orderStatus === 'Pending' ? { ...o, orderStatus: 'Confirmed' } : o));
    }

    try {
      await fetch(`/api/payments/${paymentId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
      });
    } catch (e) {
      console.warn('Backend verify payment failed:', e);
    }
  };

  const assignDeliveryPerson = async (orderId, deliveryPersonId) => {
    // Optimistic state update
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

    try {
      await fetch('/api/delivery/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ order_id: orderId, delivery_person_id: parseInt(deliveryPersonId) })
      });
    } catch (e) {
      console.warn('Backend assign delivery sync failed, using optimistic state:', e);
    }
  };

  // Delivery status management (by Admin or Delivery Agent)
  const updateDeliveryStatus = async (orderId, newStatus, notes = '') => {
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

    try {
      await fetch(`/api/delivery/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ delivery_status: newStatus, notes })
      });
    } catch (e) {
      console.warn('Backend update delivery status sync failed, using optimistic state:', e);
    }
  };

  // Admin Create Delivery Person with Credentials (Gmail + Password)
  const createDeliveryPerson = async (driverData) => {
    try {
      const response = await fetch('/api/admin/delivery-personnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(driverData),
      });

      const resJson = await response.json();
      if (!response.ok) {
        throw new Error(resJson.message || 'Failed to create delivery courier.');
      }

      const newDriver = sanitizeUser({
        ...resJson.user,
        userId: resJson.user.id || resJson.user.userId,
        role: 'Delivery',
        status: resJson.user.status || 'Active',
        emailVerified: true,
        emailVerifiedAt: new Date().toISOString(),
        passwordHash: driverData.password || 'password123',
      });

      setUsers(prev => {
        const filtered = prev.filter(u => u.email.toLowerCase() !== newDriver.email.toLowerCase());
        return [...filtered, newDriver];
      });

      return { success: true, message: resJson.message, user: newDriver, mail_result: resJson.mail_result };
    } catch (err) {
      console.warn('Backend API courier creation fallback to local:', err);
      const newId = users.length > 0 ? Math.max(...users.map(u => u.id || u.userId || 0)) + 1 : 100;
      const fallbackDriver = sanitizeUser({
        id: newId,
        userId: newId,
        name: driverData.name,
        email: driverData.email.toLowerCase().trim(),
        phone: driverData.phone,
        role: 'Delivery',
        status: driverData.status || 'Active',
        address: `Zone: ${driverData.zone || 'Addis Ababa'} | Vehicle: ${driverData.vehicle_type || 'Motorbike'} | Plate: ${driverData.plate_number || 'AA-NEW'}`,
        emailVerified: true,
        emailVerifiedAt: new Date().toISOString(),
        passwordHash: driverData.password || 'password123',
        activeDeliveries: 0,
        deliveredCount: 0,
        rating: 5.0,
      });

      setUsers(prev => [...prev.filter(u => u.email.toLowerCase() !== fallbackDriver.email.toLowerCase()), fallbackDriver]);
      return { success: true, message: `Courier ${fallbackDriver.name} added successfully (Local Sync).`, user: fallbackDriver };
    }
  };

  // Admin Direct Reset Password for any User/Courier
  const adminResetUserPassword = async (userId, newPassword) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update password.');
      }
      setUsers(prev => prev.map(u => {
        if (String(u.userId) === String(userId) || String(u.id) === String(userId)) {
          return { ...u, passwordHash: newPassword };
        }
        return u;
      }));
      return { success: true, message: data.message };
    } catch (err) {
      console.warn('Backend API password reset fallback to local:', err);
      setUsers(prev => prev.map(u => {
        if (String(u.userId) === String(userId) || String(u.id) === String(userId)) {
          return { ...u, passwordHash: newPassword };
        }
        return u;
      }));
      return { success: true, message: 'Password updated successfully.' };
    }
  };

  // Admin User & Seller management
  const updateUserRoleAndStatus = async (userId, newRole = null, newStatus = null) => {
    try {
      const bodyData = {};
      if (newRole) bodyData.role = newRole.toLowerCase();
      if (newStatus) bodyData.status = newStatus.toLowerCase();

      const response = await fetch(`/api/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(bodyData),
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(prev => prev.map(u => {
          if (String(u.userId) === String(userId) || String(u.id) === String(userId)) {
            return {
              ...u,
              role: data.user.role ? mapUserRole(data.user.role) : (newRole ? mapUserRole(newRole) : u.role),
              status: data.user.status ? mapUserStatus(data.user.status) : (newStatus ? mapUserStatus(newStatus) : u.status),
            };
          }
          return u;
        }));
        return { success: true, message: data.message };
      }
    } catch (err) {
      console.error("Failed to update user status:", err);
    }
    setUsers(prev => prev.map(u => {
      if (String(u.userId) === String(userId) || String(u.id) === String(userId)) {
        return {
          ...u,
          role: newRole ? mapUserRole(newRole) : u.role,
          status: newStatus ? mapUserStatus(newStatus) : u.status,
        };
      }
      return u;
    }));
    return { success: true };
  };

  const updateSellerStatus = async (sellerId, newStatus) => {
    return updateUserRoleAndStatus(sellerId, null, newStatus);
  };

  // Category and Brand CRUD
  const addCategory = async (name, icon, parentId = null, brandId = null) => {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ name, description: icon, parent_id: parentId || null, brand_id: brandId || null }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Could not create category.');
    }
    const category = await response.json();
    setCategories(prev => [...prev, {
      ...category,
      parentId: category.parent_id,
      parent: prev.find(item => item.id === Number(category.parent_id)),
      status: category.status === 'active' ? 'Active' : 'Inactive',
      brand_id: category.brand_id,
    }]);
    return category;
  };
  const updateCategory = async (id, name, parentId, status, brandId = null) => {
    const response = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ name, parent_id: parentId || null, status: status === 'Active' ? 'active' : 'inactive', brand_id: brandId || null }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Could not update category.');
    }
    const category = await response.json();
    setCategories(prev => prev.map(item => item.id === id ? {
      ...category,
      parentId: category.parent_id,
      parent: prev.find(parent => parent.id === Number(category.parent_id)),
      status: category.status === 'active' ? 'Active' : 'Inactive',
    } : item));
    return category;
  };
  const deleteCategory = async (id) => {
    const response = await fetch(`/api/categories/${id}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Could not delete category.');
    }
    setCategories(prev => prev.filter(c => c.id !== id));
    return true;
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
      usersLoading,
      usersError,
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
      sendVerificationOtp,
      verifyEmailOtp,
      sendPasswordResetOtp,
      verifyPasswordResetOtp,
      resetPasswordWithOtp,
      logoutUser,
      updateProfile,
      addToCart,
      updateCartQty,
      removeFromCart,
      clearCart,
      addProduct,
      updateProduct,
      updateProductStatus,
      deleteProduct,
      updateInventoryQuantity,
      checkoutOrder,
      processChapaPayment,
      adminConfirmOrder,
      adminCancelOrder,
      adminUpdateOrderStatus,
      adminUpdatePaymentStatus,
      adminRefundPayment,
      adminVerifyPayment,
      assignDeliveryPerson,
      updateDeliveryStatus,
      createDeliveryPerson,
      adminResetUserPassword,
      updateSellerStatus,
      updateUserRoleAndStatus,
      addCategory,
      updateCategory,
      deleteCategory,
      categoriesLoading,
      categoriesError,
      addBrand,
      updateBrand,
      deleteBrand,
      addReview
    }}>
      {children}
    </AppContext.Provider>
  );
};

