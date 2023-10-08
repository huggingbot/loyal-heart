import express from 'express'

import { V1CreatePartnerController } from '../controllers/partner/create-partner.controller'
import { V1DeletePartnerController } from '../controllers/partner/delete-partner.controller'
import { V1GetPartnersController } from '../controllers/partner/get-partners.controller'
import { PartnerService } from '../modules/partner'

export const apiVersion = 'v1'
const partnerBaseRoute = `/${apiVersion}/partner`

const partnerRoutes = express.Router()

const partnerService = new PartnerService()

partnerRoutes.get(`${partnerBaseRoute}`, (req, res, next) => {
  new V1GetPartnersController(partnerService).handleRequest(req, res).catch((err: unknown) => next(err))
})

partnerRoutes.post(`${partnerBaseRoute}`, (req, res, next) => {
  new V1CreatePartnerController(partnerService).handleRequest(req, res).catch((err: unknown) => next(err))
})

partnerRoutes.delete(`${partnerBaseRoute}/:id`, (req, res, next) => {
  new V1DeletePartnerController(partnerService).handleRequest(req, res).catch((err: unknown) => next(err))
})

export default partnerRoutes
