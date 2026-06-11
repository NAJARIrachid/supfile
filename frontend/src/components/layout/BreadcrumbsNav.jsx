/**
 * Fil d'Ariane — navigation hiérarchique (dossiers ou routes)
 */
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

export default function BreadcrumbsNav({ items = [] }) {
  const defaultItems =
    items.length > 0 ? items : [{ label: 'Accueil', path: '/files' }];

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="fil d'Ariane"
      sx={{ flex: 1, minWidth: 0 }}
    >
      {defaultItems.map((item, index) => {
        const isLast = index === defaultItems.length - 1;
        const key = item.path || item.label || index;

        if (isLast) {
          return (
            <Typography key={key} color="text.primary" noWrap>
              {index === 0 ? (
                <HomeOutlinedIcon sx={{ fontSize: 18, verticalAlign: 'middle', mr: 0.5 }} />
              ) : null}
              {item.label}
            </Typography>
          );
        }

        if (item.onClick) {
          return (
            <Link
              key={key}
              component="button"
              type="button"
              onClick={item.onClick}
              underline="hover"
              color="inherit"
              noWrap
              sx={{ border: 0, background: 'none', cursor: 'pointer', font: 'inherit' }}
            >
              {item.label}
            </Link>
          );
        }

        return (
          <Link
            key={key}
            component={RouterLink}
            to={item.path}
            underline="hover"
            color="inherit"
            noWrap
          >
            {item.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
