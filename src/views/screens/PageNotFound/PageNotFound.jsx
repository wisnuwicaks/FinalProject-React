import React from "react";

class PageNotFound extends React.Component {
  render() {
    return (
      <div style={{ minHeight: "650px" }}>
        <div className="alert alert-primary text-center" role="alert">
          Page Not Found, Back to Home
        </div>
      </div>
    );
  }
}

export default PageNotFound;
