// Projects router lives here

// Imports
const express = require("express");
    // helpers model
const ProjectMod = require('../data/helpers/projectModel');
    // Router
const router = express.Router();

//GET all Projects
router.get('/', (req, res) => {
    ProjectMod.get()
    .then(proj => {
        res.status(200).json(proj)
    })
    .catch(err => {
        res.status(500).json({ message: "There was an error trying to retrieve the projects." })
    });
});

// GET a specific project by id
    // needs middleware
router.get('/:id', validateProjectId, (req, res) => {
    const id = req.params.id;

    ProjectMod.get(id)
    .then(proj => {
        res.status(200).json(proj)
    })
    .catch(err => {
        res.status(500).json({ message: "There was an error trying to retrieve that specific poject."})
    })
})

// GET all actions for a project
// getProjectActions() that takes a project id as it's only argument and returns a list of all the actions for the project.
router.get('/:id/actions', validateProjectId, (req, res) => {
    const id = req.params.id;

    ProjectMod.getProjectActions(id)
    .then(action => {
        res.status(200).json({action})
    })
    .catch(err => {
        res.status(500).json({ message: "There was an error retrieving that action." })
    })
})



// PUT/update a project

// custom middleware
function validateProjectId (req, res, next) {
    const id = req.params.id;

    ProjectMod.get(id)
    .then(proj => {
        // if our project/id exists move on
        if(proj) {
            next()
        } else {
            res.status(400).json({ message: "That project ID does not exist." })
        }
    })
    .catch(err => {
        res.status(500).json({ message: "There was an issue retrieving the specific post." })
    })
};



module.exports = router;
