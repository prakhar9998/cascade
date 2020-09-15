const APIErrorHandler = (error) => {
  if (error.response) {
    // request made and server responded
    if (error.response.data.message) {
      if (error.response.status === 404) {
        return "Not Found";
      }
      return error.response.data.message;
    } else if (error.response.status === 500) {
      return "Something went wrong!";
    }
  } else if (error.request) {
    // client made request but no response received.
    return "Something went wrong! Please check your network connectivity.";
  } else {
    // something went wrong during request setup
    console.log("Error", error.message);
    return "An Error occured";
  }
};

export default APIErrorHandler;
