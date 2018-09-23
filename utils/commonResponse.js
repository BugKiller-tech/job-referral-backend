module.exports = {
  sendSomethingWentWrong: (req, res, err) => {
    return res
      .status(400)
      .json({
        success: false,
        errors: 'something went wrong'
      })
  }
}