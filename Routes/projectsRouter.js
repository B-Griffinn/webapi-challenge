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

// POST a new project
    // accepts a body
    // name and description required
router.post('/', validateProject, (req, res) => {
    const body = req.body;

    ProjectMod.insert(body)
    .then(newProj => {
        res.status(201).json({ addedProject: newProj })
    })
    .catch(err => {
        res.status(500).json({ message: "There was an error adding the project." })
    })
})

// DELETE/REMOVE a project by ID
    // need to validate ID inorder to return id deleted
    router.delete('/:id', validateProjectId, (req, res) => {
        const id = req.params.id;

        ProjectMod.remove(id)
        .then(removed => {
            res.status(200).json({ deleted: removed })
        })
        .catch(err => {
            res.status(500).json({ message: "There was an error removing that ID." })
        })
    })

// PUT/update a project by ID
// update(): accepts two arguments, the first is the id of the resource to update, and the second is an object with the changes to apply. It returns the updated resource. If a resource with the provided id is not found, the method returns null.
router.put('/:id', validateProjectId, validateProject, (req, res) => {
    const id = req.params.id;
    const body = req.body;

    ProjectMod.update(id, body)
    .then(update => {
        res.status(200).json(update)
    })
    .catch(err => {
        res.status(500).json({ message: "There was an error updating that project."})
    })
})


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

function validateProject (req, res, next) {
    const bodyName = req.body.name;
    const bodyDescription = req.body.description;

    if(!bodyName) {
        res.status(400).json({ message: "Please add a Name field." })
    } else if(!bodyDescription) {
        res.status(400).json({ message: "Please add a Description field." })
    } else {
        next();
    }
}

module.exports = router;
