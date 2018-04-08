'use strict'

const controller = require('lib/wiring/controller')
const models = require('app/models')
const Profile = models.profile

const authenticate = require('./concerns/authenticate')
const setUser = require('./concerns/set-current-user')
const setModel = require('./concerns/set-mongoose-model')

const index = (req, res, next) => {
  Profile.find()
    .populate('_owner')
    .then(profiles => res.json({
      profiles: profiles.map((e) =>
        e.toJSON({ virtuals: true, user: req.user }))
    }))
    .catch(next)
}

const show = (req, res) => {
  res.json({
    profile: req.profile.toJSON({ virtuals: true, user: req.user })
  })
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
  req.profile.update(req.body.profile)
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
  { method: setModel(Profile), only: ['show'] },
  { method: setModel(Profile, { forUser: true }), only: ['update', 'destroy'] }
] })
