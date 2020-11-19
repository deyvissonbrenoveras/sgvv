import User from '../models/User';

class UserController {
  async store(req, res) {
    const user = await User.create({
      name: 'Breno',
      email: 'deyvissonbrneoveras@gmail.com',
      passwordHash: '123',
    });
    res.json(user);
  }
}

export default new UserController();
