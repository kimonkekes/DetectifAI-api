const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const PAT = 'd98f4d87b9cc4ffea0bdad9715cbe3b4'
const USER_ID = 'kimon'
const APP_ID = 'image-detection'
const MODEL_ID = 'face-detection'
const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + PAT);

const handleApiCall = (req, res) => {
    stub.PostModelOutputs(
        {
            user_app_id: {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            model_id: MODEL_ID,
            inputs: [
                {
                    data: {
                        image: {
                            url: req.body.input,
                            allow_duplicate_url: true
                        }
                    }
                }
            ]
        },
        metadata,
        (err, response) => {
            if (err) {
                throw new Error(err);
            }
    
            if (response.status.code !== 10000) {
                throw new Error("Post model outputs failed, status: " + response.status.description);
            }

            res.json(response)
        }
    )
}    

const handleImage = (db) => (req, res)=> {
    const { id } = req.body
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries)
    })
    .catch(err => res.status(400).json('Unable to get entries'))     
}

module.exports = { handleImage, handleApiCall }