// tests/services/usersService.test.js
// Unit tests cho usersService - mock database, test business logic
//
// Cách mock hoạt động trong Jest:
//  jest.mock('~/models/usersModel') → thay toàn bộ module bằng mock
//  Mỗi test dùng .mockResolvedValue() để định nghĩa giá trị trả về

import { usersService } from '../../src/services/usersService.js'

// Mock toàn bộ model - không gọi DB thật trong unit test
jest.mock('../../src/models/usersModel.js', () => ({
  usersModel: {
    findByEmail: jest.fn(),
    createNew: jest.fn(),
    getAll: jest.fn(),
    findById: jest.fn(),
    updateById: jest.fn(),
    deleteById: jest.fn()
  }
}))

// Mock bcrypt để không tốn thời gian hash trong test
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('$2b$12$hashedPassword'),
  compare: jest.fn()
}))

// Mock JwtProvider
jest.mock('../../src/providers/JwtProvider.js', () => ({
  JwtProvider: {
    generateToken: jest.fn().mockResolvedValue('mock.jwt.token'),
    verifyToken: jest.fn()
  }
}))

// Import mocked modules để manipulate trong tests
const { usersModel } = await import('../../src/models/usersModel.js')
const bcrypt = await import('bcrypt')

// ─── Test Data ────────────────────────────────────────────────────────────────
const MOCK_USER = {
  _id: { toString: () => '64abc123def456789012abcd' },
  name: 'Nguyễn Test',
  email: 'test@example.com',
  phone: '0912345678',
  address: 'Số 1, Nguyễn Trãi, Hà Nội',
  role: 'customer',
  password: '$2b$12$hashedPassword',
  imageUrl: ''
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('usersService.createNew()', () => {
  beforeEach(() => jest.clearAllMocks())

  it('tạo user thành công với data hợp lệ', async () => {
    // Arrange: mock email chưa tồn tại
    usersModel.findByEmail.mockResolvedValue(null)
    usersModel.createNew.mockResolvedValue({ insertedId: MOCK_USER._id })
    usersModel.findById.mockResolvedValue(MOCK_USER)

    // Act
    const result = await usersService.createNew({
      name: 'Nguyễn Test',
      email: 'test@example.com',
      password: 'password123456',
      phone: '0912345678',
      address: 'Số 1, Nguyễn Trãi, Hà Nội'
    })

    // Assert
    expect(result).toBeDefined()
    expect(result.email).toBe('test@example.com')
    expect(result.password).toBeUndefined() // Password không được trả về
  })

  it('throw lỗi khi email đã tồn tại', async () => {
    // Arrange: email đã có
    usersModel.findByEmail.mockResolvedValue(MOCK_USER)

    // Assert: phải throw error
    await expect(
      usersService.createNew({ email: 'test@example.com', password: '123' })
    ).rejects.toThrow('Email này đã được đăng ký')
  })
})

describe('usersService.login()', () => {
  beforeEach(() => jest.clearAllMocks())

  it('đăng nhập thành công với credentials đúng', async () => {
    // Arrange
    usersModel.findByEmail.mockResolvedValue(MOCK_USER)
    bcrypt.compare.mockResolvedValue(true) // Password đúng

    // Act
    const result = await usersService.login({
      email: 'test@example.com',
      password: 'correctPassword'
    })

    // Assert
    expect(result).toBeDefined()
    expect(result.token).toBe('mock.jwt.token')
    expect(result.customer).toBeDefined()
    expect(result.customer.password).toBeUndefined() // Password không có trong response
  })

  it('throw lỗi khi email không tồn tại', async () => {
    usersModel.findByEmail.mockResolvedValue(null)

    await expect(
      usersService.login({ email: 'wrong@example.com', password: 'any' })
    ).rejects.toThrow('Email hoặc mật khẩu không đúng')
  })

  it('throw lỗi khi password sai', async () => {
    usersModel.findByEmail.mockResolvedValue(MOCK_USER)
    bcrypt.compare.mockResolvedValue(false) // Password sai

    await expect(
      usersService.login({ email: 'test@example.com', password: 'wrongPass' })
    ).rejects.toThrow('Email hoặc mật khẩu không đúng')
  })
})
