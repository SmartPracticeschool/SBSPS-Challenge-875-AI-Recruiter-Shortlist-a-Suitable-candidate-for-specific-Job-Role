const router = require('express').Router()
const { analyzeTone, analyzePersonality } = require('../utils/ibm')

router.post('/:jobId/:userId', async (req, res, next) => {
  const personality = analyzePersonality(req.body.text)
  const tone = analyzeTone(req.body.text)

  return res.status(200).send({
    personality,
    tone
  })
  // const application = new Application({
  //   for: req.params.jobId,
  //   by: req.params.userId,
  //   selected: false,
  //   personality: {
  //     wholeText: req.body.text,
  //     openness:
  //     conscientiousness:
  //     extraversion:
  //     agreeableness:
  //     euroticism:
  //   }
  // })
})

module.exports = router
