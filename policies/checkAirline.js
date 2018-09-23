module.exports = function(req, res, next){
  if(!req.session.user || req.session.user.role < 1) {
    res.status(401).json({
      success: false,
      errors: 'You are not airliner or admin'
    })
  }else{
    next();
  }
}