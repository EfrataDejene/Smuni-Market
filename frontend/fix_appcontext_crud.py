import re

with open('src/context/AppContext.jsx', 'r') as f:
    content = f.read()

# 1. Update addProduct
add_product_regex = r"  const addProduct = \(productData\) => \{([\s\S]*?)    return \{ success: true, product: newProduct \};\n  \};\n"

new_add_product = """  const addProduct = (productData) => {
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
        discount_percentage: productData.discount,
        status: 'Pending',
        image: productData.image
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
            discount: parseFloat(data.product.discount_percentage) || 0,
            image: data.product.images?.length > 0 ? data.product.images[0].image_url : null,
            createdAt: data.product.created_at ? data.product.created_at.split('T')[0] : ''
         }]);
       }
    })
    .catch(err => console.error("Error adding product:", err));

    return { success: true };
  };
"""
content = re.sub(add_product_regex, new_add_product, content)

# 2. Update updateProduct
update_product_regex = r"  const updateProduct = \(productId, updates\) => \{([\s\S]*?)    return \{ success: true \};\n  \};\n"

new_update_product = """  const updateProduct = (productId, updates) => {
    fetch(`/api/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category_id: updates.categoryId,
        brand_id: updates.brandId,
        name: updates.name,
        description: updates.description,
        price: updates.price,
        discount_percentage: updates.discount,
        image: updates.image
      })
    })
    .then(res => res.json())
    .then(data => {
       setProducts(prev => prev.map(p => p.productId === productId ? { ...p, ...updates } : p));
    })
    .catch(err => console.error("Error updating product:", err));

    return { success: true };
  };
"""
content = re.sub(update_product_regex, new_update_product, content)

# 3. Update deleteProduct
delete_product_regex = r"  const deleteProduct = \(productId\) => \{([\s\S]*?)    return \{ success: true \};\n  \};\n"

new_delete_product = """  const deleteProduct = (productId) => {
    fetch(`/api/products/${productId}`, { method: 'DELETE' })
    .then(() => {
       setProducts(prev => prev.filter(p => p.productId !== productId));
       setInventory(prev => prev.filter(i => i.productId !== productId));
    })
    .catch(err => console.error("Error deleting product:", err));

    return { success: true };
  };
"""
content = re.sub(delete_product_regex, new_delete_product, content)

with open('src/context/AppContext.jsx', 'w') as f:
    f.write(content)
