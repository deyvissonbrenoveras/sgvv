import * as Yup from 'yup';
import bcrypt from 'bcryptjs';
import Driver from '../models/Driver';
import User from '../models/User';
import Trip from '../models/Trip';

class DriverController {
  async index(req, res) {
    const { _id } = req.params;
    const driver = await Driver.findById(_id).populate('avatar');

    if (!driver) {
      return res
        .status(400)
        .json({ error: 'O motorista informado não existe' });
    }
    const { name, avatar } = driver;
    return res.json({ _id, name, avatar });
  }

  async show(req, res) {
    const drivers = await Driver.find()
      .populate('avatar')
      .select('-passwordHash')
      .lean();
    const trips = await Trip.find({ finished: false }).lean();
    for (let i = 0; i < drivers.length; i += 1) {
      drivers[i].busy = false;
      for (let k = 0; k < trips.length; k += 1) {
        if (drivers[i]._id.toString() === trips[k].driver.toString()) {
          drivers[i].busy = true;
        }
      }
    }
    return res.json(drivers);
  }

  async store(req, res) {
    const newDriver = req.body;
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      password: Yup.string().min(6).required(),
      avatar: Yup.string().notRequired(),
    });

    if (!(await schema.isValid(newDriver))) {
      return res.status(400).json({ error: 'Motorista não validado' });
    }

    const driverExists = await Driver.findOne({ name: newDriver.name });
    if (driverExists) {
      return res
        .status(400)
        .json({ error: 'Esse motorista já existe, insira um novo nome' });
    }
    if (newDriver.password) {
      newDriver.passwordHash = bcrypt.hashSync(newDriver.password);
    }
    const { _id, name } = await Driver.create(newDriver);

    return res.json({ _id, name });
  }

  async update(req, res) {
    const { _id } = req.params;
    const driverUpdate = req.body;
    console.log(driverUpdate);
    const driverExists = await Driver.findById(_id);
    const loggedUser = await User.findOne({ _id: req.user._id, active: true });
    if (!driverExists) {
      return res
        .status(400)
        .json({ error: 'O motorista informado não existe' });
    }
    const driverNameExists = await Driver.findOne({ name: driverUpdate.name });
    if (driverNameExists && !driverNameExists._id.equals(_id)) {
      return res.status(400).json({
        error:
          'O motorista informado já foi cadastrado, por favor insira outro nome',
      });
    }

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      avatar: Yup.string().notRequired(),
      newPassword: Yup.string().min(6).notRequired(),
      password: Yup.string().when('newPassword', {
        is: (newPassword) => newPassword && newPassword.length > 0,
        then: Yup.string().required(),
      }),
    });
    if (!(await schema.isValid(driverUpdate))) {
      return res.status(400).json({ error: 'Motorista não validado' });
    }
    if (driverUpdate.newPassword) {
      if (!loggedUser.isAdmin()) {
        if (
          !bcrypt.compareSync(
            driverUpdate.password || '',
            driverExists.passwordHash
          )
        ) {
          return res.status(401).json({
            error:
              'Você não tem permissão para alterar a senha de outro usuário',
          });
        }
      }
      driverUpdate.passwordHash = bcrypt.hashSync(driverUpdate.newPassword);
    }

    const { name, avatar } = await Driver.findOneAndUpdate(
      { _id },
      driverUpdate,
      {
        new: true,
      }
    ).populate('avatar');
    return res.json({ name, avatar });
  }
}
export default new DriverController();
