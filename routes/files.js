const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const File = require("../models/file");
const { v4: uuid4 } = require("uuid");

///Disk Storge
let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()} - ${Math.random() * 1e9} ${path.extname(
      file.originalname
    )}`;
    // 2324445-3238979821653.zip
    cb(null, uniqueName);
  },
});

let upload = multer({
  storage: storage,
  limit: { fileSize: 1000000 * 100 },
}).single("myfile");

router.post("/", (req, res) => {
  //Store files
  upload(req, res, async (err) => {
    //validate request
    if (!req.file) {
      return res.json({ errors: "All fields are required" });
    }

    if (err) {
      return res.status(500).send({ errors: err.message });
    }
    //Store into Database // first we need model

    const file = new File({
      filename: req.file.filename,
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size,
    });

    const response = await file.save();

    return res.json({
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
    });
  });

  //Response -> Link
});

// For Email Sending
router.post("/send", async (req, res) => {
  // console.log(req.body);
  // return res.send({});

  const { uuid, emailTo, emailFrom } = req.body;
  //validate Requests

  if (!uuid || !emailTo || !emailFrom) {
    return res.status(422).send({ error: "All Fields sre Required" });
  }

  // now get Data from database
  try {
    const file = await File.findOne({ uuid: uuid });
    if (file.sender) {
      return res.status(422).send({ error: "Email already sent once." });
    }
    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();
    // send mail
    const sendMail = require("../services/emailService");
    sendMail({
      from: emailFrom,
      to: emailTo,
      subject: "inShare file sharing",
      text: `${emailFrom} shared a file with you.`,
      html: require("../services/emailTemplate")({
        emailFrom,
        downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}?source=email`,
        size: parseInt(file.size / 1000) + " KB",
        expires: "24 hours",
      }),
    })
      .then(() => {
        return res.json({ success: true });
      })
      .catch((err) => {
        return res.status(500).json({ error: "Error in email sending." });
      });
  } catch (err) {
    return res.status(500).send({ error: "Something went wrong." });
  }
});

module.exports = router;
