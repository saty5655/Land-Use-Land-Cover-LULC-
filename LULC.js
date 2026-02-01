

// 1) Region of Interest (ROI) - India boundaries
var countries = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');
var roi = countries.filter(ee.Filter.eq('country_na', 'India'));

// 2) Time window
var startDate = '2019-12-01';
var endDate   = '2020-12-03';

// 3) Load Dynamic World collection
var dw = ee.ImageCollection('GOOGLE/DYNAMICWORLD/V1')
  .filterDate(startDate, endDate);

// 4) Mosaic and clip to ROI
var dwImage = ee.Image(dw.mosaic()).clip(roi);
print('Dynamic World mosaic (clipped)', dwImage);

// 5) Select classification band
var classification = dwImage.select('label');

// 6) Visualization parameters
var classNames = [
  'Water',
  'Trees',
  'Grass',
  'Flooded vegetation',
  'Crops',
  'Shrub & Scrub',
  'Built-up',
  'Bare ground',
  'Snow & Ice'
];

var classColors = [
  '#1E90FF', // Water
  '#006400', // Trees
  '#FFD700', // Grass
  '#7CFC00', // Flooded vegetation
  '#228B22', // Crops
  '#6B8E23', // Shrub & Scrub
  '#FF0000', // Built-up
  '#FFA500', // Bare ground
  '#FFFFFF'  // Snow & Ice
];

var dwVisParams = {
  min: 0,
  max: 8,
  palette: classColors
};

// 7) Add layers to map
Map.addLayer(classification, dwVisParams, 'Dynamic World LULC (label)');
Map.centerObject(roi, 5);

// 8) Add India boundary outline
var boundaryStyle = {
  color: '000000',      // black boundary
  width: 2,
  fillColor: '00000000' // transparent fill
};
Map.addLayer(roi.style(boundaryStyle), {}, 'ROI Boundary');

// 9) Legend UI
var legend = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 12px'
  }
});

// Title
legend.add(ui.Label({
  value: 'Dynamic World LULC',
  style: {
    fontWeight: 'bold',
    fontSize: '14px',
    margin: '0 0 8px 0'
  }
}));

// Rows
for (var i = 0; i < classNames.length; i++) {
  var row = ui.Panel({
    layout: ui.Panel.Layout.Flow('horizontal'),
    style: { margin: '0 0 4px 0' }
  });

  var colorBox = ui.Label({
    style: {
      backgroundColor: classColors[i],
      padding: '8px',
      margin: '0 6px 0 0'
    }
  });

  var label = ui.Label({
    value: classNames[i],
    style: { fontSize: '12px' }
  });

  row.add(colorBox);
  row.add(label);
  legend.add(row);
}

Map.add(legend);

