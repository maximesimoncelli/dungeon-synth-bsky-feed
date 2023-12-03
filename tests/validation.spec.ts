import { validate } from '../src/subscription'

describe('dungeonsynth algo', () => {
  it('should only validate string passing the validation test', () => {
    const toValidate = [
      'Hello',
      'a test',
      'Dungeon Synth',
      'dungeonsynth',
      '#dungeonsynth',
      'this is a complete sentence containing Dungeon Synth',
      '#ds',
      '🏰',
      '⚔️',
      '⛓️',
      '🧙🏼‍♀️',
      '🧙',
    ]

    const valid: string[] = []

    toValidate.forEach((string) => validate(string) ? valid.push(string) : null)
    expect(valid).toHaveLength(6)
  })
})
