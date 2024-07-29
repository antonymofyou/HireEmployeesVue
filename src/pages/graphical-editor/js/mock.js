import { reactive } from "vue";
import { exampleImageBase64 } from "./image";

// Запросим с сервера
const response = {
  "shapes": [
      {
          "id": 1,
          "type": "rectangle",
          "x": 170,
          "y": 100,
          "width": 200,
          "height": 100,
          "color": "#FF5733",
          "borderColor": "#C70039",
          "zIndex": 0.5,
          "cornerRadius": 5,
          "borderWidth": 5,
          "rotation":90
      },
      {
          "id": 2,
          "type": "image",
          "x": 200,
          "y": 200,
          "width": 150,
          "height": 150,
          "imageId": "1",
          "zIndex": 0.7,
          "cornerRadius": 40
      },
      {
        "id": 3,
        "type": "arrow",
        "x": 100,
        "y": 100,
        "width": 200,
        "height": 200,
        fill: '#C70039',
        "borderColor": "#C70039",
        "zIndex": 2,
        "startRotation": 110,
      },
      // {
      //   "type":"arrow",
      //   "id":"66bfd5eb-4f37-432e-9c76-fd3f9d14045e",
      //   "fill":"#ff0000",
      //   "stroke":"#000000",
      //   "strokeWidth":5,
      //   "zIndex":1.6000000000000005,
      //   "radius":0,
      //   "points":[200,200,250,150]
      // },
      {
          "id": 4,
          "type": "rectangle",
          "x": 170,
          "y": 100,
          "width": 200,
          "height": 100,
          "color": "#FF5733",
          "borderColor": "#C70039",
          "zIndex": 0.5,
          "textVerticalAlignment": "top",
          "text": [
              {
                  "alignment": "left",
                  "text": [
                      {
                          "text": "Hello",
                          "type": "bold",
                          "fontSize": 24,
                          "fontColor": "#333333"
                      },
                      {
                          "text": " This is a test text.",
                          "fontSize": 18,
                          "fontColor": "#333333"
                      }
                  ]
              },
              {
                  "alignment": "right",
                  "text": [
                      {
                          "text": "Hello",
                          "type": "bold",
                          "fontSize": 24,
                          "fontColor": "#333333"
                      },
                      {
                          "text": " This is a test text.",
                          "fontSize": 18,
                          "fontColor": "#333333"
                      }
                  ]
              }
          ],
          "borderWidth": 5
      },
      {
        "id": crypto.randomUUID(),
        "type": "rectangle",
        "x": 300,
        "y": 250,
        "width": 200,
        "height": 100,
        "color": "#FF5733",
        "borderColor": "#C70039",
        "zIndex": 1,
        "textVerticalAlignment": "top",
        "borderWidth": 5
    }
  ],
  "imageDictionary": {
    "1": exampleImageBase64,
  },
};

// После - отсортируем по zIndex
export const data = reactive({
  ...response,
  shapes: response.shapes.sort((a, b) => a.zIndex - b.zIndex),
});

export const prevData = reactive({
  "imageDictionary": {
    "1": exampleImageBase64,
  },
  "shapes": [
    {
      "id": 1,
      "type": "rectangle",
      "x": 170,
      "y": 100,
      "width": 200,
      "height": 100,
      "color": "#FF5733",
      "borderColor": "#C70039",
      "zIndex": 0.5,
      "cornerRadius": 20,
      "borderWidth": 5,
      "startRotation": 90
    },
    {
      "id": crypto.randomUUID(),
      "type": "circle",
      "x": 170,
      "y": 100,
      "width": 200,
      "height": 100,
      "color": "#9ddb6b",
      "borderColor": "#C70039",
      "zIndex": 0.5,
      "cornerRadius": 20,
      "borderWidth": 5,
      "startRotation": 90
    },
    {
      "id": 2,
      "type": "image",
      "x": 200,
      "y": 200,
      "width": 150,
      "height": 150,
      "imageId": "1",
      "zIndex": 0.7,
      "cornerRadius": 40,
      src: exampleImageBase64
    },
    {
      "id": 3,
      "type": "arrow",
      "x": 200,
      "y": 200,
      "width": 250,
      "height": 150,
      "borderColor": "#C70039",
      "zIndex": 0.2,
      "startRotation": 110
    },
    {
      "id": 4,
      "type": "rectangle",
      "x": 170,
      "y": 100,
      "width": 200,
      "height": 100,
      "color": "#FF5733",
      "borderColor": "#C70039",
      "zIndex": 0.5,
      "textVerticalAlignment": "middle",
      "text": [
        {
          "alignment": "left",
          "text": [
            {
              "text": "Hello1",
              "type": "bold",
              "fontSize": 24,
              "fontColor": "#333333"
            },
          ]
        },
        {
          "alignment": "right",
          "text": [
            {
              "text": "Hello2",
              "type": "bold",
              "fontSize": 24,
              "fontColor": "#333333"
            },
          ]
        }
      ],
      "borderWidth": 5
    },
    {
      "id": 5,
      "type": "rectangle",
      x: 170,
      y: 100,
      scaleX: 1,
      scaleY: 1,
      "width": 200,
      "height": 100,
      "color": "#FF5733",
      "startRotation": 33,
      "borderColor": "#C70039",
      "zIndex": 0.5,
      "textVerticalAlignment": "bottom",
      "text": [
        {
          "alignment": "left",
          "text": [
            {
              "text": "Hello1",
              "type": "bold",
              "fontSize": 24,
              "fontColor": "#333333"
            },
          ]
        },
        {
          "alignment": "right",
          "text": [
            {
              "text": "Hello2",
              "type": "bold",
              "fontSize": 24,
              "fontColor": "#333333"
            },
          ]
        }
      ],
      "borderWidth": 5
    }
  ]
});
