// components/withCustomScrollbar.jsx
import React from 'react';
import CustomScrollbar from './CustomScrollbar';

const withCustomScrollbar = (WrappedComponent) => {
  return (props) => (
    <CustomScrollbar>
      <WrappedComponent {...props} />
    </CustomScrollbar>
  );
};

export default withCustomScrollbar;