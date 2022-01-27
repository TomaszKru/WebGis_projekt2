"use strict";

require([
    'esri/Map',
    'esri/views/SceneView',
    'esri/layers/FeatureLayer',
    'esri/Graphic',
    'esri/layers/GraphicsLayer',
    'esri/widgets/BasemapGallery',
    'esri/widgets/Expand',
    'esri/widgets/Legend',
], (Map, SceneView, FeatureLayer, Graphic, GraphicsLayer, BasemapGallery, Expand, Legend) =>{
    
    const fl1 = new FeatureLayer({
        url: "https://services.arcgis.com/ue9rwulIoeLEI9bj/ArcGIS/rest/services/Earthquakes/FeatureServer/0"
    });

    const fl2 = new FeatureLayer({
        url: "https://services.arcgis.com/ue9rwulIoeLEI9bj/ArcGIS/rest/services/Earthquakes/FeatureServer/0"
    });
    
    
    let gl = new GraphicsLayer();
    
    const map1 = new Map({
        basemap: "topo-vector"
    });
    const view = new SceneView({
        map: map1,
        container: "div",
        zoom: 4,
        center: [75, 140]
    });

    map1.addMany([fl2, gl]);

    const legend = new Legend({
        view: view
    });

    view.ui.add(legend, {position:"bottom-right"});

    let query = fl1.createQuery();
    query.where="MAGNITUDE > 4";
    query.outFields = ['*'];
    query.returnGeometry = true;

    fl1.queryFeatures(query).then(response =>{
        getResults(response.features);
    });

    const getResults = (features) =>{
        const symbol ={
            type: "simple-marker",
            color: "yellow",
            size: 30
        };
        features.map(elem => {
            elem.symbol=symbol
        });
        gl.addMany(features);
    };

    const simpleRenderer = {
        type: 'simple',
        symbol: {
            type:"point-3d",
            symbolLayers:[
                {
                    type:"object",
                    resource:{
                        primitive:"cylinder"
                    },
                    width: 50000
                }
            ]
        },
        visualVariables: [
            {
                type: "color",
                field: "MAGNITUDE",
                stops:[
                    {
                        value: 0.5,
                        color: "green"
                    },
                    {
                        value: 4.48,
                        color: "red"
                    }
                ]
            },
            {
                type: "size",
                field: "DEPTH",
                stops: [
                    {
                        value: -3.39,
                        size: 10000
                    },
                    {
                        value: 30.97,
                        size: 100000
                    }
                ]
            }
        ]
    };

    fl2.renderer=simpleRenderer;
    
});

