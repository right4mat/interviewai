'use client';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import type {} from '@mui/material/themeCssVarsAugmentation';

export interface CardAlertProps {
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
  icon: React.ReactNode;
}

export function CardAlert({title, description, buttonText, onClick, icon}: CardAlertProps) {
  return (
    <Card variant="outlined" sx={{ m: 1.5, flexShrink: 0 }}>
      <CardContent>
        {icon}
        <Typography gutterBottom sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          {description}
        </Typography>
        <Button variant="contained" size="small" fullWidth onClick={onClick}>
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}
