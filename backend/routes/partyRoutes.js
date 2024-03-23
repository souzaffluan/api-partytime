const router = require("express").Router();
const jwt = require("jsonwebtoken");
const multer = require("multer");

const Party = require("../models/party");
const User = require("../models/user");

//definir onde íra salvar o arquivo da foto
const diskStorage = require("../helpers/file-storage");
const upload = multer({ storage: diskStorage });

//middlewares
const verifyToken = require("../helpers/check-token");
//const getUserByToken = require('../helpers/get-user-by-token');

//helpers
const getUserByToken = require("../helpers/get-user-by-token");

//criar nova party
router.post(
  "/",
  verifyToken,
  upload.fields([{ name: "photos" }]),
  async (req, res) => {
    // requisição dados
    const title = req.body.title;
    const description = req.body.description;
    const partyDate = req.body.party_date;

    let files = [];

    if (req.files) {
      files = req.files.photos;
    }

    //validações
    if (title == "null" || description == "null" || partyDate == "null"){
      return res
        .status(400)
        .json({ error: "Preencha pelo menos nome, descrição e data!" });
    }

    //verificar usuario
    const token = req.header("auth-token");

    const userByToken = await getUserByToken(token);

    const userId = userByToken._id.toString();

    let photoPaths = [];

    try {
      const user = await User.findOne({ _id: userId });
      let photos = [];
      if (files && files.length > 0) {
        files.forEach((photo, i) => {
          photoPaths.push(photo.path);
        });
      }
      const party = new Party({
        title: title,
        description: description,
        partyDate: partyDate,
        privacy: req.body.privacy,
        userId: user._id.toString(),
        photos: photoPaths
      });
      try {
        const newParty = await party.save();
        res.json({
          error: null,
          msg: "Evento criado com sucesso",
          data: newParty,
        });
      } catch (err) {
        return res.status(400).json({ error });
      }
    } catch (err) {
      return res.status(400).json({ error: "Acesso negado" });
    }
  }
);

router.get("/all", async (req, res) => {
  try {
    const parties = await Party.find({ privacy: false }).sort([["_id", -1]]);
    res.json({ error: null, parties: parties });
  } catch (error) {
    return res.status(400).json({ error });
  }
});

//todas a festa do usuario para fazer deshboard
router.get("/userparties", verifyToken, async (req, res) => {
  try {
    const token = req.header("auth-token");

    const user = await getUserByToken(token);

    const userId = user._id.toString();

    const parties = await Party.find({ userId: userId });
    res.json({ error: null, parties: parties });
  } catch (error) {
    return res.status(400).json({ error });
  }
});

//pegar um festa e alterar
router.get("/userparty/:id", verifyToken, async (req, res) => {
  try {
    const token = req.header("auth-token");

    const user = await getUserByToken(token);

    const userId = user._id.toString();
    const partyId = req.params.id;

    const party = await Party.findOne({ _id: partyId, userId: userId });

    res.json({ error: null, party: party });
  } catch (error) {
    return res.status(400).json({ error });
  }
});

//pegar festa publiclas ou privadas
router.get("/:id", async (req, res) => {
  //find festas

  try {
    const id = req.params.id;

    const party = await Party.findOne({ _id: id });

    //public party
    if (party.privacy === false) {
      res.json({ error: null, party: party });
      // festa privada
    } else {
      const token = req.header("auth-token");
      const user = await getUserByToken(token);

      const userId = user._id.toString();

      const partyUserId = party.userId.toString();

      //chegar se o id de usuário da festa é o mesmo do criador da festa
      if (userId == partyUserId) {
        res.json({ error: null, party: party });
      }
    }
  } catch (err) {
    return res.status(400).json({ error: "Evento nao existe" });
  }
});

//deletar a festa
router.delete("/", verifyToken, async (req, res) => {
  const token = req.header("auth-token");
  const user = await getUserByToken(token);
  const partyId = req.body.id;
  const userId = user._id.toString();

  try {
    await Party.deleteOne({ _id: partyId, userId: userId });
    res.json({ error: null, msg: "Evento removido co sucesso!" });
  } catch (err) {
    res.status(400).json({ error: "Acesso negado!" });
  }
});

//atualizar festa
router.patch(
  "/",
  verifyToken,
  upload.fields([{ name: "photos" }]),
  async (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const partyDate = req.body.party_date;
    const partyId = req.body.id;
    const partUserId = req.body.user_id;

    let files = [];

    if (req.files) {
      files = req.files.photos;
    }

    //validações
    if (title == "null" || description == "null" || partyDate == "null") {
      return res
        .status(400)
        .json({ error: "Preencha pelo menos nome, descrição e data!" });
    }

    //verificar usuario pelo token
    const token = req.header("auth-token");
    const userByToken = await getUserByToken(token);

    const userId = userByToken._id.toString();

    if (userId != partUserId) {
      return res.status(400).json({ error: "Acesso negado!" });
    }

    //contruir objeto da festa para atualizar

    const party = {
      id: partyId,
      title: title,
      description: description,
      partyDate: partyDate,
      privacy: req.body.privacy,
      userId: userId,
    };

    let photos = [];
    if (files && files.length > 0) {
      files.forEach((photo, i) => {
        photos[i] = photo.path;
      });

      party.photos = photos;
    }

    try{

        //fazer atualização dos dados da festa

        const updatedParty = await Party.findByIdAndUpdate({_id: partyId, userId: userId}, {$set: party}, {new: true});
        res.json({error: null, msg:"Evento atualizado com sucesso", data: updatedParty})

    }catch(error){

        res.status(400).json({error})
    }
});

module.exports = router;
