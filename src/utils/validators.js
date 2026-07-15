// validators.js  (trước đây bị đặt tên sai: validatiors.js - thừa chữ 'i')
// Chứa các regex pattern và message lỗi dùng chung để validate dữ liệu đầu vào.
//
// Tại sao tách ra file riêng?
//  → Tránh duplicate regex ở nhiều nơi
//  → Dễ cập nhật rule một lần, áp dụng toàn app
//  → Dễ test riêng biệt

/**
 * Regex kiểm tra số điện thoại Việt Nam.
 * Hỗ trợ: Viettel (03x, 07x, 08x, 09x), Mobifone (07x, 08x, 09x),
 *          Vinaphone (08x, 09x), Vietnamobile (05x, 09x), GTel (05x, 09x)
 * Cấu trúc: 0 + đầu số mạng + 7 chữ số → tổng 10 số
 * Ví dụ hợp lệ: 0912345678, 0356789012
 */
export const PHONE_RULE = /^(0(3[2-9]|5[2689]|7[06-9]|8[1-689]|9[0-46-9]))\d{7}$/
export const PHONE_RULE_MESSAGE = 'Số điện thoại không hợp lệ (phải là số điện thoại Việt Nam 10 số)'

/**
 * Regex kiểm tra MongoDB ObjectId.
 * ObjectId: chuỗi hex 24 ký tự (ví dụ: 64abc123def456789012abcd)
 * Dùng để validate id trong URL params trước khi truy vấn DB
 * (tránh MongoDB throw error với id không đúng format)
 */
export const OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/
export const OBJECT_ID_RULE_MESSAGE = 'ID không hợp lệ (phải là MongoDB ObjectId 24 ký tự hex)'
