const handleAsync = require("../middleware/catchAsyncError");
const cloudinary = require("cloudinary");
var db;
const { MongoClient } = require('mongodb')
var ObjectId = require('mongodb').ObjectID;


MongoClient.connect(process.env.DB_URI, function (err, client) {
    if (err) throw err;

    console.log("Connected to MongoDB")
    db = client.db('InternAssignment');
    console.log("Connected to Intern Assignment")
});

exports.getEvents = handleAsync(async (req, res, next) => {
    const id = req.query.id;
    const currentPage = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 100;
    var result
    if (id) {
        result = await db.collection("events").findOne({ "_id": new ObjectId(id) })
        res.send({
            success: "true",
            result,
        });
    }

    result = await db.collection("events").find().limit(limit).skip(limit * (currentPage - 1)).toArray()


    res.json({
        success: true,
        result,
    });
});

exports.createEvent = handleAsync(async (req, res, next) => {

    const { name, image, tagline, schedule, description, moderator, category, sub_category, rigor_rank } = req.body;
    if (name && image && tagline && schedule && description && moderator, category, sub_category, rigor_rank) {
        let images = [];
        if (typeof req.body.image === "string") {
            images.push(req.body.image);
        } else {
            images = req.body.image;
        }

        const imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
            await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
            }).then((result) => {
                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }).catch(err => console.log(err));


        }

        req.body.image = imagesLinks;

        req.body.createdAt = new Date()

        const result = await db.collection("events").insertOne(req.body);
        res.json({ success: true, result });
    }
    else {
        res.json({
            success: false,
            message: "All fields are required refer to documentation for more info"
        })
    }

})

exports.updateEvent = async (req, res, next) => {

    const id = req.params.id;
    var result
    id && (result = await db.collection("events").findOne({ "_id": new ObjectId(id) })
    )

    if (!result) { res.json({ message: `No event found for id:${id}` }) }

    const { name, image, tagline, schedule, description, moderator, category, sub_category, rigor_rank } = req.body;
    if (name && image && tagline && schedule && description && moderator, category, sub_category, rigor_rank) {
        let images = [];
        images.push(req.body.image);

        if (image !== undefined) {
            // Deleting Images From Cloudinary
            for (let i = 0; i < result.images.length; i++) {
                await cloudinary.v2.uploader.destroy(result.images[i].public_id);
            }

            const imagesLinks = [];

            for (let i = 0; i < images.length; i++) {
                const result = await cloudinary.v2.uploader.upload(images[i], {
                    folder: "products",
                });

                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }

            req.body.images = imagesLinks;
        }

        const result = await db.collection("events").replaceOne({ "_id": new ObjectId(id) }, req.body);
        res.json({ success: true, result });
    }
    else {
        res.json({
            success: false,
            message: "All fields are required refer to documentation for more info"
        })
    }



}

exports.deleteEvent = handleAsync(async (req, res, next) => {

    const id = req.params.id;
    const result = await db.collection("events").deleteOne({ "_id": new ObjectId(id) });
    if (result.deletedCount === 1) {
        res.json({ success: true })
    } else {
        console.log("No documents matched the query. Deleted 0 documents.");
        res.json({
            success: false,
            message: "No Document matched with given id"
        })
    }



})