var question = {
  "variables": {
    "text": "_U = U[0, 10, 1]\n_X = U[10, 20, 2]\n",
    "variables": [
      {
        "codeFragment": "_U = U[0, 10, 1]",
        "name": "_U",
        "parameters": {
          "min": "0",
          "max": "10",
          "step": "1"
        },
        "code": "Variables['_U'] = 0 + Math.floor(((10 - 0) * Math.random()/1)) * 1;",
        "possibleValue": null
      },
      {
        "codeFragment": "_X = U[10, 20, 2]",
        "name": "_X",
        "parameters": {
          "min": "10",
          "max": "20",
          "step": "2"
        },
        "code": "Variables['_X'] = 10 + Math.floor(((20 - 10) * Math.random()/2)) * 2;",
        "possibleValue": null
      }
    ]
  },
  "formulation": "<p>Si tengo manzanas y peras <strong>entonces que tengo</strong></p>",
  "answers": [
    {
      _id: 1,
      name: "Área",
      correctValue: "_a * _b",
      showLabel: true,
      precision: 2,
      commonErrors: [
        {
          value: "_b - _a",
          message: "Para calcular el tiempo entre dos primero es el tiempo de fin - tiempo inicio"
        },
        {
          value: "_a * _a",
          message: "Recordar tal formula"
        }
      ]
    },
    {
      _id: 2,
      name: "Perimetro",
      correctValue: "_a * 2 + 2 * _b",
      precision: 3,
      showLabel: false,
      commonErrors: [
        {
          value: "_b - _a",
          message: "Para calcular el tiempo entre dos primero es el tiempo de fin - tiempo inicio"
        },
        {
          value: "_b / _a",
          message: "Recordar tal formula"
        }
      ]
    }
  ]

};
window.question = window.question || question;