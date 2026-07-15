// tests/services/cartItemsService.test.js
// Unit tests cho cartItemsService - kiểm tra business logic giỏ hàng
//
// Business rules cần test:
//  1. addItemToCart: Nếu sản phẩm đã trong giỏ → tăng qty; chưa có → thêm mới
//  2. updateItemQuantity: qty ≤ 0 → xoá item; qty > 0 → cập nhật

import { cartItemsService } from '../../src/services/cartItemsService.js'

// Mock model để không cần DB thật
jest.mock('../../src/models/cartItemsModel.js', () => ({
  cartItemsModel: {
    getByCartIdAndProductId: jest.fn(),
    updateById: jest.fn(),
    createNew: jest.fn(),
    getById: jest.fn(),
    deleteById: jest.fn(),
    deleteByCartId: jest.fn(),
    getByCartId: jest.fn()
  }
}))

const { cartItemsModel } = await import('../../src/models/cartItemsModel.js')

// ─── Test Data ────────────────────────────────────────────────────────────────
const CART_ID = '64abc123def456789012abcd'
const PRODUCT_ID = '64abc123def456789012abce'
const ITEM_ID = '64abc123def456789012abcf'

const MOCK_EXISTING_ITEM = {
  _id: { toString: () => ITEM_ID },
  cartId: CART_ID,
  productId: PRODUCT_ID,
  quantity: 2
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('cartItemsService.addItemToCart()', () => {
  beforeEach(() => jest.clearAllMocks())

  it('tăng quantity nếu sản phẩm đã trong giỏ', async () => {
    // Arrange: sản phẩm đã có quantity = 2
    cartItemsModel.getByCartIdAndProductId.mockResolvedValue(MOCK_EXISTING_ITEM)
    cartItemsModel.updateById.mockResolvedValue({ ...MOCK_EXISTING_ITEM, quantity: 5 })

    // Act: thêm 3 nữa
    await cartItemsService.addItemToCart(CART_ID, PRODUCT_ID, 3)

    // Assert: updateById được gọi với newQuantity = 2 + 3 = 5
    expect(cartItemsModel.updateById).toHaveBeenCalledWith(ITEM_ID, { quantity: 5 })
    expect(cartItemsModel.createNew).not.toHaveBeenCalled() // Không tạo item mới
  })

  it('tạo item mới nếu sản phẩm chưa trong giỏ', async () => {
    // Arrange: chưa có sản phẩm trong giỏ
    cartItemsModel.getByCartIdAndProductId.mockResolvedValue(null)
    cartItemsModel.createNew.mockResolvedValue({ insertedId: { toString: () => ITEM_ID } })
    cartItemsModel.getById.mockResolvedValue({ ...MOCK_EXISTING_ITEM, quantity: 1 })

    // Act: thêm lần đầu
    await cartItemsService.addItemToCart(CART_ID, PRODUCT_ID, 1)

    // Assert: createNew được gọi, không gọi updateById
    expect(cartItemsModel.createNew).toHaveBeenCalledWith({ cartId: CART_ID, productId: PRODUCT_ID, quantity: 1 })
    expect(cartItemsModel.updateById).not.toHaveBeenCalled()
  })
})

describe('cartItemsService.updateItemQuantity()', () => {
  beforeEach(() => jest.clearAllMocks())

  it('cập nhật quantity khi quantity > 0', async () => {
    cartItemsModel.updateById.mockResolvedValue({ quantity: 5 })

    await cartItemsService.updateItemQuantity(ITEM_ID, 5)

    expect(cartItemsModel.updateById).toHaveBeenCalledWith(ITEM_ID, { quantity: 5 })
    expect(cartItemsModel.deleteById).not.toHaveBeenCalled()
  })

  it('xoá item khi quantity = 0', async () => {
    cartItemsModel.deleteById.mockResolvedValue({ deletedCount: 1 })

    await cartItemsService.updateItemQuantity(ITEM_ID, 0)

    expect(cartItemsModel.deleteById).toHaveBeenCalledWith(ITEM_ID)
    expect(cartItemsModel.updateById).not.toHaveBeenCalled()
  })

  it('xoá item khi quantity âm', async () => {
    cartItemsModel.deleteById.mockResolvedValue({ deletedCount: 1 })

    await cartItemsService.updateItemQuantity(ITEM_ID, -1)

    expect(cartItemsModel.deleteById).toHaveBeenCalledWith(ITEM_ID)
  })
})
