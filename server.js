const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

// console.log(process.env.DATABASE);
// console.log(process.env.DATABASE_PASSWORD);
// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD,
// );
// DUE TO PASSWORD INCLUDE @@ THIS⤴ WERE NOT WORKING

mongoose
  .connect(
    'mongodb+srv://muhammad-ahmad:Ugv%40%404466@cluster0.hcul8cj.mongodb.net/findReunite?retryWrites=true&w=majority',
  )
  .then(() => {
    console.log('Connected to MongoDB');
    // Your further code after successful connection
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

console.log(app.get('env'));

const port = process.env.PORT || 800;
app.listen(port, () => {
  console.log('Listening on port ' + port);
});
