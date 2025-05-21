"use client";
import * as React from 'react';
import { styled, Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import Link from 'next/link';

import type {} from '@mui/material/themeCssVarsAugmentation';

export interface BreadcrumbItem {
  label: string;
  url: string;
}

interface NavbarBreadcrumbsProps {
  items: BreadcrumbItem[];
}

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

export function NavbarBreadcrumbs({ items }: NavbarBreadcrumbsProps) {
  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return isLast ? (
          <Typography 
            key={index}
            variant="subtitle1"
            sx={{ color: 'text.primary', fontWeight: 600 }}
          >
            {item.label}
          </Typography>
        ) : (
          <Link href={item.url} key={index} style={{ textDecoration: 'none' }}>
            <Typography variant="subtitle1" color="text.secondary">
              {item.label}
            </Typography>
          </Link>
        );
      })}
    </StyledBreadcrumbs>
  );
}
