import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res
      .status(401)
      .json({ error: 'Token de autenticação não fornecido ou inválido' });
  }
  const token = authorization.split(' ')[1];
  const tokenSigned = jwt.verify(token, process.env.JWT_SECRET);
  if (!tokenSigned) {
    return res
      .status(401)
      .json({ error: 'Token de autenticação não fornecido ou inválido' });
  }
  req.user = tokenSigned;
  next();
};
