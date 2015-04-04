var question = {
    "variables": {
        "variable": {
            "valor": [
                "1",
                "2",
                "3",
                "45"
            ],
            "tipo": "especifica",
            "id": "x"
        }
    },
    "pregunta": {
        "formulacion": {
            "expresion": [
                {
                    "tipo": "texto",
                    "texto": "Cual es el valor de la variable\u00a0"
                },
                {
                    "tipo": "expresion",
                    "texto": "equation-0"
                }
            ]
        },
        "objetos": {
            "json": "%5B%7B%22id%22%3A0%2C%22tag%22%3A%22%22%2C%22opentag%22%3A%22%22%2C%22closetag%22%3A%22%22%2C%22children%22%3A%5B%7B%22id%22%3A1%2C%22tag%22%3A%22%3Cmn%3Ex%3C%2Fmn%3E%22%2C%22opentag%22%3A%22%22%2C%22closetag%22%3A%22%22%2C%22children%22%3A%5B%5D%2C%22meta%22%3A%7B%22type%22%3A%22especifica%22%2C%22id%22%3A%22x%22%2C%22value%22%3A%5B1%2C2%2C3%2C45%5D%7D%7D%5D%2C%22meta%22%3A%7B%7D%7D%5D",
            "html": "%7B%22%22%3A%22%22%2C%22equation-0%22%3A%22%3Cdiv%20class%3D%5C%22view-variable%20ui-draggable%20card2%20first%5C%22%20data-id%3D%5C%221%5C%22%20data-content%3D%5C%22x%5C%22%20data-type%3D%5C%22especifica%5C%22%20data-metadatos%3D%5C%22%5B%201%20%2C%202%20%2C%203%20%2C%2045%20%5D%5C%22%20style%3D%5C%22position%3A%20relative%3B%5C%22%3E%20%3Cspan%20class%3D%5C%22var%5C%22%3Ex%3C%2Fspan%3E%3C%2Fdiv%3E%22%7D"
        }
    },
    "respuesta":{
        "nombre":"otra pregunta",
        "id":"respuesta-0",
        "cifras_decimales":"0.2",
        "formula":"(sin(PI/2)*10)/2",
        "error_genuino": [
            {
                "formula": "sin(PI/2)*10",
                "retro_alimentacion": "te falto dividir por 2 :/"
            },
            {
                "formula": "sin(PI/2)/2",
                "retro_alimentacion": "te falto multiplicar por 10 :/"
            }
        ]
    }
}

window.question = window.question || question;