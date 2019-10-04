// Imports

// express
const express = require('express');

// our actions helper (given)
const actionMod = require('../data/helpers/actionModel');

// router expressRouter
const router = express.Router();


//GET a specific action by its ID
router.get('/:id', (req, res) => {
    const id = req.params.id;

    actionMod.get(id)
    .then(act => {
        res.status(200).json(act)
    })
    .catch(err => {
        res.status(500).json({ message: `There was an error retrieving action #${id}` })
    })
});

//Post a new action to a project
router.post('/', validateActions, (req, res) => {
    const body = req.body;

    actionMod.insert(body)
    .then(newAct => {
        res.status(201).json(newAct)
    })
    .catch(err => {
        res.status(500).json({ message: "There was an error adding that action." })
    })
});

// PUT/Update action for a project
router.put('/:id', validateActionsId, validateActions, (req, res) => {

    const body = req.body;
    const id = req.params.id;

    actionMod.update(id, body)
    .then(updated => {
        res.status(200).json(updated)
    })
    .catch(err => {
        res.status(500).json({ message: "There was an error updating that action." })
    })
});


// DELETE a specific action from a project based on id
router.delete('/:id', validateActionsId, (req, res) => {
    const id = req.params.id;

    actionMod.remove(id)
    .then(removed => {
        res.status(200).json(removed)
    })
    .catch(err => {
        res.status(500).json({ message: "There was an error removing that action." })
    })
})


// Custom Middle Ware
function validateActions(req, res, next) {
    // need a project_id
    //body.descriptions ** check length
    //body.notes
    const projId = req.body.project_id;
    const description = req.body.description;
    const notes = req.body.notes;

    if(!projId) {
        res.status(400).json({ message: "Please add a project_id field." })
    } else if(!description) {
        res.status(400).json({ message: "Please add a description field." })
    } else if(!notes) {
        res.status(400).json({ message: "Please add a notes field." })
    } else if(description.length > 128) {
        res.status(400).json({ message: `Description Character limit is greater than 128. Your current length is ${description.length}` })
    } else {
        next();
    }
};

function validateActionsId(req, res, next) {
    const id = req.params.id;

    actionMod.get(id)
    .then(act => {
        // if act is a real id, move on
        if(act) {
            next();
        } else {
            res.status(400).json({ message: "That id does not exist." })
        } 
    })
    .catch(err =>{
        res.status(500).json({ message: "There was an error retrieving the action." })
    })
}

module.exports = router;
