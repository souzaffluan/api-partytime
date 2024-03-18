const router = require('express').Router();
const bcrypt = require('bcrypt');


const User = require('../models/user')

//middlewares
const verifyToken = require('../helpers/check-token');

//helpers pegar usuario pelo token
const getUserByToken = require('../helpers/get-user-by-token');

// get and user
router.get('/:id', verifyToken, async (req, res)=>{

    const id = req.params.id;

    // verificar usuario
    try{
        const user = await User.findOne({_id: id}, {password: 0});
        res.json({error: null, user});
    }catch(err){

        return res.status(400).json({error: "Usuário não existe!"});
    }

});

//atualizar usuario
router.put('/',verifyToken, async (req, res)=>{

    const token = req.header("auth-token");
    const user = await getUserByToken(token);
    const userReqId = req.body.id;
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;

    const userId = user._id.toString();


    //checar se o id do usuario é igual o id do token
    if(userId != userReqId){
        res.status(401).json({error: "Acesso negado!"});
    }

    // criar objeto de usuário
    const updateData ={
        name: req.body.name,
        email: req.body.email
    };

    //checar se as senhas batem
    if(password != confirmpassword){
        res.status(401).json({error: "As senhas não conferem"});
    //muddar senha
    }else if(password == confirmpassword && password != null){

        //criar senha
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        //adicionar data de atualização da senha
        updateData.password = passwordHash;

    }

    try{
        //retornar dados atualizados
        const updatedUser = await User.findOneAndUpdate({_id: userId}, {$set: updateData}, {new: true});
        res.json({error: null, msg: "Usuário atualizado com sucesso", data: updatedUser});

    }catch(error){
        res.status(400).json({error});
    }

});
module.exports = router;