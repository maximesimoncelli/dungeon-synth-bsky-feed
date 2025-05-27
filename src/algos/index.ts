import { AppContext } from '../config'
import {
  QueryParams,
  OutputSchema as AlgorithmOutput,
} from '../lexicon/types/app/bsky/feed/getFeedSkeleton'
import {
  shortname as dungeonSynthShortname ,
  handler as dungeonSynthHandler,
} from './dungeonsynth'
import {
  shortname as fantasySynthShortname ,
  handler as fantasySynthHandler,
} from './fantasysynth'

type AlgorithmHandler = (ctx: AppContext, params: QueryParams) => Promise<AlgorithmOutput>

const algorithms: Record<string, AlgorithmHandler> = {
  [dungeonSynthShortname]: dungeonSynthHandler,
  [fantasySynthShortname]: fantasySynthHandler,
}

export default algorithms
