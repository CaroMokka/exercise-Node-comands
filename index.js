const { v4: uuidv4 } = require("uuid")
const clc = require("cli-color")
const fs = require('fs')
const yargs = require("yargs")
yargs
    .command(
        "saludar", 
        "Comando utilizado para saludar recibiendo el nombre y el apellido",
        {
            nombre: {
                alias: "n",
                describe: "Nombre para el saludo", 
                demandOption: true,
                type: "string"
            },
            apellido: {
                alias: "a",
                describe: "Apellido para el saludo",
                demandOption: true,
                type: "string"
            }

        },
        ( {nombre, apellido} ) =>{
            console.log(`Hola, Bienvenid(a) ${nombre} ${apellido}`)
        }
        )
    .command(
            "crear",
            "Comando para crear persona",
            {
                rut_dv: {
                    alias: "rd",
                    describe: "Dígito verificador de la persona a registrar",
                    demandOption: true,
                    type: "string"
                },
                rut_numero: {
                    alias: "rn",
                    describe: "Parte númerica del RUT de la persona a registrar",
                    demandOption: true,
                    type: "number"
                },
                nombre: {
                    alias: "n",
                    describe: "Nombre para el saludo",
                    demandOption: true,
                    type: "string"
                },
                apellido: {
                    alias: "a",
                    describe: "Apellido para el saludo",
                    demandOption: true,
                    type: "string"
                }
                
            },
            (arguments) => {
                const id= uuidv4()
                const { rut_dv, rut_numero, nombre, apellido } = arguments
                const persona = {
                    id,
                    rut_dv,
                    rut_numero,
                    nombre,
                    apellido
                }
                //console.log(persona)
                const contentString = fs.readFileSync(`${__dirname}/files/personas.txt`, "utf-8")
                const contentJS = JSON.parse(contentString) //[]

                const busqueda = contentJS.some( item => item.rut_dv == rut_dv && item.rut_numero == rut_numero)

                if(busqueda) {
                    return console.log(clc.red("RUT registrado previamente, por favor ingresar datos de otra persona"));
                }
                contentJS.push(persona)

                fs.writeFile(`${__dirname}/files/personas.txt`, JSON.stringify(contentJS), "utf-8", (err) => console.log(clc.red(err)))

                console.log(clc.green("Registro de persona exitoso")); 
            }
        )
    .command(
        "listar",
        "Comando para registrar una lista de personas registradas",
        {},
        () => {
            const contentString = fs.readFileSync(`${__dirname}/files/personas.txt`, "utf-8")
            const contentJS = JSON.parse(contentString)
            contentJS.sort( (a, b) => a.rut_numero - b.rut_numero )
            const response = contentJS.map(item => {
                return {
                    id: item.id,
                    rut: `${item.rut_numero}-${item.rut_dv}`,
                    nombre: item.nombre,
                    apellido: item.apellido       
                }
            })
            console.table(response)

        }
    )
        .help().argv