import re

with open('src/context/AppContext.jsx', 'r') as f:
    content = f.read()

new_fetch_logic = """    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
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
                assignedTime: d.assigned_time,
                pickedUpTime: d.picked_up_time,
                onTheWayTime: d.on_the_way_time,
                deliveredTime: d.delivered_time,
                deliveryDate: o.order_date ? new Date(o.order_date).toLocaleDateString() : '',
                estimatedDelivery: d.estimated_delivery_time,
                notes: d.delivery_notes
             });
          }
        });
        
        setOrders(mappedOrders);
        setOrderItems(mappedItems);
        setPayments(mappedPayments);
        setDeliveryTracking(mappedDeliveries);
        setOrdersLoading(false);
      })"""

# replace the block
content = re.sub(
    r"fetch\('/api/orders'\)[\s\S]*?setOrdersLoading\(false\);\n      \}\)",
    new_fetch_logic,
    content
)

with open('src/context/AppContext.jsx', 'w') as f:
    f.write(content)
