import dotenv from 'dotenv'
import { AtpAgent, BlobRef } from '@atproto/api'
import fs from 'fs/promises'
import { ids } from '../src/lexicon/lexicons'

const feeds = [
  {
    recordName: 'dungeonsynth',
    displayName: 'Dungeon Synth',
    description:
      'All things dungeon synth. Any post mentioning ‘dungeon synth‘ or ‘dungeonsynth‘ will be included. 30 days retention time.',
    avatar: './scripts/icon.png',
  },
  {
    recordName: 'fantasysynth',
    displayName: 'Fantasy Synth',
    description:
      'All things fantasy synth. Any post mentioning ‘fantasy synth‘ or ‘fantasysynth‘ will be included. 30 days retention time.',
    avatar: './scripts/icon.png',
  },
  {
    recordName: 'wintersynth',
    displayName: 'Winter Synth',
    description:
      'All things winter synth. Any post mentioning ‘winter synth‘ or ‘wintersynth‘ will be included. 30 days retention time.',
    avatar: './scripts/icon.png',
  },
  {
    recordName: 'comfysynth',
    displayName: 'Comfy Synth',
    description:
      'All things comfy synth. Any post mentioning ‘comfy synth‘ or ‘comfysynth‘ will be included. 30 days retention time.',
    avatar: './scripts/icon.png',
  },
  {
    recordName: 'vernalsynth',
    displayName: 'Vernal Synth',
    description:
      'All things vernal synth. Any post mentioning ‘vernal synth‘ or ‘vernalsynth‘ will be included. 30 days retention time.',
    avatar: './scripts/icon.png',
  },
  {
    recordName: 'summersynth',
    displayName: 'Summer Synth',
    description:
      'All things summer synth. Any post mentioning summer synth‘ or ‘summersynth‘ will be included. 30 days retention time.',
    avatar: './scripts/icon.png',
  },
  {
    recordName: 'autumnsynth',
    displayName: 'Autumn Synth',
    description:
      'All things autumn synth. Any post mentioning autumn synth‘ or ‘autumnsynth‘ will be included. 30 days retention time.',
    avatar: './scripts/icon.png',
  },
]

const run = async () => {
  dotenv.config()

  // YOUR bluesky handle
  const handle = process.env.HANDLE;

  // YOUR bluesky password, or preferably an App Password (found in your client settings)
  const password = process.env.PASSWORD;

  if (!handle || !password) {
    throw new Error('Please provide a handle and password in the .env file')
  }

  if (!process.env.FEEDGEN_SERVICE_DID && !process.env.FEEDGEN_HOSTNAME) {
    throw new Error('Please provide a hostname in the .env file')
  }
  const feedGenDid =
    process.env.FEEDGEN_SERVICE_DID ?? `did:web:${process.env.FEEDGEN_HOSTNAME}`

  const agent = new AtpAgent({ service: 'https://bsky.social' })
  await agent.login({ identifier: handle, password })

  for (const feed of feeds) {
    let avatarRef: BlobRef | undefined
    if (feed.avatar) {
      let encoding: string
      if (feed.avatar.endsWith('png')) {
        encoding = 'image/png'
      } else if (feed.avatar.endsWith('jpg') || feed.avatar.endsWith('jpeg')) {
        encoding = 'image/jpeg'
      } else {
        throw new Error('expected png or jpeg')
      }
      const img = await fs.readFile(feed.avatar)
      const blobRes = await agent.api.com.atproto.repo.uploadBlob(img, {
        encoding,
      })
      avatarRef = blobRes.data.blob
    }

    await agent.api.com.atproto.repo.putRecord({
      repo: agent.session?.did ?? '',
      collection: ids.AppBskyFeedGenerator,
      rkey: feed.recordName,
      record: {
        did: feedGenDid,
        displayName: feed.displayName,
        description: feed.description,
        avatar: avatarRef,
        createdAt: new Date().toISOString(),
      },
    })

    console.log(`All done for ${feed.recordName} 🎉`)
  }
}

run()
