import supertest from 'supertest'

import { createServer } from '../server'

describe('server', () => {
  it('health check returns 200', async () => {
    await supertest(createServer())
      .get('/api/debug')
      .expect(200)
      .then(res => {
        expect(JSON.parse(res.text)).toMatchObject({
          env: expect.any(String),
          deployedDate: expect.any(String),
          currentDateTime: expect.any(String),
        })
      })
  })
})
