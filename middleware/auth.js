"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const Trip = require("../models/trip");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");



/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */
function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      res.locals.user = jwt.verify(token, SECRET_KEY);

    } else {
      console.debug("auth.js - authenticateJWT - NO AUTH HEADER", req.headers);
    }
    return next();
  } catch (err) {
    console.debug("auth.js - authenticateJWT - catch - ERR", err);
    return next();
  }
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */
function ensureLoggedIn(req, res, next) {
  try {
    if (!res.locals.user) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}


/** Middleware to use when they be logged in as an admin user.
 *
 *  If not, raises Unauthorized.
 */
function ensureAdmin(req, res, next) {
  try {
    if (!res.locals.user || !res.locals.user.isAdmin) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

/** Middleware to use when request must provide a valid token & be user matching
 *  username provided as route param. Or be an administrator.
 *
 *  If not, raises Unauthorized.
 */
function ensureCorrectUserOrAdmin(req, res, next) {
  try {
    const user = res.locals.user;
    console.log("AUTH.JS - ENSURECORRECTUSERORADMIN - user: ", user);
    console.log("AUTH.JS - ENSURECORRECTUSERORADMIN - req.body.username: ", req.body.username);
    if (!(user && (user.isAdmin || user.username === req.body.username))) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
};

/** Middleware to use when request must provide a valid token & be user matching
 *  user in relation to the Trip id.
 * 
 *  If not, raises Unauthorized.
 */
async function ensureCorrectTripOwnerOrAdmin(req, res, next) {
  try {
    const user = res.locals.user;
    if (!(user && (user.isAdmin || await isTripOwner(user.username, req.params.id)))) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
};

/** Helper function to check if a user owns a trip using
 *  database relation between Trip (by id) and username.
 * 
 */ 
async function isTripOwner(username, tripId) {
  const trip = await Trip.get(tripId);
  return trip && trip.username === username;
}


module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin,
  ensureCorrectUserOrAdmin,
  ensureCorrectTripOwnerOrAdmin
};
