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
                    type: "string",
                    coerce: (arg) => {
                        if(arg.length > 1) throw new Error('El número verificador no debe tener más de 1 caracter')
                        return arg
                    }
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
    .command(
        "modificar",
        "Comando utilizado para modificar los datos de una persona registrada",
        {
            id: {
                alias: "i",
                describe: "Identificación única de la persona a modificar",
                type: "string",
                demandOption: true
            },
            rut_dv: {
                alias: "rd",
                describe: "Dígito verificador de la persona a registrar",
                demandOption: false,
                type: "string",
                coerce: (arg) => {
                    if(arg.length > 1) throw new Error('El número verificador no debe tener más de 1 caracter')
                    return arg
                }
            },
            rut_numero: {
                alias: "rn",
                describe: "Parte númerica del RUT de la persona a registrar",
                demandOption: false,
                type: "number"
            },
            nombre: {
                alias: "n",
                describe: "Nombre para el saludo",
                demandOption: false,
                type: "string"
            },
            apellido: {
                alias: "a",
                describe: "Apellido para el saludo",
                demandOption: false,
                type: "string"
            }
        },
        ({ id, rut_dv, rut_numero, nombre, apellido }) => {

            if(rut_dv == undefined && rut_numero == undefined && nombre == undefined && apellido == undefined) {
                return console.log(clc.yellow("Por favor enviar un atributo a modificar"))
            }

            const contentText = fs.readFileSync(`${__dirname}/files/personas.txt`, "utf-8")
            const contentJS = JSON.parse(contentText)

            const busqueda = contentJS.find( item => item.id === id )
            if(!busqueda) return console.log(clc.red("ID de persona no registrada"))
            busqueda.nombre = nombre != undefined ? nombre : busqueda.nombre
            busqueda.apellido = apellido != undefined ? apellido : busqueda.apellido
            busqueda.rut_dv = rut_dv ? rut_dv : busqueda.rut_dv
            busqueda.rut_numero = rut_numero ? rut_numero : busqueda.rut_numero 

            fs.writeFileSync(`${__dirname}/files/personas.txt`, JSON.stringify(contentJS), "utf-8")
            console.log(clc.green("Datos de persona modificada con éxito"))

            //if(busqueda) return console.log(clc.green("Usuario encontrado"), busqueda)

            
        }
    )
    .command(
        "eliminar",
        "Comando para eliminar personas registradas",
        {
            id: {
                alias: "e",
                describe: "ID utilizado como referencia para eliminar un registro de persona",
                demandOption: true,
                type: "string"
            }
        },
        ({ id }) => {
            const contentText = fs.readFileSync(`${__dirname}/files/personas.txt`, "utf-8")
            const contentJS = JSON.parse(contentText) 
            
            
            const deleteElementID = contentJS.filter( item => item.id !== id )
            if(deleteElementID.length == contentJS.length) return console.log(clc.bgYellowBright("El ID enviado no coincide que el registro de personas"))
            fs.writeFileSync(`${__dirname}/files/personas.txt`, JSON.stringify(deleteElementID), "utf-8")
            console.log(clc.bgYellow("El registro de la persona ha sido eliminado"))
            
        }
    )
        .help().argv

        //coerce() validación especifico
        //check() validación general