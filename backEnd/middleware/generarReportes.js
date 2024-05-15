const generarReporte = (req, res, next) => {
    const url = req.url
    const query = req.query
    console.log(`se ha recibido una consulta a la ruta: ${url}, con las siguientes query: `, query)
    next()
}

module.exports = {generarReporte}