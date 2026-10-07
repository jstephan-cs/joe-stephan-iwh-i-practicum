require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const CUSTOM_OBJECT = '2-70613744';
const headers = {
  Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
  'Content-Type': 'application/json'
};

// Route 1: Homepage, GET all Sports Card records
app.get('/', async (req, res) => {
  const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT}?properties=name,sport,year&limit=100`;
  try {
    const response = await axios.get(url, { headers });
    res.render('homepage', {
      title: 'Sports Cards | Integrating With HubSpot I Practicum',
      records: response.data.results
    });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).send('Error retrieving records');
  }
});

// Route 2: Render the form
app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
  });
});

// Route 3: POST form data to create a new Sports Card, then redirect home
app.post('/update-cobj', async (req, res) => {
  const newRecord = {
    properties: {
      name: req.body.name,
      sport: req.body.sport,
      year: req.body.year
    }
  };
  try {
    await axios.post(`https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT}`, newRecord, { headers });
    res.redirect('/');
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).send('Error creating record');
  }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));