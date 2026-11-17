
import http from 'http';
import fs from 'fs';

const vehicles = [
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

const server = http.createServer((req, res) => {

    if (req.url === "/" && req.method === "GET") {

        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end(`
            <h1>Vehicle Management System</h1>
            <p>Welcome to our Vehicle Management Application.</p>
            <p>Manage your vehicle records easily.</p>
        `);

    }

    else if (req.url === "/vehicles" && req.method === "GET") {

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify(vehicles, null, 2));

    }

    else if (req.url === "/about" && req.method === "GET") {

        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end(`
            <h1>About Vehicle Management System</h1>
            <p>This application manages vehicle records.</p>
            <p>Developed using Node.js HTTP and FS modules.</p>
        `);

    }

    else if (req.url === "/info" && req.method === "GET") {

        fs.readFile(new URL('./public/info.html', import.meta.url), 'utf8', (err, data) => {

            if (err) {

                res.writeHead(500, {
                    "Content-Type": "text/plain"
                });

                res.end("Internal Server Error: Unable to read file");

            }

            else {

                res.writeHead(200, {
                    "Content-Type": "text/html"
                });

                res.end(data);

            }

        });

    }

    else if (req.url === "/add-vehicle" && req.method === "POST") {

        let body = "";

        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {

            try {

                const newVehicle = JSON.parse(body);

                const { id, vehicleName, vehicleNumber, type, price } = newVehicle;

                if (
                    !Number.isInteger(id) ||
                    !vehicleName ||
                    !vehicleNumber ||
                    !type ||
                    !Number.isFinite(price) ||
                    price <= 0
                ) {

                    res.writeHead(400, {
                        "Content-Type": "application/json"
                    });

                    res.end(JSON.stringify({
                        message: "All required fields must be valid"
                    }));

                    return;

                }

                if (vehicles.some(vehicle => vehicle.id === id)) {

                    res.writeHead(400, {
                        "Content-Type": "application/json"
                    });

                    res.end(JSON.stringify({
                        message: "Vehicle ID already exists"
                    }));

                    return;

                }

                vehicles.push(newVehicle);

                res.writeHead(201, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    message: "Vehicle added successfully",
                    vehicle: newVehicle
                }));

            }

            catch (error) {

                res.writeHead(400, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    message: "Invalid JSON format"
                }));

            }

        });

    }

    else {

        res.writeHead(404, {
            "Content-Type": "text/plain"
        });

        res.end("404 - Route Not Found");

    }

});

server.listen(3000, () => {
    console.log("HTTP Server running at http://localhost:3000");
});
