# ERD - Milk Store Database

Source: `database/milk_store.sql` (runtime schema).

![Beautiful ERD](./erd-beautiful.svg)

```mermaid
erDiagram
    CATEGORIES ||--o{ PRODUCTS : contains
    BRANDS ||--o{ PRODUCTS : has
    PRODUCTS ||--o{ REVIEWS : receives
    USERS ||--o{ ORDERS : places
    ORDERS ||--o{ ORDER_DETAILS : includes
    PRODUCTS ||--o{ ORDER_DETAILS : appears_in

    CATEGORIES {
        INT id PK
        VARCHAR name UK
        TEXT description
        VARCHAR image
        TINYINT status
        TIMESTAMP created_at
    }

    BRANDS {
        INT id PK
        VARCHAR name UK
        TEXT description
        VARCHAR logo
        TINYINT status
        TIMESTAMP created_at
    }

    BANNERS {
        INT id PK
        VARCHAR title
        TEXT description
        VARCHAR image
        VARCHAR link
        INT sort_order
        BOOLEAN active
        TINYINT status
        TIMESTAMP created_at
    }

    PRODUCTS {
        INT id PK
        VARCHAR name
        VARCHAR slug UK
        TEXT description
        VARCHAR short_description
        DECIMAL price
        DECIMAL sale_price
        VARCHAR image
        JSON images
        INT stock
        INT category_id FK
        INT brand_id FK
        VARCHAR age_range
        VARCHAR weight
        VARCHAR origin
        TEXT ingredients
        TEXT benefits
        TEXT usage_instructions
        DECIMAL average_rating
        INT review_count
        BOOLEAN is_featured
        TINYINT status
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    REVIEWS {
        INT id PK
        INT product_id FK
        INT user_id
        VARCHAR full_name
        INT rating
        TEXT comment
        TINYINT status
        TIMESTAMP created_at
    }

    USERS {
        INT id PK
        VARCHAR email UK
        VARCHAR password
        VARCHAR full_name
        VARCHAR phone
        ENUM role
        TINYINT status
        VARCHAR avatar
        TEXT address
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    ORDERS {
        INT id PK
        VARCHAR order_number UK
        INT user_id FK
        DECIMAL total_amount
        ENUM order_status
        ENUM payment_status
        ENUM payment_method
        VARCHAR customer_name
        VARCHAR customer_email
        VARCHAR customer_phone
        TEXT shipping_address
        TEXT shipping_notes
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    ORDER_DETAILS {
        INT id PK
        INT order_id FK
        INT product_id FK
        VARCHAR product_name
        DECIMAL price
        INT quantity
        DECIMAL total_price
        TIMESTAMP created_at
    }

    NEWS {
        INT id PK
        VARCHAR title
        VARCHAR slug UK
        TEXT content
        VARCHAR image
        TINYINT status
        TIMESTAMP published_at
        TIMESTAMP created_at
    }

    CONTACTS {
        INT id PK
        VARCHAR full_name
        VARCHAR email
        VARCHAR phone
        TEXT message
        TEXT reply_message
        TIMESTAMP replied_at
        ENUM status
        TIMESTAMP created_at
    }

    STATISTICS {
        INT id PK
        DATE date UK
        INT total_orders
        DECIMAL total_revenue
        INT total_customers
        TIMESTAMP created_at
    }
```

## Relationship Notes

- `categories.id` -> `products.category_id`: one category has many products.
- `brands.id` -> `products.brand_id`: one brand has many products.
- `products.id` -> `reviews.product_id`: one product has many reviews.
- `users.id` -> `orders.user_id`: one user has many orders.
- `orders.id` -> `order_details.order_id`: one order has many order detail rows.
- `products.id` -> `order_details.product_id`: one product can appear in many order detail rows.
- `reviews.user_id` references `users.id` (ON DELETE CASCADE) in `milk_store.sql`.
- `contacts` is a standalone table for customer messages.
