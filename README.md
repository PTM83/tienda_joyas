# Proyecto
- Realizado con Myriam Ortiz

# tienda_joyas
Desafío que corresponde al bootcamp de Desafío Latam, que se debe desarrollar el Backend para una tienda de Joyas.

# Data Base
1. Se debe crear una base de dato denominada joyas, donde se creará una tabla con la siguiente configuración:

`CREATE DATABASE joyas;`

CREATE TABLE inventario (
    id SERIAL, 
    nombre VARCHAR(50), 
    categoria VARCHAR(50), 
    metal VARCHAR(50), 
    precio INT, 
    stock INT
    );

2. Se debe crear la tabla inventario, la cual es poblada con la siguiente información:

INSERT INTO inventario values
(DEFAULT, 'Collar Heart', 'collar', 'oro', 20000 , 2), 
(DEFAULT, 'Collar History', 'collar', 'plata', 15000 , 5), 
(DEFAULT, 'Aros Berry', 'aros', 'oro', 12000 , 10),
(DEFAULT, 'Aros Hook Blue', 'aros', 'oro', 25000 , 4), 
(DEFAULT, 'Anillo Wish', 'aros', 'plata', 30000 , 4), 
(DEFAULT, 'Anillo Cuarzo Greece', 'anillo', 'oro', 40000 , 2);

3. Conectar la base de datos.
- Se puede cargar el repositorio dotenv, con `npm install dotenv`
- Crear un archivo `.env`.
- Agregar las credenciales personales. Ver el archivo `example.env`
