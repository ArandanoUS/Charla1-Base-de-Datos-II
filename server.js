const express = require("express");
const sql = require("mssql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const config = {
    user: "sa",
    password: "Charla123!",
    server: "localhost",
    database: "sqlserverdemo",
    options: {
        trustServerCertificate: true
    }
};

sql.connect(config);

// Obtener productos
app.get("/productos", async (req, res) => {
    const result = await sql.query("EXEC ObtenerProductos");
    res.json(result.recordset);
});

//Obtener Historial de Compras
app.get("/historial/:email", async (req,res)=>{
    const result = await sql.query`
        EXEC ObtenerVentasCliente @Email=${req.params.email}
    `;
    res.json(result.recordset);
});

// Procesar compra
app.post("/comprar", async (req, res) => {
    try {
        const {
            nombre,
            email,
            direccion,
            ciudad,
            pais,
            codigoPostal,
            metodoPago,
            numeroTarjeta,
            carrito
        } = req.body;

        const table = new sql.Table();
        table.columns.add("IdProducto", sql.Int);
        table.columns.add("Cantidad", sql.Int);

        carrito.forEach(item => {
            table.rows.add(item.idProducto, item.cantidad);
        });

        const request = new sql.Request();

        request.input("Nombre", sql.VarChar, nombre);
        request.input("Email", sql.VarChar, email);
        request.input("Direccion", sql.VarChar, direccion);
        request.input("Ciudad", sql.VarChar, ciudad);
        request.input("Pais", sql.VarChar, pais);
        request.input("CodigoPostal", sql.VarChar, codigoPostal);
        request.input("MetodoPago", sql.VarChar, metodoPago);
        request.input("NumeroTarjeta", sql.VarChar, numeroTarjeta);
        request.input("Carrito", table);

        await request.execute("ProcesarCompra");

        res.send("Compra realizada con éxito");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.listen(3000, () => console.log("Servidor en puerto 3000"));