const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('public'));

app.get('/:id-:brand', (req, res) => {
  const id = req.params.id;
  const brand = req.params.brand;
  console.log(id)
  console.log(brand)

  const templatePath = path.resolve(__dirname, 'public', 'pages', 'product-detail.html');
  res.sendFile(templatePath);
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.listen(5500, () => {
  console.log('Server is running on port 5500');
});
