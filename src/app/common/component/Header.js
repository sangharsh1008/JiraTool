import React from "react";

export const Header = props => {
  const { h1, h2 } = props;
  return (
    <React.Fragment>
      {h1 && (
        <h3>
          <u
            style={{
              color: "black",
              fontWeight: "bold",
              textDecoration: "unset",
              fontSize: "35px"
            }}
          >
            {h1}
          </u>
        </h3>
      )}
      {h2 && (
        <h4>
          <u
            style={{
              color: "black",

              textDecoration: "unset",
              fontSize: "22px",
              fontWeight: "bold"
            }}
          >
            {h2}
          </u>
        </h4>
      )}
    </React.Fragment>
  );
};
