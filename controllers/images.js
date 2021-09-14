const { ClarifaiStub, grpc } = require('clarifai-nodejs-grpc');

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set('authorization', process.env.CLARIFAI_API);

const handleApiCall = (req, res) => {
  let input = req.body.input;
  stub.PostModelOutputs(
    {
      model_id: 'f76196b43bbd45c99b4f3cd8e8b40a8a',
      inputs: [{ data: { image: { url: input } } }]
    },
    metadata,
    (err, response) => {
      if (response) {
        res.json(response);
      } else if (err) {
        res.status(400).json('error');
      }
    }
  );
};
const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => {
      res.json(entries[0]);
    })
    .catch((err) => {
      res.status(400).json('Unable to get entries');
    });
};

module.exports = {
  handleImage,
  handleApiCall
};
