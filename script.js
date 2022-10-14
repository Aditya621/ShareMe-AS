const connectDB = require("./config/db");
const File = require("./models/file");
const fs = require("fs");

connectDB();

// Get all records older than 24 hours
async function fetchData() {
  // 24 hours purani files fetch kar ni hai
  const files = await File.find({
    createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });
  if (files.length) {
    for (const file of files) {
      try {
        fs.unlinkSync(file.path); // delete from uploads file seh
        await file.remove(); // file remove from database
        console.log(`successfully deleted ${file.filename}`);
      } catch (err) {
        console.log(`error while deleting file ${err} `);
      }
    }
  }
  console.log("Job done!");
}

fetchData().then(process.exit);
