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
import {
  shortname as comfysynthShortname,
  handler as comfysynthHandler,
} from './comfysynth'
import {
  shortname as summersynthShortname,
  handler as summersynthHandler,
} from './summersynth'
import {
  shortname as vernalsynthShortname,
  handler as vernalsynthHandler,
} from './vernalsynth'
import {
  shortname as wintersynthShortname,
  handler as wintersynthHandler,
} from './wintersynth'
import {
  shortname as autumnsynthShortname,
  handler as autumnsynthHandler,
} from './autumnsynth'

type AlgorithmHandler = (ctx: AppContext, params: QueryParams) => Promise<AlgorithmOutput>

const algorithms: Record<string, AlgorithmHandler> = {
  [dungeonSynthShortname]: dungeonSynthHandler,
  [fantasySynthShortname]: fantasySynthHandler,
  [comfysynthShortname]: comfysynthHandler,
  [summersynthShortname]: summersynthHandler,
  [vernalsynthShortname]: vernalsynthHandler,
  [wintersynthShortname]: wintersynthHandler,
  [autumnsynthShortname]: autumnsynthHandler,
}

export default algorithms
