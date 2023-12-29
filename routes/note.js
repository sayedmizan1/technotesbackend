const express = require("express");
const router = express.Router();
const { query, validationResult, body } = require("express-validator");
const Notes = require("../models/Note");
const fetchuser = require("../middleware/fetchuser");
// niche / dene ka mtlb h ki jo index.js me app.use m likhe ho ushi link p jyege r agr yha / ke sth kuch jor doge tb link m v auth/ k bd likhna pdega usko
// Route 1 :  get all the notes using get /note/fetchallnotes login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "some error occur" });
  }
});

// Route 2 :  Add new note using Post /note/addnote login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "enter a valid title").isLength({ min: 3 }),
    body("content").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, content } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({
        title,
        content,
        user: req.user.id,
      });
      const savednote = await note.save();
      res.json(savednote);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "some error occur" });
    }
  }
);

// Route 3 :  update note using Put /note/update login required

router.put("/update/:id", fetchuser, async (req, res) => {
  const { title, content } = req.body;
  //create new note and update as per request
  try {
    
 
  const newnote = {};
  if (title) {
    newnote.title = title;
  }
  if (content) {
    newnote.content = content;
  }

  // find the note to be updated and update it

  let note = await Notes.findById(req.params.id);
  // below if condition check is there any note is there or not
  if (!note) {
    return res.status(401).send("not found");
  }
  // below if condition check weather the user who r trying to update note and the original note user both are same or not
  if (note.user.toString() !== req.user.id) {
    return res.status(401).send("Not allowed");
  }

  note = await Notes.findByIdAndUpdate(
    req.params.id,
    { $set: newnote },
    { new: true }
  );
  res.json(note);
} catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "some error occur" });
  }
});

// Route 4 :  delete note using Delete /note/delete login required

router.delete("/delete/:id", fetchuser, async (req, res) => {

    try{
  let note = await Notes.findById(req.params.id);
  // below if condition check is there any note is there or not
  if (!note) {
    return res.status(401).send("not found");
  }
  // below if condition check weather the user who r trying to udelete note and the original note user both are same or not
  if (note.user.toString() !== req.user.id) {
    return res.status(401).send("Not allowed");
  }
  note = await Notes.findByIdAndDelete(req.params.id);
  res.json("deleted successfully");
} catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "some error occur" });
  }
});

module.exports = router;
