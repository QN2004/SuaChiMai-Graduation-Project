const envelope = (schema) => ({
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    message: { type: 'string' },
    data: schema
  }
});

const bearer = [{ bearerAuth: [] }];

const spec = {
  openapi: '3.0.3',
  info: {
    title: 'Sữa Chi Mai API',
    version: '1.0.0',
    description: 'REST API cửa hàng sữa. Authorize bằng JWT từ `POST /api/auth/login`.'
  },
  servers: [{ url: '/', description: 'Current host' }],
  tags: [
    { name: 'Health' },
    { name: 'Auth' },
    { name: 'Categories' },
    { name: 'Brands' },
    { name: 'Products' },
    { name: 'Orders' },
    { name: 'Reviews' },
    { name: 'Contacts' },
    { name: 'Users' },
    { name: 'Statistics' },
    { name: 'Upload' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          full_name: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          role: { type: 'string', enum: ['user', 'admin'] },
          status: { type: 'integer' },
          address: { type: 'string', nullable: true }
        }
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          category_id: { type: 'integer', nullable: true },
          brand_id: { type: 'integer', nullable: true },
          name: { type: 'string' },
          slug: { type: 'string' },
          image: { type: 'string' },
          price: { type: 'number' },
          sale_price: { type: 'number', nullable: true },
          stock: { type: 'integer' },
          status: { type: 'integer' },
          is_featured: { type: 'integer' }
        }
      },
      OrderItemInput: {
        type: 'object',
        required: ['product_id', 'quantity'],
        properties: {
          product_id: { type: 'integer' },
          quantity: { type: 'integer', minimum: 1 }
        }
      },
      Error: envelope({ type: 'object', nullable: true })
    }
  },
  paths: {
    '/': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        responses: { 200: { description: 'API đang chạy' } }
      }
    },
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Đăng ký',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['full_name', 'email', 'password'],
                properties: {
                  full_name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  phone: { type: 'string' },
                  password: { type: 'string', minLength: 6 }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Tạo tài khoản' },
          409: { description: 'Email đã tồn tại' },
          422: { description: 'Dữ liệu không hợp lệ' }
        }
      }
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Đăng nhập (copy token vào Authorize)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'admin@gmail.com' },
                  password: { type: 'string', example: '123456' }
                }
              }
            }
          }
        },
        responses: { 200: { description: '{ token, user }' }, 401: { description: 'Sai thông tin' } }
      }
    },
    '/api/auth/profile': {
      get: {
        tags: ['Auth'],
        summary: 'Hồ sơ hiện tại',
        security: bearer,
        responses: { 200: { description: 'User' }, 401: { description: 'Chưa đăng nhập' } }
      },
      put: {
        tags: ['Auth'],
        summary: 'Cập nhật hồ sơ',
        security: bearer,
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  full_name: { type: 'string' },
                  phone: { type: 'string' },
                  address: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'User đã cập nhật' } }
      }
    },
    '/api/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Đăng xuất (client xóa token)',
        security: bearer,
        responses: { 200: { description: 'OK' } }
      }
    },
    '/api/categories': {
      get: { tags: ['Categories'], summary: 'Danh sách danh mục', responses: { 200: { description: 'OK' } } },
      post: {
        tags: ['Categories'],
        summary: 'Tạo danh mục',
        security: bearer,
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string' },
                  slug: { type: 'string' },
                  description: { type: 'string' },
                  image: { type: 'string' },
                  status: { type: 'integer' }
                }
              }
            }
          }
        },
        responses: { 200: { description: '{ id }' }, 403: { description: 'Không phải admin' } }
      }
    },
    '/api/categories/{id}': {
      get: {
        tags: ['Categories'],
        summary: 'Chi tiết danh mục',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'OK' }, 404: { description: 'Không tìm thấy' } }
      },
      put: {
        tags: ['Categories'],
        summary: 'Cập nhật danh mục',
        security: bearer,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  slug: { type: 'string' },
                  description: { type: 'string' },
                  image: { type: 'string' },
                  status: { type: 'integer' }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'OK' } }
      },
      delete: {
        tags: ['Categories'],
        summary: 'Xóa danh mục',
        security: bearer,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'OK' } }
      }
    },
    '/api/brands': {
      get: { tags: ['Brands'], summary: 'Danh sách thương hiệu', responses: { 200: { description: 'OK' } } },
      post: {
        tags: ['Brands'],
        summary: 'Tạo thương hiệu',
        security: bearer,
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string' },
                  slug: { type: 'string' },
                  description: { type: 'string' },
                  logo: { type: 'string' },
                  status: { type: 'integer' }
                }
              }
            }
          }
        },
        responses: { 200: { description: '{ id }' } }
      }
    },
    '/api/brands/{id}': {
      get: {
        tags: ['Brands'],
        summary: 'Chi tiết thương hiệu',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'OK' } }
      },
      put: {
        tags: ['Brands'],
        summary: 'Cập nhật thương hiệu',
        security: bearer,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'OK' } }
      },
      delete: {
        tags: ['Brands'],
        summary: 'Xóa thương hiệu',
        security: bearer,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'OK' } }
      }
    },
    '/api/products': {
      get: {
        tags: ['Products'],
        summary: 'Danh sách sản phẩm (cửa hàng)',
        parameters: [
          { name: 'q', in: 'query', schema: { type: 'string' } },
          { name: 'category', in: 'query', schema: { type: 'integer' } },
          { name: 'brand', in: 'query', schema: { type: 'integer' } },
          { name: 'minPrice', in: 'query', schema: { type: 'number' } },
          { name: 'maxPrice', in: 'query', schema: { type: 'number' } },
          { name: 'sort', in: 'query', schema: { type: 'string', enum: ['latest', 'price_asc', 'price_desc'] } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 12 } }
        ],
        responses: { 200: { description: '{ items, total, page, limit }' } }
      },
      post: {
        tags: ['Products'],
        summary: 'Tạo sản phẩm',
        security: bearer,
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'price'],
                properties: {
                  category_id: { type: 'integer' },
                  brand_id: { type: 'integer' },
                  name: { type: 'string' },
                  slug: { type: 'string' },
                  image: { type: 'string' },
                  price: { type: 'number' },
                  sale_price: { type: 'number', nullable: true },
                  stock: { type: 'integer' },
                  age_range: { type: 'string' },
                  origin: { type: 'string' },
                  weight: { type: 'string' },
                  ingredients: { type: 'string' },
                  benefits: { type: 'string' },
                  usage_instructions: { type: 'string' },
                  short_description: { type: 'string' },
                  description: { type: 'string' },
                  status: { type: 'integer' },
                  is_featured: { type: 'integer' }
                }
              }
            }
          }
        },
        responses: { 200: { description: '{ id }' } }
      }
    },
    '/api/products/featured': {
      get: { tags: ['Products'], summary: 'Sản phẩm nổi bật', responses: { 200: { description: 'OK' } } }
    },
    '/api/products/latest': {
      get: { tags: ['Products'], summary: 'Sản phẩm mới', responses: { 200: { description: 'OK' } } }
    },
    '/api/products/best-selling': {
      get: { tags: ['Products'], summary: 'Sản phẩm bán chạy', responses: { 200: { description: 'OK' } } }
    },
    '/api/products/admin/all': {
      get: {
        tags: ['Products'],
        summary: 'Tất cả sản phẩm (admin, gồm ẩn)',
        security: bearer,
        responses: { 200: { description: 'OK' } }
      }
    },
    '/api/products/slug/{slug}': {
      get: {
        tags: ['Products'],
        summary: 'Chi tiết theo slug + related',
        parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: '{ product, related }' } }
      }
    },
    '/api/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Chi tiết theo id',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'OK' }, 404: { description: 'Không tìm thấy' } }
      },
      put: {
        tags: ['Products'],
        summary: 'Cập nhật sản phẩm',
        security: bearer,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'OK' } }
      },
      delete: {
        tags: ['Products'],
        summary: 'Xóa sản phẩm',
        security: bearer,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'OK' } }
      }
    },
    '/api/orders': {
      get: {
        tags: ['Orders'],
        summary: 'Danh sách đơn (admin)',
        security: bearer,
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'q', in: 'query', schema: { type: 'string' }, description: 'id / tên / SĐT / mã đơn' }
        ],
        responses: { 200: { description: 'OK' } }
      },
      post: {
        tags: ['Orders'],
        summary: 'Đặt hàng',
        security: bearer,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['customer_name', 'phone', 'address', 'items'],
                properties: {
                  customer_name: { type: 'string' },
                  phone: { type: 'string' },
                  address: { type: 'string' },
                  note: { type: 'string' },
                  payment_method: { type: 'string', enum: ['COD', 'BANK_TRANSFER'] },
                  items: { type: 'array', items: { $ref: '#/components/schemas/OrderItemInput' } }
                }
              }
            }
          }
        },
        responses: { 200: { description: '{ id, order_number, total_amount }' }, 422: { description: 'Giỏ trống' } }
      }
    },
    '/api/orders/my-orders': {
      get: {
        tags: ['Orders'],
        summary: 'Đơn của tôi',
        security: bearer,
        responses: { 200: { description: 'OK' } }
      }
    },
    '/api/orders/{id}': {
      get: {
        tags: ['Orders'],
        summary: 'Chi tiết đơn (user chỉ xem đơn mình)',
        security: bearer,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'OK' }, 404: { description: 'Không tìm thấy' } }
      }
    },
    '/api/orders/{id}/status': {
      put: {
        tags: ['Orders'],
        summary: 'Cập nhật trạng thái đơn / thanh toán',
        security: bearer,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  order_status: {
                    type: 'string',
                    enum: ['PENDING', 'CONFIRMED', 'SHIPPING', 'COMPLETED', 'CANCELLED']
                  },
                  payment_status: { type: 'string', enum: ['UNPAID', 'PAID'] }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'OK' } }
      }
    },
    '/api/orders/{id}/cancel': {
      put: {
        tags: ['Orders'],
        summary: 'Hủy đơn PENDING (hoàn kho)',
        security: bearer,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'OK' }, 400: { description: 'Không hủy được' } }
      }
    },
    '/api/reviews/admin/all': {
      get: {
        tags: ['Reviews'],
        summary: 'Tất cả đánh giá (admin)',
        security: bearer,
        responses: { 200: { description: 'OK' } }
      }
    },
    '/api/reviews/product/{productId}': {
      get: {
        tags: ['Reviews'],
        summary: 'Đánh giá đã duyệt theo sản phẩm',
        parameters: [{ name: 'productId', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'OK' } }
      }
    },
    '/api/reviews': {
      post: {
        tags: ['Reviews'],
        summary: 'Gửi đánh giá (đã mua đơn COMPLETED)',
        security: bearer,
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['product_id', 'rating'],
                properties: {
                  product_id: { type: 'integer' },
                  rating: { type: 'integer', minimum: 1, maximum: 5 },
                  comment: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { 200: { description: '{ id }' }, 403: { description: 'Chưa mua / chưa hoàn thành' } }
      }
    },
    '/api/reviews/{id}/status': {
      put: {
        tags: ['Reviews'],
        summary: 'Duyệt / ẩn đánh giá',
        security: bearer,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: { type: 'object', properties: { status: { type: 'integer' } } }
            }
          }
        },
        responses: { 200: { description: 'OK' } }
      }
    },
    '/api/reviews/{id}': {
      delete: {
        tags: ['Reviews'],
        summary: 'Xóa đánh giá',
        security: bearer,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'OK' } }
      }
    },
    '/api/contacts': {
      post: {
        tags: ['Contacts'],
        summary: 'Gửi form tư vấn',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['full_name', 'phone', 'message'],
                properties: {
                  full_name: { type: 'string' },
                  email: { type: 'string' },
                  phone: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { 200: { description: '{ id }' }, 422: { description: 'Thiếu dữ liệu' } }
      },
      get: {
        tags: ['Contacts'],
        summary: 'Danh sách liên hệ (admin)',
        security: bearer,
        responses: { 200: { description: 'OK' } }
      }
    },
    '/api/contacts/{id}/status': {
      put: {
        tags: ['Contacts'],
        summary: 'Cập nhật trạng thái liên hệ',
        security: bearer,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { status: { type: 'string', enum: ['new', 'read', 'replied'] } }
              }
            }
          }
        },
        responses: { 200: { description: 'OK' } }
      }
    },
    '/api/contacts/{id}/reply': {
      put: {
        tags: ['Contacts'],
        summary: 'Lưu phản hồi tư vấn',
        security: bearer,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['reply_message'],
                properties: { reply_message: { type: 'string' } }
              }
            }
          }
        },
        responses: { 200: { description: 'OK' } }
      }
    },
    '/api/users': {
      get: {
        tags: ['Users'],
        summary: 'Danh sách khách hàng (role=user)',
        security: bearer,
        responses: { 200: { description: 'OK' } }
      }
    },
    '/api/users/{id}/status': {
      put: {
        tags: ['Users'],
        summary: 'Khóa / mở khách hàng',
        security: bearer,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: { type: 'object', properties: { status: { type: 'integer', enum: [0, 1] } } }
            }
          }
        },
        responses: { 200: { description: 'OK' } }
      }
    },
    '/api/statistics/dashboard': {
      get: {
        tags: ['Statistics'],
        summary: 'Tổng quan admin',
        security: bearer,
        responses: { 200: { description: 'OK' } }
      }
    },
    '/api/statistics/revenue-by-month': {
      get: {
        tags: ['Statistics'],
        summary: 'Doanh thu 12 tháng (đơn COMPLETED)',
        security: bearer,
        responses: { 200: { description: 'OK' } }
      }
    },
    '/api/statistics/best-selling-products': {
      get: {
        tags: ['Statistics'],
        summary: 'Top bán chạy (admin)',
        security: bearer,
        responses: { 200: { description: 'OK' } }
      }
    },
    '/api/statistics/low-stock-products': {
      get: {
        tags: ['Statistics'],
        summary: 'Sản phẩm tồn ≤ 10',
        security: bearer,
        responses: { 200: { description: 'OK' } }
      }
    },
    '/api/upload': {
      post: {
        tags: ['Upload'],
        summary: 'Upload ảnh (admin, field `image`)',
        security: bearer,
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: { image: { type: 'string', format: 'binary' } }
              }
            }
          }
        },
        responses: { 200: { description: '{ url }' } }
      }
    }
  }
};

export default spec;
