'use strict'

const controller = require('lib/wiring/controller')
const models = require('app/models')
const Profile = models.profile

const authenticate = require('./concerns/authenticate')
const setUser = require('./concerns/set-current-user')
const setModel = require('./concerns/set-mongoose-model')

const index = (req, res, next) => {
// edited index action to only allow users to see their own profile
  Profile.find({ '_owner': req.user.id })
    .then(result => {
      if (result[0] === undefined) {
        res.send('User may only view owned profiles and user does not currently own a profile.')
      } else {
        const objProfile = result[0]
        res.json({
          profile: objProfile.toJSON({ virtuals: true, user: req.user })
        })
      }
    })
    .catch(next)
}

const show = (req, res, next) => {
  // creating a find-by-user show action
  if (req.params.id === 'find-by-user') {
    Profile.find({ '_owner': req.user.id })
      .then(result => {
        if (result[0] === undefined) {
          res.send('No Profile')
        } else {
          const objProfile = result[0]
          res.json({
            profile: objProfile.toJSON({ virtuals: true, user: req.user })
          })
        }
      })
      .catch(next)
  } else {
    // The normal show action, though it's been limited to only allow a user to
    // access their own profile
    Profile.findById(req.params.id)
      .populate('_owner')
      .then((profile) => {
        if (profile._owner.id === req.user.id) {
          res.json({
            profile: profile.toJSON({ virtuals: true, user: req.user })
          })
        } else {
          // error status 403 means "I know who you are, but I'm refusing your access"
          res.status(403)
          res.send('Users may only view profiles they own.')
        }
      })
      .catch(next)
  }
}

const create = (req, res, next) => {
  const profile = Object.assign(req.body.profile, {
    _owner: req.user._id
  })
  Profile.create(profile)
    .then(profile =>
      res.status(201)
        .json({
          profile: profile.toJSON({ virtuals: true, user: req.user })
        }))
    .catch(next)
}

const update = (req, res, next) => {
  delete req.body._owner  // disallow owner reassignment.
  req.profile.update(req.body.profile, { runValidators: true })
    .then(() => res.sendStatus(204))
    .catch(next)
}

const destroy = (req, res, next) => {
  req.profile.remove()
    .then(() => res.sendStatus(204))
    .catch(next)
}

module.exports = controller({
  index,
  show,
  create,
  update,
  destroy
}, { before: [
  { method: setUser, only: ['index', 'show'] },
  { method: authenticate, except: ['index', 'show'] },
  // { method: setModel(Profile), only: ['show'] },
  { method: setModel(Profile, { forUser: true }), only: ['update', 'destroy'] }
] })
