import { AppContext } from '../config'
import {
  QueryParams,
  OutputSchema as AlgorithmOutput,
} from '../lexicon/types/app/bsky/feed/getFeedSkeleton'
import {
  shortname,
  handler
} from './dungeonsynth'

type AlgorithmHandler = (ctx: AppContext, params: QueryParams) => Promise<AlgorithmOutput>

const algorithms: Record<string, AlgorithmHandler> = {
  [shortname]: handler,
}

export default algorithms
