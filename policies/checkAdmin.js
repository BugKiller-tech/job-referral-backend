module.exports = function(req, res, next){
  if(!req.session.user || req.session.user.role < 2) {
    res.status(401).json({
      success: false,
      errors: 'You are not admin'
    })
  }else{
    next();
  }
}