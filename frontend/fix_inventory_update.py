import re

with open('src/context/AppContext.jsx', 'r') as f:
    content = f.read()

search_str = """  const updateInventoryQuantity = (productId, quantity, threshold = null) => {
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
  };"""

replace_str = """  const updateInventoryQuantity = (productId, quantity, threshold = null) => {
    fetch(`/api/inventory/${productId}`, {
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
        if (exists) {
          return prev.map(inv => inv.productId === productId ? {
            ...inv,
            quantity: data.quantity,
            lowStockThreshold: data.low_stock_threshold,
            status: data.stock_status,
            lastUpdated: data.updated_at ? data.updated_at.split('T')[0] : ''
          } : inv);
        } else {
          return [...prev, {
            productId: data.product_id,
            quantity: data.quantity,
            lowStockThreshold: data.low_stock_threshold,
            status: data.stock_status,
            lastUpdated: data.updated_at ? data.updated_at.split('T')[0] : ''
          }];
        }
      });
    })
    .catch(err => console.error("Error updating inventory:", err));
    return { success: true };
  };"""

if search_str in content:
    content = content.replace(search_str, replace_str)
else:
    print("Could not find the updateInventoryQuantity string in AppContext.jsx")

with open('src/context/AppContext.jsx', 'w') as f:
    f.write(content)
