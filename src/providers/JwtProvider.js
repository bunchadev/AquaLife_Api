import JWT from 'jsonwebtoken'

const generateToken = async (userInfo, secretSignature, tokenLife) => {
  try {
    // sign là hàm mặc định Jwt
    return JWT.sign(userInfo, secretSignature, { algorithm: 'HS256', expiresIn: tokenLife })
  } catch (error) { throw new Error(error) }
}

// kiểm tra token có hợp lệ hay không
const verifyToken = async (token, secretSignature) => {
  try {
    // verify là hàm mặc định Jwt
    return JWT.verify(token, secretSignature)
  } catch (error) { throw new Error(error) }
}

export const JwtProvider = {
  generateToken,
  verifyToken
}