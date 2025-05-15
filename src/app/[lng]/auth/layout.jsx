import PropTypes from 'prop-types';
// @next
import dynamic from 'next/dynamic';

// @types

// @project
const ScrollFab = dynamic(() => import('@/components/shared/ScrollFab'));
const Theme = dynamic(() => import('@/theme/AppTheme'));
const MainLayout = dynamic(() => import('@/views/auth/layout'));

/***************************  LAYOUT - AI  ***************************/

export default function AI({ children }) {
  return (
    <Theme>
      <MainLayout>
        <>
          {children}

          {/* scroll to top section */}
          <ScrollFab />
        </>
      </MainLayout>
    </Theme>
  );
}

AI.propTypes = { children: PropTypes.any };
