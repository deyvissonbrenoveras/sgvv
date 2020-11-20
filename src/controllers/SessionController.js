import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as Yup from 'yup';
import User from '../models/User';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid({ email, password }))) {
      return res.status(400).json({ error: 'Credenciais não validadas' });
    }
    const user = await User.findOne({
      email,
      active: true,
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    }
    const { name, _id, passwordHash } = user;

    const passwordIsValid = bcrypt.compareSync(password, passwordHash);

    if (!passwordIsValid) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    }
    const token = jwt.sign({ _id, name }, process.env.JWT_SECRET);
    return res.json({ user: { name, email }, token });
  }
}

export default new SessionController();
