import {
  CHANGE_LAYOUT,
  CHANGE_LAYOUT_MODE,
  CHANGE_LAYOUT_POSITION,
  CHANGE_LAYOUT_WIDTH,
  CHANGE_PRELOADER,
  CHANGE_SIDEBAR_IMAGE_TYPE,
  CHANGE_SIDEBAR_SIZE_TYPE,
  CHANGE_SIDEBAR_THEME,
  CHANGE_SIDEBAR_VIEW,
  CHANGE_SIDEBAR_VISIBILITY,
  CHANGE_TOPBAR_THEME,
  RESET_VALUE,
} from "./actionType";

//constants
import {
  layoutModeTypes,
  layoutPositionTypes,
  layoutTypes,
  layoutWidthTypes,
  leftSidebarImageTypes,
  leftSidebarSizeTypes,
  leftSidebarTypes,
  leftSidebarViewTypes,
  preloaderTypes,
  sidebarVisibilityTypes,
  topBarThemeTypes,
} from "components/constants/LayoutTypes";

const INIT_STATE = {
  layoutType: layoutTypes.VERTICAL,
  leftSidebarType: leftSidebarTypes.LIGHT,
  layoutModeType: layoutModeTypes.LIGHTMODE,
  layoutWidthType: layoutWidthTypes.FLUID,
  layoutPositionType: layoutPositionTypes.FIXED,
  topBarThemeType: topBarThemeTypes.LIGHT,
  leftSidebarSizeType: leftSidebarSizeTypes.DEFAULT,
  leftSidebarViewType: leftSidebarViewTypes.DEFAULT,
  leftSidebarImageType: leftSidebarImageTypes.NONE,
  preloader: preloaderTypes.DISABLE,
  sidebarVisibilityType: sidebarVisibilityTypes.SHOW,
};

const Layout = (state = INIT_STATE, action) => {
  switch (action.type) {
    case CHANGE_LAYOUT:
      return {
        ...state,
        layoutType: action.payload,
      };

    case CHANGE_LAYOUT_MODE:
      return {
        ...state,
        layoutModeType: action.payload,
      };

    case CHANGE_SIDEBAR_THEME:
      return {
        ...state,
        leftSidebarType: action.payload,
      };

    case CHANGE_LAYOUT_WIDTH:
      return {
        ...state,
        layoutWidthType: action.payload,
      };

    case CHANGE_LAYOUT_POSITION:
      return {
        ...state,
        layoutPositionType: action.payload,
      };

    case CHANGE_TOPBAR_THEME:
      return {
        ...state,
        topBarThemeType: action.payload,
      };

    case CHANGE_SIDEBAR_SIZE_TYPE:
      return {
        ...state,
        leftSidebarSizeType: action.payload,
      };

    case CHANGE_SIDEBAR_VIEW:
      return {
        ...state,
        leftSidebarViewType: action.payload,
      };

    case CHANGE_SIDEBAR_IMAGE_TYPE:
      return {
        ...state,
        leftSidebarImageType: action.payload,
      };

    case RESET_VALUE:
      return {
        ...state,
        resetValue: INIT_STATE,
      };

    case CHANGE_PRELOADER:
      return {
        ...state,
        preloader: action.payload,
      };

    case CHANGE_SIDEBAR_VISIBILITY:
      return {
        ...state,
        sidebarVisibilityType: action.payload,
      };
    default:
      return state;
  }
};

export default Layout;
