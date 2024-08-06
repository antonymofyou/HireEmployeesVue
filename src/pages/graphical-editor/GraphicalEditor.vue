<template>
    <template v-for="shape of shapes" :key="shape.id">
        <TheRectangle :params="shape" />
    </template>
</template>

<script setup>

import TheRectangle from './components/TheRectangle.vue';

const shapes = [
    {
        "id": 1,
        "type": "rectangle",
        "x": 170,
        "y": 100,
        "width": 200,
        "height": 100,
        "color": "#FF5733",
        "borderColor": "#C70039",
        "zIndex": 1,
        "cornerRadius": 5,
        "borderWidth": 5,
        "rotation": 90
    },
    {
        "id": 2,
        "type": "rectangle",
        "x": 300,
        "y": 30,
        "width": 200,
        "height": 100,
        "color": "#F73",
        "borderColor": "#C70039",
        "zIndex": 2,
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
        "id": 3,
        "type": "rectangle",
        "x": 230,
        "y": 177,
        "width": 200,
        "height": 100,
        "color": "#F33",
        "borderColor": "#C70039",
        "zIndex": 3,
        "textVerticalAlignment": "top",
        "borderWidth": 5
    }
];

</script>