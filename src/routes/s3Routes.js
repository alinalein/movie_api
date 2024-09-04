/* eslint-disable no-undef */
const { S3Client, ListObjectsV2Command, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3'),
    express = require('express'),
    router = express.Router(),
    path = require('path'),
    fs = require('fs'),
    fileUpload = require('express-fileupload'),
    passport = require('passport');

const IMAGES_BUCKET = process.env.BUCKET_NAME;

// Define the path to the utils folder for temporary storage
const UPLOAD_TEMP_PATH = path.join(__dirname, process.env.UPLOAD_TEMP_PATH);
const AWS_REGION = process.env.AWS_REGION;

// Add command req.files, otherwise it will not be recognized
router.use(fileUpload());

// Initialize the S3 client -> chnage after testing back !!!!
const s3Client = new S3Client({
    region: AWS_REGION
    // region: 'us-east-1',
    // endpoint: 'http://localhost:4566',
    // forcePathStyle: true
});

// Listing all objects in a S3 bucket depending on the specified type 
router.get('/images/:type', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const type = req.params.type;
        if (!['original', 'thumbnail'].includes(type)) {
            return res.status(400).send('Invalid image type. Use "original" or "thumbnail".');
        }

        const folder = type === 'original' ? 'original-images' : 'resized-images';
        const listObjectsParams = {
            Bucket: IMAGES_BUCKET,
            Prefix: `${folder}`
        };

        const listObjectsCmd = new ListObjectsV2Command(listObjectsParams);
        const listObjectsResponse = await s3Client.send(listObjectsCmd);
        res.status(200).send(listObjectsResponse);
    } catch (error) {
        console.error('Error listing objects:', error);
        res.status(500).send('Failed to list objects');
    }
});


// Uploading an object to a S3 bucket
router.post('/images', passport.authenticate('jwt', { session: false }), async (req, res) => {

    const mime = await import('mime');

    const file = req.files.image
    const fileName = req.files.image.name
    const tempPath = `${UPLOAD_TEMP_PATH}/${fileName}`

    // save file temporarily
    file.mv(tempPath, async (err) => {
        if (err) {
            console.error('Error moving file to temporary path:', err)
            res.status(500).send('The file could not be uploaded')
        }
        try {
            // Read the file from the temporary path
            const fileData = fs.readFileSync(tempPath);
            // Determine file content type based on file extension
            const contentType = mime.default.getType(fileName) || 'application/octet-stream';

            // Upload the file to S3
            const uploadParams = {
                Bucket: IMAGES_BUCKET,
                Key: `original-images/${fileName}`,
                // Key: `resized-images/${fileName}`,
                Body: fileData,
                ContentType: contentType,
            };
            const putObjectCmd = new PutObjectCommand(uploadParams);
            await s3Client.send(putObjectCmd);

            // Delete the file from the temp path after upload
            fs.unlinkSync(tempPath);

            res.status(200).send({ message: `File ${fileName} uploaded successfully.` });
        } catch (error) {
            console.error('Error uploading file:', error);
            res.status(500).send('The file could not be uploaded');
        }
    });
});

// Retrieving an object from a S3 bucket depending on the specified type 
router.get('/images/:key(*)', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const key = req.params.key;

        if (!key.startsWith('original-images/') && !key.startsWith('resized-images/')) {
            return res.status(400).send('Invalid key. The key must start with "original-images/" or "resized-images/".');
        }

        const getObjectParams = {
            Bucket: IMAGES_BUCKET,
            Key: key
        };
        const getObjectCmd = new GetObjectCommand(getObjectParams)
        const objectData = await s3Client.send(getObjectCmd);

        const contentType = objectData.ContentType || 'application/octet-stream';
        res.setHeader('Content-Type', contentType);

        objectData.Body.pipe(res).on('finish', () => {
            console.log(`File ${key} retrieved successfully.`);
        });

    } catch (error) {
        console.error('Error retrieving object:', error);
        res.status(500).send('Failed to retrieve object');
    }
})

module.exports = router;


