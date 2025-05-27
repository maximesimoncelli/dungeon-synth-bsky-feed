import {
  OutputSchema as RepoEvent,
  isCommit,
} from './lexicon/types/com/atproto/sync/subscribeRepos'
import { FirehoseSubscriptionBase, getOpsByType } from './util/subscription'
import { Record } from './lexicon/types/app/bsky/feed/post'
import { isMain } from './lexicon/types/app/bsky/embed/images'

export const validConditions = [
  '#dungeonsynth',
  'dungeon synth',
  'dungeonsynth',
  'fantasy synth',
  '#fantasysynth',
  'fantasysynth',
  'wintersynth',
  'forestsynth',
  'comfysynth',
  '#wintersynth',
  '#forestsynth',
  '#comfysynth',
  'winter synth',
  'forest synth',
  'comfy synth',
]

export const validFantasySynthConditions = [
  '#fantasysynth',
  'fantasysynth',
  'fantasy synth',
]

export const validate = (post: Record) => {
  const isTextValid = validConditions.some(
    (condition) => post.text.toLowerCase().indexOf(condition) !== -1,
  )

  // Don't need to check the embed if the text is already valid
  if (isTextValid) return isTextValid

  if (isMain(post.embed)) {
    return post.embed.images.some((image) =>
      validConditions.some(
        (condition) => image.alt.toLowerCase().indexOf(condition) !== -1,
      ),
    )
  }
}

export const addFeed = (post: Record): 'fantasysynth' | 'dungeonsynth' => {
  return validFantasySynthConditions.some(
    (condition) => post.text.toLowerCase().indexOf(condition) !== -1,
  )
    ? 'fantasysynth'
    : 'dungeonsynth'
}

export class FirehoseSubscription extends FirehoseSubscriptionBase {
  async handleEvent(evt: RepoEvent) {
    if (!isCommit(evt)) return
    const ops = await getOpsByType(evt)
    const postsToDelete = ops.posts.deletes.map((del) => del.uri)
    const postsToCreate = ops.posts.creates
      .filter((create) => validate(create.record))
      .map((create) => {
        return {
          uri: create.uri,
          cid: create.cid,
          feed: addFeed(create.record),
          replyParent: create.record?.reply?.parent.uri ?? null,
          replyRoot: create.record?.reply?.root.uri ?? null,
          indexedAt: new Date().toISOString(),
        }
      })

    if (postsToDelete.length > 0) {
      await this.db
        .deleteFrom('post')
        .where('uri', 'in', postsToDelete)
        .execute()
    }
    if (postsToCreate.length > 0) {
      await this.db
        .insertInto('post')
        .values(postsToCreate)
        .onConflict((oc) => oc.doNothing())
        .execute()
    }
  }
}
