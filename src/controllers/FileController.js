import sharp from 'sharp';
import { resolve } from 'path';
import { unlinkSync } from 'fs';
import File from '../models/File';

class FileController {
  async store(req, res) {
    const { originalname: name, filename, path: filePath } = req.file;

    await sharp(filePath)
      .resize({ width: 600, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(resolve(__dirname, '..', '..', 'tmp', 'uploads', filename));

    unlinkSync(filePath);

    const { _id, url } = await File.create({ name, filename });
    return res.json({
      _id,
      url,
      path: filename,
    });
  }
}

export default new FileController();
