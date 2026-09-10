import re

with open('src/context/AppContext.jsx', 'r') as f:
    content = f.read()

# Add variants to GET mapping
get_search = "features: p.features || [],\n          createdAt:"
get_replace = "features: p.features || [],\n          variants: (p.variants || []).map(v => ({ id: v.id, color: v.color, size: v.size, price: parseFloat(v.price), offPrice: parseFloat(v.off_price), stock: v.stock, image: v.image })),\n          createdAt:"
content = content.replace(get_search, get_replace)

# Add variants to POST response mapping
post_res_search = "features: data.product.features || [],\n            createdAt:"
post_res_replace = "features: data.product.features || [],\n            variants: (data.product.variants || []).map(v => ({ id: v.id, color: v.color, size: v.size, price: parseFloat(v.price), offPrice: parseFloat(v.off_price), stock: v.stock, image: v.image })),\n            createdAt:"
content = content.replace(post_res_search, post_res_replace)

# Add variants to POST body
post_search = "features: productData.features || []\n      })"
post_replace = "features: productData.features || [],\n        variants: productData.variants || []\n      })"
content = content.replace(post_search, post_replace)

# Add variants to PUT body
put_search = "features: updates.features\n      })"
put_replace = "features: updates.features,\n        variants: updates.variants\n      })"
content = content.replace(put_search, put_replace)

with open('src/context/AppContext.jsx', 'w') as f:
    f.write(content)
