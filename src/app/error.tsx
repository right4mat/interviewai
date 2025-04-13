'use client';

// @project
import Error500Page from '@/blocks/maintenance/Error500';
import { FC } from 'react';

/***************************  ERROR 500 - DATA  ***************************/

interface ErrorData {
  primaryBtn: {
    children: string;
  };
  heading: string;
}

const data: ErrorData = {
  primaryBtn: { children: 'Back to Home Page' },
  heading: 'Please try again later or feel free to contact us if the problem persists.'
};

/***************************  ERROR - 500  ***************************/

const InternalServerError: FC = () => {
  return <Error500Page {...data} />;
};

export default InternalServerError;
