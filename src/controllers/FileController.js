import File from '../models/File';

class FileController {
  async store(req, res) {
    const { filename } = req.file;
    const file = await File.create({ filename });
    return res.json(file);
  }
}

export default new FileController();
