import { FeedGenerator } from "../src/server"
import { FirehoseSubscription } from "../src/subscription"
import events from 'events'

/**
 * These tests are not ideal as they do not really test anything 'real'
 * happening but they provide at least some mesure of safety
 * when merging dependabot automatic update PRs.
 */
describe('FeedGenerator', () => {
    let feedGenerator: FeedGenerator;
    beforeEach(() => {
        feedGenerator = FeedGenerator.create({
            hostname: 'hostname',
            listenhost: 'listenhost',
            port: 1,
            publisherDid: 'publisherDid',
            serviceDid: 'serviceDid',
            sqliteLocation: ':memory:',
            subscriptionEndpoint: 'subscriptionEndpoint',
            subscriptionReconnectDelay: 5000
        })
    })
    it('should create a new FeedGenerator', () => {
        expect(feedGenerator).toBeInstanceOf(FeedGenerator)
        expect(feedGenerator.server).not.toBeDefined()
        expect(feedGenerator.firehose).toBeInstanceOf(FirehoseSubscription)
    })

    it('should start the new FeedGenerator', async () => {
        const spyFirehoseRun = jest.spyOn(feedGenerator.firehose, 'run').mockImplementation(async () => jest.fn() as any)
        const spyAppListen = jest.spyOn(feedGenerator.app, 'listen').mockImplementation(() => jest.fn() as any)
        const spyEventsOnce = jest.spyOn(events, 'once').mockImplementation(() => jest.fn() as any)
        
        await feedGenerator.start()
        expect(spyFirehoseRun).toHaveBeenCalledWith(5000)
        expect(spyAppListen).toHaveBeenCalledWith(1, 'listenhost')
        expect(spyEventsOnce).toHaveBeenCalledWith(feedGenerator.server, 'listening')
    })
})