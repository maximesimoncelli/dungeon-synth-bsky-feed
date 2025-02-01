import { validate } from '../src/subscription'
import { Record as PostRecord } from '../src/lexicon/types/app/bsky/feed/post'


describe('dungeonsynth algo', () => {
  it('should only validate string passing the validation test', () => {
    const toValidate: PostRecord[] = [
      { createdAt: Date.now().toString(), text: 'Hello' },
      { createdAt: Date.now().toString(), text: 'a test' },
      { createdAt: Date.now().toString(), text: 'Dungeon Synth' },
      { createdAt: Date.now().toString(), text: 'dungeonsynth' },
      { createdAt: Date.now().toString(), text: '#dungeonsynth' },
      { createdAt: Date.now().toString(), text: 'comfysynth' },
      { createdAt: Date.now().toString(), text: 'this is a complete sentence containing Dungeon Synth' },
      { createdAt: Date.now().toString(), text: '#ds' },
      { createdAt: Date.now().toString(), text: '🏰' },
      { createdAt: Date.now().toString(), text: '⚔️' },
      { createdAt: Date.now().toString(), text: '⚔️', embed: { $type: 'app.bsky.embed.images', images: [ { alt: 'wintersynth'}]} },
      { createdAt: Date.now().toString(), text: '⛓️' },
      { createdAt: Date.now().toString(), text: '🧙🏼‍♀️' },
      { createdAt: Date.now().toString(), text: '🧙' },
    ]

    const valid: Array<PostRecord> = []

    toValidate.forEach((string) =>
      validate(string) ? valid.push(string) : null,
    )
    expect(valid).toHaveLength(6)
  })
})
