import * as Yup from 'yup';
import bcrypt from 'bcryptjs';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const newUser = req.body;

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
    });

    if (!(await schema.isValid(newUser))) {
      return res.status(400).json({ error: 'Usuário não validado' });
    }

    const loggedUserId = req.user._id;
    const loggedUser = await User.findOne({ _id: loggedUserId, active: true });
    if (!loggedUser || !loggedUser.isAdmin()) {
      return res
        .status(401)
        .json({ error: 'Você não tem permissão para criar usuários' });
    }

    const emailExists = await User.findOne({ email: newUser.email });
    if (emailExists) {
      return res.status(400).json({ error: 'O e-mail informado já existe' });
    }

    const { _id, name, email, active } = await User.create(newUser);
    return res.json({ _id, name, email, active });
  }

  async update(req, res) {
    const loggedUserId = req.user._id;
    let userUpdated = req.body;
    const { _id } = req.params;

    // falta validar o password
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      password: Yup.string().min(6),
    });
    if (!(await schema.isValid(userUpdated))) {
      return res.status(400).json({ error: 'Usuário não validado' });
    }

    const user = await User.findById(_id);
    if (!user) {
      return res.status(400).json({ error: 'O usuário informado não existe' });
    }

    if (user._id !== loggedUserId) {
      const loggedUser = await User.findOne({
        _id: loggedUserId,
        active: true,
      });
      if (!loggedUser || !loggedUser.isAdmin()) {
        return res
          .status(400)
          .json({ error: 'Você não tem permissão para editar usuários' });
      }
    }

    if (userUpdated.password) {
      userUpdated.passwordHash = bcrypt.hashSync(req.body.password);
    }
    userUpdated = await User.findOneAndUpdate({ _id }, userUpdated, {
      new: true,
    });
    const { name, email, active } = userUpdated;
    return res.json({ _id, name, email, active });
  }
}

export default new UserController();
