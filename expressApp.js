
import express from 'express';

const app = express();
const PORT = 4000;

app.use(express.json());

let vehicles = [
    {
        id: 1,
        vehicleName: "Hyundai Creta",
        vehicleNumber: "HR26AB1234",
        type: "SUV",
        price: 1500000
    },
    {
        id: 2,
        vehicleName: "Maruti Swift",
        vehicleNumber: "DL8CAF5030",
        type: "Hatchback",
        price: 750000
    },
    {
        id: 3,
        vehicleName: "Mahindra Thar",
        vehicleNumber: "UP14TH2026",
        type: "SUV",
        price: 1800000
    }
];

function isValidVehicle(vehicle) {

    return (
        vehicle &&
        typeof vehicle.vehicleName === "string" &&
        vehicle.vehicleName.trim() !== "" &&
        typeof vehicle.vehicleNumber === "string" &&
        vehicle.vehicleNumber.trim() !== "" &&
        typeof vehicle.type === "string" &&
        vehicle.type.trim() !== "" &&
        Number.isFinite(vehicle.price) &&
        vehicle.price > 0
    );

}

app.get('/vehicles', (req, res) => {

    res.status(200).json({
        message: "All vehicles retrieved successfully",
        vehicles: vehicles
    });

});

app.get('/vehicles/:id', (req, res) => {

    const id = Number(req.params.id);

    const vehicle = vehicles.find(v => v.id === id);

    if (!vehicle) {

        return res.status(404).json({
            message: "Vehicle not found"
        });

    }

    res.status(200).json({
        message: "Vehicle found successfully",
        vehicle: vehicle
    });

});

app.post('/vehicles', (req, res) => {

    const { id } = req.body;

    if (
        !Number.isInteger(id) ||
        id <= 0 ||
        !isValidVehicle(req.body)
    ) {

        return res.status(400).json({
            message: "Invalid vehicle details"
        });

    }

    const existingVehicle = vehicles.find(v => v.id === id);

    if (existingVehicle) {

        return res.status(400).json({
            message: "Vehicle ID already exists"
        });

    }
   // new commit
    const newVehicle = {
        id: id,
        vehicleName: req.body.vehicleName,
        vehicleNumber: req.body.vehicleNumber,
        type: req.body.type,
        price: req.body.price
    };

    vehicles.push(newVehicle);
    res.status(201).json({
        message: "Vehicle added successfully",
        vehicle: newVehicle
    });
});

app.put('/vehicles/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = vehicles.findIndex(v => v.id === id);

    if (index === -1) {

        return res.status(404).json({
            message: "Vehicle not found"
        });

    }

    if (!isValidVehicle(req.body)) {

        return res.status(400).json({
            message: "All vehicle fields are required and price must be positive"
        });

    }

    const updatedVehicle = {
        id: id,
        vehicleName: req.body.vehicleName,
        vehicleNumber: req.body.vehicleNumber,
        type: req.body.type,
        price: req.body.price
    };

    vehicles[index] = updatedVehicle;

    res.status(200).json({
        message: "Vehicle updated successfully",
        vehicle: updatedVehicle
    });

});

app.delete('/vehicles/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = vehicles.findIndex(v => v.id === id);

    if (index === -1) {

        return res.status(404).json({
            message: "Vehicle not found"
        });

    }

    const deletedVehicle = vehicles.splice(index, 1);

    res.status(200).json({
        message: "Vehicle deleted successfully",
        vehicle: deletedVehicle[0]
    });

});

app.use((req, res) => {

    res.status(404).json({
        message: "API route not found"
    });

});

app.use((err, req, res, next) => {

    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {

        return res.status(400).json({
            message: "Invalid JSON format"
        });

    }

    res.status(500).json({
        message: "Internal Server Error"
    });

});

app.listen(PORT, () => {

    console.log(`Express Server running at http://localhost:${PORT}`);

});
