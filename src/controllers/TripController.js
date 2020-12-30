import * as Yup from 'yup';
import Trip from '../models/Trip';

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
    const trips = await Trip.find()
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
      vehicle: Yup.string().min(6).required(),
      departureLocation: Yup.object({
        name: Yup.string().required(),
        latLon: Yup.array()
          .of(Yup.number().required())
          .min(2)
          .max(2)
          .required(),
      }),
      arrivalLocation: Yup.object({
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
    const trip = await Trip.findById(_id);
    if (!trip) {
      return res.status(400).json({ error: 'A viagem informada não existe' });
    }
    if (trip.finished) {
      return res.status(400).json({ error: 'Essa viagem já foi encerrada' });
    }
    trip.endTime = new Date(Date.now());
    trip.finished = true;
    await trip.save();
    return res.json(trip);
  }
}

export default new TripController();
