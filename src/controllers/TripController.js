import Trip from '../models/Trip';

class TripController {
  async show(req, res) {
    const trips = await Trip.find({ finished: false })
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
    const { driver, vehicle } = req.body;
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
    const trip = await Trip.create(req.body);
    return res.json(trip);
  }
}

export default new TripController();
