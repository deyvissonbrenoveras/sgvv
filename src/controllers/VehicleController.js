import * as Yup from 'yup';
import Vehicle from '../models/Vehicle';

class VehicleController {
  async index(req, res) {
    const { _id } = req.params;
    const vehicle = await Vehicle.findById(_id).populate('image');
    if (!vehicle) {
      return res.status(400).json({ error: 'O veículo informado não existe' });
    }
    return res.json(vehicle);
  }

  async show(req, res) {
    const vehicles = await Vehicle.find().populate('image');
    return res.json(vehicles);
  }

  async store(req, res) {
    const newVehicle = req.body;

    const schema = Yup.object().shape({
      description: Yup.string().required(),
      model: Yup.string().notRequired(),
      brand: Yup.string().required(),
      manufacturingYear: Yup.number().min(1900).max(2099).notRequired(),
      paintColor: Yup.string().notRequired(),
      licensePlate: Yup.string().notRequired(),
      active: Yup.boolean().notRequired(),
      image: Yup.string().notRequired(),
    });

    if (!(await schema.isValid(newVehicle))) {
      return res.status(400).json({ error: 'Veículo não validado' });
    }
    const vehicleDescriptionExists = await Vehicle.findOne({
      description: newVehicle.description,
    });

    if (vehicleDescriptionExists) {
      return res
        .status(400)
        .json({ error: 'Já existe um veículo cadastrado com essa descrição' });
    }

    if (newVehicle.licensePlate) {
      const vehiclePlateExists = await Vehicle.findOne({
        licensePlate: newVehicle.licensePlate,
      });
      if (vehiclePlateExists) {
        return res
          .status(400)
          .json({ error: 'Já existe um veículo cadastrado com essa placa' });
      }
    }

    const vehicle = await Vehicle.create(req.body);
    return res.json(vehicle);
  }

  async update(req, res) {
    const vehicleUpdate = req.body;
    const { _id } = req.params;
    const vehicle = await Vehicle.findById(_id);

    if (!vehicle) {
      return res.status(400).json({ error: 'O veículo informado não existe' });
    }

    const vehicleDescriptionExists = await Vehicle.findOne({
      description: vehicleUpdate.description,
    });

    if (vehicleDescriptionExists && !vehicleDescriptionExists._id.equals(_id)) {
      return res
        .status(400)
        .json({ error: 'Já existe um veículo cadastrado com essa descrição' });
    }
    if (vehicleUpdate.licensePlate) {
      const vehiclePlateExists = await Vehicle.findOne({
        licensePlate: vehicleUpdate.licensePlate,
      });
      if (vehiclePlateExists && !vehiclePlateExists._id.equals(_id)) {
        return res
          .status(400)
          .json({ error: 'Já existe um veículo cadastrado com essa placa' });
      }
    }
    const vehicleUpdated = await Vehicle.findOneAndUpdate(
      { _id },
      vehicleUpdate,
      {
        new: true,
      }
    ).populate('image');
    return res.json(vehicleUpdated);
  }
}

export default new VehicleController();
