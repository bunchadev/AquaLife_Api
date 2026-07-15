// tests/utils/validators.test.js
// Unit tests cho các regex validators
//
// Jest test structure:
//  describe(): nhóm các tests liên quan
//  it() hoặc test(): 1 test case
//  expect().toBe() / toMatch() / toThrow(): các matchers

import { PHONE_RULE, OBJECT_ID_RULE } from '../../src/utils/validators.js'

describe('PHONE_RULE - Kiểm tra số điện thoại Việt Nam', () => {
  // Test cases hợp lệ: số điện thoại đúng định dạng
  it.each([
    ['0912345678', 'Viettel 09x'],
    ['0356789012', 'Viettel 03x'],
    ['0768901234', 'Mobifone 07x'],
    ['0868901234', 'Vinaphone 08x'],
    ['0562345678', 'Vietnamobile 05x']
  ])('nên chấp nhận %s (%s)', (phone) => {
    expect(PHONE_RULE.test(phone)).toBe(true)
  })

  // Test cases không hợp lệ: số điện thoại sai định dạng
  it.each([
    ['01234567890', 'Quá nhiều chữ số (11)'],
    ['091234567', 'Thiếu chữ số (9)'],
    ['1234567890', 'Không bắt đầu bằng 0'],
    ['0012345678', '00 không hợp lệ'],
    ['abcdefghij', 'Không phải số'],
    ['', 'Chuỗi rỗng']
  ])('nên từ chối %s (%s)', (phone) => {
    expect(PHONE_RULE.test(phone)).toBe(false)
  })
})

describe('OBJECT_ID_RULE - Kiểm tra MongoDB ObjectId', () => {
  it.each([
    ['64abc123def456789012abcd', 'ObjectId hợp lệ (24 hex)'],
    ['000000000000000000000000', 'All zeros'],
    ['ffffffffffffffffffffffff', 'All f']
  ])('nên chấp nhận %s (%s)', (id) => {
    expect(OBJECT_ID_RULE.test(id)).toBe(true)
  })

  it.each([
    ['64abc123def456789012abc', 'Chỉ 23 ký tự'],
    ['64abc123def456789012abcde', '25 ký tự'],
    ['64abc123def456789012abcZ', 'Có ký tự không phải hex (Z)'],
    ['', 'Chuỗi rỗng']
  ])('nên từ chối %s (%s)', (id) => {
    expect(OBJECT_ID_RULE.test(id)).toBe(false)
  })
})
