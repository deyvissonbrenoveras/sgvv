import multer from 'multer';
import crypto from 'crypto';
import { resolve } from 'path';

export default {
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, resolve(__dirname, '..', '..', 'tmp', 'tmpUploads'));
    },
    filename(req, file, cb) {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);
        return cb(null, `${res.toString('hex')}.webp`);
      });
    },
  }),
};
