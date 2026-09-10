import re

with open('src/context/AppContext.jsx', 'r') as f:
    content = f.read()

# Replace orderItems
content = re.sub(
    r"const \[orderItems, setOrderItems\] = useState\(\(\) => \{[\s\S]*?return merged;[\s\S]*?\}\);",
    r"const [orderItems, setOrderItems] = useState([]);",
    content
)

# Replace payments
content = re.sub(
    r"const \[payments, setPayments\] = useState\(\(\) => \{[\s\S]*?return merged;[\s\S]*?\}\);",
    r"const [payments, setPayments] = useState([]);",
    content
)

# Replace deliveryTracking
content = re.sub(
    r"const \[deliveryTracking, setDeliveryTracking\] = useState\(\(\) => \{[\s\S]*?return merged;[\s\S]*?\}\);",
    r"const [deliveryTracking, setDeliveryTracking] = useState([]);",
    content
)

# Replace reviews
content = re.sub(
    r"const \[reviews, setReviews\] = useState\(\(\) => \{[\s\S]*?return saved \? JSON.parse\(saved\) : initialReviews;[\s\S]*?\}\);",
    r"const [reviews, setReviews] = useState([]);",
    content
)

with open('src/context/AppContext.jsx', 'w') as f:
    f.write(content)

