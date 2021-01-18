import * as Yup from 'yup';
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import bcrypt from 'bcryptjs';
import Trip from '../models/Trip';
import TripFilterEnum from '../util/TripFilterEnum';

class TripController {
  async index(req, res) {
    const { _id } = req.params;
    const trip = await Trip.findById(_id)
      .populate({
        path: 'driver',
        select: { name: 1 },
        populate: {
          path: 'avatar',
          model: 'File',
        },
      })
      .populate({
        path: 'vehicle',
        populate: {
          path: 'image',
          model: 'File',
        },
      });

    if (!trip) {
      return res.status(400).json({ error: 'A viagem informada não existe' });
    }
    return res.json(trip);
  }

  async show(req, res) {
    const status = Number(req.query.status);
    const schema = Yup.object().shape({
      // startTime: Yup.string()
      //   .test('startTime', '', function checkStartTime(startTime) {
      //     return !!Date.parse(startTime);
      //   })
      //   .notRequired()
      //   .nullable(),
      // endTime: Yup.string()
      //   .nullable()
      //   .test('endTime', '', function checkEndTime(endTime) {
      //     const timeStamp = !!Date.parse(endTime);
      //     return (timeStamp && timeStamp > 0) || undefined;
      //   }),
      // status: Yup.number().min(0).max(2).nullable().notRequired(),
    });
    if (!(await schema.isValid({ ...req.query, status }))) {
      return res
        .status(400)
        .json({ error: 'Parâmetros de consulta inválidos' });
    }
    const query = {};
    if (req.query.startTime) {
      query.startTime = {
        $gt: startOfDay(parseISO(req.query.startTime)),
      };
    }
    if (req.query.endTime) {
      query.endTime = {
        $lt: endOfDay(parseISO(req.query.endTime)),
      };
    }
    switch (status) {
      case TripFilterEnum.IN_PROGRESS:
        query.finished = false;
        break;
      case TripFilterEnum.FINISHED:
        query.finished = true;
        break;
      default:
        break;
    }
    console.log(query);
    const trips = await Trip.find(query)

      .populate({
        path: 'driver',
        select: { name: 1 },
        populate: {
          path: 'avatar',
          model: 'File',
        },
      })
      .populate({
        path: 'vehicle',
        populate: {
          path: 'image',
          model: 'File',
        },
      });
    return res.json(trips);
  }

  async store(req, res) {
    const newTrip = req.body;

    const schema = Yup.object().shape({
      driver: Yup.string().required(),
      vehicle: Yup.string().required(),
      departureLocation: Yup.object().shape({
        name: Yup.string().required(),
        latLon: Yup.array()
          .of(Yup.number().required())
          .min(2)
          .max(2)
          .required(),
      }),
      arrivalLocation: Yup.object().shape({
        name: Yup.string().required(),
        latLon: Yup.array()
          .of(Yup.number().required())
          .min(2)
          .max(2)
          .required(),
      }),
    });

    if (!(await schema.isValid(newTrip))) {
      return res.status(400).json({ error: 'Viagem não validada' });
    }

    const { driver, vehicle } = newTrip;
    const driverIsBusy = await Trip.findOne({ driver, finished: false });
    if (driverIsBusy) {
      return res.status(400).json({
        error: 'O motorista informado está com uma viagem em andamento',
      });
    }
    const vehicleIsBusy = await Trip.findOne({ vehicle, finished: false });
    if (vehicleIsBusy) {
      return res.status(400).json({
        error: 'O veículo informado está em uso em uma outra viagem',
      });
    }

    newTrip.startTime = new Date(Date.now());

    const trip = await Trip.create(req.body);
    return res.json(trip);
  }

  async update(req, res) {
    const { _id } = req.params;
    const { amountSpent, password } = req.body;
    const trip = await Trip.findById(_id)
      .populate({
        path: 'driver',
        select: { name: 1, passwordHash: 1 },
        populate: {
          path: 'avatar',
          model: 'File',
        },
      })
      .populate({
        path: 'vehicle',
        populate: {
          path: 'image',
          model: 'File',
        },
      });
    if (!trip) {
      return res.status(400).json({ error: 'A viagem informada não existe' });
    }
    if (trip.finished) {
      return res.status(400).json({ error: 'Essa viagem já foi encerrada' });
    }
    if (!bcrypt.compareSync(password || '', trip.driver.passwordHash)) {
      return res.status(401).json({ error: 'Senha do motorista incorreta!' });
    }
    trip.endTime = new Date(Date.now());
    trip.finished = true;

    trip.amountSpent = amountSpent;
    await trip.save();
    const resultTrip = trip.toObject();
    delete resultTrip.driver.passwordHash;
    return res.json(resultTrip);
  }
}

export default new TripController();
