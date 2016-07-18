import { expect, } from 'chai'

import * as URL from '../Url'

describe('Url', () => {
  /** fixtures */
  const containers = [
    { [URL.CONTAINER_PROPERTY.name]: 'container01', [URL.CONTAINER_PROPERTY.address]: 'address01', },
    { [URL.CONTAINER_PROPERTY.name]: 'container02', [URL.CONTAINER_PROPERTY.address]: 'address02', },
    { [URL.CONTAINER_PROPERTY.name]: 'container03', [URL.CONTAINER_PROPERTY.address]: '', },
    { [URL.CONTAINER_PROPERTY.name]: 'container04', [URL.CONTAINER_PROPERTY.address]: 'address04', },
    { [URL.CONTAINER_PROPERTY.name]: 'container04', [URL.CONTAINER_PROPERTY.address]: 'address05', },
  ]
  /** fixtures end */

  describe(`${URL._buildContainerJobPropertyUrl.name}`, () => {

    it('should throw error given id is undefined, null, empty string', () => {
      [undefined, null, '',].map(id => {
        expect(
          () => URL._buildContainerJobPropertyUrl(containers, 'container01', id, 'prop')
        ).to.throw(Error)
      })
    })

    it('should throw error given property is undefined, null, empty string', () => {
      [undefined, null, '',].map(property => {
        expect(
          () => URL._buildContainerJobPropertyUrl(containers, 'container01', 'id', property)
        ).to.throw(Error)
      })
    })

    it('should throw error returned container name is is undefined, null, empty string', () => {
      expect( /** empty container name */
        () => URL._buildContainerJobPropertyUrl(containers, 'container03', 'id', 'property')
      ).to.throw(Error)

      expect( /** undefined container */
        () => URL._buildContainerJobPropertyUrl(containers, 'container00', 'id', 'property')
      ).to.throw(Error)
    })

  }) /** describe buildContainerJobPropertyUrl */

  describe(`${URL._getContainerAddress.name}`, () => {

    it('should throw error when given container name is not found', () => {
      expect( /** not exists */
        () => URL._getContainerAddress(containers, 'container05')
      ).to.throw(Error)

    })

    it('should throw error when given container name is duplicated', () => {
      expect( /** duplicated */
        () => URL._getContainerAddress(containers, 'container04')
      ).to.throw(Error)
    })
  })
})

