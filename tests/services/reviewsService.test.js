// tests/services/reviewsService.test.js
// Unit tests cho reviewsService - kiểm tra business rule: 1 review / sản phẩm / user

import { reviewsService } from '../../src/services/reviewsService.js'

jest.mock('../../src/models/reviewsModel.js', () => ({
  reviewsModel: {
    findByUserAndProduct: jest.fn(),
    createNew: jest.fn(),
    findByProductId: jest.fn()
  }
}))

const { reviewsModel } = await import('../../src/models/reviewsModel.js')

// ─── Test Data ────────────────────────────────────────────────────────────────
const MOCK_USER = {
  id: '64abc123def456789012aaaa',
  name: 'Nguyễn Test',
  role: 'customer'
}

const REVIEW_DATA = {
  productId: '64abc123def456789012bbbb',
  rating: 5,
  comment: 'Sản phẩm tuyệt vời!'
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('reviewsService.createNew()', () => {
  beforeEach(() => jest.clearAllMocks())

  it('tạo review thành công lần đầu tiên', async () => {
    // Arrange: chưa có review cho sản phẩm này
    reviewsModel.findByUserAndProduct.mockResolvedValue(null)
    reviewsModel.createNew.mockResolvedValue({
      ...REVIEW_DATA,
      userId: MOCK_USER.id,
      userName: MOCK_USER.name,
      _id: '64abc123def456789012cccc'
    })

    // Act
    const result = await reviewsService.createNew(REVIEW_DATA, MOCK_USER)

    // Assert
    expect(result).toBeDefined()
    expect(reviewsModel.createNew).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: MOCK_USER.id,
        userName: MOCK_USER.name,
        rating: 5
      })
    )
  })

  it('throw lỗi khi user đã review sản phẩm này rồi', async () => {
    // Arrange: đã có review
    reviewsModel.findByUserAndProduct.mockResolvedValue({ ...REVIEW_DATA, userId: MOCK_USER.id })

    // Assert
    await expect(
      reviewsService.createNew(REVIEW_DATA, MOCK_USER)
    ).rejects.toThrow('Bạn đã đánh giá sản phẩm này rồi')
  })

  it('throw lỗi khi thiếu thông tin user', async () => {
    // Act & Assert: không truyền user → không có userId và userName
    await expect(
      reviewsService.createNew(REVIEW_DATA, {}) // User không có id và name
    ).rejects.toThrow('Thiếu thông tin người dùng')
  })
})
