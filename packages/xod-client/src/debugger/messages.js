export const TRANSPILING = 'Transpiling…';
export const SUCCES = 'Done';
export const INTRODUCTION =
  'Here you will see output from the compiler, uploader, debugger, and other tools.';

export const CHECKING_DEPENDENCIES = 'Checking Arduino dependencies…';
export const CHECKING_DEPENDENCIES_SUCCESS =
  'All Arduino dependencies already installed';
export const INSTALLING_DEPENDENCIES = 'Installing Arduino dependencies…';
export const INSTALLING_DEPENDENCIES_SUCCESS =
  'All Arduino dependencies are installed successfully';

export const UPDATING_ARDUINO_DEPENDECIES = 'Updating Arduino packages…';
export const UPDATING_ARDUINO_DEPENDECIES_SUCCESS =
  'All Arduino packages are updated successfully';

export const WASM_NO_RUNTIME_FOUND = 'Unable to get URL of WASM runtime script';
export const WASM_BINARY_NOT_FOUND = 'Unable to get URL of WASM binary file';

export const WASM_BUILDING_ERROR = `The generated C++ code contains errors. It can be due to a bad node implementation
or if your board is not compatible with XOD runtime code. The original compiler error
message is above. Fix C++ errors to continue. If you believe it is a bug, report the
problem to XOD developers.`;

export const WASM_NETWORK_ERROR =
  'Network error: can not compile in the cloud. Check your internet connection.';
export const WRONG_AUTHORIZATION_TOKEN =
  'Wrong authorization token. Please, logout, log in and then try again.';
export const COMPILATION_LIMIT_EXCEEDED = 'Cloud compilation limits exceeded.';
export const COMPILATION_SERVICE_OFFLINE =
  'Cloud compilation service is temporarily unavailable. Try again later.';

export const TABTEST_GENERATING_CODE = 'Generating C++ code…';
export const TABTEST_BUILDING = 'Building…';
export const TABTEST_RUNNING = 'Running tabular test…';
export const TABTEST_ABORTED = 'The test was interrupted by the user';

export const SIMULATION_GENERATING_CODE = 'Generating C++ code for simulation…';
export const SIMULATION_BUILDING = 'Building…';
export const SIMULATION_RUNNING = 'Running simulation…';
export const SIMULATION_LAUNCHED = 'Simulation is launched';
export const SIMULATION_ABORTED = 'The simulation was interrupted by the user';

export const DO_NOT_USE_TETHERING_INTERNET_IN_BROWSER = {
  title: 'Tethering unavailable in browser',
  note:
    'The internet tethering requires OS features which are not available to the web-browser.',
  solution:
    'Install the desktop version of the XOD IDE to reveal all features of XOD',
};
