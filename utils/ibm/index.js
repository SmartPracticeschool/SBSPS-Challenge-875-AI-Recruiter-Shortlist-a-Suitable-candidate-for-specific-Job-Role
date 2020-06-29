const { IamAuthenticator } = require('ibm-watson/auth')
const PersonalityInsightsV3 = require('ibm-watson/personality-insights/v3')
const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3')

const personalityInsights = new PersonalityInsightsV3({
  authenticator: new IamAuthenticator({
    apiKey: process.env.WATSON_API_KEY,
    version: process.env.WATSON_PERSONALITY_VERSION,
    url: process.env.WATSON_URL
  })
})

const toneAnalyzer = new ToneAnalyzerV3({
  authenticator: new IamAuthenticator({
    apiKey: process.env.WATSON_API_KEY,
    version: process.env.WATSON_TONE_VERSION,
    url: process.env.WATSON_URL
  })
})

const countWords = (doc) => {
  doc = doc.replace(/(^\s*)|(\s*$)/gi, '')
  doc = doc.replace(/[ ]{2,}/gi, ' ')
  doc = doc.replace(/\n /, '\n')
  return doc.split(' ').length
}

module.exports = {
  async analyzeTone (text) {
    const output = {}
    const toneAnalysis = (await toneAnalyzer.tone({
      toneInput: {
        text,
        contentType: 'application/json'
      }
    })).result

    for (const tone of toneAnalysis.document_tone.tones) {
      switch (tone.tone_name) {
        case 'Anger':
          output.anger = tone.score
          break
        case 'Fear':
          output.fear = tone.score
          break
        case 'Joy':
          output.joy = tone.score
          break
        case 'Tentative':
          output.tentative = tone.score
          break
        case 'Sadness':
          output.sadness = tone.score
          break
        case 'Analytical':
          output.analytical = tone.score
          break
        case 'Confident':
          output.confident = tone.score
      }
    }

    return output
  },
  async analyzePersonality (text) {
    const output = {}

    if (countWords(text) > 100) {
      const personalityAnalysis = (await personalityInsights.profile({
        content: text,
        contentType: 'text/plain',
        consumptionReferences: true
      })).result

      for (const trait of personalityAnalysis.personality) {
        switch (trait) {
          case 'Openness':
            output.openness = trait.percentile
            break
          case 'Conscientiousness':
            output.conscientiousness = trait.percentile
            break
          case 'Extraversion':
            output.extraversion = trait.percentile
            break
          case 'Agreeableness':
            output.agreeableness = trait.percentile
            break
          case 'Neuroticism':
            output.neuroticism = trait.percentile
            break
        }
      }
    }

    return output
  }
}
