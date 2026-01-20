import React from "react";
import PropTypes from "prop-types";

export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-white border border-gray-100 rounded-lg shadow-sm p-4 ${className}`}>
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
