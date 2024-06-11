import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import JumbotronWrapper from './JumbotronWrapper';

const NotFound = (props) => (
	<JumbotronWrapper {...props.jumbotronProps}>
		{props.children}
	</JumbotronWrapper>
);

NotFound.propTypes = {
	jumbotronProps: PropTypes.shape({
		title: PropTypes.string,
		description: PropTypes.string
	})
};

NotFound.defaultProps = {
	jumbotronProps: {
		title: 'Welcome to our School Management App'
	},
	children: (<Link to="/">Let's Create & Maintain</Link>)
};

export default memo(NotFound);