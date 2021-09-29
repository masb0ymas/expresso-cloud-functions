import { Request } from 'express'
import { IncomingHttpHeaders } from 'http'
import _ from 'lodash'

/**
 *
 * @param headers
 * @returns
 */
export function getToken(headers: IncomingHttpHeaders): string | null | any {
  if (headers?.authorization) {
    const parted = headers.authorization.split(' ')

    // Check Bearer xxx || JWT xxx
    if (parted[0] === 'Bearer' || parted[0] === 'JWT') {
      if (parted.length === 2) {
        return parted[1]
      }
    }

    return null
  }

  return null
}

/**
 *
 * @param req
 * @returns
 */
export function currentToken(req: Request): string {
  const getCookie = req.getCookies()
  const getHeaders = req.getHeaders()

  let curToken = ''

  if (!_.isEmpty(getCookie.token)) {
    curToken = getCookie.token
  } else {
    curToken = getToken(getHeaders)
  }

  return curToken
}
