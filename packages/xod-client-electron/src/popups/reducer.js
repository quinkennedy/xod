import {
  popupsReducer,
  showOnlyPopup,
  hideOnePopup,
  POPUP_ID,
} from 'xod-client';

import {
  UPLOAD,
  UPLOAD_TO_ARDUINO,
} from '../upload/actionTypes';

import {
  CREATE_WORKSPACE_REQUESTED,
  SWITCH_WORKSPACE_REQUESTED,
  CREATE_WORKSPACE,
  SWITCH_WORKSPACE,
} from '../settings/actionTypes';


export default (state, action) => {
  switch (action.type) {
    case UPLOAD:
    case UPLOAD_TO_ARDUINO: {
      if (action.meta.status === 'started') {
        return showOnlyPopup(POPUP_ID.UPLOADING, {}, state);
      }
      if (action.meta.status === 'deleted') {
        return hideOnePopup(POPUP_ID.UPLOADING, state);
      }

      return state;
    }

    case CREATE_WORKSPACE_REQUESTED:
      return showOnlyPopup(POPUP_ID.CREATING_WORKSPACE, action.payload, state);
    case SWITCH_WORKSPACE_REQUESTED:
      return showOnlyPopup(POPUP_ID.SWITCHING_WORKSPACE, action.payload, state);

    case CREATE_WORKSPACE:
      return hideOnePopup(POPUP_ID.CREATING_WORKSPACE, state);
    case SWITCH_WORKSPACE:
      return hideOnePopup(POPUP_ID.SWITCHING_WORKSPACE, state);

    default:
      return popupsReducer(state, action);
  }
};
