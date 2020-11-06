const app = require('../src/app')

describe('App', () => {
    it('GET / responds with 200 and "Hello, world!"', () => {
        return supertest(app)
            .get('/api/')
            .expect(200, 'Hello, world!')
    })
})