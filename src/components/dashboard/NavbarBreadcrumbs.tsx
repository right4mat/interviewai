import * as React from 'react';
import { styled, Theme} from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import type {} from '@mui/material/themeCssVarsAugmentation';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }:{theme:Theme | any}) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

export default function NavbarBreadcrumbs() {
  const pathname = usePathname();
  
  // Split the pathname and remove empty strings
  const pathSegments = pathname.split('/').filter(segment => segment);
  
  // Generate breadcrumb items
  const breadcrumbItems = pathSegments.map((segment, index) => {
    // Capitalize the first letter of each segment for display
    const displayName = segment.charAt(0).toUpperCase() + segment.slice(1);
    
    // Create the URL for this breadcrumb
    const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
    
    // Check if this is the last item (current page)
    const isLast = index === pathSegments.length - 1;
    
    return {
      name: displayName,
      url,
      isLast
    };
  });

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      {breadcrumbItems.map((item, index) => (
        item.isLast ? (
          <Typography 
            key={index} 
            variant="body1" 
            sx={{ color: 'text.primary', fontWeight: 600 }}
          >
            {item.name}
          </Typography>
        ) : (
          <Link href={item.url} key={index} style={{ textDecoration: 'none' }}>
            <Typography variant="body1" color="text.secondary">
              {item.name}
            </Typography>
          </Link>
        )
      ))}
    </StyledBreadcrumbs>
  );
}
