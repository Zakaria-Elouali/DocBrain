import { applyMiddleware, compose, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./reducers";
import rootSaga from "./sagas";
import { persistReducer, persistStore, createTransform } from "redux-persist";
import storage from "redux-persist/lib/storage";

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];

// Only enable Redux DevTools in development
const composeEnhancers =
  process.env.NODE_ENV !== 'production' &&
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Options: https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md
      trace: false, // Disable trace feature for better performance
      traceLimit: 10, // Limit stack trace depth
    }) :
    compose;

// Create a transform that will filter out fileData from fileFolderReducer
const fileDataTransform = createTransform(
  // transform state on its way to being serialized and persisted
  (inboundState, key) => {
    // Only apply this to fileFolderReducer
    if (key === 'fileFolderReducer') {
      // Return a copy of the state without fileData
      const { fileData, ...rest } = inboundState;
      return rest;
    }
    return inboundState;
  },
  // transform state being rehydrated
  (outboundState, key) => {
    // Only apply this to fileFolderReducer
    if (key === 'fileFolderReducer') {
      // Ensure fileData is initialized as an empty object
      return {
        ...outboundState,
        fileData: {},
      };
    }
    return outboundState;
  },
  // configuration options
  { whitelist: ['fileFolderReducer'] }
);

const persistConfig = {
  key: "root",
  storage,
  blacklist: [
    "addSuccess",
    "updateSuccess",
    "addError",
    "updateError",
    "clientDocumentsReducer", // Exclude client documents from persistence
    "signaturesReducer", // Exclude signatures from persistence
    "fileFolderReducer", // Exclude file folder data from persistence completely
    "appointmentReducer", // Exclude appointment data from persistence
    "chatbotReducer" // Exclude chatbot data from persistence
  ],
  transforms: [fileDataTransform],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  {},
  composeEnhancers(applyMiddleware(...middlewares)),
);
sagaMiddleware.run(rootSaga);

let persistor = persistStore(store);
export { store, persistor };
