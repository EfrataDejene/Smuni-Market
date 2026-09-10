import re

with open('src/context/AppContext.jsx', 'r') as f:
    content = f.read()

# Update addCategory
search_add = """  const addCategory = async (name, icon, parentId = null) => {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ name, description: icon, parent_id: parentId || null }),
    });"""
replace_add = """  const addCategory = async (name, icon, parentId = null, brandId = null) => {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ name, description: icon, parent_id: parentId || null, brand_id: brandId || null }),
    });"""
content = content.replace(search_add, replace_add)

# Update the setCategories part of addCategory mapping
search_add_map = """      parent: prev.find(item => item.id === Number(category.parent_id)),
      status: category.status === 'active' ? 'Active' : 'Inactive',
    }]);"""
replace_add_map = """      parent: prev.find(item => item.id === Number(category.parent_id)),
      status: category.status === 'active' ? 'Active' : 'Inactive',
      brand_id: category.brand_id,
    }]);"""
content = content.replace(search_add_map, replace_add_map)


# Update updateCategory
search_update = """  const updateCategory = async (id, name, parentId, status) => {
    const response = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ name, parent_id: parentId || null, status: status === 'Active' ? 'active' : 'inactive' }),
    });"""
replace_update = """  const updateCategory = async (id, name, parentId, status, brandId = null) => {
    const response = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ name, parent_id: parentId || null, status: status === 'Active' ? 'active' : 'inactive', brand_id: brandId || null }),
    });"""
content = content.replace(search_update, replace_update)

search_update_map = """        parent: prev.find(item => item.id === Number(category.parent_id)),
        status: category.status === 'active' ? 'Active' : 'Inactive',
      }
      return c;"""
replace_update_map = """        parent: prev.find(item => item.id === Number(category.parent_id)),
        status: category.status === 'active' ? 'Active' : 'Inactive',
        brand_id: category.brand_id,
      }
      return c;"""
content = content.replace(search_update_map, replace_update_map)

# Update GET mapping
search_get_map = """          name: c.name,
          icon: c.description || 'Layers',
          parent_id: c.parent_id,
          parent: c.parent,
          status: c.status === 'active' ? 'Active' : 'Inactive',
          createdAt: c.created_at ? c.created_at.split('T')[0] : ''
        })));"""
replace_get_map = """          name: c.name,
          icon: c.description || 'Layers',
          parent_id: c.parent_id,
          parent: c.parent,
          brand_id: c.brand_id,
          status: c.status === 'active' ? 'Active' : 'Inactive',
          createdAt: c.created_at ? c.created_at.split('T')[0] : ''
        })));"""
content = content.replace(search_get_map, replace_get_map)

with open('src/context/AppContext.jsx', 'w') as f:
    f.write(content)

