export const data = {
  "imageDictionary": {},
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
      "rotation": 90
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
      "rotation": 90
    },
    {
      "id": 2,
      "type": "image",
      "x": 200,
      "y": 600,
      "width": 150,
      "height": 150,
      "imageId": "1",
      "zIndex": 0.7,
      "cornerRadius": 40
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
      "rotation": 110
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
    }
  ]
};