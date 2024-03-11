import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function DynamicBreadcrumb({ pageTitle }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        height: 75,
        paddingX: 2,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontSize: '1.25rem',
          margin: 0,
          lineHeight: '75px',
          color: '#323a46',
        }}
      >
        {pageTitle}
      </Typography>
    </Box>
  );
}

export default DynamicBreadcrumb;
