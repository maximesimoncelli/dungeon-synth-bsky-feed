import {
  OutputSchema as RepoEvent,
  isCommit,
} from './lexicon/types/com/atproto/sync/subscribeRepos'
import { FirehoseSubscriptionBase, getOpsByType } from './util/subscription'
import { Record as PostRecord } from './lexicon/types/app/bsky/feed/post'
import { isMain } from './lexicon/types/app/bsky/embed/images'

type FeedType =
  | 'fantasysynth'
  | 'dungeonsynth'
  | 'wintersynth'
  | 'vernalsynth'
  | 'summersynth'
  | 'comfysynth'

const feedConditions: Record<FeedType, string[]> = {
  dungeonsynth: [
    '#dungeonsynth',
    'dungeon synth',
    'dungeonsynth',
  ],
  fantasysynth: [
    '#fantasysynth',
    'fantasysynth',
    'fantasy synth',
  ],
  wintersynth: [
    '#wintersynth',
    'wintersynth',
    'winter synth',
  ],
  vernalsynth: [
    '#vernalsynth',
    'vernalsynth',
    'vernal synth',
    'spring synth',
    '#springsynth',
    'springsynth',
  ],
  summersynth: [
    '#summersynth',
    'summersynth',
    'summer synth',
  ],
  comfysynth: [
    '#comfysynth',
    'comfysynth',
    'comfy synth',
  ],
}

const allConditions = Object.values(feedConditions).flat()

export const validate = (post: PostRecord) => {
  const text = post.text.toLowerCase()
  const isTextValid = allConditions.some(
    (condition) => text.indexOf(condition) !== -1,
  )
  if (isTextValid) return true

  if (isMain(post.embed)) {
    return post.embed.images.some((image) =>
      allConditions.some(
        (condition) => image.alt.toLowerCase().indexOf(condition) !== -1,
      ),
    )
  }
  return false
}

export const addFeed = (post: PostRecord): FeedType => {
  const text = post.text.toLowerCase()
  for (const [feed, conditions] of Object.entries(feedConditions)) {
    if (conditions.some((condition) => text.indexOf(condition) !== -1)) {
      return feed as FeedType
    }
  }
  // Default fallback
  return 'dungeonsynth'
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
