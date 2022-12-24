user - cart item/order: one to many
order - order item: one to many
product - cart item/order item: one to many

# Category

- id
- name

# User

- id
- name
- tel
- password
- gender
- role
- address

# Product

- id
- name
- images
- rating
- price
- quantity
- soldQuantity
- category
- origin
- expiry

# Cart Item

- id
- owner
- product
- quantity

# Order Item

- id
- order id
- product
- quantity

# Order

- id
- customer
- shipping method
- shipping fee
- note
- receiveDestination
- status
