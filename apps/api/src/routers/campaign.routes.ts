import express from 'express'

import { V1CreateCampaignController } from '../controllers/campaign/create-campaign.controller'
import { V1DeleteCampaignController } from '../controllers/campaign/delete-campaign.controller'
import { V1GetCampaignsController } from '../controllers/campaign/get-campaigns.controller'
import { CampaignService } from '../modules/campaign'

export const apiVersion = 'v1'
const campaignBaseRoute = `/${apiVersion}/campaign`

const campaignRoutes = express.Router()

const campaignService = new CampaignService()

campaignRoutes.get(`${campaignBaseRoute}`, (req, res, next) => {
  new V1GetCampaignsController(campaignService).handleRequest(req, res).catch((err: unknown) => next(err))
})

campaignRoutes.post(`${campaignBaseRoute}`, (req, res, next) => {
  new V1CreateCampaignController(campaignService).handleRequest(req, res).catch((err: unknown) => next(err))
})

campaignRoutes.delete(`${campaignBaseRoute}/:id`, (req, res, next) => {
  new V1DeleteCampaignController(campaignService).handleRequest(req, res).catch((err: unknown) => next(err))
})

export default campaignRoutes
