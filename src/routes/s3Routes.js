/* eslint-disable no-undef */
const { S3Client, ListObjectsV2Command, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3'),
    express = require('express'),
    router = express.Router(),
    path = require('path'),
    fs = require('fs'),
    fileUpload = require('express-fileupload');

const IMAGES_BUCKET = 'my-cool-local-bucket';
// Define the path to the utils folder for temporary storage
const UPLOAD_TEMP_PATH = path.join(__dirname, '../utils')

// Add command req.files, otherwise it will not be recognized
router.use(fileUpload());

// Initialize the S3 client
const s3Client = new S3Client({
    region: 'us-east-1',
    endpoint: 'http://localhost:4566',
    forcePathStyle: true
});

// Listing all objects in a S3 bucket
router.get('/images', async (req, res) => {
    try {
        const listObjectsParams = { Bucket: IMAGES_BUCKET };
        const listObjectsCmd = new ListObjectsV2Command(listObjectsParams);
        const listObjectsResponse = await s3Client.send(listObjectsCmd);
        res.status(200).send(listObjectsResponse);
    } catch (error) {
        console.error('Error listing objects:', error);
        res.status(500).send('Failed to list objects');
    }
});

// Uploading an object to a S3 bucket
router.post('/images', async (req, res) => {

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
                Key: fileName,
                Body: fileData,
                ContentType: contentType
            };
            const putObjectCmd = new PutObjectCommand(uploadParams);
            await s3Client.send(putObjectCmd);

            // Delete the file from the temp path after upload
            fs.unlinkSync(tempPath);

            res.status(200).send(`File ${fileName} uploaded successfully.`);
        } catch (error) {
            console.error('Error uploading file:', error);
            res.status(500).send('The file could not be uploaded');
        }
    });
});

// Retrieving an object from a S3 bucket
router.get('/images/:key', async (req, res) => {
    try {
        const fileKey = req.params.key;

        const getObjectParams = {
            Bucket: IMAGES_BUCKET,
            Key: fileKey
        };
        const getObjectCmd = new GetObjectCommand(getObjectParams)
        const objectData = await s3Client.send(getObjectCmd);

        const contentType = objectData.ContentType || 'application/octet-stream';
        res.setHeader('Content-Type', contentType);

        objectData.Body.pipe(res).on('finish', () => {
            console.log(`File ${fileKey} retrieved successfully.`);
        });

    } catch (error) {
        console.error('Error retrieving object:', error);
        res.status(500).send('Failed to retrieve object');
    }
})

module.exports = router;
