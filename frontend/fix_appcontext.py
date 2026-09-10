import re

with open('src/context/AppContext.jsx', 'r') as f:
    content = f.read()

# Replace brands
content = re.sub(
    r"const \[brands, setBrands\] = useState\(\(\) => \{[\s\S]*?return saved \? JSON.parse\(saved\) : initialBrands;[\s\S]*?\}\);",
    r"const [brands, setBrands] = useState([]);",
    content
)

# Replace products
content = re.sub(
    r"const \[products, setProducts\] = useState\(\(\) => \{[\s\S]*?return saved \? JSON.parse\(saved\) : initialProducts;[\s\S]*?\}\);",
    r"const [products, setProducts] = useState([]);\n  const [productsLoading, setProductsLoading] = useState(true);\n  const [productsError, setProductsError] = useState('');",
    content
)

# Replace inventory
content = re.sub(
    r"const \[inventory, setInventory\] = useState\(\(\) => \{[\s\S]*?return saved \? JSON.parse\(saved\) : initialInventory;[\s\S]*?\}\);",
    r"const [inventory, setInventory] = useState([]);\n  const [inventoryLoading, setInventoryLoading] = useState(true);\n  const [inventoryError, setInventoryError] = useState('');",
    content
)

# Replace orders
content = re.sub(
    r"const \[orders, setOrders\] = useState\(\(\) => \{[\s\S]*?return merged;[\s\S]*?\}\);",
    r"const [orders, setOrders] = useState([]);\n  const [ordersLoading, setOrdersLoading] = useState(true);\n  const [ordersError, setOrdersError] = useState('');",
    content
)

# Now inject the useEffects right after Categories useEffect.
fetch_effects = """
  // Global Fetches
  useEffect(() => {
    // Fetch Brands
    fetch('/api/brands')
      .then(res => res.json())
      .then(data => setBrands(data.map(b => ({
        id: b.id,
        name: b.name,
        description: b.description || '',
        logo: b.logo_url || null
      }))))
      .catch(err => console.error('Error fetching brands', err));

    // Fetch Products
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.map(p => ({
          productId: p.id,
          sellerId: p.seller_id,
          categoryId: p.category_id,
          brandId: p.brand_id,
          name: p.name,
          description: p.description,
          price: parseFloat(p.price) || 0,
          discount: parseFloat(p.discount_percentage) || 0,
          image: (p.images && p.images.length > 0) ? p.images[0].image_url : null,
          createdAt: p.created_at ? p.created_at.split('T')[0] : ''
        })));
        setProductsLoading(false);
      })
      .catch(err => {
        setProductsError('Failed to load products');
        setProductsLoading(false);
      });

    // Fetch Inventory
    fetch('/api/inventory')
      .then(res => res.json())
      .then(data => {
        setInventory(data.map(i => ({
          productId: i.product_id,
          quantity: i.quantity,
          lowStockThreshold: i.low_stock_threshold,
          status: i.status,
          lastUpdated: i.updated_at ? i.updated_at.split('T')[0] : ''
        })));
        setInventoryLoading(false);
      })
      .catch(err => {
        setInventoryError('Failed to load inventory');
        setInventoryLoading(false);
      });

    // Fetch Orders
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data.map(o => ({
          orderId: o.id,
          userId: o.user_id,
          customerName: o.customer ? o.customer.name : 'Unknown',
          customerPhone: o.customer ? o.customer.phone : '',
          customerEmail: o.customer ? o.customer.email : '',
          orderDate: o.order_date ? new Date(o.order_date).toLocaleDateString() : '',
          orderTime: o.order_date ? new Date(o.order_date).toLocaleTimeString() : '',
          totalAmount: parseFloat(o.total_amount),
          subtotal: parseFloat(o.total_amount), // Simplified
          shippingFee: 0,
          orderStatus: o.order_status,
          deliveryAddress: o.delivery_address || 'Unknown'
        })));
        setOrdersLoading(false);
      })
      .catch(err => {
        setOrdersError('Failed to load orders');
        setOrdersLoading(false);
      });
  }, []);
"""

content = content.replace("  const [brands, setBrands] = useState([]);", fetch_effects + "\n  const [brands, setBrands] = useState([]);")

with open('src/context/AppContext.jsx', 'w') as f:
    f.write(content)
