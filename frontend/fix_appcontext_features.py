import re

with open('src/context/AppContext.jsx', 'r') as f:
    content = f.read()

# Add features to the GET mapping
get_search = "discount: parseFloat(p.discount_percentage) || 0,\n          image: (p.images && p.images.length > 0) ? p.images[0].image_path : null,"
get_replace = "discount: parseFloat(p.discount_percentage) || 0,\n          image: (p.images && p.images.length > 0) ? p.images[0].image_path : null,\n          features: p.features || [],"
content = content.replace(get_search, get_replace)

# Add features to the POST body
post_search = "status: 'Pending',\n        image: productData.image"
post_replace = "status: 'Pending',\n        image: productData.image,\n        features: productData.features || []"
content = content.replace(post_search, post_replace)

# Add features to the POST response mapping
post_res_search = "discount: parseFloat(data.product.discount_percentage) || 0,\n            image: data.product.images?.length > 0 ? data.product.images[0].image_path : null,"
post_res_replace = "discount: parseFloat(data.product.discount_percentage) || 0,\n            image: data.product.images?.length > 0 ? data.product.images[0].image_path : null,\n            features: data.product.features || [],"
content = content.replace(post_res_search, post_res_replace)

# Add features to the PUT body
put_search = "discount_percentage: updates.discount,\n        image: updates.image"
put_replace = "discount_percentage: updates.discount,\n        image: updates.image,\n        features: updates.features"
content = content.replace(put_search, put_replace)

with open('src/context/AppContext.jsx', 'w') as f:
    f.write(content)

