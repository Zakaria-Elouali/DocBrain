import { all, call, fork, takeEvery } from "redux-saga/effects";

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
} from "./actionType";

function changeHTMLAttribute(attribute, value) {
  if (document.documentElement)
    document.documentElement.setAttribute(attribute, value);
  return true;
}

function* changeLayoutTheme({ payload: layout }) {
  try {
    yield call(changeHTMLAttribute, "data-layout", layout);
  } catch (error) {
    console.error(error);
  }
}

function* changeLayoutMode({ payload: mode }) {
  try {
    yield call(changeHTMLAttribute, "data-bs-theme", mode);
  } catch (error) {
    console.error(error);
  }
}

function* changeLeftSidebarTheme({ payload: theme }) {
  try {
    yield call(changeHTMLAttribute, "data-FileTree", theme);
  } catch (error) {
    console.error(error);
  }
}

function* changeLayoutWidth({ payload: layoutWidth }) {
  try {
    if (layoutWidth === "lg") {
      yield call(changeHTMLAttribute, "data-layout-width", "fluid");
    } else {
      yield call(changeHTMLAttribute, "data-layout-width", "boxed");
    }
  } catch (error) {
    console.error(error);
  }
}

function* changeLayoutPosition({ payload: layoutPosition }) {
  try {
    yield call(changeHTMLAttribute, "data-layout-position", layoutPosition);
  } catch (error) {
    console.error(error);
  }
}

function* changeSidebarVisibility({ payload: visibility }) {
  try {
    yield call(changeHTMLAttribute, "data-FileTree-visibility", visibility);
  } catch (error) {
    console.error(error);
  }
}

function* changeTopbarTheme({ payload: topbarTheme }) {
  try {
    yield call(changeHTMLAttribute, "data-topbar", topbarTheme);
  } catch (error) {
    console.error(error);
  }
}

function* changeSidebarImageType({ payload: leftSidebarImageType }) {
  try {
    yield call(changeHTMLAttribute, "data-FileTree-image", leftSidebarImageType);
  } catch (error) {
    console.error(error);
  }
}

function* changePreloader({ payload: preloaderTypes }) {
  try {
    yield call(changeHTMLAttribute, "data-preloader", preloaderTypes);
  } catch (error) {
    console.error(error);
  }
}

function* changeLeftSidebarSizeType({ payload: leftSidebarSizeType }) {
  try {
    switch (leftSidebarSizeType) {
      case "lg":
        yield call(changeHTMLAttribute, "data-FileTree-size", "lg");
        break;
      case "md":
        yield call(changeHTMLAttribute, "data-FileTree-size", "md");
        break;
      case "sm":
        yield call(changeHTMLAttribute, "data-FileTree-size", "sm");
        break;
      case "sm-hover":
        yield call(changeHTMLAttribute, "data-FileTree-size", "sm-hover");
        break;
      default:
        yield call(changeHTMLAttribute, "data-FileTree-size", "lg");
    }
  } catch (error) {
    console.error(error);
  }
}

function* changeLeftSidebarViewType({ payload: leftSidebarViewType }) {
  try {
    if (document.documentElement.getAttribute("data-layout") !== "semibox") {
      yield call(changeHTMLAttribute, "data-layout-style", leftSidebarViewType);
    } else {
      document.documentElement.removeAttribute("data-layout-style");
    }
  } catch (error) {
    console.error(error);
  }
}

export function* watchChangeLayoutType() {
  yield takeEvery(CHANGE_LAYOUT, changeLayoutTheme);
}

export function* watchChangeLayoutMode() {
  yield takeEvery(CHANGE_LAYOUT_MODE, changeLayoutMode);
}

export function* watchChangeLeftSidebarTheme() {
  yield takeEvery(CHANGE_SIDEBAR_THEME, changeLeftSidebarTheme);
}

export function* watchChangeLayoutWidth() {
  yield takeEvery(CHANGE_LAYOUT_WIDTH, changeLayoutWidth);
}

export function* watchChangeLayoutPosition() {
  yield takeEvery(CHANGE_LAYOUT_POSITION, changeLayoutPosition);
}

export function* watchChangeTopBarTheme() {
  yield takeEvery(CHANGE_TOPBAR_THEME, changeTopbarTheme);
}

export function* watchChangeLeftSidebarSizeType() {
  yield takeEvery(CHANGE_SIDEBAR_SIZE_TYPE, changeLeftSidebarSizeType);
}

export function* watchChangeLeftSidebarViewType() {
  yield takeEvery(CHANGE_SIDEBAR_VIEW, changeLeftSidebarViewType);
}

export function* watchChangeSidebarImageType() {
  yield takeEvery(CHANGE_SIDEBAR_IMAGE_TYPE, changeSidebarImageType);
}

export function* watchChangePreloader() {
  yield takeEvery(CHANGE_PRELOADER, changePreloader);
}

export function* watchChangeSidebarVisibility() {
  yield takeEvery(CHANGE_SIDEBAR_VISIBILITY, changeSidebarVisibility);
}

function* LayoutSaga() {
  yield all([
    fork(watchChangeLayoutType),
    fork(watchChangeLeftSidebarTheme),
    fork(watchChangeLayoutMode),
    fork(watchChangeLayoutWidth),
    fork(watchChangeLayoutPosition),
    fork(watchChangeTopBarTheme),
    fork(watchChangeLeftSidebarSizeType),
    fork(watchChangeLeftSidebarViewType),
    fork(watchChangeSidebarImageType),
    fork(watchChangePreloader),
    fork(watchChangeSidebarVisibility),
  ]);
}

export default LayoutSaga;
