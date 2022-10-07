import { SHOW_MODAL_TYPES } from 'config/constants'
import { isEmpty } from 'lodash'
import { useAppDispatch } from 'state'
import { setShowModal } from 'state/user/actions'
import { useIsModalShown } from 'state/user/hooks'

// Hotfix for setting initial circular staking
// TODO: Remove this file completely after changing redux state to merge
function useCircularStaking() {
  const circStaking = useIsModalShown()
  const dispatch = useAppDispatch()

  if (isEmpty(circStaking)) {
    dispatch(setShowModal({ actionType: SHOW_MODAL_TYPES.buyModal, flag: true }))
    dispatch(setShowModal({ actionType: SHOW_MODAL_TYPES.generalHarvestModal, flag: true }))
    dispatch(setShowModal({ actionType: SHOW_MODAL_TYPES.poolHarvestModal, flag: true }))
    dispatch(setShowModal({ actionType: SHOW_MODAL_TYPES.sellModal, flag: true }))
  }
}

export default useCircularStaking
