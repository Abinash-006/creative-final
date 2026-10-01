fetch('http://localhost:3000/api/work')
  .then(r => r.text())
  .then(console.log)
  .catch(console.error);
